import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import { AppHeader } from '@/shared/components/AppHeader';
import { AuthProvider } from '@/shared/providers/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mini Marketplace',
  description: 'Mini Marketplace frontend',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <AntdRegistry>
          <AuthProvider>
            <AppHeader />
            <main className="mx-auto min-h-screen max-w-7xl px-4 py-6">
              {children}
            </main>
          </AuthProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}