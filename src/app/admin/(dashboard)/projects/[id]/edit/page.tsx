export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import ProjectPageEditor from '@/components/admin/ProjectPageEditor';
import { PageHeader } from '@/components/admin/ui';

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
    <div>
      <PageHeader
        title={project.titleKa}
        description={project.titleEn}
        breadcrumbs={[
          { label: 'მთავარი', href: '/admin' },
          { label: 'პროექტები', href: '/admin/projects' },
          { label: 'რედაქტირება' },
        ]}
      />

      <div className="space-y-10">
        <ProjectForm
          project={{
            id: project.id,
            titleKa: project.titleKa,
            titleEn: project.titleEn,
            categories: project.categories,
            locationKa: project.locationKa,
            locationEn: project.locationEn,
            featuredImage: project.featuredImage,
            mobileImage: project.mobileImage,
            featured: project.featured,
            featuredOrder: project.featuredOrder,
          }}
        />

        <div className="border-t border-neutral-200/70 pt-8">
          <ProjectPageEditor
            projectId={project.id}
            pages={project.pages.map((p) => ({
              id: p.id,
              type: p.type,
              order: p.order,
              image1: p.image1,
              image2: p.image2,
              mobileImage1: p.mobileImage1,
              mobileImage2: p.mobileImage2,
              textRightKa: p.textRightKa,
              textRightEn: p.textRightEn,
              architectsKa: p.architectsKa,
              architectsEn: p.architectsEn,
              metaLocationKa: p.metaLocationKa,
              metaLocationEn: p.metaLocationEn,
              typeKa: p.typeKa,
              typeEn: p.typeEn,
              statusKa: p.statusKa,
              statusEn: p.statusEn,
              areaKa: p.areaKa,
              areaEn: p.areaEn,
              clientKa: p.clientKa,
              clientEn: p.clientEn,
              year: p.year,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
