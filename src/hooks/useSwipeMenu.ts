import { useEffect } from 'react';

/**
 * Detects horizontal swipes on touch devices to control the mobile menu.
 * - Right-to-left swipe  → `onOpen`
 * - Left-to-right swipe  → `onClose`
 * Only active when viewport width is < 1024px (mobile + tablet).
 *
 * The decision is made during `touchmove` (as soon as the horizontal
 * threshold is crossed) rather than on `touchend`. Real mobile browsers
 * frequently fire `touchcancel` — and skip `touchend` — once a gesture is
 * claimed by the compositor for scrolling/navigation, so a touchend-only
 * detector silently fails on phones while still working under desktop touch
 * emulation. Deciding on move makes the gesture fire reliably.
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
    let decided = false;

    const isMobileOrTablet = () => window.innerWidth < 1024;

    const onTouchStart = (e: TouchEvent) => {
      if (!isMobileOrTablet() || e.touches.length !== 1) {
        tracking = false;
        return;
      }
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      tracking = true;
      decided = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tracking || decided) return;
      const t = e.touches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      // Movement has committed to vertical → it's a scroll, stop tracking.
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 30) {
        tracking = false;
        return;
      }

      // Horizontal swipe past threshold → fire once for this gesture.
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
        decided = true;
        if (dx < 0) {
          onOpen();
        } else {
          onClose();
        }
      }
    };

    const onTouchEnd = () => {
      tracking = false;
      decided = false;
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [onOpen, onClose, enabled]);
}
