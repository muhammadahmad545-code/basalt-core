import type { LucideIcon } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from '../ui/Button';
import { Pressable } from '../ui/Pressable';
import { Text } from '../ui/Text';

export interface OnboardingPage {
  icon: LucideIcon;
  title: string;
  body: string;
}

/** First-run walkthrough: swipeable pages, progress dots, skip and finish. */
export function Onboarding({ pages, onDone, appName }: { pages: OnboardingPage[]; onDone: () => void; appName: string }) {
  const { colors, spacing, radius } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const list = useRef<FlatList<OnboardingPage>>(null);
  const last = index === pages.length - 1;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: insets.top + 48 }}>
        <Text variant="label" color="textMuted">
          {appName}
        </Text>
        {!last ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Skip" hitSlop={12} onPress={onDone}>
            <Text variant="label" color="accent">
              Skip
            </Text>
          </Pressable>
        ) : null}
      </View>
      <FlatList
        ref={list}
        data={pages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(p) => p.title}
        renderItem={({ item }) => {
          const Icon = item.icon;
          return (
            <View style={{ width, paddingHorizontal: spacing.xl, justifyContent: 'center', gap: spacing.xl }}>
              <View style={{ width: 64, height: 64, borderRadius: radius.lg, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={30} color={colors.accent} strokeWidth={1.9} />
              </View>
              <View style={{ gap: spacing.md }}>
                <Text variant="hero">{item.title}</Text>
                <Text variant="body" color="textMuted" style={{ fontSize: 16, lineHeight: 24 }}>
                  {item.body}
                </Text>
              </View>
            </View>
          );
        }}
      />
      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: insets.bottom + spacing.lg, gap: spacing.lg }}>
        <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center' }} accessibilityLabel={`Page ${index + 1} of ${pages.length}`}>
          {pages.map((p, i) => (
            <View key={p.title} style={{ height: 6, width: i === index ? 18 : 6, borderRadius: 3, backgroundColor: i === index ? colors.accent : colors.border }} />
          ))}
        </View>
        <Button
          label={last ? 'Get started' : 'Next'}
          size="lg"
          onPress={() => (last ? onDone() : list.current?.scrollToIndex({ index: index + 1, animated: true }))}
        />
      </View>
    </View>
  );
}
