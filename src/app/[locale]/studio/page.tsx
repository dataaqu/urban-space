import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return {
    title: `${t('about')} - URBAN SPACE`,
  };
}

export default async function AboutPage() {
  const t = await getTranslations('navigation');

  return (
    <div className="px-6 md:px-[100px] py-16">
      <h1 className="text-[32px] md:text-[40px] font-sans font-bold text-black mb-8">
        {t('about')}
      </h1>
      <div className="text-[#666666] text-base leading-relaxed">
        {/* კონტენტი შემდეგ დაემატება */}
      </div>
    </div>
  );
}
