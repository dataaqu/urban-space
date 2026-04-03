'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

interface Project {
  id: string;
  slug: string;
  titleKa: string;
  titleEn: string;
  category: string;
  type: string;
  images: string[];
  location: string | null;
}

interface SelectedWorkProps {
  projects: Project[];
}

export default function SelectedWork({ projects }: SelectedWorkProps) {
  const t = useTranslations('home.featured');
  const sub = useTranslations('projects.subtypes');
  const locale = useLocale();

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
              {t('title')}
            </h2>
            <p className="mt-2 text-lg text-[#0A0A0A]">
              {t('subtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {firstThree.map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`} className="group">
              <div className="overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.images[0] || '/poto/2.webp'}
                    alt={locale === 'ka' ? project.titleKa : project.titleEn}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 mt-0 bg-gray-100 px-5 py-6">
                <h3 className="text-lg font-medium text-[#0A0A0A]">
                  {locale === 'ka' ? project.titleKa : project.titleEn}
                </h3>
                {project.location && (
                  <p className="mt-1 text-sm text-gray-400">{project.location}</p>
                )}
                <span className="inline-block mt-2 px-3 py-1 text-xs bg-gray-200/60 text-gray-600">
                  {sub(project.type)}
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
                      src={project.images[0] || '/poto/2.webp'}
                      alt={locale === 'ka' ? project.titleKa : project.titleEn}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="border-t border-gray-200 mt-0 bg-gray-100 px-5 py-6">
                  <h3 className="text-xl font-medium text-[#0A0A0A]">
                    {locale === 'ka' ? project.titleKa : project.titleEn}
                  </h3>
                  {project.location && (
                    <p className="mt-1 text-sm text-gray-400">{project.location}</p>
                  )}
                  <span className="inline-block mt-2 px-3 py-1 text-xs bg-gray-200/60 text-gray-600">
                    {sub(project.type)}
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
