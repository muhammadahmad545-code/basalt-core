import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Pressable } from './Pressable';
import { Text } from './Text';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: LucideIcon;
  tone?: 'accent' | 'danger' | 'success' | 'warning';
}

export function Chip({ label, selected = false, onPress, icon: Icon, tone = 'accent' }: ChipProps) {
  const { colors, radius, spacing } = useTheme();
  const fg = selected ? colors.onAccent : colors[tone === 'accent' ? 'textMuted' : tone];
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={onPress ? { selected } : undefined}
      accessibilityLabel={label}
      disabled={!onPress}
      haptic={!!onPress}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: spacing.md,
        minHeight: 34,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: selected ? colors[tone] : colors.border,
        backgroundColor: selected ? colors[tone] : colors.surfaceRaised,
      }}
    >
      {Icon ? <Icon size={14} color={fg} /> : null}
      <Text variant="label" style={{ color: fg }}>
        {label}
      </Text>
    </Pressable>
  );
}
