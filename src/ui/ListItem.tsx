import type { LucideIcon } from 'lucide-react-native';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Pressable } from './Pressable';
import { Text } from './Text';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconTone?: 'accent' | 'danger' | 'success' | 'textMuted';
  trailing?: React.ReactNode;
  onPress?: () => void;
  chevron?: boolean;
}

export function ListItem({ title, subtitle, icon: Icon, iconTone = 'accent', trailing, onPress, chevron }: ListItemProps) {
  const { colors, spacing, radius } = useTheme();
  const tint = iconTone === 'danger' ? colors.dangerSoft : iconTone === 'accent' ? colors.accentSoft : colors.fill;
  const body = (
    <>
      {Icon ? (
        <View style={{ width: 36, height: 36, borderRadius: radius.md, backgroundColor: tint, alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={colors[iconTone]} strokeWidth={2} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" color="textMuted" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
      {chevron ? <ChevronRight size={18} color={colors.textFaint} /> : null}
    </>
  );
  const style = { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, minHeight: 56 } as const;
  return onPress ? (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} pressScale={1} style={style}>
      {body}
    </Pressable>
  ) : (
    <View style={style}>{body}</View>
  );
}
