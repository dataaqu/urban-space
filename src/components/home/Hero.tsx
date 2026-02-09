'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useState, useEffect, useCallback } from 'react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

const heroImages = [
  '/poto/1.webp',
  '/poto/2.webp',
  '/poto/3.webp',
  '/poto/4.webp',
  '/poto/5.webp',
];

export default function Hero() {
  const nav = useTranslations('navigation');
  const sub = useTranslations('projects');
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [archOpen, setArchOpen] = useState(false);
  const [urbanOpen, setUrbanOpen] = useState(false);

  const goToSlide = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <>
      {/* Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm"
          >
            <div className="relative flex flex-col items-center gap-6">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
                className="flex items-center gap-3"
              >
                <span className="text-[#0A0A0A] text-3xl md:text-4xl font-semibold tracking-[0.2em] font-sans">
                  URBAN SPACE
                </span>
                <span className="w-2.5 h-8 rounded-sm bg-[#0A0A0A]" />
              </motion.div>

              {/* Loading bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="w-48 h-[2px] bg-black/10 rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
                  className="h-full bg-[#0A0A0A]/60 rounded-full"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative h-screen -mt-16 overflow-hidden bg-[#0A0A0A]">
        {/* Background Images Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-0"
          >
            <img
              src={heroImages[activeSlide]}
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.56) 100%)',
          }}
        />

        {/* Top Bar - Logo & Language Switcher */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-8 md:px-[60px] z-20"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-white text-lg font-semibold tracking-[0.15em] font-sans">
              URBAN SPACE
            </span>
            <span className="w-2 h-6 rounded-sm bg-white" />
          </Link>

          <LanguageSwitcher isOverHero />
        </motion.div>

        {/* Carousel Dots - Right Side Vertical */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="absolute right-8 md:right-[60px] top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10"
        >
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-[3px] h-8 rounded-sm transition-colors duration-300 ${
                index === activeSlide ? 'bg-white' : 'bg-white/25'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </motion.div>

        {/* Bottom Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 h-20 flex items-center justify-between px-8 md:px-[60px] z-10"
        >
          {/* Left - Project Categories */}
          <div className="hidden md:flex items-center gap-10 lg:gap-[60px]">
            {/* Architecture Projects */}
            <div
              className="relative"
              onMouseEnter={() => setArchOpen(true)}
              onMouseLeave={() => setArchOpen(false)}
            >
              <Link href="/projects/architecture" className="flex flex-col gap-1">
                <span className="text-white text-[15px] font-sans font-bold">
                  {nav('architecture')} {nav('projects').toLowerCase()}
                </span>
                <span className="block h-[2px] bg-white" style={{ width: 180 }} />
              </Link>
              <AnimatePresence>
                {archOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    className="absolute bottom-full left-0 mb-3 flex flex-col gap-2 min-w-[220px] bg-black/30 backdrop-blur-md rounded-lg px-4 py-3"
                  >
                    <Link href="/projects/architecture?type=RESIDENTIAL_MULTI" className="text-white/70 text-sm font-sans hover:text-white transition-colors duration-200">
                      {sub('subtypes.RESIDENTIAL_MULTI')}
                    </Link>
                    <Link href="/projects/architecture?type=PUBLIC_MULTIFUNCTIONAL" className="text-white/70 text-sm font-sans hover:text-white transition-colors duration-200">
                      {sub('subtypes.PUBLIC_MULTIFUNCTIONAL')}
                    </Link>
                    <Link href="/projects/architecture?type=INDIVIDUAL_HOUSE" className="text-white/70 text-sm font-sans hover:text-white transition-colors duration-200">
                      {sub('subtypes.INDIVIDUAL_HOUSE')}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Urban Projects */}
            <div
              className="relative"
              onMouseEnter={() => setUrbanOpen(true)}
              onMouseLeave={() => setUrbanOpen(false)}
            >
              <Link href="/projects/urban" className="flex flex-col gap-1">
                <span className="text-white text-[15px] font-sans font-bold">
                  {nav('urban')} {nav('projects').toLowerCase()}
                </span>
                <span className="block h-[2px] bg-white" style={{ width: 140 }} />
              </Link>
              <AnimatePresence>
                {urbanOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    className="absolute bottom-full left-0 mb-3 flex flex-col gap-2 min-w-[120px] bg-black/30 backdrop-blur-md rounded-lg px-4 py-3"
                  >
                    <Link href="/projects/urban?type=GRG" className="text-white/70 text-sm font-sans hover:text-white transition-colors duration-200">
                      {sub('subtypes.GRG')}
                    </Link>
                    <Link href="/projects/urban?type=GDG" className="text-white/70 text-sm font-sans hover:text-white transition-colors duration-200">
                      {sub('subtypes.GDG')}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right - Studio & Contact */}
          <div className="hidden md:flex items-center gap-12 lg:gap-20">
            <Link href="/studio" className="flex flex-col gap-1">
              <span className="text-white text-[15px] font-sans font-bold">
                {nav('studio').toLowerCase()}
              </span>
              <span className="block h-[2px] bg-white" style={{ width: 90 }} />
            </Link>
            <Link href="/contact" className="flex flex-col gap-1">
              <span className="text-white text-[15px] font-sans font-bold">
                {nav('contact').toLowerCase()}
              </span>
              <span className="block h-[2px] bg-white" style={{ width: 90 }} />
            </Link>
          </div>
        </motion.nav>
      </section>
    </>
  );
}
