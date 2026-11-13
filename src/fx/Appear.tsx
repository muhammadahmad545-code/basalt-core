import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

/** Staggered entrance: each item rises in slightly after the previous one. */
export function Appear({ index = 0, children, style }: { index?: number; children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 12) * 45).duration(380).springify().damping(18)}
      layout={LinearTransition.springify().damping(20)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
