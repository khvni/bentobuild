import type { Metadata } from 'next';
import {
  Inter,
  Instrument_Serif,
  Noto_Sans,
  Lexend,
  Manrope,
  EB_Garamond,
  Playfair_Display
} from 'next/font/google';
import './globals.css';
import { StateHydrator } from '@/components/StateHydrator';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

// Sans-serif fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '600', '700'],
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
  weight: ['400', '600', '700'],
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
  weight: ['400', '600', '700'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '600', '700'],
});

// Serif fonts
const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  display: 'swap',
  weight: ['400', '600', '700'],
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Bentoblocks - AI Website Builder',
  description: 'Drag-and-drop website builder with AI-powered content generation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${inter.variable}
        ${notoSans.variable}
        ${lexend.variable}
        ${manrope.variable}
        ${instrumentSerif.variable}
        ${ebGaramond.variable}
        ${playfairDisplay.variable}
      `}
    >
      <body className="antialiased">
        <MantineProvider>
          <StateHydrator />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
