import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import 'katex/dist/katex.min.css';
import '@/styles/globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AXION AI - Next-Generation AI Conversation',
  description: 'Next-generation AI conversation platform with intelligent routing and deep research.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
