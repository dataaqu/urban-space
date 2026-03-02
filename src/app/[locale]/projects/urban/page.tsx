'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ProjectCardMinimal from '@/components/projects/ProjectCardMinimal';
import { useProjects } from '@/hooks/useProjects';

const heightPatterns = [350, 280, 280, 380];

export default function UrbanProjectsPage() {
  const searchParams = useSearchParams();
  const activeType = searchParams.get('type');

  const params: Record<string, string> = { category: 'URBAN' };
  if (activeType) params.type = activeType;
  const { projects, isLoading } = useProjects(params);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-[2px] bg-[#E0E0E0] rounded-full overflow-hidden">
          <div className="h-full bg-[#333333] rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  const leftColumn = projects.filter((_, i) => i % 2 === 0);
  const rightColumn = projects.filter((_, i) => i % 2 === 1);

  return (
    <div className="px-10 md:px-[100px] py-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex gap-10"
      >
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-10">
          {leftColumn.map((project, i) => (
            <ProjectCardMinimal
              key={project.id}
              project={project}
              height={heightPatterns[i % heightPatterns.length]}
            />
          ))}
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-10">
          {rightColumn.map((project, i) => (
            <ProjectCardMinimal
              key={project.id}
              project={project}
              height={heightPatterns[(i + 1) % heightPatterns.length]}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
