export const revalidate = 3600;

import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';
import { ProjectCategory } from '@prisma/client';
import ProjectsClient from '@/components/projects/ProjectsClient';

interface ProjectsPageProps {
  searchParams: { category?: string };
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const t = await getTranslations('navigation');
  const category = searchParams.category === 'URBAN' ? 'URBAN' : 'ARCHITECTURE';

  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  try {
    projects = await prisma.project.findMany({
      where: { category: category as ProjectCategory },
      orderBy: { createdAt: 'desc' },
      include: {
        pages: {
          orderBy: { order: 'asc' },
          take: 1,
          select: { image1: true },
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
