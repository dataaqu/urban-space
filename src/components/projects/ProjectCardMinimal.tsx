'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
    <Link href={`/projects/${project.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group cursor-pointer"
      >
        <div
          className="w-full overflow-hidden bg-[#F5F5F5] relative h-[var(--card-h)] xl:h-[var(--card-h-xl)] 2xl:h-[var(--card-h-2xl)]"
          style={{
            ['--card-h' as string]: `${height}px`,
            ['--card-h-xl' as string]: `${Math.round(height * 1.25)}px`,
            ['--card-h-2xl' as string]: `${Math.round(height * 1.5)}px`,
          } as React.CSSProperties}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <p className={`mt-3 xl:mt-4 2xl:mt-5 text-[13px] xl:text-[15px] 2xl:text-[17px] text-[#333333] font-sans leading-snug ${
          titleAlign === 'right' ? 'text-right' : 'text-left'
        }`}>
          {title}
        </p>
      </motion.article>
    </Link>
  );
}
