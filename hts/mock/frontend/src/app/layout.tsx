import type { Metadata } from 'next';
import './globals.css';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Header from '@/components/layout/Header';
import RouterInitializer from '@/components/RouterInitializer';
import { Providers } from '@/lib/providers';

export const metadata: Metadata = {
  title: '管理会計システム',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans bg-gray-300">
        <Providers>
          <RouterInitializer />
          <div className="mx-auto max-w-[1366px] bg-white shadow-sm">
            <Header />
            <Breadcrumb />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
