export const dynamic = 'force-dynamic';

import ProjectForm from '@/components/admin/ProjectForm';
import { PageHeader } from '@/components/admin/ui';

export default function NewProjectPage() {
  return (
    <div>
      <PageHeader
        title="ახალი პროექტი"
        description="შეავსე ძირითადი ინფო. გვერდების დამატება შესაძლებელი იქნება შექმნის შემდეგ."
        breadcrumbs={[
          { label: 'მთავარი', href: '/admin' },
          { label: 'პროექტები', href: '/admin/projects' },
          { label: 'ახალი' },
        ]}
      />
      <ProjectForm />
    </div>
  );
}
