import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';

export function ProgressBar({ progress, tone = 'accent' }: { progress: number; tone?: 'accent' | 'success' | 'danger' }) {
  const { colors, radius } = useTheme();
  const value = useSharedValue(0);
  const clamped = Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0));
  useEffect(() => {
    value.value = withTiming(clamped, { duration: 220 });
  }, [clamped, value]);
  const fill = useAnimatedStyle(() => ({ width: `${value.value * 100}%` }));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={{ height: 6, borderRadius: radius.pill, backgroundColor: colors.border, overflow: 'hidden' }}
    >
      <Animated.View style={[{ height: '100%', borderRadius: radius.pill, backgroundColor: colors[tone] }, fill]} />
    </View>
  );
}
