'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

interface ProjectsLayoutProps {
  children: React.ReactNode;
}

const architectureTypes = ['RESIDENTIAL_MULTI', 'PUBLIC_MULTIFUNCTIONAL', 'INDIVIDUAL_HOUSE'] as const;
const urbanTypes = ['GRG', 'GDG'] as const;

export default function ProjectsLayout({ children }: ProjectsLayoutProps) {
  const nav = useTranslations('navigation');
  const t = useTranslations('projects');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeType = searchParams.get('type');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isUrban = pathname === '/projects/urban';
  const isArchitecture = pathname === '/projects/architecture';

  const subtypes = isArchitecture ? architectureTypes : urbanTypes;
  const showSubNav = isUrban || isArchitecture;

  return (
    <div className="min-h-screen bg-white flex flex-col -mt-16">
      {/* Header */}
      <header className="h-[60px] flex items-center justify-between px-6 md:px-[60px] border-b border-[#000000] bg-white sticky top-0 z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#000000] text-[16px] font-semibold tracking-[2px] font-sans">
            URBAN SPACE
          </span>
          <span className="w-[6px] h-5 bg-[#000000]" />
        </Link>

        {/* Center Navigation - Category Tabs (Desktop) */}
        <nav className="hidden md:flex items-center">
          <Link
            href="/projects/urban"
            className="flex flex-col items-center gap-1 px-5"
          >
            <span
              className={`text-[14px] font-sans transition-colors ${
                isUrban ? 'text-[#000000] font-medium' : 'text-[#666666] hover:text-[#333333]'
              }`}
            >
              {nav('urban')} {nav('projects').toLowerCase()}
            </span>
            {isUrban && (
              <motion.span
                layoutId="categoryUnderline"
                className="block h-[3px] bg-[#000000] w-[120px]"
              />
            )}
          </Link>

          <span className="text-[#999999] text-[14px] mx-1">|</span>

          <Link
            href="/projects/architecture"
            className="flex flex-col items-center gap-1 px-5"
          >
            <span
              className={`text-[14px] font-sans transition-colors ${
                isArchitecture ? 'text-[#000000] font-medium' : 'text-[#666666] hover:text-[#333333]'
              }`}
            >
              {nav('architecture')} {nav('projects').toLowerCase()}
            </span>
            {isArchitecture && (
              <motion.span
                layoutId="categoryUnderline"
                className="block h-[3px] bg-[#000000] w-[120px]"
              />
            )}
          </Link>
        </nav>

        {/* Language Switcher + Mobile Menu */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-3.5 flex flex-col justify-between">
              <span className={`block h-[1.5px] w-full bg-[#000000] transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
              <span className={`block h-[1.5px] w-full bg-[#000000] transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[1.5px] w-full bg-[#000000] transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-b border-[#000000] overflow-hidden z-40"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              <Link
                href="/projects/urban"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-[14px] font-sans ${isUrban ? 'text-[#000000] font-medium' : 'text-[#666666]'}`}
              >
                {nav('urban')} {nav('projects').toLowerCase()}
              </Link>
              <Link
                href="/projects/architecture"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-[14px] font-sans ${isArchitecture ? 'text-[#000000] font-medium' : 'text-[#666666]'}`}
              >
                {nav('architecture')} {nav('projects').toLowerCase()}
              </Link>
              <div className="h-px bg-[#E0E0E0]" />
              <Link href="/studio" onClick={() => setMobileMenuOpen(false)} className="text-[14px] text-[#666666] font-sans">
                {nav('studio')}
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-[14px] text-[#666666] font-sans">
                {nav('contact')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sub Navigation - Type Filters */}
      {showSubNav && (
        <div className="h-[50px] flex items-center justify-center gap-10 px-6 md:px-10 bg-white overflow-x-auto">
          {subtypes.map((type) => (
            <Link
              key={type}
              href={`${pathname}?type=${type}`}
              className={`text-[13px] font-sans whitespace-nowrap transition-colors ${
                activeType === type
                  ? 'text-[#000000]'
                  : 'text-[#666666] hover:text-[#333333]'
              }`}
            >
              {t(`subtypes.${type}`)}
            </Link>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Footer */}
      <footer className="h-[60px] flex items-center justify-end gap-20 px-10 md:px-[100px] bg-white">
        <Link href="/studio" className="flex flex-col items-center gap-1">
          <span className="block h-px bg-[#CCCCCC] w-20" />
          <span className="text-[14px] text-[#333333] font-sans">
            {nav('studio').toLowerCase()}
          </span>
        </Link>
        <Link href="/contact" className="flex flex-col items-center gap-1">
          <span className="block h-px bg-[#CCCCCC] w-20" />
          <span className="text-[14px] text-[#333333] font-sans">
            {nav('contact').toLowerCase()}
          </span>
        </Link>
      </footer>
    </div>
  );
}
