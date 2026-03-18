import prisma from '@/lib/prisma';
import { PartnersManager } from '@/components/admin/PartnersManager';

export default async function AdminPartnersPage() {
  const partners = await prisma.partner.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-8">პარტნიორები</h1>
      <PartnersManager initialPartners={partners} />
    </div>
  );
}
