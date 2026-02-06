'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface ProcessStep {
  number: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
}

export default function ProcessTimeline() {
  const t = useTranslations('services.process');

  const steps: ProcessStep[] = [
    {
      number: '01',
      titleKey: 'consultation.title',
      descriptionKey: 'consultation.description',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      number: '02',
      titleKey: 'concept.title',
      descriptionKey: 'concept.description',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      number: '03',
      titleKey: 'design.title',
      descriptionKey: 'design.description',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      number: '04',
      titleKey: 'development.title',
      descriptionKey: 'development.description',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      number: '05',
      titleKey: 'supervision.title',
      descriptionKey: 'supervision.description',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="section-padding bg-accent-50">
      <div className="container-premium">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="badge-gold mb-4 inline-block">
            {t('badge') || 'Our Process'}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
            {t('title') || 'How We Work'}
          </h2>
          <p className="text-secondary-500 max-w-2xl mx-auto">
            {t('description') || 'Our proven process ensures successful project delivery from concept to completion.'}
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative"
        >
          {/* Vertical Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500 via-primary-300 to-transparent" />

          {/* Steps */}
          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={staggerItem}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-12 ${
                  index % 2 === 0 ? '' : 'lg:direction-rtl'
                }`}
              >
                {/* Content */}
                <div
                  className={`lg:py-8 ${
                    index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:col-start-2 lg:text-left lg:pl-12'
                  }`}
                >
                  <div
                    className={`bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 ${
                      index % 2 === 0 ? 'lg:ml-auto' : ''
                    } max-w-lg`}
                  >
                    {/* Icon and Number */}
                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                        {step.icon}
                      </div>
                      <span className="text-4xl font-display font-bold text-primary-200">
                        {step.number}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-xl font-semibold text-secondary-900 mb-2">
                      {t(step.titleKey)}
                    </h3>

                    {/* Description */}
                    <p className="text-secondary-500 text-sm leading-relaxed">
                      {t(step.descriptionKey)}
                    </p>
                  </div>
                </div>

                {/* Timeline Dot (Desktop) */}
                <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 rounded-full bg-primary-500 ring-4 ring-primary-500/20" />
                </div>

                {/* Mobile Timeline Indicator */}
                <div className="lg:hidden flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-500 text-white font-bold">
                    {step.number}
                  </div>
                  <div className="flex-1 h-px bg-secondary-200" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
