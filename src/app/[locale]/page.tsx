export const revalidate = 60;

import { unstable_cache } from 'next/cache';
import { getTranslations } from 'next-intl/server';
import HomeIntro from '@/components/home/HomeIntro';
import SelectedWork from '@/components/home/SelectedWork';
import HomeFooter from '@/components/home/HomeFooter';
import { getHeroSlides, getFeaturedProjects, getContentMap } from '@/lib/content';
import prisma from '@/lib/prisma';

const getHomeSocial = unstable_cache(
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

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home.hero' });

  return {
    title: `${t('title')} - ${t('subtitle')}`,
    description: t('description'),
  };
}

export default async function HomePage() {
  const [slides, featuredProjects, homeContent, social] = await Promise.all([
    getHeroSlides(),
    getFeaturedProjects(),
    getContentMap('home'),
    getHomeSocial(),
  ]);

  return (
    <>
      <HomeIntro slides={slides} content={homeContent} social={social} />
      <SelectedWork projects={featuredProjects} content={homeContent} />
      <HomeFooter />
    </>
  );
}
