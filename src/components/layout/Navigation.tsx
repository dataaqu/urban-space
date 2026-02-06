'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  href: string;
  label: string;
  children?: NavItem[];
}

interface NavigationProps {
  isScrolled?: boolean;
}

export default function Navigation({ isScrolled = false }: NavigationProps) {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { href: '/', label: t('home') },
    {
      href: '/projects',
      label: t('projects'),
      children: [
        { href: '/projects/architecture', label: t('architecture') },
        { href: '/projects/urban', label: t('urban') },
      ],
    },
    {
      href: '/studio',
      label: t('studio'),
      children: [
        { href: '/studio', label: t('about') },
        { href: '/studio/team', label: t('team') },
        { href: '/studio/partners', label: t('partners') },
        { href: '/studio/principles', label: t('principles') },
      ],
    },
    { href: '/services', label: t('services') },
    { href: '/contact', label: t('contact') },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="relative">
      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <li
            key={item.href}
            className="relative"
            onMouseEnter={() => item.children && setOpenDropdown(item.href)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <Link
              href={item.href}
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 group ${
                isActive(item.href)
                  ? 'text-primary-600'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              <span className="relative z-10">{item.label}</span>

              {/* Animated Underline */}
              <span
                className={`absolute left-4 right-4 bottom-1 h-0.5 bg-primary-500 transition-transform duration-300 origin-left ${
                  isActive(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />

              {/* Dropdown Indicator */}
              {item.children && (
                <motion.svg
                  animate={{ rotate: openDropdown === item.href ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block ml-1 w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              )}
            </Link>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {item.children && openDropdown === item.href && (
                <motion.ul
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
                  className="absolute top-full left-0 mt-2 py-2 min-w-[200px] bg-white/95 backdrop-blur-lg rounded-lg shadow-xl border border-secondary-100 z-50"
                >
                  {item.children.map((child, index) => (
                    <motion.li
                      key={child.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={child.href}
                        className={`block px-4 py-2.5 text-sm transition-all duration-200 ${
                          isActive(child.href)
                            ? 'text-primary-600 bg-primary-50 border-l-2 border-primary-500'
                            : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 hover:pl-5'
                        }`}
                      >
                        {child.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary-100 transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <div className="w-5 h-4 flex flex-col justify-between">
          <motion.span
            animate={{
              rotate: isMobileMenuOpen ? 45 : 0,
              y: isMobileMenuOpen ? 6 : 0,
            }}
            className="block h-0.5 w-full bg-secondary-700 rounded-full origin-center"
          />
          <motion.span
            animate={{
              opacity: isMobileMenuOpen ? 0 : 1,
              x: isMobileMenuOpen ? -10 : 0,
            }}
            className="block h-0.5 w-full bg-secondary-700 rounded-full"
          />
          <motion.span
            animate={{
              rotate: isMobileMenuOpen ? -45 : 0,
              y: isMobileMenuOpen ? -6 : 0,
            }}
            className="block h-0.5 w-full bg-secondary-700 rounded-full origin-center"
          />
        </div>
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-dark-900/50 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 md:hidden"
            >
              <div className="p-6">
                {/* Close Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Logo */}
                <div className="mb-8 pt-2">
                  <span className="text-xl font-bold">
                    URBAN<span className="text-primary-500">SPACE</span>
                  </span>
                </div>

                {/* Nav Items */}
                <ul className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                          isActive(item.href)
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-secondary-700 hover:bg-secondary-50'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <ul className="mt-1 ml-4 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={`block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                  isActive(child.href)
                                    ? 'text-primary-600 bg-primary-50'
                                    : 'text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50'
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="my-6 divider-gold" />

                {/* Contact Info */}
                <div className="text-sm text-secondary-500">
                  <p className="mb-2">info@urbanspace.ge</p>
                  <p>+995 XXX XXX XXX</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
