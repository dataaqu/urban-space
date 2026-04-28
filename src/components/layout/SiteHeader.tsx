'use client';

import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link, usePathname, useRouter } from '@/i18n/routing';

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const language = locale as 'en' | 'ka';

  const isProjects = pathname === '/projects' || pathname.startsWith('/projects/');
  const isStudio = pathname === '/studio' || pathname.startsWith('/studio/');
  const isContact = pathname === '/contact';
  const activeCategory = searchParams.get('category');

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ka' : 'en';
    router.replace(pathname, { locale: next });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/85 px-3 py-4 backdrop-blur-md md:px-4 md:py-5">
      <div className="flex w-full items-center justify-between gap-6">
        <Link href="/" className="group block">
          <div className="text-[22px] font-light leading-none tracking-[0.16em] transition group-hover:text-foreground/60 md:text-[32px]">
            URBAN SPACE
          </div>
          <div className="mt-1.5 text-[10px] tracking-[0.08em] text-foreground/75 transition group-hover:text-foreground/45 md:text-[12px]">
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
          <div className="relative flex flex-col items-start gap-2">
            <Link
              href="/projects"
              className={`transition hover:text-foreground/60 ${
                isProjects ? 'text-foreground font-medium' : 'text-foreground/90'
              }`}
            >
              {language === 'ka' ? 'პროექტები' : 'Projects'}
            </Link>
            <div
              className={`absolute left-0 top-full mt-2 flex items-center gap-2 whitespace-nowrap tracking-[0.08em] ${
                language === 'ka'
                  ? 'text-[10px] md:text-[11px]'
                  : 'text-[12px] md:text-[13px]'
              }`}
            >
              <Link
                href="/projects?category=ARCHITECTURE"
                className={`transition hover:text-foreground/80 ${
                  isProjects && activeCategory === 'ARCHITECTURE'
                    ? 'text-foreground font-medium'
                    : 'text-foreground/45'
                }`}
              >
                {language === 'ka' ? 'არქიტექტურა' : 'Architecture'}
              </Link>
              <span className="text-foreground/45">-</span>
              <Link
                href="/projects?category=URBAN"
                className={`transition hover:text-foreground/80 ${
                  isProjects && activeCategory === 'URBAN'
                    ? 'text-foreground font-medium'
                    : 'text-foreground/45'
                }`}
              >
                {language === 'ka' ? 'ურბანული' : 'Urban'}
              </Link>
            </div>
          </div>
          <Link
            href="/studio"
            className={`self-start transition hover:text-foreground/75 ${
              isStudio ? 'text-foreground font-medium' : 'text-foreground/45'
            }`}
          >
            {language === 'ka' ? 'ჩვენ შესახებ' : 'About'}
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

        <button
          type="button"
          onClick={toggleLanguage}
          className="pt-1 text-sm tracking-[0.05em] text-foreground/80 transition hover:text-foreground/55 md:text-base"
          aria-label="Toggle language"
        >
          <span className={language === 'ka' ? 'text-foreground' : ''}>ქარ</span>
          <span className="text-foreground/45">/</span>
          <span className={language === 'en' ? 'text-foreground' : ''}>EN</span>
        </button>
      </div>
    </header>
  );
}
