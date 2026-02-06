'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Button from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';

export default function Hero() {
  const t = useTranslations('home.hero');
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-luxury overflow-hidden"
    >
      {/* Marble Effect Background */}
      <div className="absolute inset-0 marble-effect-dark" />

      {/* Luxury Grid Pattern Overlay */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 grid-overlay-luxury"
      />

      {/* Parallax Background Elements */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0"
      >
        {/* Dramatic Gold Glow Effects */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-500 rounded-full filter blur-[150px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 1.5,
          }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary-400 rounded-full filter blur-[130px]"
        />
        {/* Additional Ambient Light */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 2,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-300 rounded-full filter blur-[200px]"
        />

        {/* Decorative Lines - Enhanced */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-primary-500/0 via-primary-500/30 to-primary-500/0" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-primary-500/0 via-primary-500/15 to-primary-500/0" />
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-primary-500/0 via-primary-500/10 to-primary-500/0" />

        {/* Horizontal Decorative Lines */}
        <div className="absolute top-1/4 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary-500/10 to-transparent" />
        <div className="absolute bottom-1/3 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary-500/10 to-transparent" />
      </motion.div>

      {/* Corner Brackets - Luxury Frame */}
      <div className="absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 border-primary-500/30" />
      <div className="absolute top-8 right-8 w-20 h-20 border-t-2 border-r-2 border-primary-500/30" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-b-2 border-l-2 border-primary-500/30" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-b-2 border-r-2 border-primary-500/30" />

      {/* Main Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 container-premium text-center"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Premium Badge - Enhanced */}
          <motion.div variants={staggerItem} className="mb-10">
            <span className="inline-flex items-center px-5 py-2 text-xs font-medium tracking-[0.2em] uppercase bg-primary-500/10 text-primary-400 border border-primary-500/30 rounded-full backdrop-blur-sm shadow-gold-border">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3 animate-pulse" />
              Architecture & Urban Design
            </span>
          </motion.div>

          {/* Main Title with Serif Font - Luxury */}
          <motion.h1
            variants={staggerItem}
            className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 tracking-tightest text-shadow-lg"
          >
            {t('title').split(' ').map((word, index) => (
              <span key={index} className="inline-block">
                {index === 1 ? (
                  <span className="text-shimmer">{word}</span>
                ) : (
                  word
                )}
                {index < t('title').split(' ').length - 1 && '\u00A0'}
              </span>
            ))}
          </motion.h1>

          {/* Subtitle with Gold Accent - Enhanced */}
          <motion.p
            variants={staggerItem}
            className="text-xl md:text-2xl lg:text-3xl text-primary-300/90 mb-8 font-light tracking-wider"
          >
            {t('subtitle')}
          </motion.p>

          {/* Decorative Divider - Luxury */}
          <motion.div
            variants={staggerItem}
            className="flex items-center justify-center gap-6 mb-10"
          >
            <span className="w-16 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-primary-500" />
            <span className="w-3 h-3 rounded-full bg-primary-500 shadow-gold-glow-intense" />
            <span className="w-16 h-px bg-gradient-to-l from-transparent via-primary-500/50 to-primary-500" />
          </motion.div>

          {/* Description - Enhanced */}
          <motion.p
            variants={staggerItem}
            className="text-lg md:text-xl text-secondary-300/80 mb-14 max-w-2xl mx-auto leading-relaxed"
          >
            {t('description')}
          </motion.p>

          {/* CTA Buttons - Luxury Style */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link href="/projects">
              <Button
                size="lg"
                variant="gold"
                className="min-w-[200px] shadow-luxury-gold hover:shadow-gold-glow-intense transition-shadow duration-500"
                rightIcon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                }
              >
                {t('cta')}
              </Button>
            </Link>
            <Link href="/studio">
              <Button
                size="lg"
                variant="outline-animated"
                className="min-w-[200px] border-primary-500/40 hover:border-primary-500/80"
              >
                {t('ctaSecondary') || 'Learn More'}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - Luxury */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-primary-400/50 font-light">
            Scroll
          </span>
          <div className="relative w-7 h-12 border-2 border-primary-500/40 rounded-full">
            <motion.div
              animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-1/2 top-2 -translate-x-1/2 w-1.5 h-3 bg-primary-500 rounded-full shadow-glow-gold"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade - Enhanced */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-accent-50 via-accent-50/80 to-transparent" />
    </section>
  );
}
