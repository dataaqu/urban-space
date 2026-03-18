export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import { getHeroSlides } from '@/lib/content';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home.hero' });

  return {
    title: `${t('title')} - ${t('subtitle')}`,
    description: t('description'),
  };
}

export default async function HomePage() {
  const slides = await getHeroSlides();
  return <Hero slides={slides} />;
}
