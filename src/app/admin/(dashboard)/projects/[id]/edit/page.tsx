export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
  });

  if (!project) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-8">
        პროექტის რედაქტირება
      </h1>
      <ProjectForm project={project} />
    </div>
  );
}