'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  activeCategory: string | null;
  activeType: string | null;
  onCategoryChange: (category: string | null) => void;
  onTypeChange: (type: string | null) => void;
}

const categories = ['ARCHITECTURE', 'URBAN'];
const types = [
  'RESIDENTIAL_MULTI',
  'PUBLIC_MULTIFUNCTIONAL',
  'INDIVIDUAL_HOUSE',
  'URBAN_PLANNING',
  'COMPETITION',
];

export default function CategoryFilter({
  activeCategory,
  activeType,
  onCategoryChange,
  onTypeChange,
}: CategoryFilterProps) {
  const t = useTranslations('projects');

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-medium text-secondary-700 mb-3">
          {t('filter.category')}
        </h3>
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCategoryChange(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
            }`}
          >
            {t('all')}
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {t(`categories.${category}`)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <h3 className="text-sm font-medium text-secondary-700 mb-3">
          {t('filter.type')}
        </h3>
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTypeChange(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeType === null
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
            }`}
          >
            {t('all')}
          </motion.button>
          {types.map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTypeChange(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeType === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {t(`types.${type}`)}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
