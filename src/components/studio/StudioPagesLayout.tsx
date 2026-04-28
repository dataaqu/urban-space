'use client';

interface StudioPagesLayoutProps {
  children: React.ReactNode;
}

export default function StudioPagesLayout({ children }: StudioPagesLayoutProps) {
  return (
    <div className="bg-background flex flex-col min-h-[calc(100vh-80px)]">
      <div className="flex-1">{children}</div>

      <footer className="text-center py-6 xl:py-8 2xl:py-10">
        <p className="text-[10px] xl:text-[11px] 2xl:text-[12px] text-foreground/45">
          &copy; 2026 URBAN SPACE. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
