'use client';

import { Link, usePathname } from '@/i18n/routing';
import Navigation from './Navigation';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isOverHero = isHomePage && !isScrolled;

  const headerHeight = useTransform(scrollY, [0, 100], ['5rem', '4rem']);
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(253, 249, 243, 0)', 'rgba(253, 249, 243, 0.95)']
  );
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      style={{
        height: headerHeight,
        backgroundColor,
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'backdrop-blur-xl shadow-luxury' : ''
      }`}
    >
      {/* Top Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${
          isOverHero ? 'via-white/20' : 'via-primary-500/50'
        } to-transparent transition-colors duration-500`}
      />

      {/* Bottom Border - Luxury */}
      <motion.div
        style={{ opacity: borderOpacity }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent"
      />

      <div className="container-premium h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <motion.div style={{ scale: logoScale }}>
            <Link href="/" className="flex items-center gap-2 group relative">
              <div className="absolute -inset-2 bg-primary-500/0 group-hover:bg-primary-500/5 rounded-lg transition-all duration-500" />
              <motion.span
                className="relative text-lg tracking-[0.15em] font-semibold"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <span
                  className={`transition-colors duration-500 ${
                    isOverHero ? 'text-white' : 'text-secondary-900'
                  }`}
                >
                  URBAN
                </span>
                {' '}
                <span
                  className={`transition-colors duration-500 ${
                    isOverHero ? 'text-white' : 'text-shimmer'
                  }`}
                >
                  SPACE
                </span>
              </motion.span>
              {/* Accent Bar */}
              <span
                className={`w-2 h-6 rounded-sm transition-colors duration-500 ${
                  isOverHero ? 'bg-white' : 'bg-primary-500'
                }`}
              />
            </Link>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center gap-8">
            <Navigation isScrolled={isScrolled} isOverHero={isOverHero} />
            {/* Luxury Divider */}
            <div
              className={`hidden md:block h-5 w-px bg-gradient-to-b from-transparent ${
                isOverHero ? 'via-white/30' : 'via-primary-500/30'
              } to-transparent transition-colors duration-500`}
            />
            <LanguageSwitcher isScrolled={isScrolled} isOverHero={isOverHero} />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
