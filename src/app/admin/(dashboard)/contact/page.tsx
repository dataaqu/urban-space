export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import ContactInfoForm from '@/components/admin/ContactInfoForm';
import { PageHeader } from '@/components/admin/ui';
import { getContentMap } from '@/lib/content';

const SINGLETON_ID = 'singleton';

export default async function AdminContactPage() {
  const [info, content] = await Promise.all([
    prisma.contactInfo.upsert({
      where: { id: SINGLETON_ID },
      update: {},
      create: { id: SINGLETON_ID },
    }),
    getContentMap('contact'),
  ]);

  const cm = (key: string, fallback = { ka: '', en: '' }) =>
    content[key] ?? fallback;

  return (
    <div>
      <PageHeader
        title="კონტაქტის ინფორმაცია"
        description="საიტის Contact გვერდის მონაცემები."
        breadcrumbs={[
          { label: 'მთავარი', href: '/admin' },
          { label: 'კონტაქტი' },
        ]}
      />

      <ContactInfoForm
        initial={{
          phone: info.phone || cm('info.phone').ka || null,
          email: info.email || cm('info.email').ka || null,
          addressKa: info.addressKa || cm('info.address').ka || null,
          addressEn: info.addressEn || cm('info.address').en || null,
          facebook: info.facebook || cm('follow.facebook').ka || null,
          instagram: info.instagram || cm('follow.instagram').ka || null,
          mapLat: info.mapLat,
          mapLng: info.mapLng,
        }}
        content={{
          titleKa: cm('title').ka,
          titleEn: cm('title').en,
          subtitleKa: cm('subtitle').ka,
          subtitleEn: cm('subtitle').en,
        }}
      />
    </div>
  );
}
