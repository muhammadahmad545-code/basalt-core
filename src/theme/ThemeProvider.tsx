import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { createSetting } from '../storage/settings';
import { buildPalette, radius, spacing, typography } from './tokens';
import type { AccentSpec, ColorScheme, Palette } from './tokens';

export type ThemePreference = 'system' | ColorScheme;

export const themePreference = createSetting<ThemePreference>('basalt.theme', 'system');

export interface Theme {
  scheme: ColorScheme;
  colors: Palette;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
}

const ThemeContext = createContext<Theme | null>(null);

export interface ThemeProviderProps {
  accent: AccentSpec;
  children: React.ReactNode;
}

export function ThemeProvider({ accent, children }: ThemeProviderProps) {
  const system = useColorScheme();
  const [preference] = themePreference.use();
  const scheme: ColorScheme = preference === 'system' ? (system === 'light' ? 'light' : 'dark') : preference;
  const theme = useMemo<Theme>(
    () => ({ scheme, colors: buildPalette(scheme, accent), spacing, radius, typography }),
    [scheme, accent],
  );
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used inside <ThemeProvider>');
  return theme;
}

/** Loads the suite typeface. Returns true once fonts are ready (or failed, so the app never hangs). */
export function useBasaltFonts(): boolean {
  const [loaded, error] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  return loaded || error != null;
}
