import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';

export interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel: string;
}

export function Toggle({ value, onChange, disabled, accessibilityLabel }: ToggleProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(value ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 160 });
  }, [value, progress]);
  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.border, colors.accent]),
  }));
  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: withSpring(progress.value * 20, { damping: 18, stiffness: 300 }) }] }));
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled: !!disabled }}
      hitSlop={8}
      disabled={disabled}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onChange(!value);
      }}
      style={{ opacity: disabled ? 0.45 : 1 }}
    >
      <Animated.View style={[{ width: 48, height: 28, borderRadius: 14, padding: 3 }, track]}>
        <Animated.View style={[{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFFFFF' }, thumb]} />
      </Animated.View>
    </Pressable>
  );
}
