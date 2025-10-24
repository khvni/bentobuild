import type { Metadata } from 'next';
import './globals.css';
import { StateHydrator } from '@/components/StateHydrator';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import SessionProvider from '@/components/providers/SessionProvider';
import {
  inter,
  notoSans,
  lexend,
  manrope,
  instrumentSerif,
  ebGaramond,
  playfairDisplay,
} from '@/lib/fonts';

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
        <SessionProvider>
          <MantineProvider>
            <StateHydrator />
            {children}
          </MantineProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
