/*
 * Biometric app lock. Imported by path (`@basalt/core/src/lock/LockGate`), not from the package
 * index, so apps without expo-local-authentication do not bundle it.
 */
import * as LocalAuthentication from 'expo-local-authentication';
import Lock from 'lucide-react-native/icons/lock';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { Aurora } from '../fx/Aurora';
import type { Setting } from '../storage/settings';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';

const RELOCK_AFTER_MS = 30_000;

interface LockApi {
  locked: boolean;
  /**
   * Wrap the app's own trip to another screen (scanner, picker, share sheet) so coming back does not
   * re-lock. The exemption ends when the call settles, so a call that fails early cannot leave it on.
   */
  runExternal: <T>(fn: () => Promise<T>) => Promise<T>;
  /** Run once the app is unlocked (immediately if it already is). */
  whenUnlocked: (fn: () => void) => void;
}

const LockContext = createContext<LockApi>({ locked: false, runExternal: (fn) => fn(), whenUnlocked: (fn) => fn() });
export const useLock = () => useContext(LockContext);

export interface LockGateProps {
  setting: Setting<boolean>;
  appName: string;
  message: string;
  children: React.ReactNode;
}

/**
 * Children stay mounted underneath an opaque cover, so locking never loses navigation state or
 * an in-progress flow. The cover also hides content while the app is in the background.
 */
export function LockGate({ setting, appName, message, children }: LockGateProps) {
  const { colors, spacing } = useTheme();
  const [enabled] = setting.use();
  const [locked, setLockedState] = useState(() => setting.get());
  const [hidden, setHidden] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const backgroundedAt = useRef<number | null>(null);
  const external = useRef(0);
  const busy = useRef(false);
  const pending = useRef<(() => void)[]>([]);
  // The current lock state for callbacks created in earlier renders (notification listeners etc.).
  const lockedRef = useRef(locked);
  const setLocked = useCallback((value: boolean) => {
    lockedRef.current = value;
    setLockedState(value);
  }, []);

  const unlock = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setError(null);
    try {
      const result = await LocalAuthentication.authenticateAsync({ promptMessage: `Unlock ${appName}`, disableDeviceFallback: false });
      if (result.success) {
        backgroundedAt.current = null;
        setLocked(false);
        const queued = pending.current.splice(0);
        queued.forEach((fn) => fn());
      } else if (result.error !== 'user_cancel' && result.error !== 'system_cancel' && result.error !== 'app_cancel') {
        setError('Could not verify. Try again.');
      }
    } catch {
      setError('Unlock is unavailable. Set a screen lock on this phone.');
    } finally {
      busy.current = false;
    }
  }, [appName, setLocked]);

  useEffect(() => {
    if (!enabled) {
      setLocked(false);
      const queued = pending.current.splice(0);
      queued.forEach((fn) => fn());
    }
  }, [enabled, setLocked]);

  useEffect(() => {
    if (locked && enabled) void unlock();
  }, [locked, enabled, unlock]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      // The system unlock prompt itself backgrounds the app; ignore that, or a slow PIN entry re-locks.
      if (busy.current) return;
      if (state === 'background') {
        backgroundedAt.current = Date.now();
        if (setting.get() && external.current === 0) setHidden(true);
      }
      if (state === 'active') {
        setHidden(false);
        const away = backgroundedAt.current ? Date.now() - backgroundedAt.current : 0;
        if (setting.get() && external.current === 0 && away > RELOCK_AFTER_MS) setLocked(true);
        backgroundedAt.current = null;
      }
    });
    return () => sub.remove();
  }, [setting, setLocked]);

  const runExternal = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    external.current++;
    try {
      return await fn();
    } finally {
      external.current = Math.max(0, external.current - 1);
    }
  }, []);

  const whenUnlocked = useCallback(
    (fn: () => void) => {
      if (!setting.get() || !lockedRef.current) fn();
      else pending.current.push(fn);
    },
    [setting],
  );

  const api = useMemo<LockApi>(() => ({ locked: enabled && locked, runExternal, whenUnlocked }), [enabled, locked, runExternal, whenUnlocked]);

  const cover = enabled && (locked || hidden);
  return (
    <LockContext.Provider value={api}>
      <View style={{ flex: 1 }} importantForAccessibility={cover ? 'no-hide-descendants' : 'auto'}>
        {children}
      </View>
      {cover ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.lg }]}>
          <Aurora height={600} />
          <Lock size={44} color={colors.accent} />
          <Text variant="title">{appName} is locked</Text>
          <Text color="textMuted" align="center">
            {message}
          </Text>
          {error ? <Text color="danger">{error}</Text> : null}
          {locked ? <Button label="Unlock" onPress={() => void unlock()} /> : null}
        </View>
      ) : null}
    </LockContext.Provider>
  );
}

export async function canUseLock(): Promise<boolean> {
  try {
    // A PIN, pattern or password is enough; fingerprint hardware is optional.
    return (await LocalAuthentication.getEnrolledLevelAsync()) !== LocalAuthentication.SecurityLevel.NONE;
  } catch {
    return false;
  }
}
