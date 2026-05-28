'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { X } from 'lucide-react';

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
  social?: {
    facebook: string;
    instagram: string;
  };
  /** Whether the intro loader has finished. While false on mobile the hero
   *  title is kept hidden so it doesn't ghost through the translucent loader. */
  splashDone?: boolean;
}

const fallbackBackgrounds = [
  '/full-project/hero-architecture.jpg',
  '/full-project/hero-render-1.jpg',
  '/full-project/project1.jpg',
  '/full-project/project2.jpg',
  '/full-project/project3.jpg',
];

export default function Hero({ slides, content, social, splashDone = true }: HeroProps) {
  const locale = useLocale();
  const socialLinks = social ?? { facebook: '', instagram: '' };
  const router = useRouter();
  const pathname = usePathname();
  const language = locale as 'en' | 'ka';

  const heroBackgrounds =
    slides && slides.length > 0
      ? slides.map((s) => (s.type === 'VIDEO' && s.videoUrl ? s.videoUrl : s.image))
      : fallbackBackgrounds;

  const [currentBg, setCurrentBg] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [docked, setDocked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  // Detect mobile/tablet layout once mounted. Until the intro loader finishes
  // we keep the hero top layer hidden on mobile so the title doesn't show
  // through the translucent loader. Desktop reveals immediately (no flash).
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobileLayout(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const showTopLayer = splashDone || (mounted && !isMobileLayout);

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
  const arrowWrapRef = useRef<HTMLButtonElement>(null);
  const langRef = useRef<HTMLButtonElement>(null);
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
      const vw = window.innerWidth;
      const isLandscapePhone = vh < 500 && vw > vh;
      const isMobile = vw < 768 && !isLandscapePhone;
      const isTablet = vw >= 768 && vw < 1024 && !isLandscapePhone;
      const isMobileLayout = isMobile || isTablet || isLandscapePhone;

      const start = vh * 0.15;
      const end = vh * 0.85;
      const y = window.scrollY;
      const raw = (y - start) / (end - start);
      const p = Math.min(1, Math.max(0, raw));

      if (logoRef.current) {
        if (isMobile) {
          // Mobile (portrait): centered initially, scrolls to top-left dock
          const scale = 1 - p * 0.505;
          const h1El = logoRef.current.querySelector('h1') as HTMLElement | null;
          const h1Width = h1El?.offsetWidth ?? logoRef.current.offsetWidth;
          const initialX = vw / 2 - 32 - h1Width / 2;
          const initialY = vh * 0.35 - 32;
          const tx = initialX * (1 - p);
          const ty = initialY * (1 - p);
          logoRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
        } else {
          const scale = 1 - p * 0.45;
          const topOffset = p * -4;
          const leftOffset = p * 8;
          logoRef.current.style.transform = `translate3d(${leftOffset}px, ${topOffset}px, 0) scale(${scale})`;
        }
      }

      if (ctaRef.current) {
        if (isMobileLayout) {
          // Mobile: anchor near 67% of vh, fade out on scroll
          const ctaAnchor = isLandscapePhone ? 0.68 : isTablet ? 0.72 : 0.67;
          const ctaExtraOffset = isTablet ? 24 : 0;
          const ty = vh * ctaAnchor - 36 + ctaExtraOffset;
          ctaRef.current.style.transform = `translate3d(-50%, ${ty}px, 0) scale(${isLandscapePhone ? 0.85 : 1})`;
          ctaRef.current.style.opacity = String(Math.max(0, 1 - p * 3));
          ctaRef.current.style.pointerEvents = p > 0.33 ? 'none' : 'auto';
        } else {
          // Desktop: stays visible and docks into the header
          const scale = 1 - p * 0.4;
          const translateY = (1 - p) * vh * 0.72;
          ctaRef.current.style.transform = `translate3d(-50%, ${translateY}px, 0) scale(${scale})`;
          ctaRef.current.style.opacity = '1';
          ctaRef.current.style.pointerEvents = 'auto';
        }
      }

      // Arrow position — near the bottom of the viewport, below the CTA text
      if (arrowWrapRef.current) {
        if (isMobileLayout) {
          arrowWrapRef.current.style.top = `${vh - 56}px`;
        } else {
          arrowWrapRef.current.style.top = `${vh - 50}px`;
        }
      }

      // Language switcher — on mobile fades out as you scroll
      if (langRef.current) {
        if (isMobile || isLandscapePhone) {
          langRef.current.style.opacity = String(1 - p);
          langRef.current.style.pointerEvents = p > 0.8 ? 'none' : 'auto';
        } else {
          langRef.current.style.opacity = '1';
          langRef.current.style.pointerEvents = 'auto';
        }
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
      <div
        className="fixed inset-x-0 top-0 z-40 pointer-events-none"
        style={{
          opacity: showTopLayer ? 1 : 0,
          transition: 'opacity 700ms ease',
          willChange: 'opacity',
        }}
      >
        <div
          ref={topbarRef}
          className="absolute inset-x-0 top-0 h-24 bg-background/95 backdrop-blur-sm border-b border-border"
          style={{ opacity: 0 }}
        />

        {/* Language switcher — left on mobile, right (grouped with menu) on desktop */}
        <button
          ref={langRef}
          type="button"
          onClick={toggleLanguage}
          aria-label="Toggle language"
          className={`absolute top-8 left-8 md:left-auto md:right-[5.5rem] md:top-10 pt-1 text-sm md:text-[18px] font-light tracking-[0.08em] opacity-90 hover:opacity-70 transition pointer-events-auto ${textOnDark}`}
          style={{ textShadow: '0 1px 8px rgba(0,0,0,0.45)' }}
        >
          <span className={language === 'ka' ? 'opacity-100' : 'opacity-60'}>ქარ</span>
          <span className="opacity-60"> / </span>
          <span className={language === 'en' ? 'opacity-100' : 'opacity-60'}>EN</span>
        </button>

        {/* Hamburger — always top-right */}
        <div
          className={`absolute top-8 md:top-10 right-8 md:right-10 flex items-start gap-8 md:gap-10 pointer-events-auto transition-colors duration-300 ${textOnDark}`}
        >
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
          className={`absolute top-8 left-8 pointer-events-auto text-center md:text-left ${textOnDark} ${
            menuOpen ? 'blur-sm opacity-70' : 'blur-0 opacity-100'
          }`}
          style={{
            transformOrigin: 'top left',
            willChange: 'transform',
            transition: 'filter 500ms ease, opacity 500ms ease, color 300ms ease',
          }}
        >
          <h1
            className="text-[34px] md:text-[36px] lg:text-[42px] xl:text-[48px] 2xl:text-[56px] font-light tracking-[0.16em] leading-none whitespace-nowrap"
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              textShadow: docked ? 'none' : '0 2px 18px rgba(0,0,0,0.45)',
            }}
          >
            URBAN SPACE
          </h1>
          <span
            className={`mt-2 md:mt-3 block h-[2px] md:h-px w-24 md:w-32 mx-auto md:mx-0 transition-colors ${subtleBorderColor}`}
          />
          <p
            className={`mt-3 font-light tracking-[0.12em] opacity-95 ${
              language === 'ka'
                ? 'text-[11px] md:text-[13px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px]'
                : 'text-sm md:text-[13px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px]'
            }`}
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
            className={`block text-center font-light tracking-[0.2em] hover:opacity-70 transition-opacity whitespace-nowrap ${
              language === 'ka'
                ? 'text-[16px] md:text-[22px]'
                : 'text-[18px] md:text-[26px]'
            }`}
          >
            {exploreLabel}
          </Link>
        </div>

        {/* Down arrow — separate, positioned via JS (mobile bottom of vh, desktop near CTA) */}
        <button
          ref={arrowWrapRef}
          type="button"
          onClick={() =>
            window.scrollTo({
              top: window.scrollY + window.innerHeight,
              behavior: 'smooth',
            })
          }
          aria-label="Scroll down"
          className={`absolute left-1/2 -translate-x-1/2 pointer-events-auto text-center text-[22px] md:text-[20px] lg:text-[28px] font-light leading-none opacity-90 animate-[bounce_2.6s_ease-in-out_infinite] hover:opacity-100 transition-opacity ${textOnDark}`}
          style={{ top: 'auto' }}
        >
          <span ref={arrowRef} aria-hidden>
            ↓
          </span>
        </button>
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
                <Link
                  href="/projects"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center text-background/95 hover:text-background transition"
                >
                  <span className="text-[15px] md:text-[18px] font-light tracking-[0.22em]">
                    {language === 'ka' ? 'პროექტები' : 'PROJECTS'}
                  </span>
                </Link>

                <div className="mt-5 border-l border-background/20 pl-5 flex flex-col gap-3">
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

              <Link
                href="/studio"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center text-left text-background/95 hover:text-background transition"
              >
                <span className="text-[15px] md:text-[18px] font-light tracking-[0.22em]">
                  {language === 'ka' ? 'ჩვენ შესახებ' : 'ABOUT US'}
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
            <div className="flex flex-wrap items-center gap-8 text-[12px] md:text-[13px] font-light tracking-[0.16em] text-background/72">
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-background transition"
                >
                  INSTAGRAM
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-background transition"
                >
                  FACEBOOK
                </a>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
