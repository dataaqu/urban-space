'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollReveal } from '@/lib/animations';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
}

export default function Testimonials() {
  const t = useTranslations('home.testimonials');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: t('items.0.quote'),
      author: t('items.0.author'),
      role: t('items.0.role'),
      company: t('items.0.company'),
    },
    {
      id: 2,
      quote: t('items.1.quote'),
      author: t('items.1.author'),
      role: t('items.1.role'),
      company: t('items.1.company'),
    },
    {
      id: 3,
      quote: t('items.2.quote'),
      author: t('items.2.author'),
      role: t('items.2.role'),
      company: t('items.2.company'),
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="section-padding bg-gradient-luxury relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Elements - Luxury */}
      <div className="absolute inset-0 marble-effect-dark" />
      <div className="absolute inset-0 grid-overlay-luxury" />

      {/* Dramatic Ambient Lights */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full filter blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/5 rounded-full filter blur-[100px]" />

      {/* Corner Frames */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary-500/20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary-500/20" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary-500/20" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary-500/20" />

      <div className="container-premium relative z-10">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Quote Brackets - Luxury Style */}
          <div className="text-center mb-10 relative">
            <div className="inline-flex items-center gap-4">
              <span className="text-6xl md:text-7xl font-display text-primary-500/30 select-none">[</span>
              <span className="text-xs uppercase tracking-[0.3em] text-primary-400/60">Testimonials</span>
              <span className="text-6xl md:text-7xl font-display text-primary-500/30 select-none">]</span>
            </div>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="text-center"
              >
                <blockquote className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light leading-relaxed mb-10 font-display italic">
                  &ldquo;{testimonials[currentIndex].quote}&rdquo;
                </blockquote>

                <div className="flex flex-col items-center">
                  {/* Decorative Line */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-8 h-px bg-gradient-to-r from-transparent to-primary-500" />
                    <span className="w-2 h-2 rounded-full bg-primary-500 shadow-glow-gold" />
                    <span className="w-8 h-px bg-gradient-to-l from-transparent to-primary-500" />
                  </div>
                  <cite className="not-italic">
                    <span className="block text-white font-semibold text-lg tracking-wide">
                      {testimonials[currentIndex].author}
                    </span>
                    <span className="block text-primary-400/70 text-sm mt-1 tracking-wider uppercase">
                      {testimonials[currentIndex].role}
                    </span>
                    <span className="block text-secondary-400/60 text-xs mt-0.5">
                      {testimonials[currentIndex].company}
                    </span>
                  </cite>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation - Luxury Style */}
          <div className="flex items-center justify-center gap-8 mt-14">
            {/* Prev Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevSlide}
              className="w-14 h-14 flex items-center justify-center rounded-full border border-primary-500/30 text-primary-400/60 hover:border-primary-500/60 hover:text-primary-400 hover:shadow-gold-border transition-all duration-300 backdrop-blur-sm"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* Dots - Luxury */}
            <div className="flex items-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`rounded-full transition-all duration-500 ${
                    index === currentIndex
                      ? 'w-10 h-2 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 shadow-glow-gold'
                      : 'w-2 h-2 bg-white/20 hover:bg-primary-500/40'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextSlide}
              className="w-14 h-14 flex items-center justify-center rounded-full border border-primary-500/30 text-primary-400/60 hover:border-primary-500/60 hover:text-primary-400 hover:shadow-gold-border transition-all duration-300 backdrop-blur-sm"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Top & Bottom Lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
    </section>
  );
}
