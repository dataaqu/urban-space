'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Breadcrumbs({
  items,
  className,
  variant = 'light',
}: BreadcrumbsProps) {
  const t = useTranslations('navigation');

  const allItems: BreadcrumbItem[] = [
    { label: t('home'), href: '/' },
    ...items,
  ];

  const textColor = variant === 'light' ? 'text-secondary-500' : 'text-white/60';
  const activeColor = variant === 'light' ? 'text-secondary-900' : 'text-white';
  const hoverColor = variant === 'light' ? 'hover:text-primary-600' : 'hover:text-primary-400';
  const separatorColor = variant === 'light' ? 'text-secondary-300' : 'text-white/30';

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Breadcrumb"
      className={cn('flex items-center', className)}
    >
      <ol className="flex items-center gap-2 text-sm">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <Fragment key={index}>
              <li>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className={cn(
                      'transition-colors duration-200 link-underline',
                      textColor,
                      hoverColor
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={cn(isLast ? activeColor : textColor, 'font-medium')}>
                    {item.label}
                  </span>
                )}
              </li>

              {!isLast && (
                <li className={separatorColor} aria-hidden="true">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </motion.nav>
  );
}

// Page Header with Breadcrumbs
interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  backgroundImage?: string;
  variant?: 'light' | 'dark';
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  backgroundImage,
  variant = 'dark',
}: PageHeaderProps) {
  const isDark = variant === 'dark';

  return (
    <section
      className={cn(
        'relative py-20 md:py-28 overflow-hidden',
        isDark ? 'bg-gradient-hero' : 'bg-accent-50'
      )}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />

      {/* Gradient Overlay */}
      {isDark && (
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 to-dark-900/80" />
      )}

      <div className="container-premium relative z-10">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={breadcrumbs}
          variant={variant}
          className="mb-6"
        />

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={cn(
            'font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4',
            isDark ? 'text-white' : 'text-secondary-900'
          )}
        >
          {title}
        </motion.h1>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn(
              'text-lg max-w-2xl',
              isDark ? 'text-secondary-300' : 'text-secondary-600'
            )}
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
