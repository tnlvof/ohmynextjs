import type { Metadata } from 'next';
import './globals.css';
import { RootLayoutContent } from './layout-content';

export const metadata: Metadata = {
  title: 'OhMyNextJS',
  description: 'Vibe Coding Full-Stack Starter Kit',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
}
