export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import prisma from '@/lib/prisma';
import { Button, PageHeader } from '@/components/admin/ui';
import ProjectsTable, {
  ProjectRow,
} from '@/components/admin/ProjectsTable';

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [
      { featuredOrder: { sort: 'asc', nulls: 'last' } },
      { createdAt: 'desc' },
    ],
    include: {
      pages: {
        orderBy: { order: 'asc' },
        take: 1,
      },
      _count: { select: { pages: true } },
    },
  });

  const rows: ProjectRow[] = projects.map((p) => ({
    id: p.id,
    titleKa: p.titleKa,
    titleEn: p.titleEn,
    category: p.category,
    thumbnail: p.featuredImage || p.pages[0]?.image1 || null,
    pageCount: p._count.pages,
    featured: p.featured,
    featuredOrder: p.featuredOrder,
  }));

  return (
    <div>
      <PageHeader
        title="პროექტები"
        description="დაამატე, რედაქტირე ან წაშალე პროექტები."
        breadcrumbs={[
          { label: 'მთავარი', href: '/admin' },
          { label: 'პროექტები' },
        ]}
        actions={
          <Link href="/admin/projects/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              ახალი პროექტი
            </Button>
          </Link>
        }
      />
      <ProjectsTable projects={rows} />
    </div>
  );
}
