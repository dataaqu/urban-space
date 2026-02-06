'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';
import type { Project } from '@/types';
import ProjectCard from './ProjectCard';

interface MasonryGridProps {
  projects: Project[];
}

export default function MasonryGrid({ projects }: MasonryGridProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="masonry-grid"
    >
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          variants={staggerItem}
          className="masonry-item"
        >
          <ProjectCard project={project} index={index} />
        </motion.div>
      ))}
    </motion.div>
  );
}

// Alternative compact masonry card for visual variety
interface MasonryCardProps {
  project: Project;
  size?: 'small' | 'medium' | 'large';
}

export function MasonryCard({ project, size = 'medium' }: MasonryCardProps) {
  const sizeClasses = {
    small: 'aspect-square',
    medium: 'aspect-[4/5]',
    large: 'aspect-[3/4]',
  };

  const imageUrl = project.images[0] || `https://placehold.co/800x1000/25211e/d4a027?text=${encodeURIComponent(project.titleEn)}`;

  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-lg"
    >
      {/* Image */}
      <div className={`relative ${sizeClasses[size]} overflow-hidden`}>
        <img
          src={imageUrl}
          alt={project.titleEn}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <div className="absolute inset-0 p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="badge-gold mb-3 self-start">
            {project.category}
          </span>
          <h3 className="font-display text-xl font-semibold text-white mb-2">
            {project.titleEn}
          </h3>
          {project.year && (
            <span className="text-white/60 text-sm">{project.year}</span>
          )}
        </div>

        {/* Gold Border on Hover */}
        <div className="absolute inset-0 border-2 border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
      </div>
    </motion.article>
  );
}
