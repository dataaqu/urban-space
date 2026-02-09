import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/prisma';

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

  const project = await prisma.project.findUnique({
    where: { id: params.id },
  });

  if (!project) {
    notFound();
  }

  const title = locale === 'ka' ? project.titleKa : project.titleEn;
  const description = locale === 'ka' ? project.descriptionKa : project.descriptionEn;
  const typeLabel = t(`types.${project.type}`);
  const statusLabel = t(`statuses.${project.status}`);

  const placeholderImage = `https://placehold.co/1440x600/1e293b/64748b?text=${encodeURIComponent(title)}`;
  const heroImage = project.images[0] || placeholderImage;
  const galleryImages = project.images.slice(1);

  return (
    <div className="bg-white">
      {/* Hero Section - Full Width with Overlay */}
      <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden">
        <img
          src={heroImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />

        {/* Project Info - Bottom Left */}
        <div className="absolute bottom-0 left-0 p-6 md:p-10 lg:px-20 lg:py-10 max-w-[600px]">
          <p className="text-white/50 text-[12px] font-semibold tracking-[2px] font-sans uppercase mb-4">
            {statusLabel} {project.year && `${project.year}`}
          </p>
          <h1 className="text-white text-2xl md:text-[42px] md:leading-[1.15] font-bold font-sans mb-4">
            {title}
          </h1>
          {project.location && (
            <p className="text-white/80 text-[16px] font-sans">
              {project.location.toUpperCase()}
            </p>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 md:px-[60px] lg:px-[120px] py-12 md:py-20 flex flex-col gap-16 md:gap-20">

        {/* Overview Section */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Overview Left - Description */}
          <div className="flex-1 max-w-[540px] flex flex-col gap-6">
            <h2 className="text-[#000000] text-2xl md:text-[32px] font-bold font-sans">
              {t('details.overview')}
            </h2>
            {description && (
              <p className="text-[#666666] text-[16px] leading-[1.6] font-sans">
                {description}
              </p>
            )}
          </div>

          {/* Overview Right - Project Details */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="flex flex-col gap-6">
              {project.location && (
                <div className="flex flex-col gap-2">
                  <span className="text-[#999999] text-[12px] font-semibold tracking-[1.5px] font-sans uppercase">
                    {t('details.location')}
                  </span>
                  <span className="text-[#000000] text-[16px] font-sans">
                    {project.location}
                  </span>
                </div>
              )}
              {project.area && (
                <div className="flex flex-col gap-2">
                  <span className="text-[#999999] text-[12px] font-semibold tracking-[1.5px] font-sans uppercase">
                    {t('details.area')}
                  </span>
                  <span className="text-[#000000] text-[16px] font-sans">
                    {project.area.toLocaleString()} {t('details.sqm')}
                  </span>
                </div>
              )}
              {project.year && (
                <div className="flex flex-col gap-2">
                  <span className="text-[#999999] text-[12px] font-semibold tracking-[1.5px] font-sans uppercase">
                    {t('details.year')}
                  </span>
                  <span className="text-[#000000] text-[16px] font-sans">
                    {project.year}
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <span className="text-[#999999] text-[12px] font-semibold tracking-[1.5px] font-sans uppercase">
                  {t('details.type')}
                </span>
                <span className="text-[#000000] text-[16px] font-sans">
                  {typeLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        {galleryImages.length > 0 && (
          <div className="flex flex-col gap-10">
            <h2 className="text-[#000000] text-2xl md:text-[32px] font-bold font-sans">
              {t('details.gallery')}
            </h2>

            {/* Gallery Grid Row 1 - 3 columns */}
            {galleryImages.length >= 3 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {galleryImages.slice(0, 3).map((image, index) => (
                  <div key={index} className="h-[200px] md:h-[280px] rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${title} - ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid grid-cols-1 ${galleryImages.length === 2 ? 'md:grid-cols-2' : ''} gap-5`}>
                {galleryImages.map((image, index) => (
                  <div key={index} className="h-[200px] md:h-[280px] rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${title} - ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Gallery Grid Row 2 - 2 columns */}
            {galleryImages.length > 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {galleryImages.slice(3, 5).map((image, index) => (
                  <div key={index} className="h-[240px] md:h-[380px] rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${title} - ${index + 5}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Additional images if more than 5 */}
            {galleryImages.length > 5 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {galleryImages.slice(5).map((image, index) => (
                  <div key={index} className="h-[200px] md:h-[280px] rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${title} - ${index + 7}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
