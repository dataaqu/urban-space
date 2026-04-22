'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ProjectCardMinimal from '@/components/projects/ProjectCardMinimal';
import type { Project } from '@/types';

const leftHeights = [420, 300, 420, 300];
const rightHeights = [300, 420, 300, 420];

type CategoryFilter = 'ARCHITECTURE' | 'URBAN';

interface ProjectsClientProps {
  projects: (Project & { pages?: { image1: string }[] })[];
  initialCategory: string;
  labels: { architecture: string; urban: string };
}

export default function ProjectsClient({ projects, initialCategory, labels }: ProjectsClientProps) {
  const router = useRouter();
  const activeCategory = initialCategory as CategoryFilter;

  const leftColumn = projects.filter((_, i) => i % 2 === 0);
  const rightColumn = projects.filter((_, i) => i % 2 === 1);

  const filters: { key: CategoryFilter; label: string }[] = [
    { key: 'ARCHITECTURE', label: labels.architecture },
    { key: 'URBAN', label: labels.urban },
  ];

  const handleCategoryChange = (category: CategoryFilter) => {
    router.push(`/projects?category=${category}`);
  };

  return (
    <div>
      <div className="flex justify-center gap-8 xl:gap-12 2xl:gap-16 py-4 xl:py-5 2xl:py-6 border-b border-gray-100">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => handleCategoryChange(filter.key)}
            className={`text-sm xl:text-base 2xl:text-lg font-sans pb-1 border-b-2 transition-colors ${
              activeCategory === filter.key
                ? 'text-[#0A0A0A] border-[#0A0A0A]'
                : 'text-gray-400 border-transparent hover:text-[#0A0A0A]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="px-6 md:px-[60px] lg:px-[100px] xl:px-[140px] 2xl:px-[180px] py-10 xl:py-14 2xl:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex gap-5 md:gap-8 xl:gap-10 2xl:gap-12"
          >
            <div className="flex-1 flex flex-col gap-5 md:gap-8 xl:gap-10 2xl:gap-12">
              {leftColumn.map((project, i) => (
                <ProjectCardMinimal
                  key={project.id}
                  project={project}
                  height={leftHeights[i % leftHeights.length]}
                  titleAlign="right"
                />
              ))}
            </div>

            <div className="flex-1 flex flex-col gap-5 md:gap-8 xl:gap-10 2xl:gap-12">
              {rightColumn.map((project, i) => (
                <ProjectCardMinimal
                  key={project.id}
                  project={project}
                  height={rightHeights[i % rightHeights.length]}
                  titleAlign="left"
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {projects.length === 0 && (
          <div className="text-center py-20 xl:py-28 2xl:py-36 text-gray-400 text-sm xl:text-base 2xl:text-lg">
            პროექტები არ მოიძებნა
          </div>
        )}
      </div>
    </div>
  );
}
