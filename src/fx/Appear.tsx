import React from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Wrapper kept for compatibility. Entrance animations were removed: rows added while a list was
 * on screen could stay invisible on Android, and correct content matters more than motion.
 */
export function Appear({ children, style }: { index?: number; children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={style}>{children}</View>;
}
