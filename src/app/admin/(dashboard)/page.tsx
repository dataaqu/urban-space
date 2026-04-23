export const dynamic = 'force-dynamic';

import Link from 'next/link';
import {
  FolderKanban,
  Star,
  Images,
  FileText,
  Plus,
  ArrowRight,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
} from '@/components/admin/ui';

async function getStats() {
  try {
    const [projectCount, featuredCount, slideCount, contentCount, recent] =
      await Promise.all([
        prisma.project.count(),
        prisma.project.count({ where: { featured: true } }),
        prisma.heroSlide.count(),
        prisma.siteContent.count(),
        prisma.project.findMany({
          orderBy: { updatedAt: 'desc' },
          take: 5,
          select: {
            id: true,
            titleKa: true,
            titleEn: true,
            category: true,
            featured: true,
            featuredImage: true,
            updatedAt: true,
          },
        }),
      ]);
    return {
      projectCount,
      featuredCount,
      slideCount,
      contentCount,
      recent,
      ok: true as const,
    };
  } catch {
    return {
      projectCount: 0,
      featuredCount: 0,
      slideCount: 0,
      contentCount: 0,
      recent: [],
      ok: false as const,
    };
  }
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  accent,
}: {
  icon: typeof FolderKanban;
  label: string;
  value: number;
  href: string;
  accent: 'gold' | 'neutral' | 'blue' | 'emerald';
}) {
  const accents = {
    gold: 'bg-primary-50 text-primary-700 ring-primary-100',
    neutral: 'bg-neutral-100 text-dark-700 ring-neutral-200',
    blue: 'bg-sky-50 text-sky-700 ring-sky-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  }[accent];

  return (
    <Link
      href={href}
      className="group block rounded-xl border border-neutral-200/70 bg-white p-5 shadow-sm transition-all duration-150 hover:border-neutral-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ring-1 ${accents}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <ArrowRight className="h-4 w-4 text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-500" />
      </div>
      <p className="mt-4 text-[13px] text-neutral-500">{label}</p>
      <p className="mt-0.5 text-2xl font-semibold text-dark-900 tabular-nums tracking-tight">
        {value}
      </p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const { projectCount, featuredCount, slideCount, contentCount, recent, ok } =
    await getStats();

  return (
    <div>
      <PageHeader
        title="მთავარი"
        description="მართვის პანელის მოკლე მიმოხილვა"
        actions={
          <Link href="/admin/projects/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              ახალი პროექტი
            </Button>
          </Link>
        }
      />

      {!ok && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          ბაზასთან კავშირის პრობლემა — სტატისტიკის ნახვა ახლა შეუძლებელია.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FolderKanban}
          label="პროექტები"
          value={projectCount}
          href="/admin/projects"
          accent="gold"
        />
        <StatCard
          icon={Star}
          label="Featured პროექტები"
          value={featuredCount}
          href="/admin/projects"
          accent="emerald"
        />
        <StatCard
          icon={Images}
          label="Hero სლაიდები"
          value={slideCount}
          href="/admin/hero"
          accent="blue"
        />
        <StatCard
          icon={FileText}
          label="Content ჩანაწერი"
          value={contentCount}
          href="/admin/content"
          accent="neutral"
        />
      </div>

      {/* Recent projects */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-dark-900">
            ბოლოს განახლებული პროექტები
          </h2>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1 text-sm text-primary-700 hover:text-primary-800"
          >
            ყველა პროექტი
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <Card>
          {recent.length === 0 ? (
            <EmptyState
              icon={<FolderKanban />}
              title="პროექტი ჯერ არ გაქვს"
              description="დაიწყე პირველი პროექტის დამატებით — ატვირთე სურათი, შეავსე სათაური და შექმენი შიდა გვერდები."
              action={
                <Link href="/admin/projects/new">
                  <Button leftIcon={<Plus className="h-4 w-4" />}>
                    ახალი პროექტი
                  </Button>
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-neutral-200/70">
              {recent.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-neutral-50/70"
                  >
                    <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
                      {p.featuredImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.featuredImage}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                          —
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-dark-900">
                        {p.titleKa}
                      </p>
                      <p className="truncate text-xs text-neutral-500">
                        {p.titleEn}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={p.featured ? 'gold' : 'muted'}>
                        {p.category === 'ARCHITECTURE'
                          ? 'არქიტექტურა'
                          : 'ურბანული'}
                      </Badge>
                      {p.featured && (
                        <Badge variant="gold">
                          <Star className="h-3 w-3" />
                          <span>Featured</span>
                        </Badge>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-neutral-300" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
