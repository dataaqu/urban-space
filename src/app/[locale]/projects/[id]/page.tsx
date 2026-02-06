import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import Button from '@/components/ui/Button';

interface ProjectDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const locale = await getLocale();
  const project = await prisma.project.findUnique({
    where: { id: params.id },
  });

  if (!project) return { title: 'Not Found' };

  const title = locale === 'ka' ? project.titleKa : project.titleEn;
  return { title: `${title} - URBAN SPACE` };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const locale = await getLocale();
  const t = await getTranslations('projects');
  const commonT = await getTranslations('common');

  const project = await prisma.project.findUnique({
    where: { id: params.id },
  });

  if (!project) {
    notFound();
  }

  const title = locale === 'ka' ? project.titleKa : project.titleEn;
  const description = locale === 'ka' ? project.descriptionKa : project.descriptionEn;
  const categoryLabel = t(`categories.${project.category}`);
  const typeLabel = t(`types.${project.type}`);
  const statusLabel = t(`statuses.${project.status}`);

  const placeholderImage = `https://placehold.co/1200x800/1e293b/64748b?text=${encodeURIComponent(title)}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-[60vh] bg-secondary-900">
        <img
          src={project.images[0] || placeholderImage}
          alt={title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary-600 text-white text-sm rounded-full">
              {categoryLabel}
            </span>
            <span className="px-3 py-1 bg-secondary-700 text-white text-sm rounded-full">
              {typeLabel}
            </span>
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                project.status === 'ONGOING'
                  ? 'bg-green-500 text-white'
                  : 'bg-secondary-200 text-secondary-700'
              }`}
            >
              {statusLabel}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">{title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Link href="/projects">
              <Button variant="ghost" className="mb-6">
                &larr; {commonT('back')}
              </Button>
            </Link>

            {description && (
              <div className="prose max-w-none">
                <p className="text-lg text-secondary-700 leading-relaxed">
                  {description}
                </p>
              </div>
            )}

            {/* Image Gallery */}
            {project.images.length > 1 && (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
                  Gallery
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {project.images.slice(1).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-[4/3] rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`${title} - ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-secondary-50 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                {t('details.year')}
              </h3>
              <dl className="space-y-4">
                {project.year && (
                  <div>
                    <dt className="text-sm text-secondary-500">
                      {t('details.year')}
                    </dt>
                    <dd className="text-secondary-900 font-medium">
                      {project.year}
                    </dd>
                  </div>
                )}
                {project.location && (
                  <div>
                    <dt className="text-sm text-secondary-500">
                      {t('details.location')}
                    </dt>
                    <dd className="text-secondary-900 font-medium">
                      {project.location}
                    </dd>
                  </div>
                )}
                {project.area && (
                  <div>
                    <dt className="text-sm text-secondary-500">
                      {t('details.area')}
                    </dt>
                    <dd className="text-secondary-900 font-medium">
                      {project.area.toLocaleString()} {t('details.sqm')}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
