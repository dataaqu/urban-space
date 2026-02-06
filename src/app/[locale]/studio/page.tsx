import { getTranslations } from 'next-intl/server';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import Button from '@/components/ui/Button';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'studio' });

  return {
    title: `${t('title')} - URBAN SPACE`,
    description: t('about.description'),
  };
}

export default async function StudioPage() {
  const t = await getTranslations('studio');
  const navT = await getTranslations('navigation');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl text-secondary-300 max-w-3xl">
            {t('about.description')}
          </p>
        </div>
      </section>

      {/* Links Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Card */}
            <div className="bg-secondary-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                {t('team.title')}
              </h3>
              <p className="text-secondary-600 mb-6">
                Meet the talented individuals behind our projects.
              </p>
              <Link href="/studio/team">
                <Button variant="outline">{navT('team')}</Button>
              </Link>
            </div>

            {/* Partners Card */}
            <div className="bg-secondary-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                {t('partners.title')}
              </h3>
              <p className="text-secondary-600 mb-6">
                Our trusted partners and collaborators.
              </p>
              <Link href="/studio/partners">
                <Button variant="outline">{navT('partners')}</Button>
              </Link>
            </div>

            {/* Principles Card */}
            <div className="bg-secondary-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                {t('principles.title')}
              </h3>
              <p className="text-secondary-600 mb-6">
                {t('principles.description')}
              </p>
              <Link href="/studio/principles">
                <Button variant="outline">{navT('principles')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
