'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface StudioOverlayContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const StudioOverlayContext = createContext<StudioOverlayContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export function useStudioOverlay() {
  return useContext(StudioOverlayContext);
}

export function StudioOverlayProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <StudioOverlayContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
      <StudioOverlay />
    </StudioOverlayContext.Provider>
  );
}

const navLinks = [
  { href: '/studio', key: 'about' },
  { href: '/studio/team', key: 'team' },
  { href: '/studio/partners', key: 'partners' },
  { href: '/services', key: 'services' },
] as const;

function StudioOverlay() {
  const { isOpen, close } = useStudioOverlay();
  const nav = useTranslations('navigation');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md"
        >
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-6 right-6 md:top-8 md:right-12 w-10 h-10 flex items-center justify-center"
            aria-label="Close"
          >
            <div className="w-6 h-6 relative">
              <span className="absolute top-1/2 left-0 w-full h-[1.5px] bg-[#0A0A0A] rotate-45" />
              <span className="absolute top-1/2 left-0 w-full h-[1.5px] bg-[#0A0A0A] -rotate-45" />
            </div>
          </button>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            className="flex items-center gap-3 mb-12"
          >
            <span className="text-[#0A0A0A] text-2xl font-semibold tracking-[0.2em] font-sans">
              URBAN SPACE
            </span>
            <span className="w-2 h-7 rounded-sm bg-[#0A0A0A]" />
          </motion.div>

          {/* Navigation Links */}
          <nav className="flex flex-col items-center gap-6">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.19, 1, 0.22, 1] }}
              >
                <Link
                  href={link.href}
                  onClick={close}
                  className="text-[#333333] text-lg md:text-xl font-sans font-medium tracking-wide hover:text-[#0A0A0A] transition-colors duration-300"
                >
                  {nav(link.key)}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
