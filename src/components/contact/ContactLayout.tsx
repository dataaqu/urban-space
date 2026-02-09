'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

interface ContactLayoutProps {
  children: React.ReactNode;
}

export default function ContactLayout({ children }: ContactLayoutProps) {
  const nav = useTranslations('navigation');
  const pathname = usePathname();

  const isUrban = pathname.startsWith('/projects/urban');
  const isArchitecture = pathname.startsWith('/projects/architecture');

  return (
    <div className="min-h-screen bg-white flex flex-col -mt-16">
      {/* Header */}
      <header className="h-[60px] flex items-center justify-between px-6 md:px-[60px] border-b border-[#000000] bg-white sticky top-0 z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#000000] text-[16px] font-semibold tracking-[2px] font-sans">
            URBAN SPACE
          </span>
          <span className="w-[6px] h-5 bg-[#000000]" />
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center">
          <Link
            href="/projects/urban"
            className="flex flex-col items-center gap-1 px-5"
          >
            <span
              className={`text-[14px] font-sans transition-colors ${
                isUrban ? 'text-[#000000] font-medium' : 'text-[#666666] hover:text-[#333333]'
              }`}
            >
              {nav('urban')} {nav('projects').toLowerCase()}
            </span>
          </Link>

          <span className="text-[#999999] text-[14px] mx-1">|</span>

          <Link
            href="/projects/architecture"
            className="flex flex-col items-center gap-1 px-5"
          >
            <span
              className={`text-[14px] font-sans transition-colors ${
                isArchitecture ? 'text-[#000000] font-medium' : 'text-[#666666] hover:text-[#333333]'
              }`}
            >
              {nav('architecture')} {nav('projects').toLowerCase()}
            </span>
          </Link>
        </nav>

        {/* Language Switcher */}
        <LanguageSwitcher />
      </header>

      {/* Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Footer */}
      <footer className="h-[60px] flex items-center justify-end gap-20 px-10 md:px-[100px] bg-white">
        <Link href="/studio" className="flex flex-col items-center gap-1">
          <span className="block h-px bg-[#CCCCCC] w-20" />
          <span className="text-[14px] text-[#333333] font-sans">
            {nav('studio').toLowerCase()}
          </span>
        </Link>
        <Link href="/contact" className="flex flex-col items-center gap-1">
          <span className="block h-px bg-[#CCCCCC] w-20" />
          <span className="text-[14px] text-[#333333] font-sans">
            {nav('contact').toLowerCase()}
          </span>
        </Link>
      </footer>
    </div>
  );
}
