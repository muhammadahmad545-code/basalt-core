import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable as RNPressable } from 'react-native';
import type { PressableProps as RNPressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

export interface PressableProps extends Omit<RNPressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Scale applied while pressed. Set to 1 to disable. */
  pressScale?: number;
  haptic?: boolean;
}

/** Tappable with a short, quiet press response (slight dim and scale), used across the suite. */
export function Pressable({ style, pressScale = 0.985, haptic = false, onPressIn, onPressOut, onPress, disabled, ...rest }: PressableProps) {
  const pressed = useSharedValue(0);
  const animated = useAnimatedStyle(() => ({
    opacity: 1 - pressed.value * 0.12,
    transform: [{ scale: 1 - pressed.value * (1 - pressScale) }],
  }));
  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={(e) => {
        pressed.value = withTiming(1, { duration: 80 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        pressed.value = withTiming(0, { duration: 140 });
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
      style={[style, animated, disabled ? { opacity: 0.4 } : null]}
    />
  );
}
