import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Pressable } from '../ui/Pressable';
import { Text } from '../ui/Text';

export interface TabItem {
  name: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export interface TabBarProps {
  state: { index: number; routes: { key: string; name: string }[] };
  navigateToTab: (routeKey: string) => void;
  insets: { bottom: number };
}

/** A classic docked tab bar: hairline top border, icon over label, accent for the current tab. */
export function FloatingTabBar({ items, state, navigateToTab, insets }: TabBarProps & { items: TabItem[] }) {
  const { colors, spacing } = useTheme();
  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: Math.max(insets.bottom, spacing.sm),
        paddingTop: spacing.sm,
      }}
    >
      {state.routes.map((route, index) => {
        const item = items.find((i) => i.name === route.name);
        if (!item) return null;
        const focused = state.index === index;
        const Icon = item.icon;
        const tint = focused ? colors.accent : colors.textFaint;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityLabel={item.badge ? `${item.label}, ${item.badge} new` : item.label}
            accessibilityState={{ selected: focused }}
            haptic
            pressScale={1}
            onPress={() => navigateToTab(route.key)}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, paddingVertical: 2 }}
          >
            <View>
              <Icon size={22} color={tint} strokeWidth={focused ? 2.2 : 1.9} />
              {item.badge ? (
                <View style={{ position: 'absolute', top: -3, right: -8, minWidth: 16, height: 16, paddingHorizontal: 4, borderRadius: 8, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' }}>
                  <Text variant="caption" style={{ color: '#fff', fontSize: 10, lineHeight: 12 }}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text variant="caption" style={{ color: focused ? colors.text : colors.textFaint, fontSize: 11, fontFamily: focused ? 'Inter_600SemiBold' : 'Inter_500Medium' }}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Tab screens sit above the docked bar, so they need no extra bottom padding. */
export const TAB_BAR_SPACE = 0;
