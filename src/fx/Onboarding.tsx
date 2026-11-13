import type { LucideIcon } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from '../ui/Button';
import { Pressable } from '../ui/Pressable';
import { Text } from '../ui/Text';
import { Aurora } from './Aurora';
import { Gradient } from './Gradient';

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
      <Aurora height={520} />
      <View style={{ paddingTop: insets.top + spacing.md, paddingHorizontal: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="overline" color="accent">
          Basalt · {appName}
        </Text>
        {!last ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Skip introduction" hitSlop={12} onPress={onDone}>
            <Text variant="label" color="textMuted">
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
        renderItem={({ item, index: i }) => {
          const Icon = item.icon;
          return (
            <View style={{ width, paddingHorizontal: spacing.xl, justifyContent: 'center', gap: spacing.xl }}>
              <Animated.View entering={ZoomIn.delay(i === 0 ? 150 : 0).springify().damping(14)} style={{ alignSelf: 'flex-start' }}>
                <Gradient colors={[colors.accent, colors.accent2]} radius={radius.xl} style={{ width: 96, height: 96, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={44} color={colors.onAccent} strokeWidth={2.2} />
                </Gradient>
              </Animated.View>
              <Animated.View entering={FadeIn.delay(i === 0 ? 300 : 0)} style={{ gap: spacing.md }}>
                <Text variant="hero">{item.title}</Text>
                <Text variant="body" color="textMuted" style={{ fontSize: 17, lineHeight: 26 }}>
                  {item.body}
                </Text>
              </Animated.View>
            </View>
          );
        }}
      />
      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: insets.bottom + spacing.lg, gap: spacing.lg }}>
        <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center' }} accessibilityLabel={`Page ${index + 1} of ${pages.length}`}>
          {pages.map((p, i) => (
            <View key={p.title} style={{ height: 8, width: i === index ? 24 : 8, borderRadius: 4, backgroundColor: i === index ? colors.accent : colors.border }} />
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
