import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';
import TeamMemberComponent from '@/components/studio/TeamMember';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'studio.team' });

  return {
    title: `${t('title')} - URBAN SPACE`,
  };
}

export default async function TeamPage() {
  const t = await getTranslations('studio.team');

  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-secondary-900 mb-12 text-center">
          {t('title')}
        </h1>

        {teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <TeamMemberComponent key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <p className="text-center text-secondary-500">
            No team members found.
          </p>
        )}
      </div>
    </div>
  );
}
