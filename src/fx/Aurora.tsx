import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Removed from the design: the calm style uses plain surfaces. Kept as a no-op so older screens
 * that still render <Aurora /> compile and show nothing.
 */
export function Aurora(_props: { height?: number; style?: StyleProp<ViewStyle> }) {
  return null;
}
