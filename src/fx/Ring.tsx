import React, { useEffect, useId } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface RingProps {
  /** 0–1 */
  progress: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
  tone?: 'accent' | 'success' | 'warning' | 'danger';
}

/** Animated gradient progress ring with content in the middle. */
export function Ring({ progress, size = 120, stroke = 12, children, tone = 'accent' }: RingProps) {
  const { colors } = useTheme();
  const id = `r${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const value = useSharedValue(0);
  const clamped = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
  useEffect(() => {
    value.value = withTiming(clamped, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [clamped, value]);
  const props = useAnimatedProps(() => ({ strokeDashoffset: circumference * (1 - value.value) }));
  const start = tone === 'accent' ? colors.accent : colors[tone];
  const end = tone === 'accent' ? colors.accent2 : colors[tone];
  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }} style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={start} />
            <Stop offset="1" stopColor={end} />
          </LinearGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.border} strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={props}
        />
      </Svg>
      {children}
    </View>
  );
}
