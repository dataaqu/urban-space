import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import prisma from '@/lib/prisma';
import ProjectDetailClient from '@/components/projects/ProjectDetailClient';

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

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      pages: {
        orderBy: { order: 'asc' },
      },
    },
  });

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
