'use client';

import { ReactNode, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

export default function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-72">
        <AdminTopbar onOpenSidebar={() => setOpen(true)} />
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
