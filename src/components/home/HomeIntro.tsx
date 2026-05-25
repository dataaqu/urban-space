'use client';

import { useState } from 'react';
import Hero from '@/components/home/Hero';
import SplashScreen from '@/components/home/SplashScreen';

interface HeroSlide {
  id: string;
  image: string;
  videoUrl: string | null;
  type: 'IMAGE' | 'VIDEO';
  titleKa: string | null;
  titleEn: string | null;
  order: number;
  active: boolean;
}

interface HomeIntroProps {
  slides?: HeroSlide[];
  content?: Record<string, { ka: string; en: string }>;
  social?: {
    facebook: string;
    instagram: string;
  };
}

export default function HomeIntro({ slides, content, social }: HomeIntroProps) {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      <SplashScreen onComplete={() => setSplashDone(true)} />
      <Hero slides={slides} content={content} social={social} splashDone={splashDone} />
    </>
  );
}
