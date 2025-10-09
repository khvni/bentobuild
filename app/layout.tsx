import type { Metadata } from 'next';
import { Noto_Sans, Instrument_Serif } from 'next/font/google';
import './globals.css';
import { StateHydrator } from '@/components/StateHydrator';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
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
    <html lang="en" className={`${notoSans.variable} ${instrumentSerif.variable}`}>
      <body className="antialiased font-sans">
        <StateHydrator />
        {children}
      </body>
    </html>
  );
}
