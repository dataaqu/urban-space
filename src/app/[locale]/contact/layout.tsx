import { ReactNode, Suspense } from 'react';

export default function ContactPageLayout({ children }: { children: ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
