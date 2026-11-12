import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Pressable } from './Pressable';
import { Text } from './Text';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, variant = 'primary', size = 'md', icon: Icon, loading, disabled, style }: ButtonProps) {
  const { colors, radius, spacing } = useTheme();
  const bg = { primary: colors.accent, secondary: colors.surfaceRaised, ghost: 'transparent', danger: colors.dangerSoft }[variant];
  const fg = { primary: colors.onAccent, secondary: colors.text, ghost: colors.accent, danger: colors.danger }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled || !!loading, busy: !!loading }}
      haptic
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        {
          minHeight: size === 'lg' ? 54 : 46,
          paddingHorizontal: spacing.xl,
          borderRadius: radius.lg,
          backgroundColor: bg,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: colors.border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : Icon ? <Icon size={18} color={fg} /> : null}
      <View style={{ flexShrink: 1 }}>
        <Text variant="bodyStrong" numberOfLines={1} style={{ color: fg }}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
