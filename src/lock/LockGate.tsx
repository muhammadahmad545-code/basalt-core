/*
 * Biometric app lock. Imported by path (`@basalt/core/src/lock/LockGate`), not from the package
 * index, so apps without expo-local-authentication do not bundle it.
 */
import * as LocalAuthentication from 'expo-local-authentication';
import { Lock } from 'lucide-react-native';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { Aurora } from '../fx/Aurora';
import type { Setting } from '../storage/settings';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';

const RELOCK_AFTER_MS = 30_000;

interface LockApi {
  locked: boolean;
  /** Call before opening the app's own external screen (scanner, picker, share sheet) so returning does not re-lock. */
  expectExternal: () => void;
  /** Run once the app is unlocked (immediately if it already is). */
  whenUnlocked: (fn: () => void) => void;
}

const LockContext = createContext<LockApi>({ locked: false, expectExternal: () => {}, whenUnlocked: (fn) => fn() });
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
  const [locked, setLocked] = useState(() => setting.get());
  const [hidden, setHidden] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const backgroundedAt = useRef<number | null>(null);
  const external = useRef(false);
  const busy = useRef(false);
  const pending = useRef<(() => void)[]>([]);

  const unlock = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setError(null);
    try {
      const result = await LocalAuthentication.authenticateAsync({ promptMessage: `Unlock ${appName}`, disableDeviceFallback: false });
      if (result.success) {
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
  }, [appName]);

  useEffect(() => {
    if (!enabled) {
      setLocked(false);
      const queued = pending.current.splice(0);
      queued.forEach((fn) => fn());
    }
  }, [enabled]);

  useEffect(() => {
    if (locked && enabled) void unlock();
  }, [locked, enabled, unlock]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        backgroundedAt.current = Date.now();
        if (setting.get() && !external.current) setHidden(true);
      }
      if (state === 'active') {
        setHidden(false);
        const away = backgroundedAt.current ? Date.now() - backgroundedAt.current : 0;
        if (setting.get() && !external.current && away > RELOCK_AFTER_MS) setLocked(true);
        external.current = false;
      }
    });
    return () => sub.remove();
  }, [setting]);

  const api: LockApi = {
    locked: enabled && locked,
    expectExternal: () => {
      external.current = true;
    },
    whenUnlocked: (fn) => {
      if (!setting.get() || !locked) fn();
      else pending.current.push(fn);
    },
  };

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
