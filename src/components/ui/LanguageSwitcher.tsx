'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { motion } from 'framer-motion';

interface LanguageSwitcherProps {
  isScrolled?: boolean;
  isOverHero?: boolean;
}

export default function LanguageSwitcher({ isScrolled = false, isOverHero = false }: LanguageSwitcherProps) {
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
      className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
        isOverHero ? 'hover:bg-white/10' : 'hover:bg-secondary-100'
      }`}
    >
      <span className="relative flex items-center gap-1.5">
        <span
          className={`transition-all duration-300 ${
            locale === 'ka'
              ? isOverHero
                ? 'text-white font-semibold'
                : 'text-primary-600 font-semibold'
              : isOverHero
                ? 'text-white/40'
                : 'text-secondary-400'
          }`}
        >
          ქარ
        </span>

        <span
          className={`transition-colors duration-300 ${
            isOverHero ? 'text-white/30' : 'text-secondary-300'
          }`}
        >
          /
        </span>

        <span
          className={`transition-all duration-300 ${
            locale === 'en'
              ? isOverHero
                ? 'text-white font-semibold'
                : 'text-primary-600 font-semibold'
              : isOverHero
                ? 'text-white/40'
                : 'text-secondary-400'
          }`}
        >
          EN
        </span>
      </span>
    </motion.button>
  );
}
