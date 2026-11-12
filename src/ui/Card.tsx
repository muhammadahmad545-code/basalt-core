import React from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Pressable } from './Pressable';

export interface CardProps extends ViewProps {
  onPress?: () => void;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Card({ onPress, padded = true, style, children, ...rest }: CardProps) {
  const { colors, radius, spacing } = useTheme();
  const base: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: padded ? spacing.lg : 0,
    overflow: 'hidden',
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
