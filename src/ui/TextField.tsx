import React from 'react';
import { TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  hint?: string;
  error?: string | null;
}

export function TextField({ label, hint, error, multiline, ...rest }: TextFieldProps) {
  const { colors, radius, spacing, typography } = useTheme();
  return (
    <View style={{ gap: spacing.xs }}>
      {label ? (
        <Text variant="label" color="textMuted">
          {label}
        </Text>
      ) : null}
      <TextInput
        {...rest}
        multiline={multiline}
        accessibilityLabel={rest.accessibilityLabel ?? label}
        placeholderTextColor={colors.textFaint}
        style={[
          typography.body,
          {
            color: colors.text,
            backgroundColor: colors.surfaceRaised,
            borderWidth: 1,
            borderColor: error ? colors.danger : colors.border,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            minHeight: multiline ? 96 : 48,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
      />
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" color="textFaint">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
