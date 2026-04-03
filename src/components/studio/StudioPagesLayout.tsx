'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

interface StudioPagesLayoutProps {
  children: React.ReactNode;
}

export default function StudioPagesLayout({ children }: StudioPagesLayoutProps) {
  const nav = useTranslations('navigation');
  const pathname = usePathname();
  const [projectsOpen, setProjectsOpen] = useState(false);

  const navItems = [
    { href: '/projects/architecture', label: nav('projects') },
    { href: '/studio', label: nav('studio') },
    { href: '/contact', label: nav('contact') },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col -mt-16">
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-8 md:px-[60px] bg-white sticky top-0 z-50">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
          <span className="text-[#0A0A0A] text-[28px] font-bold tracking-[0.2em] font-sans">
            URBAN SPACE
          </span>
          <span className="text-[#0A0A0A]/50 text-[8px] tracking-[0.25em] uppercase font-light">
            Architecture & Urban Planning
          </span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Projects with dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setProjectsOpen(true)}
            onMouseLeave={() => setProjectsOpen(false)}
          >
            <span className="text-sm font-sans text-gray-500 hover:text-[#0A0A0A] transition-colors duration-300 cursor-pointer">
              {nav('projects')}
            </span>
            <AnimatePresence>
              {projectsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                  className="absolute top-full left-0 mt-2 flex flex-col gap-1.5 bg-white border border-gray-200 rounded-lg px-5 py-3 whitespace-nowrap shadow-sm"
                >
                  <Link href="/projects/architecture" className="text-sm font-sans text-gray-500 hover:text-[#0A0A0A] transition-colors duration-200">
                    {nav('architecture')} {nav('projects').toLowerCase()}
                  </Link>
                  <Link href="/projects/urban" className="text-sm font-sans text-gray-500 hover:text-[#0A0A0A] transition-colors duration-200">
                    {nav('urban')} {nav('projects').toLowerCase()}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span className="text-gray-300 mx-3">|</span>

          {/* Studio */}
          <Link
            href="/studio"
            className={`text-sm font-sans transition-colors duration-300 ${
              pathname === '/studio' ? 'text-[#0A0A0A] font-semibold' : 'text-gray-500 hover:text-[#0A0A0A]'
            }`}
          >
            {nav('studio')}
          </Link>

          <span className="text-gray-300 mx-3">|</span>

          {/* Contact */}
          <Link
            href="/contact"
            className={`text-sm font-sans transition-colors duration-300 ${
              pathname === '/contact' ? 'text-[#0A0A0A] font-semibold' : 'text-gray-500 hover:text-[#0A0A0A]'
            }`}
          >
            {nav('contact')}
          </Link>
        </nav>

        {/* Language Switcher */}
        <LanguageSwitcher />
      </header>

      {/* Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Footer */}
      <footer className="text-center py-6">
        <p className="text-[10px] text-gray-400">
          &copy; 2026 URBAN SPACE. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
