'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import type { Project } from '@/types';
import { scrollReveal, imageZoom, cardHover } from '@/lib/animations';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const locale = useLocale();
  const t = useTranslations('projects');

  const title = locale === 'ka' ? project.titleKa : project.titleEn;
  const description =
    locale === 'ka' ? project.descriptionKa : project.descriptionEn;
  const categoryLabel = t(`categories.${project.category}`);
  const statusLabel = t(`statuses.${project.status}`);

  const placeholderImage = `https://placehold.co/800x600/25211e/d4a027?text=${encodeURIComponent(title)}`;
  const imageUrl = project.images[0] || placeholderImage;

  return (
    <motion.article
      variants={scrollReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/projects/${project.id}`}>
        <motion.div
          variants={cardHover}
          initial="rest"
          whileHover="hover"
          className="relative bg-white rounded-xl overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-500"
        >
          {/* Corner Frames - Luxury */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-white/0 group-hover:border-primary-400/60 transition-all duration-500 z-20 rounded-tl" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-white/0 group-hover:border-primary-400/60 transition-all duration-500 z-20 rounded-tr" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-white/0 group-hover:border-primary-400/60 transition-all duration-500 z-20 rounded-bl" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-white/0 group-hover:border-primary-400/60 transition-all duration-500 z-20 rounded-br" />

          {/* Image Container with Multi-layer Hover */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {/* Image with Zoom Effect */}
            <motion.img
              variants={imageZoom}
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay - Luxury */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/30 to-transparent opacity-70 group-hover:opacity-95 transition-opacity duration-500" />

            {/* Gold Shimmer Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-primary-500/10 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Status Badge - Luxury */}
            <div className="absolute top-4 right-4 z-10">
              <span
                className={`px-4 py-1.5 text-xs font-medium tracking-[0.15em] uppercase rounded-full backdrop-blur-md border ${
                  project.status === 'ONGOING'
                    ? 'bg-primary-500/90 text-white border-primary-400/50 shadow-gold-border'
                    : 'bg-white/95 text-secondary-700 border-white/50'
                }`}
              >
                {statusLabel}
              </span>
            </div>

            {/* Category Tag - Top Left - Luxury */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium tracking-[0.1em] uppercase bg-dark-900/80 text-primary-400 border border-primary-500/30 rounded-full backdrop-blur-md">
                {categoryLabel}
              </span>
            </div>

            {/* Bottom Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              {/* Title with Serif Font - Luxury */}
              <h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors duration-300 text-shadow">
                {title}
              </h3>

              {/* Description - Slides up on hover */}
              <p className="text-white/70 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                {description}
              </p>

              {/* Meta Info - Luxury */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-white/50 text-sm">
                  {project.year && (
                    <span className="flex items-center gap-1.5 group-hover:text-primary-400/80 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {project.year}
                    </span>
                  )}
                  {project.location && (
                    <span className="flex items-center gap-1.5 group-hover:text-primary-400/80 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {project.location}
                    </span>
                  )}
                </div>

                {/* Arrow Icon - Reveals on Hover - Luxury */}
                <div className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                  <span className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-gold-glow-intense">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Gold Accent Line at Bottom - Thicker and More Dramatic */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-glow-gold" />
          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
}
