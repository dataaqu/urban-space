import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Noto_Sans, Inter, Cormorant_Garamond, Noto_Sans_Georgian } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { ConditionalHeader, ConditionalFooter } from '@/components/layout/ConditionalHeader';
import '@/app/globals.css';

const notoSans = Noto_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-noto-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500'],
});

const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ['latin', 'georgian'],
  variable: '--font-noto-georgian',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600'],
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

  const fontVars = `${notoSans.variable} ${inter.variable} ${cormorant.variable} ${notoSansGeorgian.variable}`;
  const langClass = locale === 'ka' ? 'font-georgian' : 'font-inter';

  return (
    <html lang={locale} className={`${fontVars} ${langClass}`}>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
            <ConditionalHeader />
            <main className="flex-1">{children}</main>
            <ConditionalFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
