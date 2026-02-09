'use client';

import { usePathname } from '@/i18n/routing';
import Header from './Header';
import Footer from './Footer';

export function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname === '/' || pathname.startsWith('/projects') || pathname === '/contact') return null;
  return <Header />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === '/' || pathname.startsWith('/projects') || pathname === '/contact') return null;
  return <Footer />;
}
