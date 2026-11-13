import { ArrowLeft } from 'lucide-react-native';
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
  const { colors, spacing, radius } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
          onPress={onBack}
          style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text variant="title" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" color="textMuted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

/** Square icon button used in headers. */
export function IconButton({ icon: Icon, label, onPress, tone = 'text' }: { icon: React.ComponentType<{ size?: number; color?: string }>; label: string; onPress: () => void; tone?: 'text' | 'accent' | 'danger' }) {
  const { colors, radius } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={onPress}
      style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}
    >
      <Icon size={20} color={colors[tone]} />
    </Pressable>
  );
}
