import ProjectForm from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-8">
        ახალი პროექტი
      </h1>
      <ProjectForm />
    </div>
  );
}
