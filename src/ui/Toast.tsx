import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

type Tone = 'info' | 'success' | 'danger';
interface ToastItem {
  id: number;
  message: string;
  tone: Tone;
}

const ToastContext = createContext<((message: string, tone?: Tone) => void) | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { colors, radius, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastItem | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(1);

  const show = useCallback((message: string, tone: Tone = 'info') => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: nextId.current++, message, tone });
    timer.current = setTimeout(() => setToast(null), tone === 'danger' ? 5000 : 2800);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const border = toast ? { info: colors.border, success: colors.success, danger: colors.danger }[toast.tone] : colors.border;
  return (
    <ToastContext.Provider value={show}>
      {children}
      <View pointerEvents="none" style={{ position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: insets.bottom + spacing.xl, alignItems: 'center' }}>
        {toast ? (
          <Animated.View
            key={toast.id}
            entering={FadeInDown.duration(180)}
            exiting={FadeOutDown.duration(180)}
            accessibilityLiveRegion="polite"
            style={{ backgroundColor: colors.surfaceRaised, borderColor: border, borderWidth: 1, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, maxWidth: 480 }}
          >
            <Text variant="label" align="center">
              {toast.message}
            </Text>
          </Animated.View>
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error('useToast must be used inside <ToastProvider>');
  return show;
}
