import React from 'react';
import { Text as RNText } from 'react-native';
import type { TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import type { TypographyVariant } from '../theme/tokens';
import type { Palette } from '../theme/tokens';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: keyof Palette;
  align?: TextStyle['textAlign'];
}

export function Text({ variant = 'body', color = 'text', align, style, ...rest }: TextProps) {
  const theme = useTheme();
  return (
    <RNText
      {...rest}
      style={[theme.typography[variant] as TextStyle, { color: theme.colors[color], textAlign: align }, style]}
    />
  );
}
