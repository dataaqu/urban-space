'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

const getTopBarHeight = () => {
  if (typeof window === 'undefined') return 80;
  if (window.innerWidth >= 1536) return 112;
  if (window.innerWidth >= 1280) return 96;
  return 80;
};

export default function HomeNav() {
  const nav = useTranslations('navigation');
  const [archOpen, setArchOpen] = useState(false);
  const [mobileArchOpen, setMobileArchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const bottomNavRef = useRef<HTMLElement>(null);
  const [bottomNavOffset, setBottomNavOffset] = useState(0);
  const [scrollThreshold, setScrollThreshold] = useState(1);

  const { scrollY } = useScroll();
  const navY = useTransform(scrollY, [0, scrollThreshold], [bottomNavOffset, 0], { clamp: true });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setPastHero(window.scrollY > window.innerHeight - getTopBarHeight());
    };
    const computeOffset = () => {
      const topBarH = getTopBarHeight();
      if (bottomNavRef.current) {
        const offset = Math.max(0, window.innerHeight - bottomNavRef.current.offsetHeight);
        setBottomNavOffset(offset);
      }
      setScrollThreshold(Math.max(1, window.innerHeight - topBarH));
    };
    const onResize = () => {
      handleScroll();
      computeOffset();
    };
    handleScroll();
    computeOffset();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const textColor = pastHero ? 'text-[#0A0A0A]' : 'text-white';
  const subTextColor = pastHero ? 'text-[#0A0A0A]/50' : 'text-white/60';
  const dropdownBg = pastHero ? 'bg-white/80 border border-gray-200' : 'bg-black/10 backdrop-blur-sm';
  const dropdownText = pastHero ? 'text-gray-600 hover:text-[#0A0A0A]' : 'text-white/70 hover:text-white';

  return (
    <>
      {/* Top Bar - Logo & Language Switcher */}
      <div
        className={`fixed top-0 left-0 right-0 h-20 xl:h-24 2xl:h-28 flex items-center justify-between px-8 md:px-[60px] xl:px-[80px] 2xl:px-[120px] z-40 transition-colors duration-500 ${
          pastHero ? 'bg-white/95 backdrop-blur-md shadow-sm' : ''
        }`}
      >
        <Link href="/" className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
          <span className={`text-[28px] xl:text-[32px] 2xl:text-[38px] font-bold tracking-[0.2em] font-sans transition-colors duration-500 ${textColor}`}>
            URBAN SPACE
          </span>
          <span className={`text-[8px] xl:text-[10px] 2xl:text-[12px] tracking-[0.25em] uppercase font-light transition-colors duration-500 ${subTextColor}`}>
            Architecture & Urban Planning
          </span>
        </Link>

        <LanguageSwitcher isOverHero={!pastHero} />
      </div>

      {/* Desktop Navigation - scroll-linked: slides up smoothly as user scrolls, merges as single-row header when aligned with logo */}
      <motion.nav
        ref={bottomNavRef}
        style={{ y: navY }}
        className="fixed top-0 left-0 right-0 hidden md:flex flex-col items-center justify-center h-20 xl:h-24 2xl:h-28 px-8 md:px-[60px] xl:px-[80px] 2xl:px-[120px] z-50 pointer-events-none"
      >
        <div className="flex items-center justify-center pointer-events-auto">
          <div
            className="relative"
            onMouseEnter={() => setArchOpen(true)}
            onMouseLeave={() => setArchOpen(false)}
          >
            <AnimatePresence>
              {archOpen && (
                <motion.div
                  initial={{ opacity: 0, y: pastHero ? -8 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: pastHero ? -8 : 8 }}
                  transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                  className={`absolute ${pastHero ? 'top-full mt-2' : 'bottom-full mb-2'} left-0 flex flex-col gap-1.5 xl:gap-2 rounded-lg px-5 xl:px-6 2xl:px-7 py-3 xl:py-4 whitespace-nowrap ${dropdownBg}`}
                >
                  <Link href="/projects?category=ARCHITECTURE" className={`text-base xl:text-lg 2xl:text-xl font-sans font-medium transition-colors duration-200 ${dropdownText}`}>
                    {nav('architecture')} {nav('projects').toLowerCase()}
                  </Link>
                  <Link href="/projects?category=URBAN" className={`text-base xl:text-lg 2xl:text-xl font-sans font-medium transition-colors duration-200 ${dropdownText}`}>
                    {nav('urban')} {nav('projects').toLowerCase()}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <Link href="/projects" className="inline-block transition-transform duration-300 hover:scale-105 px-1 py-1">
              <span className={`text-2xl xl:text-3xl 2xl:text-4xl font-sans font-bold transition-colors duration-500 ${textColor}`}>
                {nav('projects')}
              </span>
            </Link>
          </div>

          <Link href="/studio" className="ml-8 lg:ml-12 xl:ml-16 2xl:ml-20 inline-block transition-transform duration-300 hover:scale-105 px-1 py-1">
            <span className={`text-2xl xl:text-3xl 2xl:text-4xl font-sans font-semibold transition-colors duration-500 ${textColor}`}>
              {nav('studio')}
            </span>
          </Link>

          <Link href="/contact" className="ml-8 lg:ml-12 xl:ml-16 2xl:ml-20 inline-block transition-transform duration-300 hover:scale-105 px-1 py-1">
            <span className={`text-2xl xl:text-3xl 2xl:text-4xl font-sans font-semibold transition-colors duration-500 ${textColor}`}>
              {nav('contact')}
            </span>
          </Link>
        </div>
      </motion.nav>

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
                <Link href="/projects?category=ARCHITECTURE" onClick={() => setMobileArchOpen(false)} className={`text-sm font-sans transition-colors duration-200 ${scrolled ? 'text-gray-600 hover:text-[#0A0A0A]' : 'text-white/70 hover:text-white'}`}>
                  {nav('architecture')} {nav('projects').toLowerCase()}
                </Link>
                <Link href="/projects?category=URBAN" onClick={() => setMobileArchOpen(false)} className={`text-sm font-sans transition-colors duration-200 ${scrolled ? 'text-gray-600 hover:text-[#0A0A0A]' : 'text-white/70 hover:text-white'}`}>
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
            <span className={`text-[11px] font-sans font-bold text-center leading-tight transition-colors duration-500 ${scrolled ? 'text-[#0A0A0A]' : 'text-white'}`}>
              {nav('projects')}
            </span>
          </Link>
          <Link href="/studio" className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg active:bg-white/10 transition-all duration-200">
            <span className={`text-[11px] font-sans font-bold text-center leading-tight transition-colors duration-500 ${scrolled ? 'text-[#0A0A0A]' : 'text-white'}`}>
              {nav('studio')}
            </span>
          </Link>
          <Link href="/contact" className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg active:bg-white/10 transition-all duration-200">
            <span className={`text-[11px] font-sans font-bold text-center leading-tight transition-colors duration-500 ${scrolled ? 'text-[#0A0A0A]' : 'text-white'}`}>
              {nav('contact')}
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
