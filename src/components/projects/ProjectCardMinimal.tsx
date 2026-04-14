'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import type { Project } from '@/types';

interface ProjectCardMinimalProps {
  project: Project;
  height?: number;
  titleAlign?: 'left' | 'right';
}

export default function ProjectCardMinimal({ project, height = 300, titleAlign = 'left' }: ProjectCardMinimalProps) {
  const locale = useLocale();
  const title = locale === 'ka' ? project.titleKa : project.titleEn;
  const placeholderImage = `https://placehold.co/800x600/1e293b/64748b?text=${encodeURIComponent(title)}`;
  const featured = (project as any).featuredImage;
  const firstPageImage = (project as any).pages?.[0]?.image1;
  const imageUrl = featured || firstPageImage || placeholderImage;

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
        <p className={`mt-3 text-[13px] text-[#333333] font-sans leading-snug ${
          titleAlign === 'right' ? 'text-right' : 'text-left'
        }`}>
          {title}
        </p>
      </motion.article>
    </Link>
  );
}
