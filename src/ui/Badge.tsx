import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { withAlpha } from '../theme/tokens';
import { Text } from './Text';

export function Badge({ label, tone = 'accent' }: { label: string; tone?: 'accent' | 'success' | 'warning' | 'danger' | 'muted' }) {
  const { colors, radius } = useTheme();
  const fg = tone === 'muted' ? colors.textMuted : colors[tone];
  return (
    <View style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill, backgroundColor: withAlpha(fg, 0.14) }}>
      <Text variant="caption" style={{ color: fg, fontFamily: 'Inter_600SemiBold' }}>
        {label}
      </Text>
    </View>
  );
}
