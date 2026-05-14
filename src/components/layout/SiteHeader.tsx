'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Minus, Plus, X } from 'lucide-react';
import { useSwipeMenu } from '@/hooks/useSwipeMenu';

interface SocialLinks {
  facebook: string;
  instagram: string;
}

export default function SiteHeader({ social }: { social?: SocialLinks }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const language = locale as 'en' | 'ka';
  const socialLinks = social ?? { facebook: '', instagram: '' };

  const isProjects = pathname === '/projects' || pathname.startsWith('/projects/');
  const isStudio = pathname === '/studio' || pathname.startsWith('/studio/');
  const isContact = pathname === '/contact';

  const [menuOpen, setMenuOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(true);

  useSwipeMenu(() => setMenuOpen(true), !menuOpen);

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ka' : 'en';
    router.replace(pathname, { locale: next });
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/85 px-8 py-4 backdrop-blur-md md:px-10 md:py-5 lg:px-16 xl:px-20">
        <div className="flex w-full items-center justify-between gap-6">
          <Link href="/" className="group block">
            <div className="text-[15px] font-light leading-none tracking-[0.16em] transition group-hover:text-foreground/60 md:text-[32px]">
              URBAN SPACE
            </div>
            <div className="hidden md:block mt-1.5 text-[10px] tracking-[0.08em] text-foreground/75 transition group-hover:text-foreground/45 md:text-[12px]">
              {language === 'ka'
                ? 'არქიტექტურა და ურბანული დაგეგმარება'
                : 'Architecture & urban planning'}
            </div>
          </Link>

          <nav
            className={`absolute left-1/2 top-[38%] hidden -translate-x-1/2 -translate-y-1/2 items-start gap-12 tracking-[0.06em] md:flex ${
              language === 'ka' ? 'text-[14px]' : 'text-[17px]'
            }`}
          >
            <Link
              href="/projects"
              className={`self-start transition hover:text-foreground/75 ${
                isProjects ? 'text-foreground font-medium' : 'text-foreground/45'
              }`}
            >
              {language === 'ka' ? 'პროექტები' : 'Projects'}
            </Link>
            <Link
              href="/studio"
              className={`self-start transition hover:text-foreground/75 ${
                isStudio ? 'text-foreground font-medium' : 'text-foreground/45'
              }`}
            >
              {language === 'ka' ? 'ჩვენ შესახებ' : 'About Us'}
            </Link>
            <Link
              href="/contact"
              className={`self-start transition hover:text-foreground/75 ${
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
              className="group relative mt-1 flex h-5 w-5 flex-col justify-between md:hidden"
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
        className={`fixed inset-0 z-40 transition-opacity duration-500 md:hidden ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(0, 0, 0, 0.28)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] text-background shadow-elegant transition-transform duration-500 ease-out md:hidden ${
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
                <button
                  type="button"
                  onClick={() => setProjectsOpen((v) => !v)}
                  className="w-full flex items-center justify-between text-background/95 hover:text-background transition"
                >
                  <span className="text-[15px] font-light tracking-[0.22em]">
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
