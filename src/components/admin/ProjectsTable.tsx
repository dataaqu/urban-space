'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Star,
  Pencil,
  ImageOff,
  FolderKanban,
  Plus,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
} from '@/components/admin/ui';
import { DeleteButton } from './DeleteButton';

export interface ProjectRow {
  id: string;
  titleKa: string;
  titleEn: string;
  category: 'ARCHITECTURE' | 'URBAN' | string;
  thumbnail: string | null;
  pageCount: number;
  featured: boolean;
  featuredOrder: number | null;
}

type CategoryFilter = 'ALL' | 'ARCHITECTURE' | 'URBAN';

export default function ProjectsTable({ projects }: { projects: ProjectRow[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('ALL');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (category !== 'ALL' && p.category !== category) return false;
      if (!q) return true;
      return (
        p.titleKa.toLowerCase().includes(q) ||
        p.titleEn.toLowerCase().includes(q)
      );
    });
  }, [projects, query, category]);

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: 'ALL', label: 'ყველა' },
    { value: 'ARCHITECTURE', label: 'არქიტექტურა' },
    { value: 'URBAN', label: 'ურბანული' },
  ];

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 sm:max-w-xs">
          <Input
            placeholder="ძებნა სათაურით..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search />}
          />
        </div>
        <div
          className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1"
          role="tablist"
          aria-label="Filter by category"
        >
          <Filter className="ml-1 h-3.5 w-3.5 text-neutral-400" />
          {categories.map((c) => (
            <button
              key={c.value}
              role="tab"
              aria-selected={category === c.value}
              onClick={() => setCategory(c.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                category === c.value
                  ? 'bg-dark-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-dark-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          projects.length === 0 ? (
            <EmptyState
              icon={<FolderKanban />}
              title="პროექტი ჯერ არ გაქვს"
              description="დაამატე პირველი პროექტი — შემდეგ შეძლებ მასში გვერდების და სურათების ატვირთვას."
              action={
                <Link href="/admin/projects/new">
                  <Button leftIcon={<Plus className="h-4 w-4" />}>
                    ახალი პროექტი
                  </Button>
                </Link>
              }
            />
          ) : (
            <EmptyState
              icon={<Search />}
              title="შედეგი არ მოიძებნა"
              description="სცადე სხვა საძიებო სიტყვა ან გათიშე ფილტრი."
            />
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50/60 border-b border-neutral-200/70">
                <tr>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    სურათი
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    სახელი
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    კატეგორია
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    გვერდები
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    მთავარი
                  </th>
                  <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    მოქმედება
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/70">
                {filtered.map((project) => (
                  <tr
                    key={project.id}
                    className="group transition-colors hover:bg-neutral-50/60"
                  >
                    <td className="px-5 py-3">
                      <div className="h-12 w-16 overflow-hidden rounded-md bg-neutral-100 ring-1 ring-neutral-200/60">
                        {project.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.thumbnail}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-neutral-400">
                            <ImageOff className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-dark-900">
                        {project.titleKa}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {project.titleEn}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <Badge>
                        {project.category === 'ARCHITECTURE'
                          ? 'არქიტექტურა'
                          : 'ურბანული'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-sm text-neutral-600 tabular-nums">
                      {project.pageCount}
                    </td>
                    <td className="px-5 py-3">
                      {project.featured ? (
                        <Badge variant="gold">
                          <Star className="h-3 w-3" />
                          <span>
                            {project.featuredOrder
                              ? `#${project.featuredOrder}`
                              : 'Featured'}
                          </span>
                        </Badge>
                      ) : (
                        <span className="text-sm text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Pencil className="h-3.5 w-3.5" />}
                          >
                            რედაქტირება
                          </Button>
                        </Link>
                        <DeleteButton
                          id={project.id}
                          endpoint="/api/admin/projects"
                          itemName={project.titleKa}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {filtered.length > 0 && (
        <p className="mt-3 text-xs text-neutral-500">
          ნაჩვენებია {filtered.length} / {projects.length}
        </p>
      )}
    </>
  );
}
