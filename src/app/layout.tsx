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
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
