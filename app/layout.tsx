import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
  variable: '--font-noto-kr',
});

export const metadata: Metadata = {
  title: 'Typoface — Typographic Portrait',
  description:
    'Real-time webcam portrait made of Korean words. Turn your face into a living mosaic of colored pill-shaped word badges. Open source.',
  keywords: ['typographic portrait', 'webcam', 'Korean', 'canvas', 'art', 'real-time', 'open source'],
  authors: [{ name: 'victorgalvez56', url: 'https://github.com/victorgalvez56' }],
  creator: 'victorgalvez56',
  openGraph: {
    title: 'Typoface — Typographic Portrait',
    description: 'Real-time webcam portrait made of Korean words. Open source.',
    url: 'https://github.com/victorgalvez56/typoface',
    siteName: 'Typoface',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Typoface — Typographic Portrait',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Typoface — Typographic Portrait',
    description: 'Real-time webcam portrait made of Korean words. Open source.',
    images: ['/og-image.png'],
    creator: '@victorgalvez56',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSansKR.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={notoSansKR.className}>{children}</body>
    </html>
  );
}
