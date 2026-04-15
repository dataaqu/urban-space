'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function HomeNav() {
  const nav = useTranslations('navigation');
  const [archOpen, setArchOpen] = useState(false);
  const [mobileArchOpen, setMobileArchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
      setAtBottom(isAtBottom);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColor = scrolled ? 'text-[#0A0A0A]' : 'text-white';
  const subTextColor = scrolled ? 'text-[#0A0A0A]/50' : 'text-white/60';
  const dropdownBg = scrolled ? 'bg-white/80 border border-gray-200' : 'bg-black/10 backdrop-blur-sm';
  const dropdownText = scrolled ? 'text-gray-600 hover:text-[#0A0A0A]' : 'text-white/70 hover:text-white';

  return (
    <>
      {/* Top Bar - Logo & Language Switcher */}
      <div
        className={`fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 md:px-[60px] z-50 transition-colors duration-500 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : ''
        }`}
      >
        <Link href="/" className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
          <span className={`text-[28px] font-bold tracking-[0.2em] font-sans transition-colors duration-500 ${textColor}`}>
            URBAN SPACE
          </span>
          <span className={`text-[8px] tracking-[0.25em] uppercase font-light transition-colors duration-500 ${subTextColor}`}>
            Architecture & Urban Planning
          </span>
        </Link>

        <LanguageSwitcher isOverHero={!scrolled} />
      </div>

      {/* Bottom Navigation - Desktop */}
      <nav
        className={`fixed bottom-0 left-0 right-0 hidden md:flex flex-col items-center px-8 md:px-[60px] z-50 transition-all duration-700 ease-out ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-[0_-1px_3px_rgba(0,0,0,0.08)] pt-3' : ''
        } ${atBottom ? 'pb-3' : 'pb-6'}`}
      >
        <div className="flex items-end justify-center">
          <div
            className="relative"
            onMouseEnter={() => setArchOpen(true)}
            onMouseLeave={() => setArchOpen(false)}
          >
            <AnimatePresence>
              {archOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                  className={`absolute bottom-full left-0 mb-2 flex flex-col gap-1.5 rounded-lg px-5 py-3 whitespace-nowrap ${dropdownBg}`}
                >
                  <Link href="/projects?category=ARCHITECTURE" className={`text-base font-sans font-medium transition-colors duration-200 ${dropdownText}`}>
                    {nav('architecture')} {nav('projects').toLowerCase()}
                  </Link>
                  <Link href="/projects?category=URBAN" className={`text-base font-sans font-medium transition-colors duration-200 ${dropdownText}`}>
                    {nav('urban')} {nav('projects').toLowerCase()}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <Link href="/projects" className="transition-transform duration-300 hover:scale-105 px-1 py-1">
              <span className={`text-2xl font-sans font-bold transition-colors duration-500 ${textColor}`}>
                {nav('projects')}
              </span>
            </Link>
          </div>

          <Link href="/studio" className="ml-16 lg:ml-24 transition-transform duration-300 hover:scale-105 px-1 py-1">
            <span className={`text-2xl font-sans font-semibold transition-colors duration-500 ${textColor}`}>
              {nav('studio')}
            </span>
          </Link>

          <Link href="/contact" className="ml-16 lg:ml-24 transition-transform duration-300 hover:scale-105 px-1 py-1">
            <span className={`text-2xl font-sans font-semibold transition-colors duration-500 ${textColor}`}>
              {nav('contact')}
            </span>
          </Link>
        </div>

        <AnimatePresence>
          {atBottom && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className="text-[10px] text-gray-400 mt-2"
            >
              &copy; 2026 URBAN SPACE. All rights reserved.
            </motion.p>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        <AnimatePresence>
          {mobileArchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              className={`overflow-hidden ${scrolled ? 'bg-white/90 border-b border-gray-200' : 'bg-black/40 backdrop-blur-md border-b border-white/10'}`}
            >
              <div className="flex flex-col gap-2 px-6 py-3">
                <Link href="/projects?category=ARCHITECTURE" onClick={() => setMobileArchOpen(false)} className={`text-sm font-sans transition-colors duration-200 ${dropdownText}`}>
                  {nav('architecture')} {nav('projects').toLowerCase()}
                </Link>
                <Link href="/projects?category=URBAN" onClick={() => setMobileArchOpen(false)} className={`text-sm font-sans transition-colors duration-200 ${dropdownText}`}>
                  {nav('urban')} {nav('projects').toLowerCase()}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className={`flex items-center justify-around px-4 py-4 transition-colors duration-500 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-[0_-1px_3px_rgba(0,0,0,0.1)]' : 'bg-black/30 backdrop-blur-md'
        }`}>
          <Link href="/projects" className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg active:bg-white/10 transition-all duration-200">
            <span className={`text-[11px] font-sans font-bold text-center leading-tight transition-colors duration-500 ${textColor}`}>
              {nav('projects')}
            </span>
          </Link>
          <Link href="/studio" className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg active:bg-white/10 transition-all duration-200">
            <span className={`text-[11px] font-sans font-bold text-center leading-tight transition-colors duration-500 ${textColor}`}>
              {nav('studio')}
            </span>
          </Link>
          <Link href="/contact" className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg active:bg-white/10 transition-all duration-200">
            <span className={`text-[11px] font-sans font-bold text-center leading-tight transition-colors duration-500 ${textColor}`}>
              {nav('contact')}
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
