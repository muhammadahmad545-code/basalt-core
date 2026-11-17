import { Slot, router, usePathname } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { FloatingTabBar } from './TabBar';

export interface SlotTab {
  /** Route path of the tab, e.g. "/" or "/activity". */
  href: string;
  label: string;
  icon: LucideIcon;
}

/**
 * Tab navigation built on Expo Router's Slot plus the floating tab bar. Used instead of the
 * router's JS tab navigator, which mounted no screens at all in release builds on Android.
 */
export function SlotTabs({ tabs }: { tabs: SlotTab[] }) {
  const { colors } = useTheme();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const active = Math.max(
    0,
    tabs.findIndex((t) => (t.href === '/' ? pathname === '/' : pathname === t.href || pathname.startsWith(`${t.href}/`))),
  );
  const state = { index: active, routes: tabs.map((t) => ({ key: t.href, name: t.href })) };
  const items = tabs.map((t) => ({ name: t.href, label: t.label, icon: t.icon }));
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <FloatingTabBar
        items={items}
        state={state}
        insets={insets}
        navigateToTab={(href) => {
          if (href !== tabs[active]?.href) router.navigate(href as never);
        }}
      />
    </View>
  );
}
