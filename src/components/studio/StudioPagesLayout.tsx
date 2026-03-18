'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useStudioOverlay } from '@/components/studio/StudioOverlay';

interface StudioPagesLayoutProps {
  children: React.ReactNode;
}

const studioTabs = [
  { href: '/studio', key: 'about' },
  { href: '/studio/team', key: 'team' },
  { href: '/studio/partners', key: 'partners' },
  { href: '/studio/services', key: 'services' },
] as const;

export default function StudioPagesLayout({ children }: StudioPagesLayoutProps) {
  const nav = useTranslations('navigation');
  const studioOverlay = useStudioOverlay();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col -mt-16">
      {/* Header */}
      <header className="h-[60px] flex items-center justify-between px-6 md:px-[60px] border-b border-[#000000] bg-white sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#000000] text-[16px] font-semibold tracking-[2px] font-sans">
            URBAN SPACE
          </span>
          <span className="w-[6px] h-5 bg-[#000000]" />
        </Link>

        {/* Center Navigation - Studio Tabs (Desktop) */}
        <nav className="hidden md:flex items-center">
          {studioTabs.map((tab, i) => (
            <div key={tab.key} className="flex items-center">
              {i > 0 && <span className="text-[#999999] text-[14px] mx-1">|</span>}
              <Link
                href={tab.href}
                className="flex flex-col items-center gap-1 px-5"
              >
                <span
                  className={`text-[14px] font-sans transition-colors ${
                    pathname === tab.href ? 'text-[#000000] font-medium' : 'text-[#666666] hover:text-[#333333]'
                  }`}
                >
                  {nav(tab.key)}
                </span>
                {pathname === tab.href && (
                  <motion.span
                    layoutId="studioUnderline"
                    className="block h-[3px] bg-[#000000] w-[100px]"
                  />
                )}
              </Link>
            </div>
          ))}
        </nav>

        {/* Language Switcher + Mobile Menu */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

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
              {studioTabs.map((tab) => (
                <Link
                  key={tab.key}
                  href={tab.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-[14px] font-sans ${pathname === tab.href ? 'text-[#000000] font-medium' : 'text-[#666666]'}`}
                >
                  {nav(tab.key)}
                </Link>
              ))}
              <div className="h-px bg-[#E0E0E0]" />
              <Link href="/projects/architecture" onClick={() => setMobileMenuOpen(false)} className="text-[14px] text-[#666666] font-sans">
                {nav('projects')}
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-[14px] text-[#666666] font-sans">
                {nav('contact')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Footer - Desktop only */}
      <footer className="hidden md:flex h-[60px] items-center justify-end gap-20 px-10 md:px-[100px] bg-white">
        <Link href="/projects/architecture" className="flex flex-col items-center gap-1">
          <span className="block h-px bg-[#CCCCCC] w-20" />
          <span className="text-[14px] text-[#333333] font-sans">
            {nav('projects').toLowerCase()}
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
