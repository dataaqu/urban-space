import { useEffect } from 'react';

/**
 * Detects a right-to-left horizontal swipe on touch devices and triggers `onOpen`.
 * Only active when viewport width is < 1024px (mobile + tablet).
 * Ignores swipes that are mostly vertical (scrolling).
 */
export function useSwipeMenu(onOpen: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    let startX = 0;
    let startY = 0;
    let tracking = false;

    const isMobileOrTablet = () => window.innerWidth < 1024;

    const onTouchStart = (e: TouchEvent) => {
      if (!isMobileOrTablet()) return;
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      tracking = true;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (dx < -60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        onOpen();
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onOpen, enabled]);
}
