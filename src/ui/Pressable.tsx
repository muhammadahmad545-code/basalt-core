import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable as RNPressable } from 'react-native';
import type { PressableProps as RNPressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

export interface PressableProps extends Omit<RNPressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Scale applied while pressed. Set to 1 to disable. */
  pressScale?: number;
  haptic?: boolean;
}

/** Pressable with a spring scale and optional light haptic, used by every tappable in the suite. */
export function Pressable({ style, pressScale = 0.97, haptic = false, onPressIn, onPressOut, onPress, disabled, ...rest }: PressableProps) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={(e) => {
        scale.value = withSpring(pressScale, { damping: 20, stiffness: 400 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 20, stiffness: 400 });
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.(e);
      }}
      style={[style, animated, disabled ? { opacity: 0.45 } : null]}
    />
  );
}
