// Render at request time so live DB content shows on first load (Railway
// can't reach the internal DB at build time, baking an empty snapshot).
export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';
import { ProjectCategory } from '@prisma/client';
import { pageMetadata, type Locale } from '@/lib/seo';
import ProjectsClient from '@/components/projects/ProjectsClient';

interface ProjectsPageProps {
  params: { locale: string };
  searchParams: { category?: string };
}

export async function generateMetadata({ params: { locale } }: ProjectsPageProps) {
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return pageMetadata({
    locale: locale as Locale,
    path: '/projects',
    title: t('projects'),
    description:
      locale === 'ka'
        ? 'URBAN SPACE-ის არქიტექტურული და ურბანული პროექტების პორტფოლიო.'
        : 'Portfolio of architecture and urban projects by URBAN SPACE.',
  });
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const t = await getTranslations('navigation');
  const raw = searchParams.category;
  const category: 'ALL' | 'ARCHITECTURE' | 'URBAN' =
    raw === 'URBAN' ? 'URBAN' : raw === 'ARCHITECTURE' ? 'ARCHITECTURE' : 'ALL';

  const where =
    category === 'ALL' ? {} : { categories: { has: category as ProjectCategory } };

  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  try {
    projects = await prisma.project.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        pages: {
          orderBy: { order: 'asc' },
          take: 1,
          select: { image1: true, mobileImage1: true },
        },
      },
    });
  } catch {
    projects = [];
  }

  return (
    <ProjectsClient
      projects={JSON.parse(JSON.stringify(projects))}
      initialCategory={category}
      labels={{
        architecture: t('architecture'),
        urban: t('urban'),
      }}
    />
  );
}
