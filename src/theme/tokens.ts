export type ColorScheme = 'light' | 'dark';

export interface Palette {
  bg: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  text: string;
  textMuted: string;
  textFaint: string;
  accent: string;
  /** Second hue for gradients; falls back to a shifted accent. */
  accent2: string;
  accentSoft: string;
  /** Translucent accent for glows and aurora backgrounds. */
  glow: string;
  onAccent: string;
  success: string;
  warning: string;
  danger: string;
  dangerSoft: string;
  overlay: string;
}

export interface AccentSpec {
  /** Accent on dark surfaces. */
  dark: string;
  /** Accent on light surfaces (usually a deeper shade for contrast). */
  light: string;
  /** Text/icon colour placed on top of the accent. */
  onAccent?: string;
  /** Optional second hue used in gradients (dark, light). */
  dark2?: string;
  light2?: string;
}

function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex.slice(0, 7)}${a}`;
}

export { withAlpha };

export function buildPalette(scheme: ColorScheme, accent: AccentSpec): Palette {
  if (scheme === 'dark') {
    return {
      bg: '#07080B',
      surface: '#101217',
      surfaceRaised: '#171A21',
      border: '#232731',
      text: '#F4F6FA',
      textMuted: '#A3ABB8',
      textFaint: '#687080',
      accent: accent.dark,
      accent2: accent.dark2 ?? accent.dark,
      accentSoft: withAlpha(accent.dark, 0.14),
      glow: withAlpha(accent.dark, 0.35),
      onAccent: accent.onAccent ?? '#06110F',
      success: '#3DD68C',
      warning: '#F5B544',
      danger: '#FF6B6B',
      dangerSoft: withAlpha('#FF6B6B', 0.14),
      overlay: 'rgba(0,0,0,0.6)',
    };
  }
  return {
    bg: '#F6F7F9',
    surface: '#FFFFFF',
    surfaceRaised: '#FFFFFF',
    border: '#E3E6EB',
    text: '#0F1216',
    textMuted: '#55606E',
    textFaint: '#8A94A3',
    accent: accent.light,
    accent2: accent.light2 ?? accent.light,
    accentSoft: withAlpha(accent.light, 0.1),
    glow: withAlpha(accent.light, 0.18),
    onAccent: '#FFFFFF',
    success: '#12855A',
    warning: '#A9690A',
    danger: '#C93636',
    dangerSoft: withAlpha('#C93636', 0.08),
    overlay: 'rgba(15,18,22,0.45)',
  };
}

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 } as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const typography = {
  hero: { fontFamily: fonts.bold, fontSize: 40, lineHeight: 46, letterSpacing: -1.2 },
  display: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 38, letterSpacing: -0.8 },
  title: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 30, letterSpacing: -0.4 },
  heading: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16 },
  overline: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14, letterSpacing: 1, textTransform: 'uppercase' },
  mono: { fontFamily: 'monospace', fontSize: 13, lineHeight: 18 },
} as const;

export type TypographyVariant = keyof typeof typography;
