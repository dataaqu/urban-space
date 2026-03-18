import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import { getContentMap } from '@/lib/content';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return {
    title: `${t('about')} - URBAN SPACE`,
  };
}

export default async function AboutPage() {
  const t = await getTranslations('studio.about');
  const locale = await getLocale();
  const content = await getContentMap('studio');

  const lang = locale as 'ka' | 'en';
  const p1 = content['about.paragraph1']?.[lang] || t('paragraph1');
  const p2 = content['about.paragraph2']?.[lang] || t('paragraph2');
  const p3 = content['about.paragraph3']?.[lang] || t('paragraph3');
  const p4 = content['about.paragraph4']?.[lang] || t('paragraph4');

  return (
    <div className="px-6 md:px-[100px] py-16">
      <div className="relative mb-8">
        <div className="relative w-full h-[200px] md:h-[320px] rounded-2xl overflow-hidden">
          <Image
            src="/poto/about.jpeg"
            alt="Urban Space Team"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 text-[#999] text-base leading-relaxed font-dachi">
        <div className="space-y-10">
          <p>{p1}</p>
          <p>{p2}</p>
        </div>
        <div className="space-y-10">
          <p>{p3}</p>
          <p>{p4}</p>
        </div>
      </div>
    </div>
  );
}
