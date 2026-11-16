import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Slow-drifting blurred light blobs in the app's accent colours, drawn behind hero sections.
 * Pure SVG radial gradients, so there is no image asset and it adapts to light and dark.
 */
export function Aurora({ height = 420, style }: { height?: number; style?: StyleProp<ViewStyle> }) {
  const { colors, scheme } = useTheme();
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 14000, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [t]);
  const a = useAnimatedProps(() => ({ cx: `${18 + t.value * 22}%`, cy: `${28 + t.value * 10}%` }));
  const b = useAnimatedProps(() => ({ cx: `${82 - t.value * 18}%`, cy: `${18 + t.value * 16}%` }));
  const c = useAnimatedProps(() => ({ cx: `${55 + t.value * 10}%`, cy: `${70 - t.value * 12}%` }));
  const strength = scheme === 'dark' ? 0.55 : 0.35;
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  return (
    <View pointerEvents="none" onLayout={onLayout} style={[StyleSheet.absoluteFill, { height }, style]}>
      {width > 0 ? (
      <>
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient id="ga" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={colors.accent} stopOpacity={strength} />
            <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="gb" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={colors.accent2} stopOpacity={strength * 0.9} />
            <Stop offset="1" stopColor={colors.accent2} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="gc" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={colors.accent} stopOpacity={strength * 0.5} />
            <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <AnimatedCircle animatedProps={a} r="46%" fill="url(#ga)" />
        <AnimatedCircle animatedProps={b} r="40%" fill="url(#gb)" />
        <AnimatedCircle animatedProps={c} r="36%" fill="url(#gc)" />
      </Svg>
      {/* Fade the aurora into the page background so content below stays calm. */}
      <Svg width={width} height={height * 0.45} style={{ position: 'absolute', bottom: 0 }}>
        <Defs>
          <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.bg} stopOpacity={0} />
            <Stop offset="1" stopColor={colors.bg} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect width={width} height={height * 0.45} fill="url(#fade)" />
      </Svg>
      </>
      ) : null}
    </View>
  );
}
