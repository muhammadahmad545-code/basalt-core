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
  const active = colors[tone];
  const fg = selected ? colors.onAccent : tone === 'accent' ? colors.text : active;
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
        minHeight: 32,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: selected ? active : colors.border,
        backgroundColor: selected ? active : colors.surface,
      }}
    >
      {Icon ? <Icon size={14} color={selected ? colors.onAccent : active} strokeWidth={2.2} /> : null}
      <Text variant="label" style={{ color: fg }}>
        {label}
      </Text>
    </Pressable>
  );
}
