import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { ThemeProvider } from '@/components/layout/theme-provider';

export const metadata: Metadata = {
  title: 'tools4dev',
  description: 'Suite de ferramentas para produtividade no desenvolvimento.',
  icons: {
    icon: '/developer.png',
    shortcut: '/developer.png',
    apple: '/developer.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
