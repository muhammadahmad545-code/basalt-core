import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from '../ui/Text';

export interface BarsProps {
  values: number[];
  labels?: string[];
  height?: number;
  /** Index to emphasise, e.g. today or the peak. */
  highlight?: number;
  accessibilityLabel: string;
}

/** Compact column chart drawn with Views, animated in. */
export function Bars({ values, labels, height = 120, highlight, accessibilityLabel }: BarsProps) {
  const { colors, spacing } = useTheme();
  const max = Math.max(1, ...values);
  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={{ gap: spacing.xs }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height, gap: 3 }}>
        {values.map((v, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: `${Math.max(3, (v / max) * 100)}%`,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
              backgroundColor: i === highlight ? colors.accent : colors.glow,
            }}
          />
        ))}
      </View>
      {labels ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {labels.map((l, i) => (
            <Text key={i} variant="caption" color="textFaint">
              {l}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}
