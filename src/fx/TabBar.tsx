import type { LucideIcon } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';
import { Pressable } from '../ui/Pressable';
import { Text } from '../ui/Text';
import { withAlpha } from '../theme/tokens';

export interface TabItem {
  /** Route name as the router reports it, e.g. "index" or "settings". */
  name: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

/** Minimal structural type of the props expo-router's JS Tabs pass to a custom tab bar. */
export interface TabBarProps {
  state: { index: number; routes: { key: string; name: string }[] };
  navigateToTab: (routeKey: string) => void;
  insets: { bottom: number };
}

function Tab({ item, focused, onPress }: { item: TabItem; focused: boolean; onPress: () => void }) {
  const { colors, radius, spacing } = useTheme();
  const v = useSharedValue(focused ? 1 : 0);
  useEffect(() => {
    v.value = withSpring(focused ? 1 : 0, { damping: 18, stiffness: 220 });
  }, [focused, v]);
  const pill = useAnimatedStyle(() => ({ opacity: v.value, transform: [{ scale: 0.8 + v.value * 0.2 }] }));
  const Icon = item.icon;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={item.badge ? `${item.label}, ${item.badge} new` : item.label}
      accessibilityState={{ selected: focused }}
      haptic
      pressScale={0.92}
      onPress={onPress}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.sm, gap: 2 }}
    >
      <View style={{ width: 56, height: 32, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={[{ position: 'absolute', inset: 0, borderRadius: radius.pill, backgroundColor: colors.accentSoft }, pill]} />
        <Icon size={22} color={focused ? colors.accent : colors.textMuted} strokeWidth={focused ? 2.4 : 2} />
        {item.badge ? (
          <View style={{ position: 'absolute', top: -2, right: 8, minWidth: 16, height: 16, paddingHorizontal: 4, borderRadius: 8, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="caption" style={{ color: '#fff', fontSize: 10, lineHeight: 12 }}>
              {item.badge > 99 ? '99+' : item.badge}
            </Text>
          </View>
        ) : null}
      </View>
      <Text variant="caption" style={{ color: focused ? colors.text : colors.textMuted, fontSize: 11 }}>
        {item.label}
      </Text>
    </Pressable>
  );
}

/** Floating, rounded tab bar with an animated pill behind the active tab. */
export function FloatingTabBar({ items, state, navigateToTab, insets }: TabBarProps & { items: TabItem[] }) {
  const { colors, radius, spacing, scheme } = useTheme();
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: Math.max(insets.bottom, spacing.md), paddingHorizontal: spacing.lg }}>
      <View
        accessibilityRole="tablist"
        style={{
          flexDirection: 'row',
          backgroundColor: withAlpha(colors.surfaceRaised, scheme === 'dark' ? 0.96 : 0.98),
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: spacing.xs,
          shadowColor: '#000',
          shadowOpacity: scheme === 'dark' ? 0.5 : 0.12,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
        }}
      >
        {state.routes.map((route, index) => {
          const item = items.find((i) => i.name === route.name);
          if (!item) return null;
          return <Tab key={route.key} item={item} focused={state.index === index} onPress={() => navigateToTab(route.key)} />;
        })}
      </View>
    </View>
  );
}

/** Bottom padding a tab screen needs so its last item clears the floating bar. */
export const TAB_BAR_SPACE = 104;
