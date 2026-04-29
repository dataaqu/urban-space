'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { Minus, Plus, X } from 'lucide-react';

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
  content?: Record<string, { ka: string; en: string }>;
}

const fallbackBackgrounds = [
  '/full-project/hero-architecture.jpg',
  '/full-project/hero-render-1.jpg',
  '/full-project/project1.jpg',
  '/full-project/project2.jpg',
  '/full-project/project3.jpg',
];

export default function Hero({ slides, content }: HeroProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const language = locale as 'en' | 'ka';

  const heroBackgrounds =
    slides && slides.length > 0
      ? slides.map((s) => (s.type === 'VIDEO' && s.videoUrl ? s.videoUrl : s.image))
      : fallbackBackgrounds;

  const [currentBg, setCurrentBg] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [docked, setDocked] = useState(false);

  const heroTagline =
    language === 'ka'
      ? 'არქიტექტურა და ურბანული დაგეგმარება'
      : 'Architecture & urban planning';
  const exploreLabel =
    content?.['hero.cta']?.[language] ||
    (language === 'ka' ? 'იხილე პროექტები' : 'EXPLORE PROJECTS');

  const logoRef = useRef<HTMLAnchorElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const overlayDarkRef = useRef<HTMLDivElement>(null);
  const overlayWhiteRef = useRef<HTMLDivElement>(null);
  const topbarRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ka' : 'en';
    router.replace(pathname, { locale: next });
  };

  useEffect(() => {
    if (heroBackgrounds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroBackgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroBackgrounds.length]);

  useEffect(() => {
    let rafId = 0;
    let ticking = false;
    let lastDocked = false;

    const apply = () => {
      const vh = window.innerHeight;
      const start = vh * 0.15;
      const end = vh * 0.85;
      const y = window.scrollY;
      const raw = (y - start) / (end - start);
      const p = Math.min(1, Math.max(0, raw));

      if (logoRef.current) {
        const scale = 1 - p * 0.45;
        const topOffset = p * -4;
        const leftOffset = p * 8;
        logoRef.current.style.transform = `translate3d(${leftOffset}px, ${topOffset}px, 0) scale(${scale})`;
      }

      if (ctaRef.current) {
        const scale = 1 - p * 0.4;
        const translateY = (1 - p) * window.innerHeight * 0.78;
        ctaRef.current.style.transform = `translate3d(-50%, ${translateY}px, 0) scale(${scale})`;
      }

      if (arrowRef.current) {
        arrowRef.current.style.opacity = String(1 - p);
      }

      if (overlayDarkRef.current) {
        overlayDarkRef.current.style.opacity = String(1 - p * 0.6);
      }
      if (overlayWhiteRef.current) {
        overlayWhiteRef.current.style.opacity = String(p);
      }
      if (topbarRef.current) {
        topbarRef.current.style.opacity = String(p > 0.85 ? (p - 0.85) / 0.15 : 0);
      }

      const nowDocked = p > 0.5;
      if (nowDocked !== lastDocked) {
        lastDocked = nowDocked;
        setDocked(nowDocked);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(apply);
      }
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', apply);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', apply);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const textOnDark = docked ? 'text-foreground' : 'text-background';
  const subtleBorderColor = docked ? 'bg-foreground/70' : 'bg-background/90';

  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0">
          {heroBackgrounds.map((bg, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={bg}
              alt={
                language === 'ka'
                  ? `Urban Space არქიტექტურა ${index + 1}`
                  : `Urban Space architecture ${index + 1}`
              }
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ${
                index === currentBg ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div
            ref={overlayDarkRef}
            className="absolute inset-0 bg-foreground/30 pointer-events-none"
          />
          {/* Top-left vignette so the logo stays legible on bright skies */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 55% at 0% 0%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0) 70%)',
            }}
          />
          {/* Top-right vignette so the lang toggle + hamburger stay legible */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 35% 40% at 100% 0%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0) 75%)',
            }}
          />
          <div
            ref={overlayWhiteRef}
            className="absolute inset-0 bg-background pointer-events-none"
            style={{ opacity: 0 }}
          />
        </div>
      </section>

      {/* Fixed morphing top layer */}
      <div className="fixed inset-x-0 top-0 z-40 pointer-events-none">
        <div
          ref={topbarRef}
          className="absolute inset-x-0 top-0 h-24 bg-background/95 backdrop-blur-sm border-b border-border"
          style={{ opacity: 0 }}
        />

        <div
          className={`absolute top-8 md:top-10 right-8 md:right-10 flex items-start gap-8 md:gap-10 pointer-events-auto transition-colors duration-300 ${textOnDark}`}
        >
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="pt-1 text-sm md:text-[18px] font-light tracking-[0.08em] opacity-100 hover:opacity-80 transition"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.45)' }}
          >
            <span className={language === 'ka' ? 'opacity-100' : 'opacity-75'}>ქარ</span>
            <span className="opacity-75"> / </span>
            <span className={language === 'en' ? 'opacity-100' : 'opacity-75'}>EN</span>
          </button>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
            className="group relative mt-1 flex h-5 w-5 flex-col justify-between"
          >
            <span
              className={`block h-[1px] w-full transition ${subtleBorderColor} ${
                menuOpen ? 'translate-y-[9px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-[1px] w-full transition ${subtleBorderColor} ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-[1px] w-full transition ${subtleBorderColor} ${
                menuOpen ? '-translate-y-[9px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>

        <Link
          ref={logoRef}
          href="/"
          className={`absolute top-8 left-8 pointer-events-auto ${textOnDark} ${
            menuOpen ? 'blur-sm opacity-70' : 'blur-0 opacity-100'
          }`}
          style={{
            transformOrigin: 'top left',
            willChange: 'transform',
            transition: 'filter 500ms ease, opacity 500ms ease, color 300ms ease',
          }}
        >
          <h1
            className="text-[28px] md:text-[36px] lg:text-[42px] xl:text-[48px] 2xl:text-[56px] font-light tracking-[0.16em] leading-none whitespace-nowrap"
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              textShadow: docked ? 'none' : '0 2px 18px rgba(0,0,0,0.45)',
            }}
          >
            URBAN SPACE
          </h1>
          <span
            className={`mt-3 block h-px w-20 md:w-24 lg:w-28 xl:w-32 transition-colors ${subtleBorderColor}`}
          />
          <p
            className="mt-3 text-[12px] md:text-[13px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px] font-light tracking-[0.12em] opacity-95"
            style={{ textShadow: docked ? 'none' : '0 1px 10px rgba(0,0,0,0.45)' }}
          >
            {heroTagline}
          </p>
        </Link>

        <div
          ref={ctaRef}
          className={`absolute top-9 left-1/2 pointer-events-auto ${textOnDark} ${
            menuOpen ? 'blur-sm opacity-70' : 'blur-0 opacity-100'
          }`}
          style={{
            transformOrigin: 'top center',
            willChange: 'transform',
            transition: 'filter 500ms ease, opacity 500ms ease, color 300ms ease',
          }}
        >
          <Link
            href="/projects"
            className="block text-center text-[16px] md:text-[18px] lg:text-[20px] xl:text-[24px] 2xl:text-[26px] font-light tracking-[0.2em] hover:opacity-70 transition-opacity whitespace-nowrap"
          >
            {exploreLabel}
          </Link>
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: window.scrollY + window.innerHeight,
                behavior: 'smooth',
              })
            }
            aria-label="Scroll down"
            className="mx-auto block text-center text-[18px] md:text-[22px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] font-light leading-none mt-12 md:mt-16 xl:mt-20 animate-[bounce_2.6s_ease-in-out_infinite] hover:opacity-70 transition-opacity"
          >
            <span ref={arrowRef} aria-hidden>
              ↓
            </span>
          </button>
        </div>
      </div>

      {/* Side menu backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-30 transition-opacity duration-500 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(0, 0, 0, 0.28)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      <aside
        className={`fixed top-0 right-0 z-40 h-full w-full sm:w-[420px] md:w-[480px] text-background shadow-elegant transition-transform duration-500 ease-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'rgba(20, 20, 20, 0.72)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-end gap-8 px-8 pt-8 md:px-10 md:pt-10">
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="text-sm md:text-[15px] font-light tracking-[0.08em] text-background/85 hover:text-background transition"
            >
              <span className={language === 'ka' ? 'text-background' : 'text-background/60'}>
                ქარ
              </span>
              <span className="text-background/60"> / </span>
              <span className={language === 'en' ? 'text-background' : 'text-background/60'}>
                EN
              </span>
            </button>

            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="text-background/85 hover:text-background transition"
            >
              <X className="h-6 w-6" strokeWidth={1} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col justify-center px-8 md:px-10">
            <div className="space-y-8">
              <div>
                <button
                  type="button"
                  onClick={() => setProjectsOpen((v) => !v)}
                  className="w-full flex items-center justify-between text-background/95 hover:text-background transition"
                >
                  <span className="text-[15px] md:text-[18px] font-light tracking-[0.22em]">
                    {language === 'ka' ? 'პროექტები' : 'PROJECTS'}
                  </span>
                  {projectsOpen ? (
                    <Minus className="h-4 w-4" strokeWidth={1} />
                  ) : (
                    <Plus className="h-4 w-4" strokeWidth={1} />
                  )}
                </button>

                <div
                  className={`grid transition-all duration-500 ease-out ${
                    projectsOpen
                      ? 'grid-rows-[1fr] opacity-100 mt-5'
                      : 'grid-rows-[0fr] opacity-0 mt-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-l border-background/20 pl-5 flex flex-col gap-3">
                      <Link
                        href="/projects?category=ARCHITECTURE"
                        onClick={() => setMenuOpen(false)}
                        className="text-[15px] md:text-[16px] font-light tracking-[0.03em] text-background/72 hover:text-background transition"
                      >
                        {language === 'ka' ? 'არქიტექტურა' : 'Architecture'}
                      </Link>

                      <Link
                        href="/projects?category=URBAN"
                        onClick={() => setMenuOpen(false)}
                        className="text-[15px] md:text-[16px] font-light tracking-[0.03em] text-background/72 hover:text-background transition"
                      >
                        {language === 'ka' ? 'ურბანული' : 'Urban'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/studio"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center text-left text-background/95 hover:text-background transition"
              >
                <span className="text-[15px] md:text-[18px] font-light tracking-[0.22em]">
                  {language === 'ka' ? 'ჩვენ შესახებ' : 'ABOUT'}
                </span>
              </Link>

              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center text-left text-background/95 hover:text-background transition"
              >
                <span className="text-[15px] md:text-[18px] font-light tracking-[0.22em]">
                  {language === 'ka' ? 'კონტაქტი' : 'CONTACT'}
                </span>
              </Link>
            </div>
          </nav>

          <div className="px-8 pb-8 md:px-10 md:pb-10">
            <div className="flex items-center gap-8 text-[12px] md:text-[13px] font-light tracking-[0.16em] text-background/72">
              <a href="#" className="hover:text-background transition">
                INSTAGRAM
              </a>
              <a href="#" className="hover:text-background transition">
                FACEBOOK
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
