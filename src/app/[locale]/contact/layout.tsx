import { ReactNode, Suspense } from 'react';
import ContactLayout from '@/components/contact/ContactLayout';

export default function ContactPageLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <ContactLayout>{children}</ContactLayout>
    </Suspense>
  );
}
