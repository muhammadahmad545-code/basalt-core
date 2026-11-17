import * as Application from 'expo-application';
import * as Device from 'expo-device';
import type { File } from 'expo-file-system';
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { AppState } from 'react-native';
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

/**
 * Checked every time the app is opened. Coming back from the background re-checks only after this
 * long, so switching apps back and forth does not hit GitHub on every switch.
 */
const RESUME_RECHECK_MS = 15 * 60 * 1000;

export const currentVersion = Application.nativeApplicationVersion ?? '0.0.0';

/** Processor types this phone runs, best first (e.g. ["arm64-v8a", "armeabi-v7a"]). */
function deviceAbis(): string[] {
  try {
    return Device.supportedCpuArchitectures ?? [];
  } catch {
    return [];
  }
}

/*
 * One updater per app process, shared by every screen. A download started in Settings keeps
 * going when the user navigates away, and every screen shows the same progress.
 */
let state: UpdaterState = { phase: 'idle' };
const listeners = new Set<() => void>();
let abort: AbortController | null = null;
let autoChecked = false;
let resumeWatch: { remove: () => void } | null = null;
let cleaned = false;

function setState(next: UpdaterState | ((s: UpdaterState) => UpdaterState)) {
  state = typeof next === 'function' ? next(state) : next;
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const getState = () => state;

const MESSAGES = {
  offline: 'No internet connection. Updates are checked online; everything else works offline.',
  'rate-limited': 'GitHub is limiting requests right now. Try again in a while.',
  'no-release': 'No published release found yet.',
  'no-apk': 'The latest release has no APK attached yet.',
  'server-error': 'GitHub returned an unexpected response. Try again later.',
} as const;

async function check(source: UpdateSource, manual: boolean): Promise<void> {
  if (state.phase === 'checking' || state.phase === 'downloading') return;
  setState({ phase: 'checking' });
  const result = await checkForUpdate(source, currentVersion, deviceAbis());
  lastCheckAt.set(Date.now());
  if (result.status === 'available') {
    if (!manual && skippedVersion.get() === result.update.version) return setState({ phase: 'idle' });
    return setState({ phase: 'available', update: result.update });
  }
  if (result.status === 'up-to-date') return setState({ phase: manual ? 'up-to-date' : 'idle' });
  setState(manual ? { phase: 'error', message: MESSAGES[result.reason] } : { phase: 'idle' });
}

async function download(): Promise<void> {
  const s = state;
  if (s.phase !== 'available' && s.phase !== 'error') return;
  const update = s.update;
  if (!update) return;
  abort = new AbortController();
  setState({ phase: 'downloading', update, progress: 0 });
  try {
    const file = await downloadUpdate(
      update,
      (progress) => setState((cur) => (cur.phase === 'downloading' ? { ...cur, progress } : cur)),
      abort.signal,
    );
    setState({ phase: 'ready', update, file });
    await installUpdate(file);
  } catch (error) {
    setState({ phase: 'error', message: toMessage(error), update });
  } finally {
    abort = null;
  }
}

export interface UseUpdaterOptions {
  source: UpdateSource;
  /** Check on mount, at most once per 6 hours and once per app run. Default true. */
  auto?: boolean;
}

export function useUpdater({ source, auto = true }: UseUpdaterOptions) {
  const current = useSyncExternalStore(subscribe, getState, getState);
  const { owner, repo } = source;

  useEffect(() => {
    if (!cleaned) {
      cleaned = true;
      // After a successful update, remove the installer file that got us here.
      if (lastSeenVersion.get() !== currentVersion) {
        clearDownloadedUpdates();
        lastSeenVersion.set(currentVersion);
      }
    }
    if (!auto) return;
    // Every launch checks once, so a new release shows up as soon as the app is opened.
    if (!autoChecked) {
      autoChecked = true;
      void check({ owner, repo }, false);
    }
    // Returning to the app later (it stayed in memory) checks again after a while.
    if (!resumeWatch) {
      resumeWatch = AppState.addEventListener('change', (next) => {
        if (next === 'active' && Date.now() - lastCheckAt.get() > RESUME_RECHECK_MS) void check({ owner, repo }, false);
      });
    }
  }, [auto, owner, repo]);

  const install = useCallback(async () => {
    const s = state;
    if (s.phase !== 'ready') return;
    try {
      await installUpdate(s.file);
    } catch (error) {
      setState({ phase: 'error', message: toMessage(error), update: s.update });
    }
  }, []);

  return {
    state: current,
    currentVersion,
    check: () => check({ owner, repo }, true),
    download: () => void download(),
    install,
    cancel: () => abort?.abort(),
    skip: () => {
      if (state.phase === 'available') skippedVersion.set(state.update.version);
      setState({ phase: 'idle' });
    },
    dismiss: () => setState({ phase: 'idle' }),
  };
}

export type Updater = ReturnType<typeof useUpdater>;
