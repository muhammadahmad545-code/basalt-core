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
  const { colors, radius, spacing, scheme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: colors.fill, borderRadius: radius.md, padding: 3 }}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={o.label}
            haptic
            pressScale={1}
            onPress={() => onChange(o.value)}
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              borderRadius: radius.sm,
              alignItems: 'center',
              backgroundColor: selected ? (scheme === 'dark' ? colors.surfaceRaised : colors.surface) : 'transparent',
              ...(selected && scheme === 'light' ? { shadowColor: '#0B1220', shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 } : null),
            }}
          >
            <Text variant="label" numberOfLines={1} style={{ color: selected ? colors.text : colors.textMuted, fontFamily: selected ? 'Inter_600SemiBold' : 'Inter_500Medium' }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
