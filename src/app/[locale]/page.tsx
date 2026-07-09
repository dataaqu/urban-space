// Render at request time so live DB content shows on first load. Railway
// can't reach the internal DB at build time, which otherwise bakes an empty
// page (no slides/projects) into the static snapshot and shows it until the
// first refresh. Data stays fast via the unstable_cache wrappers in @/lib/content.
export const dynamic = 'force-dynamic';

import { unstable_cache } from 'next/cache';
import { getTranslations } from 'next-intl/server';
import { pageMetadata, type Locale } from '@/lib/seo';
import HomeIntro from '@/components/home/HomeIntro';
import SelectedWork from '@/components/home/SelectedWork';
import HomeFooter from '@/components/home/HomeFooter';
import { getHeroSlides, getFeaturedProjects, getContentMap } from '@/lib/content';
import prisma from '@/lib/prisma';

const getHomeContact = unstable_cache(
  async () => {
    const dbInfo = await prisma.contactInfo
      .findUnique({ where: { id: 'singleton' } })
      .catch(() => null);
    return {
      phone: dbInfo?.phone?.trim() || '',
      addressKa: dbInfo?.addressKa?.trim() || '',
      addressEn: dbInfo?.addressEn?.trim() || '',
      facebook: dbInfo?.facebook?.trim() || '',
      instagram: dbInfo?.instagram?.trim() || '',
    };
  },
  ['contact-info-home'],
  { revalidate: 3600, tags: ['contact-info'] },
);

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home.hero' });

  return pageMetadata({
    locale: locale as Locale,
    path: '',
    title: `${t('title')} — ${t('subtitle')}`,
    description: t('description'),
    absoluteTitle: true,
  });
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const [slides, featuredProjects, homeContent, contact] = await Promise.all([
    getHeroSlides(),
    getFeaturedProjects(),
    getContentMap('home'),
    getHomeContact(),
  ]);

  const social = { facebook: contact.facebook, instagram: contact.instagram };
  const address =
    (locale === 'ka' ? contact.addressKa : contact.addressEn) ||
    (locale === 'ka'
      ? 'თბილისი, საბურთალო, ვაჟა-ფშაველას გამზ. 25'
      : 'Tbilisi, Saburtalo, Vazha-Pshavela Ave. 25');
  const phone = contact.phone || '+995 555 123 456';

  return (
    <>
      <HomeIntro slides={slides} content={homeContent} social={social} />
      <SelectedWork projects={featuredProjects} content={homeContent} />
      <HomeFooter
        address={address}
        phone={phone}
        facebook={contact.facebook}
        instagram={contact.instagram}
      />
    </>
  );
}
