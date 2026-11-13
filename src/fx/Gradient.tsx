import React, { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

export interface GradientProps {
  colors: [string, string] | [string, string, string];
  /** Angle-ish direction: diagonal by default. */
  from?: { x: number; y: number };
  to?: { x: number; y: number };
  radius?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/** A view with an SVG linear-gradient background. */
export function Gradient({ colors, from = { x: 0, y: 0 }, to = { x: 1, y: 1 }, radius = 0, style, children }: GradientProps) {
  const id = `g${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <View style={[{ borderRadius: radius, overflow: 'hidden' }, style]}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <LinearGradient id={id} x1={from.x} y1={from.y} x2={to.x} y2={to.y}>
            {colors.map((c, i) => (
              <Stop key={i} offset={i / (colors.length - 1)} stopColor={c} />
            ))}
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}
