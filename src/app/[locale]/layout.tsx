import { ReactNode, type CSSProperties } from 'react';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Noto_Sans, Inter, Cormorant_Garamond, Noto_Sans_Georgian } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { ConditionalHeader, ConditionalFooter } from '@/components/layout/ConditionalHeader';
import ServiceWorkerCleanup from '@/components/layout/ServiceWorkerCleanup';
import prisma from '@/lib/prisma';
import { SITE_URL, SITE_NAME, buildAlternates, type Locale } from '@/lib/seo';
import '@/app/globals.css';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home.hero' });
  const description = t('description');

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — ${t('subtitle')}`,
      template: `%s — ${SITE_NAME}`,
    },
    description,
    applicationName: SITE_NAME,
    alternates: buildAlternates(locale as Locale),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: locale === 'ka' ? 'ka_GE' : 'en_US',
      url: `${SITE_URL}/${locale}`,
      title: `${SITE_NAME} — ${t('subtitle')}`,
      description,
    },
    twitter: {
      card: 'summary',
      title: `${SITE_NAME} — ${t('subtitle')}`,
      description,
    },
    icons: {
      icon: '/u.png',
      shortcut: '/u.png',
      apple: '/u.png',
    },
  };
}

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

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/u.png`,
    sameAs: [social.facebook, social.instagram].filter(Boolean),
  };

  return (
    <html
      lang={locale}
      className={`${fontVars} ${langClass}`}
      // Brand logo ("URBAN SPACE") must always render in real Inter, even on
      // Georgian where globals.css remaps --font-inter to Noto Georgian.
      style={{ '--font-brand': inter.style.fontFamily } as CSSProperties}
    >
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Escape '<' so DB-sourced social URLs can never break out of the
            // <script> tag (JSON-LD injection hardening).
            __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c'),
          }}
        />
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
