export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { TeamManager } from '@/components/admin/TeamManager';

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-8">გუნდის წევრები</h1>
      <TeamManager initialMembers={members} />
    </div>
  );
}