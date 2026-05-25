'use client';

import { useLocale } from 'next-intl';
import { MapPin, Phone } from 'lucide-react';

// lucide-react 1.x dropped brand icons, so the Facebook/Instagram marks are
// inlined here in the same stroke style (viewBox 24, currentColor).
function FacebookIcon({ size = 16, strokeWidth = 1.25 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ size = 16, strokeWidth = 1.25 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

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
          <div className="text-lg md:text-xl font-light tracking-[0.16em]">
            Urban Space
          </div>
          <p className="mt-2 text-[9px] md:text-[10px] font-light tracking-[0.2em] opacity-60">
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
              className="flex items-center gap-2 text-sm font-light tracking-[0.2em] uppercase hover:opacity-70 transition-opacity border-b border-secondary-foreground/30 pb-1"
            >
              <FacebookIcon size={16} strokeWidth={1.25} />
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center gap-2 text-sm font-light tracking-[0.2em] uppercase hover:opacity-70 transition-opacity border-b border-secondary-foreground/30 pb-1"
            >
              <InstagramIcon size={16} strokeWidth={1.25} />
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
