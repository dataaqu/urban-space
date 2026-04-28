'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const locale = useLocale();
  const language = locale as 'en' | 'ka';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete?.(), 700);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    if (!isVisible) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isVisible]);

  const handleClick = () => {
    setIsVisible(false);
    setTimeout(() => onComplete?.(), 700);
  };

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
