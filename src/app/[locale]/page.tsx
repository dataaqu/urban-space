export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import SelectedWork from '@/components/home/SelectedWork';
import HomeFooter from '@/components/home/HomeFooter';
import SplashScreen from '@/components/home/SplashScreen';
import { getHeroSlides, getFeaturedProjects, getContentMap } from '@/lib/content';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home.hero' });

  return {
    title: `${t('title')} - ${t('subtitle')}`,
    description: t('description'),
  };
}

export default async function HomePage() {
  const [slides, featuredProjects, homeContent] = await Promise.all([
    getHeroSlides(),
    getFeaturedProjects(),
    getContentMap('home'),
  ]);
  return (
    <>
      <SplashScreen />
      <Hero slides={slides} />
      <SelectedWork projects={featuredProjects} content={homeContent} />
      <HomeFooter />
    </>
  );
}
