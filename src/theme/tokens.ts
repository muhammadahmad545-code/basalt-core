export type ColorScheme = 'light' | 'dark';

export interface Palette {
  bg: string;
  surface: string;
  surfaceRaised: string;
  /** Subtle fill for inputs, icon tiles and pressed states. */
  fill: string;
  border: string;
  text: string;
  textMuted: string;
  textFaint: string;
  accent: string;
  /** Second shade for the rare places a gradient is used; a deeper tone of the accent. */
  accent2: string;
  accentSoft: string;
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

/** Calm neutrals with one accent per app. Contrast checked for body text on every surface. */
export function buildPalette(scheme: ColorScheme, accent: AccentSpec): Palette {
  if (scheme === 'dark') {
    return {
      bg: '#0C0D10',
      surface: '#15171B',
      surfaceRaised: '#1B1E23',
      fill: '#1F2228',
      border: '#262A31',
      text: '#ECEDEF',
      textMuted: '#9EA4AE',
      textFaint: '#6A707B',
      accent: accent.dark,
      accent2: accent.dark2 ?? accent.dark,
      accentSoft: withAlpha(accent.dark, 0.13),
      glow: withAlpha(accent.dark, 0.25),
      onAccent: accent.onAccent ?? '#0C0D10',
      success: '#4ADE80',
      warning: '#FBBF24',
      danger: '#F87171',
      dangerSoft: withAlpha('#F87171', 0.13),
      overlay: 'rgba(0,0,0,0.6)',
    };
  }
  return {
    bg: '#F6F7F9',
    surface: '#FFFFFF',
    surfaceRaised: '#FFFFFF',
    fill: '#F0F1F4',
    border: '#E3E5E9',
    text: '#111318',
    textMuted: '#5A606C',
    textFaint: '#8B919C',
    accent: accent.light,
    accent2: accent.light2 ?? accent.light,
    accentSoft: withAlpha(accent.light, 0.09),
    glow: withAlpha(accent.light, 0.14),
    onAccent: '#FFFFFF',
    success: '#15803D',
    warning: '#B45309',
    danger: '#DC2626',
    dangerSoft: withAlpha('#DC2626', 0.08),
    overlay: 'rgba(17,19,24,0.45)',
  };
}

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { sm: 8, md: 10, lg: 14, xl: 16, pill: 999 } as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const typography = {
  hero: { fontFamily: fonts.bold, fontSize: 30, lineHeight: 36, letterSpacing: -0.6 },
  display: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 32, letterSpacing: -0.5 },
  title: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 26, letterSpacing: -0.3 },
  heading: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, letterSpacing: -0.1 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 17 },
  overline: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14, letterSpacing: 0.8, textTransform: 'uppercase' },
  mono: { fontFamily: 'monospace', fontSize: 13, lineHeight: 18 },
} as const;

export type TypographyVariant = keyof typeof typography;
