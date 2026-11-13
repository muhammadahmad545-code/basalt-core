import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from '../ui/Text';

export interface HeroProps {
  overline?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
}

/** Large page title block used at the top of tab screens, over the aurora. */
export function Hero({ overline, title, subtitle, right, children }: HeroProps) {
  const { spacing } = useTheme();
  return (
    <Animated.View entering={FadeInDown.duration(420)} style={{ gap: spacing.md, paddingTop: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
        <View style={{ flex: 1, gap: 2 }}>
          {overline ? (
            <Text variant="overline" color="accent">
              {overline}
            </Text>
          ) : null}
          <Text variant="hero" accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? <Text color="textMuted">{subtitle}</Text> : null}
        </View>
        {right ? <View style={{ flexDirection: 'row', gap: spacing.sm }}>{right}</View> : null}
      </View>
      {children}
    </Animated.View>
  );
}
