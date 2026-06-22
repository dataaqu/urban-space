// Render at request time so live DB content shows on first load (Railway
// can't reach the internal DB at build time, baking an empty snapshot).
export const dynamic = 'force-dynamic';

import { getLocale, getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';
import { getContentMap } from '@/lib/content';
import ContactPageClient from '@/components/contact/ContactPageClient';

const SINGLETON_ID = 'singleton';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: `${t('title')} - URBAN SPACE`,
  };
}

export default async function ContactPage() {
  const locale = await getLocale();
  const t = await getTranslations('contact');
  const lang = locale as 'ka' | 'en';

  const [foundInfo, content] = await Promise.all([
    prisma.contactInfo
      .findUnique({ where: { id: SINGLETON_ID } })
      .catch(() => null),
    getContentMap('contact'),
  ]);
  const dbInfo = foundInfo ?? {
    email: null,
    phone: null,
    addressKa: null,
    addressEn: null,
    facebook: null,
    instagram: null,
    mapLat: null,
    mapLng: null,
  };

  const text = (key: string, fallback: string) =>
    content[key]?.[lang]?.trim() || fallback;

  const info = {
    title: text('title', t('title')),
    intro: text(
      'subtitle',
      locale === 'ka'
        ? 'ღია ვართ თანამშრომლობისა და ახალი პროექტებისთვის.'
        : 'We are open for collaboration and new projects.',
    ),
    email: dbInfo.email || 'info@urbanspace.ge',
    phone: dbInfo.phone || '+995 32 2 22 22 22',
    address:
      (locale === 'ka' ? dbInfo.addressKa : dbInfo.addressEn) ||
      (locale === 'ka'
        ? 'თბილისი, საბურთალო, ვაჟა-ფშაველას გამზ. 25'
        : 'Tbilisi, Saburtalo, Vazha-Pshavela Ave. 25'),
    facebook: dbInfo.facebook || '',
    instagram: dbInfo.instagram || '',
    mapLat: dbInfo.mapLat ?? null,
    mapLng: dbInfo.mapLng ?? null,
    formCta: locale === 'ka' ? 'დაიწყე პროექტი' : 'Start a project',
    formPlaceholder:
      locale === 'ka'
        ? 'მოგვიყევით თქვენი პროექტის შესახებ'
        : 'Tell us about your project',
    formSubmit: locale === 'ka' ? 'გაგზავნა →' : 'Send inquiry →',
    formSending: locale === 'ka' ? 'იგზავნება...' : 'Sending...',
    formSuccess:
      locale === 'ka'
        ? 'შეტყობინება წარმატებით გაიგზავნა.'
        : 'Your message was sent successfully.',
    formError:
      locale === 'ka' ? 'შეცდომა მოხდა. სცადეთ თავიდან.' : 'Something went wrong. Try again.',
    namePlaceholder: locale === 'ka' ? 'სახელი' : 'Name',
    emailPlaceholder: locale === 'ka' ? 'ელ-ფოსტა' : 'Email',
    tagline:
      locale === 'ka'
        ? 'არქიტექტურა და ურბანული დაგეგმარება'
        : 'Architecture & Urban Planning',
  };

  return <ContactPageClient locale={locale} info={info} />;
}
