import { getTranslations } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import Statistics from '@/components/home/Statistics';
import ServicesPreview from '@/components/home/ServicesPreview';
import Testimonials from '@/components/home/Testimonials';
import ProjectGrid from '@/components/projects/ProjectGrid';
import { ParallaxCTA } from '@/components/ui/ParallaxSection';
import Button from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home.hero' });

  return {
    title: `${t('title')} - ${t('subtitle')}`,
    description: t('description'),
  };
}

export default async function HomePage() {
  const t = await getTranslations('home.featured');
  const ctaT = await getTranslations('home.cta');

  const featuredProjects = await prisma.project.findMany({
    where: { featured: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Statistics Section */}
      <Statistics />

      {/* Featured Projects Section */}
      <section className="section-padding bg-accent-50">
        <div className="container-premium">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="badge-gold mb-4 inline-block">
                {t('badge') || 'Featured Work'}
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary-900">
                {t('title')}
              </h2>
            </div>
            <Link href="/projects">
              <Button
                variant="outline"
                rightIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                }
              >
                {t('viewAll')}
              </Button>
            </Link>
          </div>

          {/* Projects Grid */}
          <ProjectGrid projects={featuredProjects} />
        </div>
      </section>

      {/* Services Preview Section */}
      <ServicesPreview />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <ParallaxCTA
        title={ctaT('title') || 'Ready to Start Your Project?'}
        description={ctaT('description') || 'Let\'s create something extraordinary together. Contact us to discuss your architectural vision.'}
        buttonText={ctaT('button') || 'Get in Touch'}
        buttonHref="/contact"
      />
    </>
  );
}
