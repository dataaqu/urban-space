export const dynamic = 'force-dynamic';

import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { getContentMap } from '@/lib/content';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return {
    title: `${t('studio')} - URBAN SPACE`,
  };
}

export default async function StudioPage() {
  const locale = await getLocale();
  const content = await getContentMap('studio');

  const text = (key: string, fallback: string) => {
    return content[key]?.[locale as 'ka' | 'en'] || fallback;
  };

  const listItems = (key: string, fallback: string) => {
    const val = content[key]?.[locale as 'ka' | 'en'] || fallback;
    return val.split('\n').filter(Boolean);
  };

  return (
    <div className="bg-white">
      {/* About Section */}
      <section className="px-8 md:px-[80px] xl:px-[100px] 2xl:px-[140px] pt-12 xl:pt-16 2xl:pt-20 pb-16 xl:pb-20 2xl:pb-24">
        <div className="mx-auto max-w-[1500px] grid grid-cols-1 md:grid-cols-2 gap-12 xl:gap-16 2xl:gap-20 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl font-medium text-[#0A0A0A] mb-8 xl:mb-10 2xl:mb-12">
              {text('about.title', 'About Us')}
            </h2>
            <div className="space-y-5 xl:space-y-6 2xl:space-y-7 text-[15px] xl:text-[17px] 2xl:text-[19px] text-[#333] leading-relaxed">
              <p>{text('about.description', '')}</p>
              <p>{text('about.paragraph1', '')}</p>
              <p>{text('about.paragraph2', '')}</p>
              <p>{text('about.paragraph3', '')}</p>
            </div>
          </div>

          <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
            <Image
              src="/poto/about.jpeg"
              alt="Urban Space Team"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Expertise / Principles / Team */}
      <section className="px-8 md:px-[80px] xl:px-[100px] 2xl:px-[140px] pt-6 xl:pt-8 2xl:pt-10 pb-16 xl:pb-20 2xl:pb-24">
        <div className="mx-auto max-w-[1500px] grid grid-cols-1 md:grid-cols-3 gap-12 xl:gap-16 2xl:gap-20">
          {/* Expertise */}
          <div>
            <h3 className="text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-medium text-[#0A0A0A] mb-6 xl:mb-8 2xl:mb-10">
              {text('expertise.title', 'Expertise')}
            </h3>

            <h4 className="text-base xl:text-lg 2xl:text-xl font-semibold text-[#0A0A0A] mb-3 xl:mb-4">
              {text('expertise.urban.title', 'Urban Planning')}
            </h4>
            <ul className="space-y-1.5 xl:space-y-2 text-[15px] xl:text-[17px] 2xl:text-[19px] text-[#333] mb-6 xl:mb-8">
              {listItems('expertise.urban.items', 'Master Plans – Tbilisi\nDetailed Development Plans – Regions').map((item, i) => (
                <li key={i} className="flex items-start gap-2 xl:gap-3">
                  <span className="mt-2 xl:mt-2.5 w-1 h-1 xl:w-1.5 xl:h-1.5 rounded-full bg-[#333] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <h4 className="text-base xl:text-lg 2xl:text-xl font-semibold text-[#0A0A0A] mb-3 xl:mb-4">
              {text('expertise.arch.title', 'Architecture')}
            </h4>
            <ul className="space-y-1.5 xl:space-y-2 text-[15px] xl:text-[17px] 2xl:text-[19px] text-[#333]">
              {listItems('expertise.arch.items', 'Residential and mixed-use complexes\nCommercial and hospitality buildings\nPublic and educational facilities').map((item, i) => (
                <li key={i} className="flex items-start gap-2 xl:gap-3">
                  <span className="mt-2 xl:mt-2.5 w-1 h-1 xl:w-1.5 xl:h-1.5 rounded-full bg-[#333] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Principles */}
          <div>
            <h3 className="text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-medium text-[#0A0A0A] mb-6 xl:mb-8 2xl:mb-10">
              {text('principles.title', 'Principles')}
            </h3>
            <ul className="space-y-2 xl:space-y-3 text-[15px] xl:text-[17px] 2xl:text-[19px] text-[#333] mb-8 xl:mb-10 2xl:mb-12">
              {listItems('principles.items', 'Context-based design\nLong-term urban and architectural value\nHuman scale and spatial quality\nSustainable and thoughtful design processes').map((item, i) => (
                <li key={i} className="flex items-start gap-2 xl:gap-3">
                  <span className="mt-2 xl:mt-2.5 w-1 h-1 xl:w-1.5 xl:h-1.5 rounded-full bg-[#333] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-[15px] xl:text-[17px] 2xl:text-[19px] text-[#666] italic leading-relaxed">
              {text('principles.quote', 'Well-thought-out architecture increases the value of a building over time.')}
            </p>
          </div>

          {/* Team */}
          <div>
            <h3 className="text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-medium text-[#0A0A0A] mb-6 xl:mb-8 2xl:mb-10">
              {text('team.title', 'Team')}
            </h3>
            <p className="text-[15px] xl:text-[17px] 2xl:text-[19px] text-[#333] leading-relaxed mb-8 xl:mb-10 2xl:mb-12">
              {text('team.description', '')}
            </p>

            <div>
              <p className="text-base xl:text-lg 2xl:text-xl font-semibold text-[#0A0A0A]">
                {text('team.leads', 'Mariam Ephremidze    Luka Kikiani')}
              </p>
              <p className="text-sm xl:text-base 2xl:text-lg text-[#666] mt-1 xl:mt-1.5">
                {text('team.leadsRole', 'Principal Architects')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
