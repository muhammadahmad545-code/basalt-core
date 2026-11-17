import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

/** A short, quiet fade-in for content as it first appears. Only the first few items are staggered. */
export function Appear({ index = 0, children, style }: { index?: number; children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <Animated.View entering={FadeIn.duration(180).delay(Math.min(index, 5) * 30)} style={style}>
      {children}
    </Animated.View>
  );
}
