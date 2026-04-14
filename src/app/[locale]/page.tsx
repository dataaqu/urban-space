export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import HomeNav from '@/components/home/HomeNav';
import SelectedWork from '@/components/home/SelectedWork';
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
      <HomeNav />
      <Hero slides={slides} />
      <SelectedWork projects={featuredProjects} content={homeContent} />
    </>
  );
}
