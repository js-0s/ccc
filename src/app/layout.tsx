import '@/styles/globals.css';

import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'CCC',
  description: 'Web3 Coding Challenge',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookies = (await headers()).get('cookie');
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Providers cookies={cookies}>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
