import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { AdminSessionProvider } from '@/components/admin/AdminSessionProvider';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Admin Panel - Urban Space',
  robots: 'noindex, nofollow',
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ka" className={inter.variable}>
      <body className="min-h-screen bg-neutral-50 font-sans text-dark-900 antialiased">
        <AdminSessionProvider>{children}</AdminSessionProvider>
      </body>
    </html>
  );
}
