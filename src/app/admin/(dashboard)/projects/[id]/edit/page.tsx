export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import ProjectPageEditor from '@/components/admin/ProjectPageEditor';

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      pages: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!project) notFound();

  return (
    <div className="space-y-10">
      <ProjectForm
        project={{
          id: project.id,
          titleKa: project.titleKa,
          titleEn: project.titleEn,
          category: project.category,
          locationKa: project.locationKa,
          locationEn: project.locationEn,
          featuredImage: project.featuredImage,
          featured: project.featured,
          featuredOrder: project.featuredOrder,
        }}
      />
      <ProjectPageEditor
        projectId={project.id}
        pages={project.pages.map((p) => ({
          id: p.id,
          type: p.type,
          order: p.order,
          image1: p.image1,
          image2: p.image2,
          textKa: p.textKa,
          textEn: p.textEn,
          textRightKa: p.textRightKa,
          textRightEn: p.textRightEn,
        }))}
      />
    </div>
  );
}
