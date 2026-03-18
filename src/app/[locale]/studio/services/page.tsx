import { getTranslations, getLocale } from 'next-intl/server';
import { getServices } from '@/lib/content';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return {
    title: `${t('services')} - URBAN SPACE`,
  };
}

export default async function ServicesPage() {
  const t = await getTranslations('navigation');
  const locale = await getLocale();
  const services = await getServices();

  return (
    <div className="px-6 md:px-[100px] py-16">
      <h1 className="text-[32px] md:text-[40px] font-sans font-bold text-black mb-12">
        {t('services')}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-8 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
          >
            {service.icon && (
              <div className="text-3xl mb-4">{service.icon}</div>
            )}
            <h3 className="text-xl font-semibold text-black mb-3">
              {locale === 'ka' ? service.titleKa : service.titleEn}
            </h3>
            {(locale === 'ka' ? service.descriptionKa : service.descriptionEn) && (
              <p className="text-[#666666] text-base leading-relaxed">
                {locale === 'ka' ? service.descriptionKa : service.descriptionEn}
              </p>
            )}
          </div>
        ))}
      </div>
      {services.length === 0 && (
        <p className="text-[#999] text-center py-12">
          {locale === 'ka' ? 'სერვისები ჯერ არ დამატებულა' : 'No services added yet'}
        </p>
      )}
    </div>
  );
}
