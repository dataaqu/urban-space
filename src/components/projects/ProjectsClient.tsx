'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import ResponsiveProjectImage from './ResponsiveProjectImage';
import CategoryFilter from './CategoryFilter';
import type { Project } from '@/types';

type CategoryFilter = 'ALL' | 'ARCHITECTURE' | 'URBAN';

interface ProjectWithPages extends Project {
  pages?: { image1: string | null; mobileImage1?: string | null }[];
}

interface ProjectsClientProps {
  projects: ProjectWithPages[];
  initialCategory: string;
  labels: { architecture: string; urban: string };
}

export default function ProjectsClient({
  projects,
  initialCategory,
}: ProjectsClientProps) {
  const locale = useLocale();
  const activeCategory = initialCategory as CategoryFilter;

  const architectureProjects = projects.filter((p) =>
    p.categories.includes('ARCHITECTURE')
  );
  const urbanProjects = projects.filter((p) =>
    p.categories.includes('URBAN')
  );

  let visibleProjects: ProjectWithPages[];
  if (activeCategory === 'ARCHITECTURE') {
    visibleProjects = architectureProjects;
  } else if (activeCategory === 'URBAN') {
    visibleProjects = urbanProjects;
  } else {
    // All: respect the admin-defined displayOrder (server already sorts by it);
    // each project appears once in the array, so no regrouping/dedupe needed.
    visibleProjects = projects;
  }

  if (visibleProjects.length === 0) {
    return (
      <>
        <CategoryFilter activeCategory={activeCategory} />
        <section className="px-8 pb-20 pt-8 md:px-10 md:pb-24 md:pt-10">
          <div className="mx-auto max-w-[1680px] text-center py-20 xl:py-28 2xl:py-36 text-gray-400 text-sm xl:text-base 2xl:text-lg">
            პროექტები არ მოიძებნა
          </div>
        </section>
      </>
    );
  }

  const titleSizing =
    locale === 'ka'
      ? 'text-[13px] md:text-[16px]'
      : 'text-[18px] md:text-[22px]';
  const subtitleSizing =
    locale === 'ka' ? 'text-[11px] md:text-[12px]' : 'text-sm md:text-base';

  return (
    <>
      <CategoryFilter activeCategory={activeCategory} />
      <section className="px-8 pb-20 pt-8 md:px-10 md:pb-24 md:pt-10 lg:px-[10%] 2xl:px-[15%]">
        <div className="mx-auto max-w-[1140px] lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 sm:gap-y-20 md:grid-cols-2 md:gap-y-24 xl:gap-x-8 xl:gap-y-28 items-start">
          {visibleProjects.map((project) => {
            const projectTitle =
              locale === 'ka' ? project.titleKa : project.titleEn;
            const location =
              locale === 'ka' ? project.locationKa : project.locationEn;
            const imageSrc =
              project.featuredImage ||
              project.pages?.[0]?.image1 ||
              '/poto/2.webp';
            const mobileSrc =
              project.mobileImage ||
              project.pages?.[0]?.mobileImage1 ||
              null;

            return (
              <article key={project.id} className="mx-auto w-[90%] sm:w-auto">
                <Link
                  href={
                    activeCategory && activeCategory !== 'ALL'
                      ? `/projects/${project.slug}?category=${activeCategory}`
                      : `/projects/${project.slug}`
                  }
                  onClick={() => {
                    // Mark that we entered the detail from the list, so closing
                    // can use history-back and restore this exact scroll spot.
                    try {
                      sessionStorage.setItem('projects:fromList', '1');
                    } catch {}
                  }}
                  className="group block"
                >
                  <div className="overflow-hidden bg-transparent">
                    <ResponsiveProjectImage
                      src={imageSrc}
                      mobileSrc={mobileSrc}
                      alt={projectTitle}
                      width={1600}
                      height={1200}
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="mx-auto block h-auto w-auto max-h-[58vh] max-w-full object-contain transition duration-700 group-hover:scale-[1.015] tall:max-h-none tall:w-full lg:max-h-none lg:w-full 3xl:max-h-[72vh]"
                    />
                  </div>

                  <div className="pt-4 md:pt-5">
                    <h3
                      className={`font-light tracking-[0.03em] text-foreground/90 ${titleSizing}`}
                    >
                      {projectTitle}
                    </h3>
                    {location && (
                      <p className={`mt-1 text-foreground/55 ${subtitleSizing}`}>
                        {location}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
      </section>
    </>
  );
}
