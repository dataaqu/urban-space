'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectGrid from '@/components/projects/ProjectGrid';
import MasonryGrid from '@/components/projects/MasonryGrid';
import CategoryFilter from '@/components/projects/CategoryFilter';
import { PageHeader } from '@/components/ui/Breadcrumbs';
import type { Project } from '@/types';

type ViewMode = 'grid' | 'masonry';
type SortOption = 'newest' | 'oldest' | 'name';

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (activeCategory) params.append('category', activeCategory);
      if (activeType) params.append('type', activeType);

      try {
        const response = await fetch(`/api/projects?${params.toString()}`);
        const data = await response.json();

        // Sort projects
        const sortedData = [...data].sort((a: Project, b: Project) => {
          switch (sortBy) {
            case 'oldest':
              return (a.year || 0) - (b.year || 0);
            case 'name':
              return a.titleEn.localeCompare(b.titleEn);
            case 'newest':
            default:
              return (b.year || 0) - (a.year || 0);
          }
        });

        setProjects(sortedData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [activeCategory, activeType, sortBy]);

  return (
    <div className="min-h-screen bg-accent-50">
      {/* Page Header with Breadcrumbs */}
      <PageHeader
        title={t('title')}
        description={t('description') || 'Explore our portfolio of architectural and urban planning projects.'}
        breadcrumbs={[{ label: t('title') }]}
        variant="dark"
      />

      {/* Main Content */}
      <div className="container-premium py-12">
        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          {/* Category Filter */}
          <CategoryFilter
            activeCategory={activeCategory}
            activeType={activeType}
            onCategoryChange={setActiveCategory}
            onTypeChange={setActiveType}
          />

          {/* View and Sort Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white border border-secondary-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 cursor-pointer"
              >
                <option value="newest">{t('sort.newest') || 'Newest First'}</option>
                <option value="oldest">{t('sort.oldest') || 'Oldest First'}</option>
                <option value="name">{t('sort.name') || 'By Name'}</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-white border border-secondary-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'text-secondary-400 hover:text-secondary-600'
                }`}
                aria-label="Grid view"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'masonry'
                    ? 'bg-primary-500 text-white'
                    : 'text-secondary-400 hover:text-secondary-600'
                }`}
                aria-label="Masonry view"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Projects Display */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4" />
            <p className="text-secondary-500">{t('loading') || 'Loading projects...'}</p>
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-secondary-100">
              <svg className="w-10 h-10 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              {t('emptyState.title') || 'No projects found'}
            </h3>
            <p className="text-secondary-500 max-w-md">
              {t('emptyState.description') || 'Try adjusting your filters or check back later for new projects.'}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === 'grid' ? (
                <ProjectGrid projects={projects} />
              ) : (
                <MasonryGrid projects={projects} />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Results Count */}
        {!isLoading && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 text-center text-secondary-500 text-sm"
          >
            {t('resultsCount', { count: projects.length }) || `Showing ${projects.length} projects`}
          </motion.div>
        )}
      </div>
    </div>
  );
}
