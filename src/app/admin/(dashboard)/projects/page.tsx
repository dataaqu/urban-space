import prisma from '@/lib/prisma';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">პროექტები</h1>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          + დამატება
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-secondary-500">სურათი</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-secondary-500">სახელი</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-secondary-500">კატეგორია</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-secondary-500">სტატუსი</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-secondary-500">Featured</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-secondary-500">მოქმედება</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {project.images[0] && (
                    <img
                      src={project.images[0]}
                      alt=""
                      className="w-16 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-secondary-900">{project.titleKa}</p>
                  <p className="text-sm text-secondary-500">{project.titleEn}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full">
                    {project.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {project.status === 'COMPLETED' ? 'დასრულებული' : 'მიმდინარე'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {project.featured ? '⭐' : '—'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded transition-colors"
                    >
                      რედაქტირება
                    </Link>
                    <DeleteButton
                      id={project.id}
                      endpoint="/api/admin/projects"
                      label="წაშლა"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-secondary-400">
                  პროექტები არ არის
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
