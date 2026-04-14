'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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

const textStyle = "text-[14px] text-[#333] font-sans leading-relaxed prose prose-sm max-w-none";

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
                <div className="flex-1 flex min-h-0">
                  {/* Left text */}
                  <div className="hidden lg:flex w-[220px] xl:w-[260px] flex-shrink-0 flex-col justify-end px-8 pb-16">
                    {leftText && <SafeHTML html={leftText} className={textStyle} />}
                  </div>

                  {/* Center image */}
                  <div className="flex-1 flex items-stretch max-w-[45%] mx-auto min-w-0">
                    <div className="w-full h-full overflow-hidden">
                      {page.image1 ? (
                        <img src={page.image1} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                          სურათი არ არის
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right text */}
                  <div className="hidden lg:flex w-[220px] xl:w-[260px] flex-shrink-0 flex-col justify-start px-8 pt-16">
                    {rightText && <SafeHTML html={rightText} className={textStyle} />}
                  </div>
                </div>

                {/* Mobile */}
                <div className="lg:hidden px-6 py-5">
                  {leftText && <SafeHTML html={leftText} className={textStyle} />}
                </div>
              </div>
            ) : (
              /* Double image page */
              <div className="w-full flex items-end px-[120px] py-[40px] h-full">
                <div className="flex gap-[120px] w-full h-full">
                  <div className="flex-1 h-full overflow-hidden">
                    <img src={page.image1} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                  {page.image2 && (
                    <div className="flex-1 h-full overflow-hidden">
                      <img src={page.image2} alt={project.title} className="w-full h-full object-cover" />
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
