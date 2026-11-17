import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export function EmptyState({ icon: Icon, title, message, action }: { icon: LucideIcon; title: string; message: string; action?: React.ReactNode }) {
  const { colors, spacing, radius } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl, gap: spacing.sm }}>
      <View style={{ width: 52, height: 52, borderRadius: radius.lg, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs }}>
        <Icon size={24} color={colors.textMuted} strokeWidth={1.8} />
      </View>
      <Text variant="heading" align="center">
        {title}
      </Text>
      <Text variant="label" color="textMuted" align="center" style={{ maxWidth: 300 }}>
        {message}
      </Text>
      {action ? <View style={{ marginTop: spacing.sm }}>{action}</View> : null}
    </View>
  );
}
