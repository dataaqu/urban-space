export const dynamic = 'force-dynamic';

import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';
import { getPartners } from '@/lib/content';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return {
    title: `${t('partners')} - URBAN SPACE`,
  };
}

export default async function PartnersPage() {
  const t = await getTranslations('navigation');
  const locale = await getLocale();
  const partners = await getPartners();

  return (
    <div className="px-6 md:px-[100px] py-16">
      <h1 className="text-[32px] md:text-[40px] font-sans font-bold text-black mb-12">
        {t('partners')}
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {partners.map((partner) => (
          <a
            key={partner.id}
            href={partner.website || '#'}
            target={partner.website ? '_blank' : undefined}
            rel={partner.website ? 'noopener noreferrer' : undefined}
            className="flex flex-col items-center gap-4 p-6 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
          >
            {partner.logo ? (
              <div className="relative w-24 h-24">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-lg">
                <span className="text-2xl font-bold text-gray-400">
                  {partner.name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-sm font-medium text-[#333] text-center">
              {partner.name}
            </span>
          </a>
        ))}
      </div>
      {partners.length === 0 && (
        <p className="text-[#999] text-center py-12">
          {locale === 'ka' ? 'პარტნიორები ჯერ არ დამატებულა' : 'No partners added yet'}
        </p>
      )}
    </div>
  );
}
