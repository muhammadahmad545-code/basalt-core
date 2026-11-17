import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from '../ui/Text';

export interface HeroProps {
  overline?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
}

/** Page title for tab screens: a large title with optional actions, no decoration. */
export function Hero({ title, subtitle, right, children }: HeroProps) {
  const { spacing } = useTheme();
  return (
    <View style={{ gap: spacing.md, paddingTop: spacing.xs }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 40 }}>
        <Text variant="hero" accessibilityRole="header" style={{ flex: 1 }} numberOfLines={1}>
          {title}
        </Text>
        {right ? <View style={{ flexDirection: 'row', gap: spacing.sm }}>{right}</View> : null}
      </View>
      {subtitle ? (
        <Text variant="body" color="textMuted" style={{ marginTop: -spacing.sm }}>
          {subtitle}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
