'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import clsx from 'clsx';

const navItems = [
  { href: '/admin/projects', label: 'პროექტები', icon: '🏗️' },
  { href: '/admin/hero', label: 'Hero სლაიდერი', icon: '🖼️' },
  { href: '/admin/content', label: 'კონტენტი', icon: '📝' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-secondary-900 text-white flex flex-col z-50">
      <div className="p-6 border-b border-secondary-700">
        <Link href="/admin/projects" className="text-xl font-bold text-primary-400">
          Urban Space
        </Link>
        <p className="text-sm text-secondary-400 mt-1">ადმინ პანელი</p>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-6 py-3 text-sm transition-colors',
                isActive
                  ? 'bg-primary-600/20 text-primary-400 border-r-2 border-primary-400'
                  : 'text-secondary-300 hover:bg-secondary-800 hover:text-white'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-secondary-700">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 px-4 py-2 w-full text-sm text-secondary-400 hover:text-white transition-colors rounded-lg hover:bg-secondary-800"
        >
          <span>🚪</span>
          <span>გასვლა</span>
        </button>
      </div>
    </aside>
  );
}
