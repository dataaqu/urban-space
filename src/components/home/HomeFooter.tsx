'use client';

import { useLocale } from 'next-intl';
import { MapPin, Phone } from 'lucide-react';

export default function HomeFooter() {
  const locale = useLocale();
  const language = locale as 'en' | 'ka';

  return (
    <footer
      id="contact"
      className="bg-secondary text-secondary-foreground border-t border-border"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-20 lg:py-28">
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-light tracking-[0.16em]">
            Urban Space
          </div>
          <p className="mt-3 text-[10px] md:text-xs font-light tracking-[0.2em] opacity-60">
            {language === 'ka'
              ? 'არქიტექტურა და ურბანული დაგეგმარება'
              : 'Architecture & Urban Planning'}
          </p>
        </div>

        <div className="mt-14 flex flex-col items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="flex items-center gap-3 text-sm md:text-base font-light opacity-90">
              <MapPin size={16} strokeWidth={1.25} className="shrink-0" />
              <span>
                {language === 'ka'
                  ? 'თბილისი, საბურთალო, ვაჟა-ფშაველას გამზ. 25'
                  : 'Tbilisi, Saburtalo, Vazha-Pshavela Ave. 25'}
              </span>
            </div>
            <a
              href="tel:+995555123456"
              className="flex items-center gap-3 text-sm md:text-base font-light hover:opacity-70 transition-opacity"
            >
              <Phone size={16} strokeWidth={1.25} />
              +995 555 123 456
            </a>
          </div>

          <div className="flex items-center gap-8">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-sm font-light tracking-[0.2em] uppercase hover:opacity-70 transition-opacity border-b border-secondary-foreground/30 pb-1"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-sm font-light tracking-[0.2em] uppercase hover:opacity-70 transition-opacity border-b border-secondary-foreground/30 pb-1"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-secondary-foreground/15 flex justify-center text-[10px] md:text-xs font-light tracking-[0.2em] opacity-60">
          <span>© 2026 Urban Space</span>
        </div>
      </div>
    </footer>
  );
}
