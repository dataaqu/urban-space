import { ReactNode, Suspense } from 'react';
import StudioPagesLayout from '@/components/studio/StudioPagesLayout';

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <StudioPagesLayout>{children}</StudioPagesLayout>
    </Suspense>
  );
}
