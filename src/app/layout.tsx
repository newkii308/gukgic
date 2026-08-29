import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/hooks/use-theme';
import { I18nProvider } from '@/hooks/use-i18n';
import { AuthProvider } from '@/hooks/use-auth';
import { QueryProvider } from '@/components/providers/query-provider';
import { AppShell } from '@/components/layout/app-shell';

export const metadata: Metadata = {
  title: {
    default: 'GUKGIC — ພື້ນທີ່ຫາເພື່ອນໃໝ່ຂອງຄົນຮຸ່ນໃໝ່ໃນລາວ',
    template: '%s | GUKGIC',
  },
  description: 'GUKGIC: The modern social web application for finding friends, sharing moments, and real-time messaging designed for Lao Gen Z.',
  keywords: ['GUKGIC', 'Friend App Laos', 'ຫາເພື່ອນລາວ', 'Social Lao', 'Gen Z Laos', 'Vientiane', 'Luang Prabang', 'Find Friends'],
  authors: [{ name: 'GUKGIC Team' }],
  metadataBase: new URL('https://gukgic.la'),
  openGraph: {
    title: 'GUKGIC — ພື້ນທີ່ຫາເພື່ອນໃໝ່ຂອງຄົນຮຸ່ນໃໝ່ໃນລາວ',
    description: 'Find friends, share photos, send voice messages, and connect across Laos on GUKGIC.',
    url: 'https://gukgic.la',
    siteName: 'GUKGIC',
    locale: 'lo_LA',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'GUKGIC Social App Laos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GUKGIC — ພື້ນທີ່ຫາເພື່ອນໃໝ່ຂອງຄົນຮຸ່ນໃໝ່ໃນລາວ',
    description: 'Find friends, share photos, send voice messages, and connect across Laos on GUKGIC.',
    images: ['https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&auto=format&fit=crop&q=80'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0F19' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lo" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased select-auto min-h-screen">
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <QueryProvider>
                <AppShell>{children}</AppShell>
              </QueryProvider>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
