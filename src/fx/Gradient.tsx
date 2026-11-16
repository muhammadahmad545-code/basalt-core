import React, { useId, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
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

/**
 * A view with an SVG linear-gradient background. The SVG is drawn at the view's measured size:
 * percentage sizes are resolved before layout on Android and left the gradient short of the edges.
 */
export function Gradient({ colors, from = { x: 0, y: 0 }, to = { x: 1, y: 1 }, radius = 0, style, children }: GradientProps) {
  const id = `g${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (!size || Math.abs(size.width - width) > 0.5 || Math.abs(size.height - height) > 0.5) setSize({ width, height });
  };
  return (
    <View onLayout={onLayout} style={[{ borderRadius: radius, overflow: 'hidden', backgroundColor: colors[0] }, style]}>
      {size ? (
        <Svg style={StyleSheet.absoluteFill} width={size.width} height={size.height} pointerEvents="none">
          <Defs>
            <LinearGradient id={id} x1={from.x} y1={from.y} x2={to.x} y2={to.y}>
              {colors.map((c, i) => (
                <Stop key={i} offset={i / (colors.length - 1)} stopColor={c} />
              ))}
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={size.width} height={size.height} fill={`url(#${id})`} />
        </Svg>
      ) : null}
      {children}
    </View>
  );
}
