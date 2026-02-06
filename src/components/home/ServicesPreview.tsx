'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { staggerContainer, staggerItem, scrollReveal } from '@/lib/animations';
import Button from '@/components/ui/Button';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

function ServiceCard({ icon, title, description, index }: ServiceCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -12, rotateX: 2, rotateY: -2 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      className="group relative p-8 bg-white rounded-xl shadow-luxury hover:shadow-luxury-hover transition-all duration-500 gold-line-thick overflow-hidden"
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      {/* Corner Brackets */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-primary-500/0 group-hover:border-primary-500/50 transition-all duration-500" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-primary-500/0 group-hover:border-primary-500/50 transition-all duration-500" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-primary-500/0 group-hover:border-primary-500/50 transition-all duration-500" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-primary-500/0 group-hover:border-primary-500/50 transition-all duration-500" />

      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-transparent transition-all duration-500 rounded-xl" />

      {/* Icon - Luxury Style */}
      <div className="relative w-16 h-16 mb-6 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 text-primary-500 border border-primary-200/50 group-hover:border-primary-500/50 group-hover:shadow-gold-border transition-all duration-500">
        <div className="group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>

      {/* Content */}
      <h3 className="relative font-display text-xl font-semibold text-secondary-900 mb-3 group-hover:text-primary-700 transition-colors duration-300">
        {title}
      </h3>
      <p className="relative text-secondary-500 text-sm leading-relaxed mb-5">
        {description}
      </p>

      {/* Learn More Link - Enhanced */}
      <Link
        href="/services"
        className="relative inline-flex items-center gap-2 text-sm font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
      >
        <span>Learn More</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>

      {/* Decorative Number - Luxury */}
      <div className="absolute top-5 right-5 text-7xl font-display font-bold text-secondary-100/80 group-hover:text-primary-200/60 transition-colors duration-500 select-none">
        0{index + 1}
      </div>

      {/* Bottom Gold Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </motion.div>
  );
}

export default function ServicesPreview() {
  const t = useTranslations('home.services');

  const services = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      titleKey: 'items.architecture.title',
      descriptionKey: 'items.architecture.description',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      titleKey: 'items.urban.title',
      descriptionKey: 'items.urban.description',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      titleKey: 'items.interior.title',
      descriptionKey: 'items.interior.description',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      titleKey: 'items.consulting.title',
      descriptionKey: 'items.consulting.description',
    },
  ];

  return (
    <section className="section-padding bg-accent-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-400/5 rounded-full filter blur-[80px]" />
      </div>

      <div className="container-premium relative z-10">
        {/* Section Header - Luxury */}
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center px-4 py-1.5 text-xs font-medium tracking-[0.15em] uppercase bg-primary-500/10 text-primary-700 border border-primary-500/20 rounded-full mb-6">
            {t('badge') || 'Our Expertise'}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6">
            {t('title') || 'What We Do'}
          </h2>
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-primary-500/50" />
            <span className="w-2 h-2 rounded-full bg-primary-500/50" />
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-primary-500/50" />
          </div>
          <p className="text-secondary-500 max-w-2xl mx-auto text-lg">
            {t('description') || 'We offer comprehensive architectural and urban planning services tailored to your needs.'}
          </p>
        </motion.div>

        {/* Services Grid - Luxury Spacing */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.titleKey}
              icon={service.icon}
              title={t(service.titleKey)}
              description={t(service.descriptionKey)}
              index={index}
            />
          ))}
        </motion.div>

        {/* CTA - Enhanced */}
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/services">
            <Button
              variant="outline"
              size="lg"
              className="border-secondary-300 hover:border-primary-500 hover:text-primary-600 px-8"
              rightIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              }
            >
              {t('viewAll') || 'View All Services'}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
