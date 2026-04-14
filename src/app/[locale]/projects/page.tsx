'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCardMinimal from '@/components/projects/ProjectCardMinimal';
import { useProjects } from '@/hooks/useProjects';

const leftHeights = [420, 300, 420, 300];
const rightHeights = [300, 420, 300, 420];

type CategoryFilter = 'ARCHITECTURE' | 'URBAN';

export default function ProjectsPage() {
  const t = useTranslations('navigation');
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') as CategoryFilter | null;
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(categoryParam === 'URBAN' ? 'URBAN' : 'ARCHITECTURE');

  const params: Record<string, string> = { category: activeCategory };
  const { projects, isLoading } = useProjects(params);

  const leftColumn = projects.filter((_, i) => i % 2 === 0);
  const rightColumn = projects.filter((_, i) => i % 2 === 1);

  const filters: { key: CategoryFilter; label: string }[] = [
    { key: 'ARCHITECTURE', label: t('architecture') },
    { key: 'URBAN', label: t('urban') },
  ];

  return (
    <div>
      {/* Category filters */}
      <div className="flex justify-center gap-8 py-4 border-b border-gray-100">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveCategory(filter.key)}
            className={`text-sm font-sans pb-1 border-b-2 transition-colors ${
              activeCategory === filter.key
                ? 'text-[#0A0A0A] border-[#0A0A0A]'
                : 'text-gray-400 border-transparent hover:text-[#0A0A0A]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="px-6 md:px-[60px] lg:px-[100px] py-10">
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-[2px] bg-[#E0E0E0] rounded-full overflow-hidden">
            <div className="h-full bg-[#333333] rounded-full animate-pulse" />
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex gap-5 md:gap-8"
          >
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-5 md:gap-8">
              {leftColumn.map((project, i) => (
                <ProjectCardMinimal
                  key={project.id}
                  project={project}
                  height={leftHeights[i % leftHeights.length]}
                  titleAlign="right"
                />
              ))}
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col gap-5 md:gap-8">
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
      )}

      {!isLoading && projects.length === 0 && (
        <div className="text-center py-20 text-gray-400 text-sm">
          პროექტები არ მოიძებნა
        </div>
      )}
      </div>
    </div>
  );
}
