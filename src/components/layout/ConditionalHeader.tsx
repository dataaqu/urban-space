'use client';

import { Suspense } from 'react';
import { usePathname } from '@/i18n/routing';
import SiteHeader from './SiteHeader';

interface SocialLinks {
  facebook: string;
  instagram: string;
}

export function ConditionalHeader({ social }: { social: SocialLinks }) {
  const pathname = usePathname();
  // Home has its own Hero-embedded navigation
  if (pathname === '/') return null;
  // Project detail (/projects/<id>): hide the header on mobile/tablet only (desktop unchanged)
  const isProjectDetail = /^\/projects\/[^/]+$/.test(pathname);
  return (
    <Suspense fallback={null}>
      <SiteHeader social={social} hideBarOnMobile={isProjectDetail} />
    </Suspense>
  );
}

export function ConditionalFooter() {
  return null;
}
