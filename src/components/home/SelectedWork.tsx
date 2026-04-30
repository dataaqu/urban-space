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

  const titleSizing =
    locale === 'ka'
      ? 'text-[22px] md:text-[34px]'
      : 'text-[28px] md:text-[44px]';

  const renderCard = (project: Project) => {
    const title = locale === 'ka' ? project.titleKa : project.titleEn;
    const location = locale === 'ka' ? project.locationKa : project.locationEn;
    const imageSrc =
      project.featuredImage || project.pages?.[0]?.image1 || '/poto/2.webp';

    return (
      <Link key={project.id} href={`/projects/${project.slug}`} className="group block">
        <div className="overflow-hidden relative">
          <Image
            src={imageSrc}
            alt={title}
            width={1600}
            height={1200}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="w-full h-auto transition duration-700 group-hover:scale-[1.02]"
          />
        </div>
        <div className="mt-5">
          <h3 className="text-[20px] md:text-[26px] font-light text-[#222222]">
            {title}
          </h3>
          {location && (
            <p className="mt-1 text-[#777777]">{location}</p>
          )}
        </div>
      </Link>
    );
  };

  return (
    <section
      id="selected-work"
      className="bg-[#F2F2F2] px-3 py-24 md:px-4 md:py-32"
    >
      <div className="mx-auto max-w-[1920px]">
        <div className="mb-20">
          <p className="text-[18px] md:text-[26px] uppercase tracking-[0.2em] text-[#777777] font-light">
            {getText('featured.badge', 'badge')}
          </p>
          <h2
            className={`mt-4 font-light tracking-[0.06em] text-[#222222] ${titleSizing}`}
          >
            {getText('featured.title', 'title')}
          </h2>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          <div className="grid gap-8 md:grid-cols-3 md:gap-8 items-start">
            {firstThree.map((project) => renderCard(project))}
          </div>

          {lastTwo.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 md:gap-12 md:px-4 items-start">
              {lastTwo.map((project) => renderCard(project))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
