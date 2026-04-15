'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

interface ProjectPage {
  image1: string | null;
}

interface Project {
  id: string;
  slug: string;
  titleKa: string;
  titleEn: string;
  category: string;
  locationKa?: string | null;
  locationEn?: string | null;
  featuredImage?: string | null;
  pages?: ProjectPage[];
}

interface SelectedWorkProps {
  projects: Project[];
  content?: Record<string, { ka: string; en: string }>;
}

export default function SelectedWork({ projects, content }: SelectedWorkProps) {
  const t = useTranslations('home.featured');
  const locale = useLocale();

  const getText = (key: string, fallbackKey: string) => {
    const dbValue = content?.[key]?.[locale as 'ka' | 'en'];
    if (dbValue) return dbValue;
    return t(fallbackKey);
  };

  if (projects.length === 0) return null;

  const firstThree = projects.slice(0, 3);
  const lastTwo = projects.slice(3, 5);

  return (
    <>
      {/* Section 1: Title + 3 cards */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-[60px] py-20 bg-white">
        <div className="flex justify-end mb-12">
          <div className="text-right">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A0A0A]">
              {getText('featured.title', 'title')}
            </h2>
            <p className="mt-2 text-lg text-[#0A0A0A]">
              {getText('featured.subtitle', 'subtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {firstThree.map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`} className="group">
              <div className="overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.featuredImage || project.pages?.[0]?.image1 || '/poto/2.webp'}
                    alt={locale === 'ka' ? project.titleKa : project.titleEn}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 mt-0 bg-gray-100 px-5 py-5">
                <h3 className="text-base font-semibold text-[#0A0A0A]">
                  {locale === 'ka' ? project.titleKa : project.titleEn}
                </h3>
                {(project.locationKa || project.locationEn) && (
                  <p className="text-sm text-[#666] mt-0.5">
                    {locale === 'ka' ? project.locationKa : project.locationEn}
                  </p>
                )}
                <span className="inline-block mt-2 px-3 py-1 text-xs border border-gray-300 rounded text-[#555]">
                  {project.category === 'ARCHITECTURE'
                    ? (locale === 'ka' ? 'არქიტექტურა' : 'Architecture')
                    : (locale === 'ka' ? 'ურბანული' : 'Urban')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 2: 2 larger cards */}
      {lastTwo.length > 0 && (
        <section className="px-8 md:px-[60px] -mt-16 pb-40 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {lastTwo.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`} className="group">
                <div className="overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={project.featuredImage || project.pages?.[0]?.image1 || '/poto/2.webp'}
                      alt={locale === 'ka' ? project.titleKa : project.titleEn}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="border-t border-gray-200 mt-0 bg-gray-100 px-5 py-5">
                  <h3 className="text-base font-semibold text-[#0A0A0A]">
                    {locale === 'ka' ? project.titleKa : project.titleEn}
                  </h3>
                  {(project.locationKa || project.locationEn) && (
                    <p className="text-sm text-[#666] mt-0.5">
                      {locale === 'ka' ? project.locationKa : project.locationEn}
                    </p>
                  )}
                  <span className="inline-block mt-2 px-3 py-1 text-xs border border-gray-300 rounded text-[#555]">
                    {project.category === 'ARCHITECTURE'
                      ? (locale === 'ka' ? 'არქიტექტურა' : 'Architecture')
                      : (locale === 'ka' ? 'ურბანული' : 'Urban')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </>
  );
}
