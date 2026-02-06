import React from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/ui/Breadcrumbs';
import ProcessTimeline from '@/components/services/ProcessTimeline';
import { ParallaxCTA } from '@/components/ui/ParallaxSection';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'services' });

  return {
    title: `${t('title')} - URBAN SPACE`,
    description: t('description'),
  };
}

export default async function ServicesPage() {
  const locale = await getLocale();
  const t = await getTranslations('services');
  const ctaT = await getTranslations('home.cta');

  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' },
  });

  const defaultServices = [
    {
      id: '1',
      titleKa: 'არქიტექტურული პროექტირება',
      titleEn: 'Architectural Design',
      descriptionKa: 'სრული არქიტექტურული პროექტირება კონცეფციიდან რეალიზაციამდე. მოიცავს ესკიზურ პროექტს, სამუშაო ნახაზებს და ტექნიკურ დოკუმენტაციას.',
      descriptionEn: 'Complete architectural design from concept to realization. Includes schematic design, working drawings, and technical documentation.',
      icon: '🏛️',
    },
    {
      id: '2',
      titleKa: 'ურბანული დაგეგმარება',
      titleEn: 'Urban Planning',
      descriptionKa: 'ქალაქგეგმარებითი პროექტები და განვითარების კონცეფციები. საზოგადოებრივი სივრცეების დიზაინი და ურბანული რეგენერაცია.',
      descriptionEn: 'Urban planning projects and development concepts. Public space design and urban regeneration strategies.',
      icon: '🌆',
    },
    {
      id: '3',
      titleKa: 'ინტერიერის დიზაინი',
      titleEn: 'Interior Design',
      descriptionKa: 'ინტერიერის კონცეპტუალური და დეტალური დიზაინი. ავეჯის შერჩევა, მასალების სპეციფიკაცია და განათების დაგეგმარება.',
      descriptionEn: 'Conceptual and detailed interior design. Furniture selection, material specification, and lighting design.',
      icon: '🪑',
    },
    {
      id: '4',
      titleKa: 'კონსულტაცია',
      titleEn: 'Consulting',
      descriptionKa: 'არქიტექტურული და ურბანული კონსულტაციები. პროექტის განხორციელებადობის ანალიზი და ექსპერტული შეფასება.',
      descriptionEn: 'Architectural and urban consulting services. Project feasibility analysis and expert evaluation.',
      icon: '💬',
    },
    {
      id: '5',
      titleKa: '3D ვიზუალიზაცია',
      titleEn: '3D Visualization',
      descriptionKa: 'ფოტორეალისტური 3D ვიზუალიზაცია და ანიმაცია. ვირტუალური ტურები და პრეზენტაციები.',
      descriptionEn: 'Photorealistic 3D visualization and animation. Virtual tours and presentations.',
      icon: '🎨',
    },
    {
      id: '6',
      titleKa: 'საავტორო ზედამხედველობა',
      titleEn: 'Construction Supervision',
      descriptionKa: 'მშენებლობის საავტორო ზედამხედველობა და პროექტის მართვა. ხარისხის კონტროლი.',
      descriptionEn: 'Construction supervision and project management. Quality control throughout the building process.',
      icon: '🔧',
    },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  const iconComponents: Record<string, React.ReactNode> = {
    '🏛️': (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    '🌆': (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    '🪑': (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    '💬': (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    '🎨': (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
    '🔧': (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };

  return (
    <div className="min-h-screen bg-accent-50">
      {/* Page Header */}
      <PageHeader
        title={t('title')}
        description={t('description')}
        breadcrumbs={[{ label: t('title') }]}
        variant="dark"
      />

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-premium">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayServices.map((service, index) => {
              const title = locale === 'ka' ? service.titleKa : service.titleEn;
              const description =
                locale === 'ka' ? service.descriptionKa : service.descriptionEn;
              const icon = service.icon || '📐';

              return (
                <Card
                  key={service.id}
                  variant="default"
                  elevation={2}
                  className="group"
                >
                  <CardContent className="p-8">
                    {/* Icon */}
                    <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-xl bg-primary-50 text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                      {iconComponents[icon] || <span className="text-3xl">{icon}</span>}
                    </div>

                    {/* Number Badge */}
                    <div className="absolute top-6 right-6 text-6xl font-display font-bold text-secondary-100 group-hover:text-primary-100 transition-colors duration-300">
                      0{index + 1}
                    </div>

                    {/* Title */}
                    <CardTitle className="mb-3 group-hover:text-primary-600 transition-colors">
                      {title}
                    </CardTitle>

                    {/* Description */}
                    <CardDescription className="leading-relaxed">
                      {description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <ProcessTimeline />

      {/* CTA Section */}
      <ParallaxCTA
        title={ctaT('title') || 'Ready to Start Your Project?'}
        description={ctaT('description') || 'Let\'s create something extraordinary together.'}
        buttonText={ctaT('button') || 'Get in Touch'}
        buttonHref="/contact"
      />
    </div>
  );
}
