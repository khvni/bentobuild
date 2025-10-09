import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bentobuild - AI Website Builder',
  description: 'Drag-and-drop website builder with AI-powered content generation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
