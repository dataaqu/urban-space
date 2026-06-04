'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

/**
 * Fullscreen image viewer. Opens with a fade + zoom-in animation, shows the
 * whole image fit to the screen (object-contain, uncropped), and closes on the
 * X button, a backdrop click, or Escape. Clicking the image itself does NOT
 * close it. Rendered only while a src is set by the parent.
 */
export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  // Drives the enter/exit transition. Starts hidden, flips on after mount.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Animate out, then unmount once the transition has finished.
  const close = useCallback(() => {
    setVisible(false);
    const t = window.setTimeout(onClose, 300);
    return () => window.clearTimeout(t);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  // Render at <body> via a portal so it escapes the project detail <main>'s
  // own stacking context (z-10) — otherwise the site header (z-50) would punch
  // through the top of the overlay.
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={close}
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity duration-300 ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        aria-label="Close"
        className="fixed right-4 top-4 md:right-6 md:top-6 z-[51] text-black/70 hover:text-black transition"
      >
        <X className="h-7 w-7" strokeWidth={1.25} />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative h-[92vh] w-[94vw] transition-transform duration-300 ease-out ${
          visible ? 'scale-100' : 'scale-[0.92]'
        }`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-contain select-none"
          priority
        />
      </div>
    </div>,
    document.body,
  );
}
