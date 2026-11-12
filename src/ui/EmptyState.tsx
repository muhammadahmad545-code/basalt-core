import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export function EmptyState({ icon: Icon, title, message, action }: { icon: LucideIcon; title: string; message: string; action?: React.ReactNode }) {
  const { colors, spacing, radius } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: spacing.xxxl, paddingHorizontal: spacing.xl, gap: spacing.md }}>
      <View style={{ width: 72, height: 72, borderRadius: radius.xl, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={32} color={colors.accent} />
      </View>
      <Text variant="heading" align="center">
        {title}
      </Text>
      <Text color="textMuted" align="center">
        {message}
      </Text>
      {action}
    </View>
  );
}
