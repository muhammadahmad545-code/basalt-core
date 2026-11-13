import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Pressable } from './Pressable';
import { Text } from './Text';

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const { spacing } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs }}>
      <Text variant="overline" color="textMuted">
        {title}
      </Text>
      {action && onAction ? (
        <Pressable accessibilityRole="button" accessibilityLabel={action} hitSlop={12} onPress={onAction}>
          <Text variant="label" color="accent">
            {action}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
