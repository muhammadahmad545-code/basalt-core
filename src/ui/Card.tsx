import React from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Pressable } from './Pressable';

export interface CardProps extends ViewProps {
  onPress?: () => void;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  /** raised: lifted surface with a soft shadow. glow: accent-tinted border and glow. */
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
    ...(variant !== 'default'
      ? {
          shadowColor: variant === 'glow' ? colors.accent : '#000',
          shadowOpacity: variant === 'glow' ? 0.35 : scheme === 'dark' ? 0.4 : 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 6 },
          elevation: variant === 'glow' ? 6 : 4,
        }
      : null),
  };
  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} pressScale={0.985} style={[base, style]} {...rest}>
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
