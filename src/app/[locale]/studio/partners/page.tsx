import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'studio.partners' });

  return {
    title: `${t('title')} - URBAN SPACE`,
  };
}

export default async function PartnersPage() {
  const t = await getTranslations('studio.partners');

  const partners = await prisma.partner.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-secondary-900 mb-12 text-center">
          {t('title')}
        </h1>

        {partners.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {partners.map((partner) => (
              <a
                key={partner.id}
                href={partner.website || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full h-12 object-contain"
                  />
                ) : (
                  <span className="text-secondary-700 font-medium text-center">
                    {partner.name}
                  </span>
                )}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-center text-secondary-500">No partners found.</p>
        )}
      </div>
    </div>
  );
}
