'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useCounter } from '@/hooks/useCounter';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface StatItemProps {
  end: number;
  suffix?: string;
  label: string;
  delay?: number;
}

function StatItem({ end, suffix = '', label, delay = 0 }: StatItemProps) {
  const { count, ref } = useCounter({
    end,
    duration: 2500,
    suffix,
    delay: delay * 200,
  });

  return (
    <motion.div
      ref={ref}
      variants={staggerItem}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="text-center group relative"
    >
      {/* Decorative Frame */}
      <div className="absolute inset-0 border border-primary-500/0 group-hover:border-primary-500/20 rounded-lg transition-all duration-500" />

      {/* Corner Accents */}
      <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-primary-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-primary-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-primary-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-primary-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Number - Luxury Style */}
      <div className="number-luxury text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-3">
        {count}
      </div>

      {/* Label */}
      <div className="text-secondary-300/80 text-sm md:text-base uppercase tracking-[0.2em] font-light">
        {label}
      </div>

      {/* Bottom Accent Line */}
      <div className="mx-auto mt-4 w-8 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent group-hover:w-16 transition-all duration-500" />
    </motion.div>
  );
}

export default function Statistics() {
  const t = useTranslations('home.stats');

  const stats = [
    { end: 150, suffix: '+', labelKey: 'projects' },
    { end: 25, suffix: '+', labelKey: 'years' },
    { end: 50, suffix: '+', labelKey: 'awards' },
    { end: 98, suffix: '%', labelKey: 'satisfaction' },
  ];

  return (
    <section className="relative py-24 md:py-32 bg-gradient-luxury overflow-hidden">
      {/* Marble Effect Background */}
      <div className="absolute inset-0 marble-effect-dark" />

      {/* Luxury Grid Pattern */}
      <div className="absolute inset-0 grid-overlay-luxury" />

      {/* Dramatic Ambient Lights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
      >
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/15 rounded-full filter blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-400/10 rounded-full filter blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary-500/5 rounded-full filter blur-[100px]" />
      </motion.div>

      {/* Decorative Corner Frames */}
      <div className="absolute top-8 left-8 w-24 h-24 border-t border-l border-primary-500/20" />
      <div className="absolute top-8 right-8 w-24 h-24 border-t border-r border-primary-500/20" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b border-l border-primary-500/20" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b border-r border-primary-500/20" />

      <div className="container-premium relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 lg:gap-8"
        >
          {/* Vertical Dividers */}
          <div className="hidden md:block absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-px h-20 divider-vertical-luxury" />
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-px h-20 divider-vertical-luxury" />
          <div className="hidden md:block absolute top-1/2 left-3/4 -translate-y-1/2 -translate-x-1/2 w-px h-20 divider-vertical-luxury" />

          {stats.map((stat, index) => (
            <StatItem
              key={stat.labelKey}
              end={stat.end}
              suffix={stat.suffix}
              label={t(stat.labelKey)}
              delay={index}
            />
          ))}
        </motion.div>
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
    </section>
  );
}
