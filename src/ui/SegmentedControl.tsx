import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Pressable } from './Pressable';
import { Text } from './Text';

export interface SegmentedControlProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const { colors, radius, spacing } = useTheme();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: colors.surfaceRaised, borderRadius: radius.md, padding: 4, borderWidth: 1, borderColor: colors.border }}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={o.label}
            haptic
            onPress={() => onChange(o.value)}
            style={{ flex: 1, paddingVertical: spacing.sm, borderRadius: radius.sm, alignItems: 'center', backgroundColor: selected ? colors.accent : 'transparent' }}
          >
            <Text variant="label" style={{ color: selected ? colors.onAccent : colors.textMuted }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
