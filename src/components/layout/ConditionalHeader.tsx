'use client';

import { Suspense } from 'react';
import { usePathname } from '@/i18n/routing';
import SiteHeader from './SiteHeader';
import Footer from './Footer';

export function ConditionalHeader() {
  const pathname = usePathname();
  // Home has its own Hero-embedded navigation
  if (pathname === '/') return null;
  return (
    <Suspense fallback={null}>
      <SiteHeader />
    </Suspense>
  );
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === '/' || pathname.startsWith('/projects') || pathname === '/contact' || pathname.startsWith('/studio')) return null;
  return <Footer />;
}
