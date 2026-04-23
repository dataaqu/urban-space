'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  FolderKanban,
  Images,
  FileText,
  LogOut,
  X,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { href: '/admin', label: 'მთავარი', icon: LayoutDashboard, exact: true },
  { href: '/admin/projects', label: 'პროექტები', icon: FolderKanban },
  { href: '/admin/hero', label: 'Hero სლაიდერი', icon: Images },
  { href: '/admin/content', label: 'კონტენტი', icon: FileText },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const initial = (session?.user?.email ?? session?.user?.name ?? 'A')
    .charAt(0)
    .toUpperCase();

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={clsx(
          'fixed inset-0 z-40 bg-dark-900/60 backdrop-blur-sm lg:hidden transition-opacity',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        aria-hidden
      />

      <aside
        className={clsx(
          'fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-dark-900 text-white',
          'transition-transform duration-200 ease-out',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600/15 text-primary-400 ring-1 ring-primary-500/20">
              <span className="text-sm font-bold tracking-tight">U</span>
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white tracking-tight">
                Urban Space
              </p>
              <p className="text-[11px] text-neutral-400">ადმინ პანელი</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-neutral-400 hover:text-white p-1 rounded-md hover:bg-white/5"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
            ნავიგაცია
          </p>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={clsx(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                      active
                        ? 'bg-white/[0.06] text-white'
                        : 'text-neutral-400 hover:bg-white/[0.04] hover:text-white',
                    )}
                  >
                    {active && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r bg-primary-400"
                        aria-hidden
                      />
                    )}
                    <Icon
                      className={clsx(
                        'h-[18px] w-[18px] flex-shrink-0 transition-colors',
                        active
                          ? 'text-primary-400'
                          : 'text-neutral-500 group-hover:text-neutral-300',
                      )}
                    />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="border-t border-white/5 p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-600/20 text-primary-300 ring-1 ring-primary-500/30 text-sm font-semibold">
              {initial}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[13px] font-medium text-white">
                {session?.user?.name || 'Admin'}
              </p>
              <p className="truncate text-[11px] text-neutral-500">
                {session?.user?.email || ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-400 hover:bg-white/[0.04] hover:text-white transition-colors"
          >
            <LogOut className="h-[17px] w-[17px]" />
            <span className="font-medium">გასვლა</span>
          </button>
        </div>
      </aside>
    </>
  );
}
