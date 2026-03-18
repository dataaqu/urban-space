export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { ServicesManager } from '@/components/admin/ServicesManager';

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-8">სერვისები</h1>
      <ServicesManager initialServices={services} />
    </div>
  );
}