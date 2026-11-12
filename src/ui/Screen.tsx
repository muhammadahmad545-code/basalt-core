import React from 'react';
import { ScrollView, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

export interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  /** Apply the top safe-area inset. Turn off under a navigation header. */
  topInset?: boolean;
  bottomInset?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  footer?: React.ReactNode;
}

export function Screen({ children, scroll = true, topInset = true, bottomInset = true, contentStyle, footer }: ScreenProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const padding: ViewStyle = {
    paddingTop: (topInset ? insets.top : 0) + spacing.lg,
    paddingBottom: (bottomInset && !footer ? insets.bottom : 0) + spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[padding, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, padding, contentStyle]}>{children}</View>
      )}
      {footer ? (
        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: insets.bottom + spacing.md,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.bg,
            gap: spacing.sm,
          }}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
}
