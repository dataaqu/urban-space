export const dynamic = 'force-dynamic';

import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';
import { getTeamMembers } from '@/lib/content';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return {
    title: `${t('team')} - URBAN SPACE`,
  };
}

export default async function TeamPage() {
  const t = await getTranslations('navigation');
  const locale = await getLocale();
  const members = await getTeamMembers();

  return (
    <div className="px-6 md:px-[100px] py-16">
      <h1 className="text-[32px] md:text-[40px] font-sans font-bold text-black mb-12">
        {t('team')}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((member) => (
          <div key={member.id} className="group">
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={locale === 'ka' ? member.nameKa : member.nameEn}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-black">
              {locale === 'ka' ? member.nameKa : member.nameEn}
            </h3>
            <p className="text-sm text-[#666666] mt-1">
              {locale === 'ka' ? member.positionKa : member.positionEn}
            </p>
          </div>
        ))}
      </div>
      {members.length === 0 && (
        <p className="text-[#999] text-center py-12">
          {locale === 'ka' ? 'გუნდის წევრები ჯერ არ დამატებულა' : 'No team members added yet'}
        </p>
      )}
    </div>
  );
}
