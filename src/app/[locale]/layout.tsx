import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Playfair_Display } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { ConditionalHeader, ConditionalFooter } from '@/components/layout/ConditionalHeader';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  if (!routing.locales.includes(locale as 'ka' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-accent-50 text-secondary-900">
        <NextIntlClientProvider messages={messages}>
          <ConditionalHeader />
          <main className="flex-1 pt-16">{children}</main>
          <ConditionalFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
