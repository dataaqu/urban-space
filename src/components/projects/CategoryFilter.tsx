'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

interface CategoryFilterProps {
  activeCategory: 'ALL' | 'ARCHITECTURE' | 'URBAN';
}

export default function CategoryFilter({ activeCategory }: CategoryFilterProps) {
  const locale = useLocale();
  const language = locale as 'en' | 'ka';
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      // Near the top it's always visible.
      if (window.scrollY <= 10) {
        clearTimeout(idleTimer);
        setAtTop(true);
        setHidden(false);
        return;
      }
      // Hide while actively scrolling, then reveal once scrolling stops.
      setAtTop(false);
      setHidden(true);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setHidden(false), 250);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(idleTimer);
    };
  }, []);

  const isArch = activeCategory === 'ARCHITECTURE';
  const isUrban = activeCategory === 'URBAN';

  const renderLink = (href: string, label: string, active: boolean) => (
    <Link
      href={active ? '/projects' : href}
      className="group flex flex-col items-start text-foreground/70 hover:text-foreground transition"
    >
      <span className="text-[10px] md:text-[12px] lg:text-[11px] font-light tracking-[0.18em] uppercase">
        {label}
      </span>
      <span
        className={`mt-2 h-px bg-foreground/60 ${
          active ? 'w-1/2 opacity-100 transition-all duration-300' : 'w-0 opacity-0'
        }`}
      />
    </Link>
  );

  return (
    <div
      className={`sticky top-[56px] md:top-[100px] short-landscape:!top-[40px] z-30 bg-background/85 backdrop-blur-md lg:hidden ${
        hidden ? 'pointer-events-none' : ''
      }`}
      style={{
        opacity: hidden ? 0 : 1,
        visibility: hidden ? 'hidden' : 'visible',
        transform: 'translate3d(0, 0, 0)',
        transition: hidden ? 'none' : 'opacity 700ms ease-in-out, visibility 0s',
      }}
    >
      <div className="px-6 py-3 md:px-10 md:py-4">
        <div className="mx-auto flex max-w-[1680px] flex-col items-center lg:flex-row lg:justify-center">
          {atTop && (
            <Link
              href="/projects"
              className="mb-3 text-[11px] font-light tracking-[0.22em] uppercase text-foreground/85 hover:text-foreground transition lg:hidden"
            >
              {language === 'ka' ? 'პროექტები' : 'Projects'}
            </Link>
          )}
          <div className="flex items-center justify-center gap-10 md:gap-16">
            {renderLink(
              '/projects?category=ARCHITECTURE',
              language === 'ka' ? 'არქიტექტურა' : 'Architecture',
              isArch
            )}
            {renderLink(
              '/projects?category=URBAN',
              language === 'ka' ? 'ურბანული დაგეგმარება' : 'Urban Planning',
              isUrban
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
