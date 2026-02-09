'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ProjectCardMinimal from '@/components/projects/ProjectCardMinimal';
import type { Project } from '@/types';

const heightPatterns = [350, 280, 280, 380];

export default function ArchitectureProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const activeType = searchParams.get('type');

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append('category', 'ARCHITECTURE');
      if (activeType) params.append('type', activeType);

      try {
        const response = await fetch(`/api/projects?${params.toString()}`);
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [activeType]);

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
