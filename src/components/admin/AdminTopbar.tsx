'use client';

import Link from 'next/link';
import { Menu, ExternalLink } from 'lucide-react';
import { IconButton } from './ui';

interface AdminTopbarProps {
  onOpenSidebar: () => void;
}

export default function AdminTopbar({ onOpenSidebar }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-neutral-200/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <IconButton
            icon={<Menu />}
            aria-label="Open menu"
            onClick={onOpenSidebar}
            className="lg:hidden"
          />
          <span className="hidden lg:block text-sm text-neutral-500">
            Urban Space · Admin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-dark-800 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-neutral-100"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">საიტის ნახვა</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
