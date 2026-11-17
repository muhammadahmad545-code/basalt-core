import React from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Pressable } from './Pressable';

export interface CardProps extends ViewProps {
  onPress?: () => void;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  /** raised: slightly lifted surface. glow: accent outline for the one thing that needs attention. */
  variant?: 'default' | 'raised' | 'glow';
}

export function Card({ onPress, padded = true, style, children, variant = 'default', ...rest }: CardProps) {
  const { colors, radius, spacing, scheme } = useTheme();
  const base: ViewStyle = {
    backgroundColor: variant === 'raised' ? colors.surfaceRaised : colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: variant === 'glow' ? colors.accent : colors.border,
    padding: padded ? spacing.lg : 0,
    overflow: 'hidden',
    ...(variant === 'raised' && scheme === 'light'
      ? { shadowColor: '#0B1220', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 2 }, elevation: 1 }
      : null),
  };
  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={[base, style]} {...rest}>
        {children}
      </Pressable>
    );
  }
  return (
    <View style={[base, style]} {...rest}>
      {children}
    </View>
  );
}
