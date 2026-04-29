'use client';

import { useState } from 'react';
import { List, ListOrdered } from 'lucide-react';
import ProjectsTable, { ProjectRow } from './ProjectsTable';
import ProjectsOrderClient, { OrderRow } from './ProjectsOrderClient';

interface Props {
  projects: ProjectRow[];
  orderRows: OrderRow[];
}

type Tab = 'list' | 'order';

export default function ProjectsPageTabs({ projects, orderRows }: Props) {
  const [tab, setTab] = useState<Tab>('list');

  const tabs: { id: Tab; label: string; icon: typeof List }[] = [
    { id: 'list', label: 'პროექტების სია', icon: List },
    { id: 'order', label: 'განლაგება', icon: ListOrdered },
  ];

  return (
    <>
      <div className="mb-6 border-b border-neutral-200">
        <nav className="flex gap-1 -mb-px overflow-x-auto" role="tablist">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`group inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-[15px] font-medium transition-colors ${
                  active
                    ? 'border-primary-600 text-dark-900'
                    : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-dark-800'
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    active
                      ? 'text-primary-600'
                      : 'text-neutral-400 group-hover:text-neutral-600'
                  }`}
                />
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>

      {tab === 'list' ? (
        <ProjectsTable projects={projects} />
      ) : (
        <ProjectsOrderClient projects={orderRows} />
      )}
    </>
  );
}
