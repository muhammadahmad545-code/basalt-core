import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export function StatTile({ label, value, detail }: { label: string; value: string; detail?: string }) {
  const { colors, radius, spacing } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingVertical: spacing.md, paddingHorizontal: spacing.md, gap: 2, minWidth: 0 }}>
      <Text variant="caption" color="textMuted" numberOfLines={1}>
        {label}
      </Text>
      <Text variant="title" numberOfLines={1} style={{ fontVariant: ['tabular-nums'] }}>
        {value}
      </Text>
      {detail ? (
        <Text variant="caption" color="textFaint" numberOfLines={1}>
          {detail}
        </Text>
      ) : null}
    </View>
  );
}
