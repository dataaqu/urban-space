'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const fallbackImages = [
  '/poto/2.webp',
];

interface HeroSlide {
  id: string;
  image: string;
  videoUrl: string | null;
  type: 'IMAGE' | 'VIDEO';
  titleKa: string | null;
  titleEn: string | null;
  order: number;
  active: boolean;
}

interface HeroProps {
  slides?: HeroSlide[];
}

export default function Hero({ slides }: HeroProps) {
  const heroSlides: { src: string; type: 'IMAGE' | 'VIDEO' }[] = slides && slides.length > 0
    ? slides.map(s => ({
        src: s.type === 'VIDEO' && s.videoUrl ? s.videoUrl : s.image,
        type: s.type,
      }))
    : fallbackImages.map(img => ({ src: img, type: 'IMAGE' as const }));

  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('loaderShown')) {
      setLoading(false);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('loaderShown', '1');
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 120000);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <>
      {/* Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
              className="relative flex flex-col items-center"
            >
              <span className="text-[#0A0A0A] text-3xl md:text-5xl font-bold tracking-[0.2em] font-sans">
                URBAN SPACE
              </span>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2, ease: [0.19, 1, 0.22, 1] }}
                className="mt-4 text-[#0A0A0A]/60 text-sm md:text-base tracking-[0.25em] uppercase font-light"
              >
                Architecture & Urban Planning
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative h-screen -mt-16 overflow-hidden bg-[#0A0A0A]">
        {/* Background Images Carousel */}
        <AnimatePresence>
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-0"
          >
            {heroSlides[activeSlide].type === 'VIDEO' ? (
              <video
                src={heroSlides[activeSlide].src}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={heroSlides[activeSlide].src}
                alt=""
                fill
                priority={activeSlide === 0}
                sizes="100vw"
                className="object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Light Overlay */}
        <div className="absolute inset-0 bg-white/20" />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.56) 100%)',
          }}
        />
      </section>
    </>
  );
}
