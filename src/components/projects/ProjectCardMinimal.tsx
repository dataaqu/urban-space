'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import type { Project } from '@/types';

interface ProjectCardMinimalProps {
  project: Project;
  height?: number;
}

export default function ProjectCardMinimal({ project, height = 300 }: ProjectCardMinimalProps) {
  const locale = useLocale();
  const title = locale === 'ka' ? project.titleKa : project.titleEn;
  const placeholderImage = `https://placehold.co/800x600/1e293b/64748b?text=${encodeURIComponent(title)}`;
  const imageUrl = project.images[0] || placeholderImage;

  return (
    <Link href={`/projects/${project.id}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group cursor-pointer"
      >
        <div
          className="w-full overflow-hidden bg-[#F5F5F5]"
          style={{ height }}
        >
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <p className="mt-3 text-[13px] text-[#333333] font-sans leading-snug">
          {title}
          {project.location && ` – ${project.location}`}
        </p>
      </motion.article>
    </Link>
  );
}
