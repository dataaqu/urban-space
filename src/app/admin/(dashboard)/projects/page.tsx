export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import prisma from '@/lib/prisma';
import { Button, PageHeader } from '@/components/admin/ui';
import ProjectsPageTabs from '@/components/admin/ProjectsPageTabs';
import { ProjectRow } from '@/components/admin/ProjectsTable';
import { OrderRow } from '@/components/admin/ProjectsOrderClient';

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [
      { displayOrder: 'asc' },
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

  const tableRows: ProjectRow[] = projects.map((p) => ({
    id: p.id,
    titleKa: p.titleKa,
    titleEn: p.titleEn,
    category: p.category,
    thumbnail: p.featuredImage || p.pages[0]?.image1 || null,
    pageCount: p._count.pages,
    featured: p.featured,
    featuredOrder: p.featuredOrder,
  }));

  const orderRows: OrderRow[] = projects.map((p) => ({
    id: p.id,
    titleKa: p.titleKa,
    titleEn: p.titleEn,
    category: p.category,
    thumbnail: p.featuredImage || p.pages[0]?.image1 || null,
    featured: p.featured,
    featuredOrder: p.featuredOrder,
    displayOrder: p.displayOrder,
  }));

  return (
    <div>
      <PageHeader
        title="პროექტები"
        description="დაამატე, რედაქტირე ან წაშალე პროექტები. განლაგება tab-ში — დაალაგე და აირჩიე მთავარი 5."
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
      <ProjectsPageTabs projects={tableRows} orderRows={orderRows} />
    </div>
  );
}
