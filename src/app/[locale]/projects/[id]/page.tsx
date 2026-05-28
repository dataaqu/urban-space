export const revalidate = 60;

import { cache } from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProjectDetailClient from '@/components/projects/ProjectDetailClient';

interface ProjectDetailPageProps {
  params: { id: string; locale: string };
}

const getProject = cache(async (idOrSlug: string) => {
  return prisma.project.findFirst({
    where: { OR: [{ slug: idOrSlug }, { id: idOrSlug }] },
    include: { pages: { orderBy: { order: 'asc' as const } } },
  });
});

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const project = await getProject(params.id);

  if (!project) return { title: 'Not Found' };

  const title = params.locale === 'ka' ? project.titleKa : project.titleEn;
  return { title: `${title} - URBAN SPACE` };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const locale = params.locale;

  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  const title = locale === 'ka' ? project.titleKa : project.titleEn;
  const description = locale === 'ka' ? project.locationKa : project.locationEn;

  const pages = project.pages.map((page) => ({
    id: page.id,
    type: page.type as 'SINGLE_IMAGE' | 'DOUBLE_IMAGE' | 'IMAGE_ONLY',
    order: page.order,
    image1: page.image1,
    image2: page.image2,
    mobileImage1: page.mobileImage1,
    mobileImage2: page.mobileImage2,
    textRightKa: page.textRightKa || null,
    textRightEn: page.textRightEn || null,
    metaInfoKa: page.metaInfoKa || null,
    metaInfoEn: page.metaInfoEn || null,
  }));

  return (
    <ProjectDetailClient
      locale={locale}
      project={{
        id: project.id,
        title,
        description,
        pages,
      }}
    />
  );
}
