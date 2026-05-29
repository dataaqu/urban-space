import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Noto_Sans, Inter, Cormorant_Garamond, Noto_Sans_Georgian } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { ConditionalHeader, ConditionalFooter } from '@/components/layout/ConditionalHeader';
import ServiceWorkerCleanup from '@/components/layout/ServiceWorkerCleanup';
import prisma from '@/lib/prisma';
import '@/app/globals.css';

export const metadata: Metadata = {
  icons: {
    icon: '/u.png',
    shortcut: '/u.png',
    apple: '/u.png',
  },
};

const getSocialLinks = unstable_cache(
  async () => {
    const dbInfo = await prisma.contactInfo
      .findUnique({ where: { id: 'singleton' } })
      .catch(() => null);
    return {
      facebook: dbInfo?.facebook?.trim() || '',
      instagram: dbInfo?.instagram?.trim() || '',
    };
  },
  ['contact-info-social'],
  { revalidate: 3600, tags: ['contact-info'] },
);

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

  setRequestLocale(locale);

  const [messages, social] = await Promise.all([
    getMessages({ locale }),
    getSocialLinks(),
  ]);

  const fontVars = `${notoSans.variable} ${inter.variable} ${cormorant.variable} ${notoSansGeorgian.variable}`;
  const langClass = locale === 'ka' ? 'font-georgian' : 'font-inter';

  return (
    <html lang={locale} className={`${fontVars} ${langClass}`}>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
            <ServiceWorkerCleanup />
            <ConditionalHeader social={social} />
            <main className="flex-1">{children}</main>
            <ConditionalFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
