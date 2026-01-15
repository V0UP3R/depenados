import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Depenados - Crônicas de Aventuras Épicas',
  description:
    'Um lugar mágico para contar e preservar as histórias lendárias das aventuras dos Depenados. Compartilhe suas memórias épicas com fotos e vídeos.',
  keywords: ['depenados', 'aventuras', 'histórias', 'crônicas', 'rpg', 'fantasia'],
  authors: [{ name: 'Depenados' }],
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Depenados - Crônicas de Aventuras Épicas',
    description: 'Onde as lendas dos Depenados ganham vida',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Preconnect to Google Fonts for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Permanent+Marker&family=Space+Mono:wght@400;700&display=swap"
          as="style"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
