'use client';

import { usePathname } from '@/i18n/routing';

interface ProjectsLayoutProps {
  children: React.ReactNode;
}

export default function ProjectsLayout({ children }: ProjectsLayoutProps) {
  const pathname = usePathname();
  const isDetailPage = pathname !== '/projects' && pathname.startsWith('/projects/');

  return (
    <div className="bg-background text-foreground flex flex-col min-h-[calc(100vh-80px)]">
      <div className="flex-1">{children}</div>

      {!isDetailPage && (
        <footer className="text-center py-6 xl:py-8 2xl:py-10">
          <p className="text-[10px] xl:text-[11px] 2xl:text-[12px] text-foreground/45">
            &copy; 2026 URBAN SPACE. All rights reserved.
          </p>
        </footer>
      )}
    </div>
  );
}
