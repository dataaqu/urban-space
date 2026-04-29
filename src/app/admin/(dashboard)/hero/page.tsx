import { PageHeader } from '@/components/admin/ui';
import HeroSlideManager from '@/components/admin/HeroSlideManager';

export default function HeroPage() {
  return (
    <div>
      <PageHeader
        title="Hero სლაიდერი"
        description="მართე მთავარ გვერდზე განთავსებული ფონური სურათები და ვიდეოები."
        breadcrumbs={[
          { label: 'მთავარი', href: '/admin' },
          { label: 'Hero სლაიდერი' },
        ]}
      />
      <HeroSlideManager />
    </div>
  );
}
