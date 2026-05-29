'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { X } from 'lucide-react';
import { Link } from '@/i18n/routing';
import ResponsiveProjectImage from './ResponsiveProjectImage';

interface PageData {
  id: string;
  type: 'SINGLE_IMAGE' | 'DOUBLE_IMAGE' | 'IMAGE_ONLY';
  order: number;
  image1: string;
  image2: string | null;
  mobileImage1: string | null;
  mobileImage2: string | null;
  textRightKa: string | null;
  textRightEn: string | null;
  metaInfoKa: string | null;
  metaInfoEn: string | null;
}

function RichTextBlock({ html, withGap }: { html: string; withGap: boolean }) {
  // html is already DOMPurify-sanitized upstream before reaching this component
  return (
    <div
      className={`prose prose-sm md:prose-base max-w-none break-words ${
        withGap ? 'mt-12' : ''
      }`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function htmlHasContent(html: string | null | undefined): boolean {
  if (!html) return false;
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim().length > 0;
}

interface ProjectDetailClientProps {
  locale: string;
  project: {
    id: string;
    title: string;
    description: string | null;
    pages: PageData[];
  };
}

export default function ProjectDetailClient({ locale, project }: ProjectDetailClientProps) {
  const totalPages = project.pages.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);

  const activeIndexRef = useRef(0);
  const lockRef = useRef(false);
  const infoOpenRef = useRef(false);
  const asideRef = useRef<HTMLElement>(null);

  // The sticky header's height varies by breakpoint, locale and font loading.
  // Measure only that (it's stable — it doesn't depend on the iOS toolbar) so
  // the fixed stage can start exactly below it. The stage itself is
  // `position: fixed` (top below header → bottom 0), so it always spans the
  // visible area no matter the toolbar state or the scroll position the page was
  // entered from. No viewport-height math, so nothing drifts between entries.
  const [headerH, setHeaderH] = useState<number>();
  useEffect(() => {
    const update = () => {
      const header = document.querySelector('header');
      setHeaderH(header ? Math.round(header.getBoundingClientRect().height) : 0);
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  // Pin the detail view to the top and freeze the document scroll for the whole
  // time this page is mounted. The site `<body>` is `min-h-screen` (`100vh` =
  // iOS *large* viewport), while the stage is sized to the *small* viewport, so
  // the page is scrollable by exactly the toolbar's height. Entering from a
  // scrolled list left the toolbar in a different state each time, shifting the
  // whole layout. Locking scroll at the top removes that variability — the photo
  // now lands in the same place no matter where you came from.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    window.scrollTo(0, 0);
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  const isKa = locale === 'ka';
  const closeLabel = isKa ? 'დახურვა' : 'Close';
  const infoLabel = isKa ? 'პროექტის ინფორმაცია' : 'Project Information';

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    infoOpenRef.current = infoOpen;
  }, [infoOpen]);

  // Use `inert` (not aria-hidden) on the closed drawer so its focusable
  // children can't retain focus or be tabbed into while it's off-screen.
  // Toggled imperatively because React 18 has no typed `inert` JSX prop.
  useEffect(() => {
    const el = asideRef.current;
    if (!el) return;
    if (infoOpen) el.removeAttribute('inert');
    else el.setAttribute('inert', '');
  }, [infoOpen]);

  // Body scroll lock + ESC close when drawer is open
  useEffect(() => {
    if (!infoOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInfoOpen(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [infoOpen]);

  // Slide navigation — wheel, touch, keyboard
  useEffect(() => {
    if (totalPages <= 1) return;

    const change = (dir: 1 | -1) => {
      if (lockRef.current) return;
      if (infoOpenRef.current) return;
      const next = activeIndexRef.current + dir;
      if (next < 0 || next >= totalPages) return;
      lockRef.current = true;
      activeIndexRef.current = next;
      setActiveIndex(next);
      window.setTimeout(() => {
        lockRef.current = false;
      }, 450);
    };

    let touchStartY = 0;

    const onWheel = (e: WheelEvent) => {
      if (infoOpenRef.current) return;
      e.preventDefault();
      if (Math.abs(e.deltaY) < 10) return;
      change(e.deltaY > 0 ? 1 : -1);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (infoOpenRef.current) return;
      e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (infoOpenRef.current) return;
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const diff = touchStartY - endY;
      if (Math.abs(diff) < 40) return;
      change(diff > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (infoOpenRef.current) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        change(1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        change(-1);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
    };
  }, [totalPages]);

  if (totalPages === 0) {
    return (
      <main className="h-screen overflow-hidden bg-background text-foreground flex items-center justify-center">
        <p className="text-foreground/45 text-sm">
          {isKa ? 'პროექტს გვერდები არ აქვს' : 'No pages'}
        </p>
      </main>
    );
  }

  const page = project.pages[activeIndex];
  const metaInfoPage =
    project.pages.find((p) =>
      htmlHasContent(isKa ? p.metaInfoKa : p.metaInfoEn),
    ) ?? page;
  const rawMetaInfo =
    (isKa ? metaInfoPage.metaInfoKa : metaInfoPage.metaInfoEn) || '';
  const metaInfoHtml = useMemo(() => DOMPurify.sanitize(rawMetaInfo), [rawMetaInfo]);
  const hasTwoImages = page.type === 'DOUBLE_IMAGE' && !!page.image2;
  const textPage =
    project.pages.find((p) =>
      ((isKa ? p.textRightKa : p.textRightEn)?.trim() ?? '').length > 0,
    ) ?? page;
  const rawPageText =
    (isKa ? textPage.textRightKa : textPage.textRightEn)?.trim() || '';
  const pageTextHtml = useMemo(() => DOMPurify.sanitize(rawPageText), [rawPageText]);
  const hasInfo = metaInfoHtml.length > 0 || pageTextHtml.length > 0;

  return (
    <main
      className="fixed left-0 right-0 bottom-0 top-14 md:top-20 z-10 overflow-hidden bg-background text-foreground"
      style={headerH != null ? { top: headerH } : undefined}
    >
      {/* Close link */}
      <Link
        href="/projects"
        aria-label={closeLabel}
        className="fixed right-4 top-[72px] md:right-8 md:top-[130px] short-landscape:top-[120px] z-20 text-[10px] md:text-[12px] short-landscape:text-[9px] font-light tracking-[0.22em] uppercase text-foreground/85 hover:text-foreground transition"
      >
        {closeLabel}
      </Link>

      {/* Pagination dots */}
      {totalPages > 1 && (
        <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 short-landscape:top-1/2 short-landscape:mt-0 z-30 flex flex-col gap-3">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (lockRef.current) return;
                lockRef.current = true;
                activeIndexRef.current = i;
                setActiveIndex(i);
                window.setTimeout(() => {
                  lockRef.current = false;
                }, 450);
              }}
              aria-label={`Slide ${i + 1}`}
              className={`h-1 w-1 rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? 'bg-foreground scale-125'
                  : 'bg-foreground/30 hover:bg-foreground/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* Center stack */}
      <div className="flex h-full w-full flex-col items-center justify-start px-6 pt-[48px] pb-[calc(48px+env(safe-area-inset-bottom))] md:pt-6 md:pb-5 short-landscape:justify-start short-landscape:pt-4 short-landscape:pb-3 short-landscape:pr-16">
        {/* Image stage — image centered, optional right-side text overlays empty right space on desktop */}
        <div className="relative flex w-full items-center justify-center flex-1 min-h-0 short-landscape:h-auto short-landscape:flex-1 short-landscape:min-h-0">
          {hasTwoImages ? (
            <>
              {/* Mobile + tablet (<lg) portrait: stacked vertically, each half fills
                  and contains, so the pair centres identically on every device. */}
              <div
                key={`m-${activeIndex}`}
                className="flex h-full w-full flex-col items-center justify-center gap-3 pt-[8vh] md:w-[60%] lg:hidden short-landscape:hidden"
              >
                <div className="relative w-full flex-1 min-h-0">
                  <ResponsiveProjectImage
                    src={page.image1}
                    mobileSrc={page.mobileImage1}
                    alt={project.title}
                    fill
                    switchAt="lg"
                    className="object-contain"
                    sizes="100vw"
                    priority={activeIndex === 0}
                  />
                </div>
                <div className="relative w-full flex-1 min-h-0">
                  <ResponsiveProjectImage
                    src={page.image2 as string}
                    mobileSrc={page.mobileImage2}
                    alt={project.title}
                    fill
                    switchAt="lg"
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              </div>

              {/* Desktop (lg) + landscape: side-by-side, unchanged look */}
              <div
                key={`d-${activeIndex}`}
                className="hidden lg:flex short-landscape:flex lg:flex-row short-landscape:flex-row h-full w-full items-center justify-center gap-6"
              >
                <div className="relative lg:h-[84%] lg:w-[48%] short-landscape:h-full short-landscape:w-[48%]">
                  <ResponsiveProjectImage
                    src={page.image1}
                    mobileSrc={page.mobileImage1}
                    alt={project.title}
                    fill
                    className="object-contain"
                    sizes="40vw"
                    priority={activeIndex === 0}
                  />
                </div>
                <div className="relative lg:h-[84%] lg:w-[48%] short-landscape:h-full short-landscape:w-[48%]">
                  <ResponsiveProjectImage
                    src={page.image2 as string}
                    mobileSrc={page.mobileImage2}
                    alt={project.title}
                    fill
                    className="object-contain"
                    sizes="40vw"
                  />
                </div>
              </div>
            </>
          ) : page.image1 ? (
            <div
              key={`d-${activeIndex}`}
              className="flex h-full w-full items-center justify-center pt-[8vh] lg:pt-0"
            >
              <div
                className={`relative h-full w-full md:w-[72%] ${
                  activeIndex === 0 ? 'lg:h-full lg:w-full' : 'lg:h-[82%] lg:w-[82%]'
                }`}
              >
                <ResponsiveProjectImage
                  src={page.image1}
                  mobileSrc={page.mobileImage1}
                  alt={project.title}
                  fill
                  switchAt="lg"
                  className="object-contain"
                  sizes="100vw"
                  priority={activeIndex === 0}
                />
              </div>
            </div>
          ) : (
            <div className="w-full min-h-[200px] md:h-full bg-foreground/5 flex items-center justify-center text-foreground/45 text-sm">
              {isKa ? 'სურათი არ არის' : 'No image'}
            </div>
          )}

        </div>

        {/* Text block — fixed min-height so info button doesn't shift */}
        <div
          className={`mt-6 lg:mt-5 short-landscape:mt-2 text-center shrink-0 min-h-[80px] short-landscape:min-h-0 flex flex-col items-center justify-start ${
            activeIndex === 0 ? 'lg:min-h-[64px]' : 'lg:min-h-0'
          }`}
        >
          {activeIndex === 0 && (
            <>
              <h2
                className={`font-light tracking-[0.04em] text-foreground/90 short-landscape:text-[16px] ${
                  isKa ? 'text-[18px] lg:text-[26px]' : 'text-[22px] lg:text-[32px]'
                }`}
              >
                {project.title}
              </h2>
              {project.description && (
                <p
                  className={`mt-3 lg:mt-4 short-landscape:mt-1 text-foreground/60 leading-relaxed max-w-[640px] short-landscape:text-[11px] ${
                    isKa ? 'text-[12px] lg:text-[14px]' : 'text-[14px] lg:text-[16px]'
                  }`}
                >
                  {project.description}
                </p>
              )}
            </>
          )}
        </div>

        {/* Info button */}
        <div
          className={`shrink-0 flex items-center justify-center h-[60px] lg:h-[56px] short-landscape:h-[40px] ${
            activeIndex === 0
              ? 'lg:mt-4'
              : 'lg:absolute lg:inset-x-0 lg:bottom-5'
          }`}
        >
          {hasInfo && (
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              className="group inline-flex flex-col items-center text-foreground/70 hover:text-foreground transition"
            >
              <span className="text-[10px] lg:text-[12px] short-landscape:text-[9px] font-light tracking-[0.22em] uppercase">
                {infoLabel}
              </span>
              <span className="mt-2 h-px w-10 bg-foreground/60 transition-all duration-300 group-hover:w-16" />
            </button>
          )}
        </div>
      </div>

      {/* Drawer backdrop — dark on mobile, transparent on desktop, both close on click */}
      <div
        onClick={() => setInfoOpen(false)}
        className={`fixed inset-0 lg:top-[96px] z-20 transition-opacity duration-500 ${
          infoOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer — slides from bottom on mobile, from left on desktop */}
      <aside
        ref={asideRef}
        className={`fixed inset-x-0 top-14 bottom-0 z-30 md:top-20 lg:inset-x-auto lg:left-0 lg:top-[96px] lg:bottom-0 lg:h-[calc(100vh-96px)] lg:w-[500px] bg-background text-foreground shadow-elegant transition-transform duration-500 ease-out ${
          infoOpen
            ? 'translate-y-0 lg:translate-x-0'
            : 'translate-y-full lg:translate-y-0 lg:-translate-x-full'
        }`}
      >
        <div className="relative flex h-full flex-col">
          <div className="flex justify-center pt-3 lg:hidden">
            <span className="h-1 w-10 rounded-full bg-foreground/20" />
          </div>

          <div className="flex items-center justify-end px-6 lg:px-10 pt-3 lg:pt-4">
            <button
              type="button"
              onClick={() => setInfoOpen(false)}
              aria-label="Close"
              className="text-foreground/70 hover:text-foreground transition"
            >
              <X className="h-5 w-5" strokeWidth={1} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto lg:overflow-hidden px-6 py-6 lg:pl-16 lg:pr-10 lg:pt-3 lg:pb-8 xl:pl-20">
            <div
              className={`max-w-[720px] mx-auto lg:mx-0 text-foreground/75 leading-relaxed font-light ${
                isKa ? 'text-[13px] lg:text-[15px]' : 'text-[14px] lg:text-[16px]'
              }`}
            >
              {metaInfoHtml && <RichTextBlock html={metaInfoHtml} withGap={false} />}
              {pageTextHtml && (
                <RichTextBlock
                  html={pageTextHtml}
                  withGap={metaInfoHtml.length > 0}
                />
              )}
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
