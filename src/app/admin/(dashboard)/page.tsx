import prisma from '@/lib/prisma';

async function getStats() {
  const [projectCount, teamCount, partnerCount, serviceCount, unreadMessages] =
    await Promise.all([
      prisma.project.count(),
      prisma.teamMember.count(),
      prisma.partner.count(),
      prisma.service.count(),
      prisma.contactSubmission.count({ where: { read: false } }),
    ]);

  return { projectCount, teamCount, partnerCount, serviceCount, unreadMessages };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: 'პროექტები', value: stats.projectCount, icon: '🏗️', href: '/admin/projects' },
    { label: 'გუნდის წევრები', value: stats.teamCount, icon: '👥', href: '/admin/team' },
    { label: 'პარტნიორები', value: stats.partnerCount, icon: '🤝', href: '/admin/partners' },
    { label: 'სერვისები', value: stats.serviceCount, icon: '⚡', href: '/admin/services' },
    { label: 'წაუკითხავი შეტყობინებები', value: stats.unreadMessages, icon: '📬', href: '/admin/messages' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-8">დეშბორდი</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500">{card.label}</p>
                <p className="text-3xl font-bold text-secondary-900 mt-1">{card.value}</p>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
