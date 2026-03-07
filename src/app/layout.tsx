import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { ThemeProvider } from '@/components/layout/theme-provider';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  getHomeSeoKeywords,
  getPublicSiteUrl,
} from '@/lib/seo';

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: getHomeSeoKeywords(),
  alternates: siteUrl
    ? {
        canonical: '/',
      }
    : undefined,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    ...(siteUrl ? { url: siteUrl } : {}),
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    ...(siteUrl
      ? {
          images: [
            {
              url: `${siteUrl}/developer.png`,
              width: 1200,
              height: 630,
              alt: `${SITE_NAME} logo`,
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    ...(siteUrl ? { images: [`${siteUrl}/developer.png`] } : {}),
  },
  verification: {
    google: 'NtLsh5bfARYSPHto1GxoGVbDE0clV6yJYRI5vQHlUlI',
  },
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
