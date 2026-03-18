export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { MessagesInbox } from '@/components/admin/MessagesInbox';

export default async function AdminMessagesPage() {
  const messages = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-8">შეტყობინებები</h1>
      <MessagesInbox initialMessages={messages} />
    </div>
  );
}