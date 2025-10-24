import {
  Inter,
  Instrument_Serif,
  Noto_Sans,
  Lexend,
  Manrope,
  EB_Garamond,
  Playfair_Display,
} from 'next/font/google';

// Sans-serif fonts
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '600', '700'],
});

// Serif fonts
export const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

export const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
  weight: ['400', '600', '700'],
});

// Font map for direct className usage
export const fontMap = {
  Inter: inter,
  'Noto Sans': notoSans,
  Lexend: lexend,
  Manrope: manrope,
  'Instrument Serif': instrumentSerif,
  'EB Garamond': ebGaramond,
  'Playfair Display': playfairDisplay,
};
