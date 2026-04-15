export const revalidate = 60;

import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import prisma from '@/lib/prisma';
import ProjectDetailClient from '@/components/projects/ProjectDetailClient';

interface ProjectDetailPageProps {
  params: { id: string };
}

async function findProject(idOrSlug: string) {
  // Try by slug first, then by id
  return (
    await prisma.project.findUnique({ where: { slug: idOrSlug } }) ||
    await prisma.project.findUnique({ where: { id: idOrSlug } })
  );
}

async function findProjectWithPages(idOrSlug: string) {
  const include = { pages: { orderBy: { order: 'asc' as const } } };
  return (
    await prisma.project.findUnique({ where: { slug: idOrSlug }, include }) ||
    await prisma.project.findUnique({ where: { id: idOrSlug }, include })
  );
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const locale = await getLocale();
  const project = await findProject(params.id);

  if (!project) return { title: 'Not Found' };

  const title = locale === 'ka' ? project.titleKa : project.titleEn;
  return { title: `${title} - URBAN SPACE` };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const locale = await getLocale();

  const project = await findProjectWithPages(params.id);

  if (!project) {
    notFound();
  }

  const title = locale === 'ka' ? project.titleKa : project.titleEn;

  const pages = project.pages.map((page) => ({
    id: page.id,
    type: page.type as 'SINGLE_IMAGE' | 'DOUBLE_IMAGE',
    order: page.order,
    image1: page.image1,
    image2: page.image2,
    textKa: page.textKa || null,
    textEn: page.textEn || null,
    textRightKa: page.textRightKa || null,
    textRightEn: page.textRightEn || null,
  }));

  return (
    <ProjectDetailClient
      locale={locale}
      project={{
        id: project.id,
        title,
        category: project.category,
        pages,
      }}
    />
  );
}
