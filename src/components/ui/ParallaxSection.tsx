'use client';

import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParallaxSectionProps {
  children: ReactNode;
  backgroundImage?: string;
  backgroundColor?: string;
  overlay?: 'light' | 'dark' | 'gold' | 'none';
  speed?: number;
  className?: string;
  contentClassName?: string;
  minHeight?: string;
}

export default function ParallaxSection({
  children,
  backgroundImage,
  backgroundColor = 'bg-secondary-900',
  overlay = 'dark',
  speed = 0.5,
  className,
  contentClassName,
  minHeight = 'min-h-[60vh]',
}: ParallaxSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 30}%`]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6]);

  const overlayClasses = {
    light: 'bg-white/60',
    dark: 'bg-dark-900/70',
    gold: 'bg-gradient-to-b from-primary-900/30 via-dark-900/50 to-dark-900/80',
    none: '',
  };

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative overflow-hidden',
        minHeight,
        !backgroundImage && backgroundColor,
        className
      )}
    >
      {/* Parallax Background */}
      {backgroundImage && (
        <motion.div
          style={{ y }}
          className="absolute inset-0 w-full h-[130%] -top-[15%]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        </motion.div>
      )}

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10 pointer-events-none" />

      {/* Color Overlay */}
      {overlay !== 'none' && (
        <div className={cn('absolute inset-0', overlayClasses[overlay])} />
      )}

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className={cn('relative z-10 h-full', contentClassName)}
      >
        {children}
      </motion.div>
    </section>
  );
}

// Variant for CTA sections
interface ParallaxCTAProps {
  title: string;
  description?: string;
  buttonText: string;
  buttonHref: string;
  backgroundImage?: string;
}

export function ParallaxCTA({
  title,
  description,
  buttonText,
  buttonHref,
  backgroundImage,
}: ParallaxCTAProps) {
  return (
    <ParallaxSection
      backgroundImage={backgroundImage}
      overlay="gold"
      minHeight="min-h-[50vh]"
      contentClassName="flex items-center justify-center"
    >
      <div className="container-premium text-center py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
        >
          {title}
        </motion.h2>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-white/80 max-w-2xl mx-auto mb-8"
          >
            {description}
          </motion.p>
        )}

        <motion.a
          href={buttonHref}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-gold text-dark-900 font-semibold rounded-lg hover:shadow-glow-gold transition-all duration-300"
        >
          {buttonText}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.a>
      </div>
    </ParallaxSection>
  );
}
