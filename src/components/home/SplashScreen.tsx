'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';

interface SplashScreenProps {
  onComplete?: () => void;
}

const STORAGE_KEY = 'urban-space:splash-shown';

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'idle' | 'visible' | 'fading'>('idle');
  const initialized = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const locale = useLocale();
  const language = locale as 'en' | 'ka';

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (sessionStorage.getItem(STORAGE_KEY)) {
      onCompleteRef.current?.();
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, '1');
    setPhase('visible');
  }, []);

  useEffect(() => {
    if (phase !== 'visible') return;
    const timer = setTimeout(() => {
      setPhase('fading');
      setTimeout(() => {
        onCompleteRef.current?.();
        setPhase('idle');
      }, 700);
    }, 3000);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'idle') return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [phase]);

  if (phase === 'idle') return null;

  const handleClick = () => {
    setPhase('fading');
    setTimeout(() => {
      onCompleteRef.current?.();
      setPhase('idle');
    }, 700);
  };

  const isVisible = phase === 'visible';

  return (
    <div
      onClick={handleClick}
      className={`fixed inset-0 z-50 cursor-pointer flex items-center justify-center px-8 text-foreground bg-background/75 backdrop-blur-sm transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center animate-fade-in">
        <h1 className="text-[44px] md:text-[88px] font-light tracking-[0.16em] leading-none whitespace-nowrap">
          URBAN SPACE
        </h1>

        <span className="mt-5 block h-px w-32 md:w-48 bg-foreground/60" />

        <p className="mt-5 text-sm md:text-[18px] font-light tracking-[0.12em] opacity-85">
          {language === 'ka'
            ? 'არქიტექტურა და ურბანული დაგეგმარება'
            : 'Architecture & urban planning'}
        </p>
      </div>
    </div>
  );
}
