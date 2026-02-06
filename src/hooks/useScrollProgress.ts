'use client';

import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, RefObject } from 'react';

interface UseScrollProgressOptions {
  offset?: [string, string];
  smooth?: number;
}

interface UseScrollProgressReturn {
  ref: RefObject<HTMLDivElement | null>;
  scrollProgress: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}

/**
 * Custom hook for tracking scroll progress within an element
 * Useful for parallax effects and scroll-triggered animations
 */
export function useScrollProgress(
  options: UseScrollProgressOptions = {}
): UseScrollProgressReturn {
  const { offset = ['start end', 'end start'] } = options;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ['start end', 'end start'],
  });

  return {
    ref,
    scrollProgress: scrollYProgress,
    scrollYProgress,
  };
}

interface UseParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
  offset?: [string, string];
}

interface UseParallaxReturn {
  ref: RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
}

/**
 * Custom hook for creating parallax effects
 */
export function useParallax(
  options: UseParallaxOptions = {}
): UseParallaxReturn {
  const { speed = 50, direction = 'up', offset = ['start end', 'end start'] } = options;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ['start end', 'end start'],
  });

  const multiplier = direction === 'up' ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [speed * multiplier, -speed * multiplier]);

  return {
    ref,
    y,
  };
}

interface UseScrollFadeOptions {
  threshold?: number;
  offset?: [string, string];
}

interface UseScrollFadeReturn {
  ref: RefObject<HTMLDivElement | null>;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}

/**
 * Custom hook for fade-in effect on scroll
 */
export function useScrollFade(
  options: UseScrollFadeOptions = {}
): UseScrollFadeReturn {
  const { threshold = 0.3, offset = ['start end', 'end start'] } = options;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ['start end', 'end start'],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, threshold, 1 - threshold, 1],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    [0, threshold, 1 - threshold, 1],
    [30, 0, 0, -30]
  );

  return {
    ref,
    opacity,
    y,
  };
}

interface UseScrollScaleOptions {
  minScale?: number;
  maxScale?: number;
  offset?: [string, string];
}

interface UseScrollScaleReturn {
  ref: RefObject<HTMLDivElement | null>;
  scale: MotionValue<number>;
}

/**
 * Custom hook for scale effect on scroll
 */
export function useScrollScale(
  options: UseScrollScaleOptions = {}
): UseScrollScaleReturn {
  const { minScale = 0.8, maxScale = 1, offset = ['start end', 'center center'] } = options;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ['start end', 'center center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [minScale, maxScale]);

  return {
    ref,
    scale,
  };
}

/**
 * Hook for tracking global scroll position
 */
export function useGlobalScrollProgress() {
  const { scrollY, scrollYProgress } = useScroll();

  return {
    scrollY,
    scrollYProgress,
  };
}

/**
 * Custom hook for creating a header that changes on scroll
 */
export function useHeaderScroll(threshold: number = 50) {
  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, threshold],
    ['rgba(253, 249, 243, 0)', 'rgba(253, 249, 243, 0.95)']
  );

  const backdropBlur = useTransform(
    scrollY,
    [0, threshold],
    ['blur(0px)', 'blur(12px)']
  );

  const height = useTransform(
    scrollY,
    [0, threshold],
    ['5rem', '4rem']
  );

  const shadow = useTransform(
    scrollY,
    [0, threshold],
    ['0 0 0 0 rgba(0,0,0,0)', '0 4px 6px -1px rgba(0, 0, 0, 0.08)']
  );

  return {
    scrollY,
    backgroundColor,
    backdropBlur,
    height,
    shadow,
  };
}
