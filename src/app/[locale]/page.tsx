import { getTranslations } from 'next-intl/server';
import Hero from '@/components/home/Hero';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home.hero' });

  return {
    title: `${t('title')} - ${t('subtitle')}`,
    description: t('description'),
  };
}

export default function HomePage() {
  return <Hero />;
}
