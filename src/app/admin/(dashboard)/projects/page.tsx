export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      pages: {
        orderBy: { order: 'asc' },
        take: 1,
      },
      _count: { select: { pages: true } },
    },
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
              <th className="text-left px-6 py-3 text-sm font-medium text-secondary-500">გვერდები</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-secondary-500">მთავარი</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-secondary-500">მოქმედება</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((project) => {
              const thumbnail = project.featuredImage || project.pages[0]?.image1;
              return (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {thumbnail ? (
                      <img src={thumbnail} alt="" className="w-16 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">—</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-secondary-900">{project.titleKa}</p>
                    <p className="text-sm text-secondary-500">{project.titleEn}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full">
                      {project.category === 'ARCHITECTURE' ? 'არქიტექტურა' : 'ურბანული'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-secondary-600">{project._count.pages}</span>
                  </td>
                  <td className="px-6 py-4">
                    {project.featured ? `⭐ ${project.featuredOrder || ''}` : '—'}
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
              );
            })}
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
