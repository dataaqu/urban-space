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

  // The site header is sticky and its height varies by breakpoint, locale and
  // font loading. Measure it so the slide stage fills exactly the space below
  // it — otherwise the page slightly overflows and a scroll eats the top gap.
  const [stageHeight, setStageHeight] = useState<string>();
  // Pixel cap for the mobile image so the stack hugs the image (no letterbox
  // bands) and stays vertically centred with equal gaps for any aspect ratio.
  const [imgMaxH, setImgMaxH] = useState<number>();
  useEffect(() => {
    const update = () => {
      const header = document.querySelector('header');
      const h = header ? Math.round(header.getBoundingClientRect().height) : 0;
      // Use the real visible viewport instead of `100dvh`. On mobile the
      // address bar makes `dvh` resolve inconsistently depending on the scroll
      // state the page was entered from (the stage is overflow-hidden, so the
      // bar never settles here). That left the fixed CLOSE/dots misaligned with
      // the flowed content and produced an uneven bottom gap. visualViewport
      // reports the actual visible area, so the stage always fits exactly.
      const vh = Math.round(window.visualViewport?.height ?? window.innerHeight);
      setStageHeight(`${vh - h}px`);
      setImgMaxH(Math.round((vh - h) * 0.52));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.visualViewport?.removeEventListener('resize', update);
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
      className="h-[calc(100svh-56px)] md:h-[calc(100svh-80px)] overflow-hidden bg-background text-foreground"
      style={stageHeight ? { height: stageHeight } : undefined}
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
        <div className="fixed right-4 md:right-6 top-[42%] -translate-y-1/2 -mt-10 short-landscape:top-1/2 short-landscape:mt-0 z-30 flex flex-col gap-3">
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
      <div className="flex h-full w-full flex-col items-center justify-center px-6 pt-[48px] pb-[calc(48px+env(safe-area-inset-bottom))] md:justify-start md:pt-6 md:pb-5 short-landscape:justify-start short-landscape:pt-4 short-landscape:pb-3 short-landscape:pr-16">
        {/* Image stage — image centered, optional right-side text overlays empty right space on desktop */}
        <div className="relative flex w-full items-center justify-center shrink-0 min-h-0 md:h-auto md:flex-1 md:min-h-0 short-landscape:h-auto short-landscape:flex-1 short-landscape:min-h-0">
          {hasTwoImages ? (
            <>
              {/* Mobile portrait: each photo hugs its own size — no letterbox bands,
                  centered as a group, capped height so the pair never overflows. */}
              <div
                key={`m-${activeIndex}`}
                className="flex w-full flex-col items-center justify-center gap-3 md:hidden short-landscape:hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={page.mobileImage1 ?? page.image1}
                  alt={project.title}
                  style={imgMaxH ? { maxHeight: Math.round((imgMaxH - 12) / 2) } : undefined}
                  className="block h-auto w-auto max-w-full object-contain"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={page.mobileImage2 ?? (page.image2 as string)}
                  alt={project.title}
                  style={imgMaxH ? { maxHeight: Math.round((imgMaxH - 12) / 2) } : undefined}
                  className="block h-auto w-auto max-w-full object-contain"
                />
              </div>

              {/* Tablet / desktop / landscape: side-by-side, unchanged */}
              <div
                key={`d-${activeIndex}`}
                className="hidden md:flex short-landscape:flex md:flex-row short-landscape:flex-row h-full w-full items-center justify-center gap-6"
              >
                <div className="relative md:h-[84%] md:w-[48%] short-landscape:h-full short-landscape:w-[48%]">
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
                <div className="relative md:h-[84%] md:w-[48%] short-landscape:h-full short-landscape:w-[48%]">
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
            <>
              {/* Mobile portrait: intrinsic image hugs its own (capped) height
                  so the stack centres with equal top/bottom gaps for any aspect. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={`m-${activeIndex}`}
                src={page.mobileImage1 ?? page.image1}
                alt={project.title}
                style={imgMaxH ? { maxHeight: imgMaxH } : undefined}
                className="block h-auto w-auto max-w-full object-contain md:hidden short-landscape:hidden"
              />
              {/* Tablet / desktop / landscape: fill the flex stage (unchanged). */}
              <div
                key={`d-${activeIndex}`}
                className="relative hidden h-full w-full md:block short-landscape:block"
              >
                <ResponsiveProjectImage
                  src={page.image1}
                  mobileSrc={page.mobileImage1}
                  alt={project.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority={activeIndex === 0}
                />
              </div>
            </>
          ) : (
            <div className="w-full min-h-[200px] md:h-full bg-foreground/5 flex items-center justify-center text-foreground/45 text-sm">
              {isKa ? 'სურათი არ არის' : 'No image'}
            </div>
          )}

        </div>

        {/* Text block — fixed min-height so info button doesn't shift */}
        <div className="mt-6 md:mt-5 short-landscape:mt-2 text-center shrink-0 min-h-[80px] md:min-h-[64px] short-landscape:min-h-0 flex flex-col items-center justify-start">
          {activeIndex === 0 && (
            <>
              <h2
                className={`font-light tracking-[0.04em] text-foreground/90 short-landscape:text-[16px] ${
                  isKa ? 'text-[18px] md:text-[26px]' : 'text-[22px] md:text-[32px]'
                }`}
              >
                {project.title}
              </h2>
              {project.description && (
                <p
                  className={`mt-3 md:mt-4 short-landscape:mt-1 text-foreground/60 leading-relaxed max-w-[640px] short-landscape:text-[11px] ${
                    isKa ? 'text-[12px] md:text-[14px]' : 'text-[14px] md:text-[16px]'
                  }`}
                >
                  {project.description}
                </p>
              )}
            </>
          )}
        </div>

        {/* Info button */}
        <div className="shrink-0 flex items-center justify-center h-[60px] md:h-[56px] short-landscape:h-[40px] md:mt-4">
          {hasInfo && (
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              className="group inline-flex flex-col items-center text-foreground/70 hover:text-foreground transition"
            >
              <span className="text-[10px] md:text-[12px] short-landscape:text-[9px] font-light tracking-[0.22em] uppercase">
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

          <div className="flex-1 overflow-y-auto px-6 py-6 lg:pl-16 lg:pr-10 lg:pt-3 lg:pb-8 xl:pl-20">
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
