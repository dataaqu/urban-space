'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

interface PageData {
  id: string;
  type: 'SINGLE_IMAGE' | 'DOUBLE_IMAGE' | 'IMAGE_ONLY';
  order: number;
  image1: string;
  image2: string | null;
  textKa: string | null;
  textEn: string | null;
  textRightKa: string | null;
  textRightEn: string | null;
}

interface ProjectDetailClientProps {
  locale: string;
  project: {
    id: string;
    title: string;
    category: string;
    pages: PageData[];
  };
}

function SafeHTML({ html, className }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

const textStyle = "text-[18px] xl:text-[20px] 2xl:text-[22px] text-[#333] font-sans leading-relaxed prose prose-sm xl:prose-base 2xl:prose-lg max-w-none";

export default function ProjectDetailClient({ locale, project }: ProjectDetailClientProps) {
  const totalPages = project.pages.length;
  const [activePage, setActivePage] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activePageRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const HEADER_OFFSET = 80;
  const sectionHeight = `calc(100vh - ${HEADER_OFFSET}px)`;

  const getLeftText = (page: PageData) => locale === 'ka' ? page.textKa : page.textEn;
  const getRightText = (page: PageData) => locale === 'ka' ? page.textRightKa : page.textRightEn;

  useEffect(() => {
    activePageRef.current = activePage;
  }, [activePage]);

  const scrollToPage = (index: number) => {
    const target = sectionRefs.current[index];
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    isAnimatingRef.current = true;
    activePageRef.current = index;
    setActivePage(index);
    window.scrollTo({ top, behavior: 'smooth' });
    window.setTimeout(() => {
      isAnimatingRef.current = false;
    }, 800);
  };

  useEffect(() => {
    if (totalPages <= 1) return;

    let touchStartY = 0;

    const goTo = (delta: number) => {
      if (isAnimatingRef.current) return;
      const next = activePageRef.current + delta;
      if (next < 0 || next >= totalPages) return;
      const target = sectionRefs.current[next];
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      isAnimatingRef.current = true;
      activePageRef.current = next;
      setActivePage(next);
      window.scrollTo({ top, behavior: 'smooth' });
      window.setTimeout(() => {
        isAnimatingRef.current = false;
      }, 800);
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 5) return;
      e.preventDefault();
      goTo(e.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0]?.clientY ?? 0;
      const diff = touchStartY - currentY;
      if (Math.abs(diff) < 30) return;
      e.preventDefault();
      goTo(diff > 0 ? 1 : -1);
      touchStartY = currentY;
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goTo(1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goTo(-1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKey);
    };
  }, [totalPages]);

  if (project.pages.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: sectionHeight }}>
        <p className="text-gray-400 text-sm xl:text-base 2xl:text-lg">პროექტს გვერდები არ აქვს</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white relative"
    >
      {/* Close button */}
      <Link
        href="/projects"
        aria-label="Close"
        className="fixed top-[120px] xl:top-[132px] right-6 xl:right-8 2xl:right-10 z-40 text-[12px] xl:text-[13px] font-medium tracking-[0.16em] text-[#1a1a1a] transition hover:text-black"
      >
        close
      </Link>

      {/* Pagination dots */}
      {totalPages > 1 && (
        <div className="fixed right-6 xl:right-8 2xl:right-10 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-2.5 xl:gap-3 2xl:gap-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToPage(i)}
              className={`w-[6px] h-[6px] xl:w-[8px] xl:h-[8px] 2xl:w-[10px] 2xl:h-[10px] rounded-full transition-all duration-300 ${
                activePage === i ? 'bg-[#1a1a1a]' : 'bg-[#ccc]'
              }`}
            />
          ))}
        </div>
      )}

      {/* Render each page */}
      {project.pages.map((page, index) => {
        const leftText = getLeftText(page);
        const rightText = getRightText(page);

        return (
          <motion.div
            key={page.id}
            ref={(el) => { sectionRefs.current[index] = el; }}
            style={{ height: sectionHeight }}
            className="pb-[20px]"
            animate={{
              opacity: index === activePage ? 1 : 0.25,
              scale: index === activePage ? 1 : 0.97,
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {page.type === 'IMAGE_ONLY' ? (
              <div className="w-full h-full px-2 sm:px-4 md:px-6 lg:px-8">
                <div className="relative w-full h-full">
                  {page.image1 ? (
                    <Image
                      src={page.image1}
                      alt={project.title}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm xl:text-base 2xl:text-lg">
                      სურათი არ არის
                    </div>
                  )}
                </div>
              </div>
            ) : page.type === 'SINGLE_IMAGE' ? (
              <div className="w-full h-full flex flex-col overflow-hidden">
                {/* Desktop layout */}
                <div className="hidden lg:flex flex-1 min-h-0">
                  {/* Left text */}
                  <div className="flex flex-1 flex-col justify-center items-end px-10 xl:px-14 2xl:px-20">
                    {leftText && <SafeHTML html={leftText} className={`${textStyle} max-w-[260px] xl:max-w-[340px] 2xl:max-w-[420px]`} />}
                  </div>

                  {/* Center image */}
                  <div className="w-[55%] flex-shrink-0">
                    <div className="w-full h-full overflow-hidden relative">
                      {page.image1 ? (
                        <Image src={page.image1} alt={project.title} fill className="object-contain" sizes="55vw" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm xl:text-base 2xl:text-lg">
                          სურათი არ არის
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right text */}
                  <div className="flex flex-1 flex-col justify-start items-start px-10 xl:px-14 2xl:px-20 pt-16 xl:pt-20 2xl:pt-24">
                    {rightText && <SafeHTML html={rightText} className={`${textStyle} max-w-[260px] xl:max-w-[340px] 2xl:max-w-[420px]`} />}
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="lg:hidden flex flex-col h-full overflow-auto">
                  <div className="w-full flex-1 relative min-h-0">
                    {page.image1 ? (
                      <Image src={page.image1} alt={project.title} fill className="object-contain" sizes="100vw" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                        სურათი არ არის
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-[20px] px-6 py-4">
                    {rightText && <SafeHTML html={rightText} className={textStyle} />}
                    {leftText && <SafeHTML html={leftText} className={textStyle} />}
                  </div>
                </div>
              </div>
            ) : (
              /* Double image page */
              <div className="w-full h-full flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-[60px] xl:px-[100px] 2xl:px-[140px]">
                <div className="flex flex-col md:flex-row gap-[16px] md:gap-[20px] xl:gap-[28px] 2xl:gap-[36px] w-full h-full">
                  <div className="flex-1 min-h-0 relative">
                    <Image src={page.image1} alt={project.title} fill className="object-contain" sizes="(max-width: 768px) 100vw, 45vw" />
                  </div>
                  {page.image2 && (
                    <div className="flex-1 min-h-0 relative">
                      <Image src={page.image2} alt={project.title} fill className="object-contain" sizes="(max-width: 768px) 100vw, 45vw" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
