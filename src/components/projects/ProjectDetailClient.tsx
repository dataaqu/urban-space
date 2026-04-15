'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';

interface PageData {
  id: string;
  type: 'SINGLE_IMAGE' | 'DOUBLE_IMAGE';
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
  const sanitized = DOMPurify.sanitize(html);
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

const textStyle = "text-[18px] text-[#333] font-sans leading-relaxed prose prose-sm max-w-none";

export default function ProjectDetailClient({ locale, project }: ProjectDetailClientProps) {
  const totalPages = project.pages.length;
  const [activePage, setActivePage] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const sectionHeight = 'calc(100vh - 80px)';

  const getLeftText = (page: PageData) => locale === 'ka' ? page.textKa : page.textEn;
  const getRightText = (page: PageData) => locale === 'ka' ? page.textRightKa : page.textRightEn;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) setActivePage(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [totalPages]);

  const scrollToPage = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  if (project.pages.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: sectionHeight }}>
        <p className="text-gray-400 text-sm">პროექტს გვერდები არ აქვს</p>
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
      {/* Pagination dots */}
      {totalPages > 1 && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-2.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToPage(i)}
              className={`w-[6px] h-[6px] rounded-full transition-all duration-300 ${
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
          <div
            key={page.id}
            ref={(el) => { sectionRefs.current[index] = el; }}
            style={{ height: sectionHeight }}
          >
            {page.type === 'SINGLE_IMAGE' ? (
              <div className="w-full h-full flex flex-col overflow-hidden">
                {/* Desktop layout */}
                <div className="hidden lg:flex flex-1 min-h-0">
                  {/* Left text */}
                  <div className="flex flex-1 flex-col justify-center items-end px-10">
                    {leftText && <SafeHTML html={leftText} className={`${textStyle} max-w-[260px]`} />}
                  </div>

                  {/* Center image */}
                  <div className="w-[55%] flex-shrink-0">
                    <div className="w-full h-full overflow-hidden relative">
                      {page.image1 ? (
                        <Image src={page.image1} alt={project.title} fill className="object-cover" sizes="55vw" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                          სურათი არ არის
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right text */}
                  <div className="flex flex-1 flex-col justify-start items-start px-10 pt-16">
                    {rightText && <SafeHTML html={rightText} className={`${textStyle} max-w-[260px]`} />}
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="lg:hidden flex flex-col h-full overflow-auto">
                  <div className="w-full flex-1 relative min-h-0">
                    {page.image1 ? (
                      <Image src={page.image1} alt={project.title} fill className="object-cover" sizes="100vw" />
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
              <div className="w-full flex items-end h-full">
                <div className="flex gap-[20px] w-full h-full">
                  <div className="flex-1 h-full overflow-hidden relative">
                    <Image src={page.image1} alt={project.title} fill className="object-cover" sizes="40vw" />
                  </div>
                  {page.image2 && (
                    <div className="flex-1 h-full overflow-hidden relative">
                      <Image src={page.image2} alt={project.title} fill className="object-cover" sizes="40vw" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}
