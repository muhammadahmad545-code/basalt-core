import * as Application from 'expo-application';
import type { File } from 'expo-file-system';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createSetting } from '../storage/settings';
import { toMessage } from '../utils/errors';
import { checkForUpdate } from './github';
import type { UpdateInfo, UpdateSource } from './github';
import { clearDownloadedUpdates, downloadUpdate, installUpdate } from './install';

export type UpdaterState =
  | { phase: 'idle' }
  | { phase: 'checking' }
  | { phase: 'up-to-date' }
  | { phase: 'available'; update: UpdateInfo }
  | { phase: 'downloading'; update: UpdateInfo; progress: number }
  | { phase: 'ready'; update: UpdateInfo; file: File }
  | { phase: 'error'; message: string; update?: UpdateInfo };

const lastCheckAt = createSetting<number>('basalt.updater.lastCheckAt', 0);
const skippedVersion = createSetting<string | null>('basalt.updater.skipped', null);
const lastSeenVersion = createSetting<string | null>('basalt.updater.lastSeenVersion', null);

const AUTO_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000;

export const currentVersion = Application.nativeApplicationVersion ?? '0.0.0';

export interface UseUpdaterOptions {
  source: UpdateSource;
  /** Check on mount, at most once per 6 hours. Default true. */
  auto?: boolean;
}

export function useUpdater({ source, auto = true }: UseUpdaterOptions) {
  const [state, setState] = useState<UpdaterState>({ phase: 'idle' });
  const abort = useRef<AbortController | null>(null);
  const { owner, repo } = source;

  const check = useCallback(
    async (manual: boolean) => {
      setState({ phase: 'checking' });
      const result = await checkForUpdate({ owner, repo }, currentVersion);
      lastCheckAt.set(Date.now());
      if (result.status === 'available') {
        if (!manual && skippedVersion.get() === result.update.version) return setState({ phase: 'idle' });
        return setState({ phase: 'available', update: result.update });
      }
      if (result.status === 'up-to-date') return setState({ phase: manual ? 'up-to-date' : 'idle' });
      if (!manual) return setState({ phase: 'idle' });
      const messages = {
        offline: 'No internet connection. Updates are checked online; everything else works offline.',
        'rate-limited': 'GitHub is limiting requests right now. Try again in a while.',
        'no-release': 'No published release found yet.',
        'no-apk': 'The latest release has no APK attached yet.',
        'server-error': 'GitHub returned an unexpected response. Try again later.',
      } as const;
      setState({ phase: 'error', message: messages[result.reason] });
    },
    [owner, repo],
  );

  useEffect(() => {
    // After a successful update, clean up the installer file that got us here.
    if (lastSeenVersion.get() !== currentVersion) {
      clearDownloadedUpdates();
      lastSeenVersion.set(currentVersion);
    }
    if (auto && Date.now() - lastCheckAt.get() > AUTO_CHECK_INTERVAL_MS) void check(false);
    return () => abort.current?.abort();
  }, [auto, check]);

  const download = useCallback(async () => {
    if (state.phase !== 'available' && state.phase !== 'error') return;
    const update = state.update;
    if (!update) return;
    abort.current = new AbortController();
    setState({ phase: 'downloading', update, progress: 0 });
    try {
      const file = await downloadUpdate(
        update,
        (progress) => setState((s) => (s.phase === 'downloading' ? { ...s, progress } : s)),
        abort.current.signal,
      );
      setState({ phase: 'ready', update, file });
      await installUpdate(file);
    } catch (error) {
      setState({ phase: 'error', message: toMessage(error), update });
    }
  }, [state]);

  const install = useCallback(async () => {
    if (state.phase !== 'ready') return;
    try {
      await installUpdate(state.file);
    } catch (error) {
      setState({ phase: 'error', message: toMessage(error), update: state.update });
    }
  }, [state]);

  const cancel = useCallback(() => abort.current?.abort(), []);

  const skip = useCallback(() => {
    if (state.phase === 'available') skippedVersion.set(state.update.version);
    setState({ phase: 'idle' });
  }, [state]);

  const dismiss = useCallback(() => setState({ phase: 'idle' }), []);

  return { state, currentVersion, check: () => check(true), download, install, cancel, skip, dismiss };
}

export type Updater = ReturnType<typeof useUpdater>;
