'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { X } from 'lucide-react';
import { useSwipeMenu } from '@/hooks/useSwipeMenu';

interface SocialLinks {
  facebook: string;
  instagram: string;
}

export default function SiteHeader({ social, hideBarOnMobile = false }: { social?: SocialLinks; hideBarOnMobile?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const language = locale as 'en' | 'ka';
  const socialLinks = social ?? { facebook: '', instagram: '' };

  const isProjects = pathname === '/projects' || pathname.startsWith('/projects/');
  const isStudio = pathname === '/studio' || pathname.startsWith('/studio/');
  const isContact = pathname === '/contact';

  const searchParams = useSearchParams();
  const activeCategory = searchParams?.get('category');
  const isArchActive = isProjects && activeCategory === 'ARCHITECTURE';
  const isUrbanActive = isProjects && activeCategory === 'URBAN';

  const [menuOpen, setMenuOpen] = useState(false);

  useSwipeMenu(() => setMenuOpen(true), () => setMenuOpen(false));

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ka' : 'en';
    router.replace(pathname, { locale: next });
  };

  return (
    <>
      <header className={`sticky top-0 z-50 border-b border-foreground/10 bg-background/90 px-8 py-4 backdrop-blur-md md:px-10 md:py-5 short-landscape:!py-2${hideBarOnMobile ? ' hidden lg:block' : ''}`}>
        <div className="flex w-full items-center justify-between gap-6">
          <Link href="/" className="group relative top-[10px] block">
            <div
              style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
              className="text-[15px] font-light leading-none tracking-[0.16em] transition group-hover:text-foreground/60 md:text-[19.8px] lg:text-[23.1px] xl:text-[28.6px] 2xl:text-[30.8px] short-landscape:!text-[16px]"
            >
              URBAN SPACE
            </div>
            {/* Tablet-only divider (matches urbanspace-mobile); hidden on mobile and desktop */}
            <span className="hidden md:block mt-[6.6px] h-px w-[70.4px] bg-foreground/60 short-landscape:!hidden" />
            <div className="hidden md:block mt-[6.6px] text-[10px] font-light tracking-[0.08em] text-foreground/75 transition group-hover:text-foreground/45 md:text-[7.15px] lg:text-[8.25px] xl:text-[8.8px] 2xl:text-[9.9px] short-landscape:!hidden">
              {language === 'ka'
                ? 'არქიტექტურა და ურბანული დაგეგმარება'
                : 'Architecture & urban planning'}
            </div>
          </Link>

          <nav
            className={`absolute left-1/2 top-[10px] xl:top-3 mt-[10px] hidden -translate-x-1/2 items-start gap-8 xl:gap-10 2xl:gap-12 tracking-[0.06em] lg:flex ${
              language === 'ka'
                ? 'text-[13px] xl:text-[14px] 2xl:text-[16px]'
                : 'text-[15px] xl:text-[17px] 2xl:text-[17px]'
            }`}
          >
            <div className="relative flex flex-col items-start">
              <Link
                href="/projects"
                className={`flex h-8 xl:h-9 2xl:h-10 items-end leading-none transition hover:text-foreground/75 ${
                  isProjects ? 'text-foreground font-medium' : 'text-foreground/45'
                }`}
              >
                {language === 'ka' ? 'პროექტები' : 'Projects'}
              </Link>
              {isProjects && (
                <div
                  className="absolute left-0 top-full mt-[11px] flex items-baseline gap-3 font-light tracking-[0.08em] leading-none text-[12px] xl:text-[13px] 2xl:text-[15px]"
                >
                  <Link
                    href={isArchActive ? '/projects' : '/projects?category=ARCHITECTURE'}
                    className={`flex flex-col items-start transition hover:text-foreground ${
                      isArchActive ? 'text-foreground' : 'text-foreground/55'
                    }`}
                  >
                    <span>{language === 'ka' ? 'არქიტექტურა' : 'Architecture'}</span>
                    <span
                      className={`mt-1 h-px bg-foreground/60 transition-all duration-300 ${
                        isArchActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                      }`}
                    />
                  </Link>
                  <span className="text-foreground/40">-</span>
                  <Link
                    href={isUrbanActive ? '/projects' : '/projects?category=URBAN'}
                    className={`flex flex-col items-start transition hover:text-foreground ${
                      isUrbanActive ? 'text-foreground' : 'text-foreground/55'
                    }`}
                  >
                    <span>{language === 'ka' ? 'ურბანული' : 'Urban'}</span>
                    <span
                      className={`mt-1 h-px bg-foreground/60 transition-all duration-300 ${
                        isUrbanActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                      }`}
                    />
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/studio"
              className={`flex h-8 xl:h-9 2xl:h-10 items-end leading-none transition hover:text-foreground/75 ${
                isStudio ? 'text-foreground font-medium' : 'text-foreground/45'
              }`}
            >
              {language === 'ka' ? 'ჩვენ შესახებ' : 'About'}
            </Link>
            <Link
              href="/contact"
              className={`flex h-8 xl:h-9 2xl:h-10 items-end leading-none transition hover:text-foreground/75 ${
                isContact ? 'text-foreground font-medium' : 'text-foreground/45'
              }`}
            >
              {language === 'ka' ? 'კონტაქტი' : 'Contact'}
            </Link>
          </nav>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={toggleLanguage}
              className="hidden md:inline-block pt-1 text-sm tracking-[0.05em] text-foreground/80 transition hover:text-foreground/55 md:text-base"
              aria-label="Toggle language"
            >
              <span className={language === 'ka' ? 'text-foreground' : ''}>ქარ</span>
              <span className="text-foreground/45">/</span>
              <span className={language === 'en' ? 'text-foreground' : ''}>EN</span>
            </button>

            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
              className="group relative mt-1 flex h-5 w-5 flex-col justify-between lg:hidden"
            >
              <span
                className={`block h-[1px] w-full bg-foreground/80 transition ${
                  menuOpen ? 'translate-y-[9px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-[1px] w-full bg-foreground/80 transition ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-[1px] w-full bg-foreground/80 transition ${
                  menuOpen ? '-translate-y-[9px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Side menu backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 transition-opacity duration-500 lg:hidden ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(0, 0, 0, 0.28)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] text-background shadow-elegant transition-transform duration-500 ease-out lg:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'rgba(20, 20, 20, 0.72)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-end gap-8 px-8 pt-8">
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="text-sm font-light tracking-[0.08em] text-background/85 hover:text-background transition"
            >
              <span className={language === 'ka' ? 'text-background' : 'text-background/60'}>ქარ</span>
              <span className="text-background/60"> / </span>
              <span className={language === 'en' ? 'text-background' : 'text-background/60'}>EN</span>
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

          <nav className="flex-1 flex flex-col justify-center px-8">
            <div className="space-y-8">
              <div>
                <Link
                  href="/projects"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center text-background/95 hover:text-background transition"
                >
                  <span className="text-[15px] font-light tracking-[0.22em]">
                    {language === 'ka' ? 'პროექტები' : 'PROJECTS'}
                  </span>
                </Link>

                <div className="mt-5">
                  <div className="overflow-hidden">
                    <div className="border-l border-background/20 pl-5 flex flex-col gap-3">
                      <Link
                        href="/projects?category=ARCHITECTURE"
                        onClick={() => setMenuOpen(false)}
                        className="text-[15px] font-light tracking-[0.03em] text-background/72 hover:text-background transition"
                      >
                        {language === 'ka' ? 'არქიტექტურა' : 'Architecture'}
                      </Link>

                      <Link
                        href="/projects?category=URBAN"
                        onClick={() => setMenuOpen(false)}
                        className="text-[15px] font-light tracking-[0.03em] text-background/72 hover:text-background transition"
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
                <span className="text-[15px] font-light tracking-[0.22em]">
                  {language === 'ka' ? 'ჩვენ შესახებ' : 'ABOUT US'}
                </span>
              </Link>

              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center text-left text-background/95 hover:text-background transition"
              >
                <span className="text-[15px] font-light tracking-[0.22em]">
                  {language === 'ka' ? 'კონტაქტი' : 'CONTACT'}
                </span>
              </Link>
            </div>
          </nav>

          <div className="px-8 pb-8">
            <div className="flex flex-wrap items-center gap-8 text-[12px] font-light tracking-[0.16em] text-background/72">
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
