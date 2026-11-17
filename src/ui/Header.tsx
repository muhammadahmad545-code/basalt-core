import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Pressable } from './Pressable';
import { Text } from './Text';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  /** Called by the back button. Omit to hide it. */
  onBack?: () => void;
}

export function Header({ title, subtitle, right, onBack }: HeaderProps) {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ gap: spacing.md }}>
      {onBack || right ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 40 }}>
          {onBack ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Back" hitSlop={10} onPress={onBack} style={{ width: 40, height: 40, marginLeft: -8, alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeft size={22} color={colors.text} />
            </Pressable>
          ) : (
            <View />
          )}
          {right ? <View style={{ flexDirection: 'row', gap: spacing.sm }}>{right}</View> : null}
        </View>
      ) : null}
      <View style={{ gap: 2 }}>
        <Text variant="display" accessibilityRole="header" numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="label" color="textMuted" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/** Round icon button for headers and toolbars. */
export function IconButton({ icon: Icon, label, onPress, tone = 'text' }: { icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; label: string; onPress: () => void; tone?: 'text' | 'accent' | 'danger' }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={onPress}
      style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: tone === 'danger' ? colors.dangerSoft : colors.fill, alignItems: 'center', justifyContent: 'center' }}
    >
      <Icon size={19} color={colors[tone]} strokeWidth={2} />
    </Pressable>
  );
}
