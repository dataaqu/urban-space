import { useEffect } from 'react';

/**
 * Detects horizontal swipes on touch devices to control the mobile menu.
 * - Right-to-left swipe  → `onOpen`
 * - Left-to-right swipe  → `onClose`
 * Only active when viewport width is < 1024px (mobile + tablet).
 * Ignores swipes that are mostly vertical (scrolling).
 */
export function useSwipeMenu(
  onOpen: () => void,
  onClose: () => void,
  enabled: boolean = true,
) {
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

      const isHorizontal = Math.abs(dx) > Math.abs(dy) * 1.5;
      if (!isHorizontal) return;

      if (dx < -60) {
        onOpen();
      } else if (dx > 60) {
        onClose();
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onOpen, onClose, enabled]);
}
