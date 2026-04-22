'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

interface ContactLayoutProps {
  children: React.ReactNode;
}

export default function ContactLayout({ children }: ContactLayoutProps) {
  const nav = useTranslations('navigation');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col -mt-16">
      {/* Header */}
      <header className="h-20 xl:h-24 2xl:h-28 flex items-center justify-between px-8 md:px-[60px] xl:px-[80px] 2xl:px-[120px] bg-white sticky top-0 z-50">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
          <span className="text-[#0A0A0A] text-[28px] xl:text-[32px] 2xl:text-[38px] font-bold tracking-[0.2em] font-sans">
            URBAN SPACE
          </span>
          <span className="text-[#0A0A0A]/50 text-[8px] xl:text-[10px] 2xl:text-[12px] tracking-[0.25em] uppercase font-light">
            Architecture & Urban Planning
          </span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-1 xl:gap-2">
          {/* Projects */}
          <Link href="/projects" className="text-sm xl:text-base 2xl:text-lg font-sans text-gray-500 hover:text-[#0A0A0A] transition-colors duration-300">
            {nav('projects')}
          </Link>

          <span className="text-gray-300 mx-3 xl:mx-4 2xl:mx-5">|</span>

          {/* Studio */}
          <Link
            href="/studio"
            className={`text-sm xl:text-base 2xl:text-lg font-sans transition-colors duration-300 ${
              pathname === '/studio' ? 'text-[#0A0A0A] font-semibold' : 'text-gray-500 hover:text-[#0A0A0A]'
            }`}
          >
            {nav('studio')}
          </Link>

          <span className="text-gray-300 mx-3 xl:mx-4 2xl:mx-5">|</span>

          {/* Contact */}
          <Link
            href="/contact"
            className={`text-sm xl:text-base 2xl:text-lg font-sans transition-colors duration-300 ${
              pathname === '/contact' ? 'text-[#0A0A0A] font-semibold' : 'text-gray-500 hover:text-[#0A0A0A]'
            }`}
          >
            {nav('contact')}
          </Link>
        </nav>

        {/* Language Switcher + Mobile Menu */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-3.5 flex flex-col justify-between">
              <span className={`block h-[1.5px] w-full bg-[#0A0A0A] transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
              <span className={`block h-[1.5px] w-full bg-[#0A0A0A] transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[1.5px] w-full bg-[#0A0A0A] transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
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
            className="md:hidden bg-white overflow-hidden sticky top-20 z-40 border-b border-gray-100"
          >
            <div className="px-8 py-5 flex flex-col gap-3">
              <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="text-sm font-sans text-gray-500">
                {nav('projects')}
              </Link>
              <div className="h-px bg-gray-100" />
              <Link href="/studio" onClick={() => setMobileMenuOpen(false)} className={`text-sm font-sans ${pathname === '/studio' ? 'text-[#0A0A0A] font-semibold' : 'text-gray-500'}`}>
                {nav('studio')}
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className={`text-sm font-sans ${pathname === '/contact' ? 'text-[#0A0A0A] font-semibold' : 'text-gray-500'}`}>
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

      {/* Footer */}
      <footer className="text-center py-6 xl:py-8 2xl:py-10">
        <p className="text-[10px] xl:text-[11px] 2xl:text-[12px] text-gray-400">
          &copy; 2026 URBAN SPACE. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
