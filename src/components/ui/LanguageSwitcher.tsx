'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { motion } from 'framer-motion';

interface LanguageSwitcherProps {
  isScrolled?: boolean;
}

export default function LanguageSwitcher({ isScrolled = false }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const newLocale = locale === 'ka' ? 'en' : 'ka';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLocale}
      className="relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-secondary-100"
    >
      {/* Active Indicator Background */}
      <span className="relative flex items-center gap-1.5">
        <span
          className={`transition-all duration-300 ${
            locale === 'ka'
              ? 'text-primary-600 font-semibold'
              : 'text-secondary-400'
          }`}
        >
          KA
        </span>

        <span className="w-px h-4 bg-secondary-200" />

        <span
          className={`transition-all duration-300 ${
            locale === 'en'
              ? 'text-primary-600 font-semibold'
              : 'text-secondary-400'
          }`}
        >
          EN
        </span>
      </span>
    </motion.button>
  );
}
