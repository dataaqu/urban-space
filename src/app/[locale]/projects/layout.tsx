import { ReactNode, Suspense } from 'react';
import ProjectsLayout from '@/components/projects/ProjectsLayout';

export default function ProjectsPageLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <ProjectsLayout>{children}</ProjectsLayout>
    </Suspense>
  );
}
