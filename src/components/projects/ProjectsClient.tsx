'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import type { Project } from '@/types';

type CategoryFilter = 'ALL' | 'ARCHITECTURE' | 'URBAN';

interface ProjectWithPages extends Project {
  pages?: { image1: string | null }[];
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

  const architectureProjects = projects.filter(
    (p) => p.category === 'ARCHITECTURE'
  );
  const urbanProjects = projects.filter((p) => p.category === 'URBAN');

  let visibleProjects: ProjectWithPages[];
  if (activeCategory === 'ARCHITECTURE') {
    visibleProjects = architectureProjects;
  } else if (activeCategory === 'URBAN') {
    visibleProjects = urbanProjects;
  } else {
    visibleProjects = [...architectureProjects, ...urbanProjects];
  }

  if (visibleProjects.length === 0) {
    return (
      <section className="px-6 pb-20 pt-8 md:px-10 md:pb-24 md:pt-10">
        <div className="mx-auto max-w-[1680px] text-center py-20 xl:py-28 2xl:py-36 text-gray-400 text-sm xl:text-base 2xl:text-lg">
          პროექტები არ მოიძებნა
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 pb-20 pt-8 md:px-10 md:pb-24 md:pt-10">
      <div className="mx-auto max-w-[1680px]">
        <div className="grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-2 md:gap-y-24 xl:gap-x-8 xl:gap-y-28">
          {visibleProjects.map((project) => {
            const projectTitle =
              locale === 'ka' ? project.titleKa : project.titleEn;
            const location =
              locale === 'ka' ? project.locationKa : project.locationEn;
            const imageSrc =
              project.featuredImage ||
              project.pages?.[0]?.image1 ||
              '/poto/2.webp';

            return (
              <article key={project.id}>
                <Link href={`/projects/${project.slug}`} className="group block">
                  <div className="overflow-hidden bg-black/5 aspect-[4/3] relative">
                    <Image
                      src={imageSrc}
                      alt={projectTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain transition duration-700 group-hover:scale-[1.015]"
                    />
                  </div>

                  <div className="pt-4 md:pt-5">
                    <h3 className="text-[18px] font-light tracking-[0.03em] text-black/90 md:text-[22px]">
                      {projectTitle}
                    </h3>
                    {location && (
                      <p className="mt-1 text-sm text-black/55 md:text-base">
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
  );
}
