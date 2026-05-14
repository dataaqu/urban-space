export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import SelectedWork from '@/components/home/SelectedWork';
import HomeFooter from '@/components/home/HomeFooter';
import SplashScreen from '@/components/home/SplashScreen';
import { getHeroSlides, getFeaturedProjects, getContentMap } from '@/lib/content';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home.hero' });

  return {
    title: `${t('title')} - ${t('subtitle')}`,
    description: t('description'),
  };
}

export default async function HomePage() {
  const [slides, featuredProjects, homeContent, dbInfo] = await Promise.all([
    getHeroSlides(),
    getFeaturedProjects(),
    getContentMap('home'),
    prisma.contactInfo
      .findUnique({ where: { id: 'singleton' } })
      .catch(() => null),
  ]);

  const social = {
    facebook: dbInfo?.facebook?.trim() || '',
    instagram: dbInfo?.instagram?.trim() || '',
  };

  return (
    <>
      <SplashScreen />
      <Hero slides={slides} content={homeContent} social={social} />
      <SelectedWork projects={featuredProjects} content={homeContent} />
      <HomeFooter />
    </>
  );
}
