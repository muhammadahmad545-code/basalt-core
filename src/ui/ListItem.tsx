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
  const body = (
    <>
      {Icon ? (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.md,
            backgroundColor: iconTone === 'danger' ? colors.dangerSoft : colors.accentSoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={20} color={colors[iconTone]} />
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
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} pressScale={0.99} style={style}>
      {body}
    </Pressable>
  ) : (
    <View style={style}>{body}</View>
  );
}
