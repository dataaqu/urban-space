'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from 'framer-motion';

interface UseCounterOptions {
  start?: number;
  end: number;
  duration?: number;
  delay?: number;
  easing?: 'linear' | 'easeOut' | 'easeInOut' | 'spring';
  decimals?: number;
  suffix?: string;
  prefix?: string;
  onComplete?: () => void;
}

interface UseCounterReturn {
  count: string;
  ref: React.RefObject<HTMLDivElement | null>;
  isAnimating: boolean;
  reset: () => void;
}

// Easing functions
const easingFunctions = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  spring: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

/**
 * Custom hook for animated counters
 * Triggers animation when element comes into view
 */
export function useCounter(options: UseCounterOptions): UseCounterReturn {
  const {
    start = 0,
    end,
    duration = 2000,
    delay = 0,
    easing = 'easeOut',
    decimals = 0,
    suffix = '',
    prefix = '',
    onComplete,
  } = options;

  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const animationRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    if (hasAnimated) return;

    setIsAnimating(true);
    const startTime = performance.now();
    const easingFn = easingFunctions[easing];

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime - delay;

      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(step);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);
      const currentCount = start + (end - start) * easedProgress;

      setCount(currentCount);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        setIsAnimating(false);
        setHasAnimated(true);
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(step);
  }, [start, end, duration, delay, easing, hasAnimated, onComplete]);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInView, hasAnimated, animate]);

  const reset = useCallback(() => {
    setCount(start);
    setHasAnimated(false);
    setIsAnimating(false);
  }, [start]);

  const formattedCount = `${prefix}${count.toFixed(decimals)}${suffix}`;

  return {
    count: formattedCount,
    ref,
    isAnimating,
    reset,
  };
}

interface UseCountUpOptions {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

/**
 * Simplified counter hook with common defaults
 */
export function useCountUp(options: UseCountUpOptions): UseCounterReturn {
  return useCounter({
    start: 0,
    end: options.end,
    duration: options.duration || 2500,
    easing: 'easeOut',
    decimals: 0,
    suffix: options.suffix || '',
    prefix: options.prefix || '',
  });
}

/**
 * Counter hook for percentage values
 */
export function usePercentageCounter(
  end: number,
  duration: number = 2000
): UseCounterReturn {
  return useCounter({
    start: 0,
    end,
    duration,
    easing: 'easeOut',
    decimals: 0,
    suffix: '%',
  });
}

/**
 * Counter hook for currency values
 */
export function useCurrencyCounter(
  end: number,
  currency: string = '$',
  duration: number = 2500
): UseCounterReturn {
  return useCounter({
    start: 0,
    end,
    duration,
    easing: 'easeOut',
    decimals: 0,
    prefix: currency,
  });
}

/**
 * Counter hook for year display
 */
export function useYearCounter(
  startYear: number,
  endYear: number,
  duration: number = 1500
): UseCounterReturn {
  return useCounter({
    start: startYear,
    end: endYear,
    duration,
    easing: 'easeOut',
    decimals: 0,
  });
}
