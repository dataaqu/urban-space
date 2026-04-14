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
      <section className="px-8 md:px-[80px] pt-12 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-medium text-[#0A0A0A] mb-8">
              {text('about.title', 'About Us')}
            </h2>
            <div className="space-y-5 text-[15px] text-[#333] leading-relaxed">
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
      <section className="px-8 md:px-[80px] pt-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Expertise */}
          <div>
            <h3 className="text-xl md:text-2xl font-medium text-[#0A0A0A] mb-6">
              {text('expertise.title', 'Expertise')}
            </h3>

            <h4 className="text-base font-semibold text-[#0A0A0A] mb-3">
              {text('expertise.urban.title', 'Urban Planning')}
            </h4>
            <ul className="space-y-1.5 text-[15px] text-[#333] mb-6">
              {listItems('expertise.urban.items', 'Master Plans – Tbilisi\nDetailed Development Plans – Regions').map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 w-1 h-1 rounded-full bg-[#333] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <h4 className="text-base font-semibold text-[#0A0A0A] mb-3">
              {text('expertise.arch.title', 'Architecture')}
            </h4>
            <ul className="space-y-1.5 text-[15px] text-[#333]">
              {listItems('expertise.arch.items', 'Residential and mixed-use complexes\nCommercial and hospitality buildings\nPublic and educational facilities').map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 w-1 h-1 rounded-full bg-[#333] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Principles */}
          <div>
            <h3 className="text-xl md:text-2xl font-medium text-[#0A0A0A] mb-6">
              {text('principles.title', 'Principles')}
            </h3>
            <ul className="space-y-2 text-[15px] text-[#333] mb-8">
              {listItems('principles.items', 'Context-based design\nLong-term urban and architectural value\nHuman scale and spatial quality\nSustainable and thoughtful design processes').map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 w-1 h-1 rounded-full bg-[#333] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-[15px] text-[#666] italic leading-relaxed">
              {text('principles.quote', 'Well-thought-out architecture increases the value of a building over time.')}
            </p>
          </div>

          {/* Team */}
          <div>
            <h3 className="text-xl md:text-2xl font-medium text-[#0A0A0A] mb-6">
              {text('team.title', 'Team')}
            </h3>
            <p className="text-[15px] text-[#333] leading-relaxed mb-8">
              {text('team.description', '')}
            </p>

            <div>
              <p className="text-base font-semibold text-[#0A0A0A]">
                {text('team.leads', 'Mariam Ephremidze    Luka Kikiani')}
              </p>
              <p className="text-sm text-[#666] mt-1">
                {text('team.leadsRole', 'Principal Architects')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
