'use client';

import { useMemo, useState } from 'react';
import { ArrowUp, ArrowDown, Save, Star, X, ImageOff, Plus } from 'lucide-react';
import {
  Button,
  Card,
  Select,
  useToast,
} from '@/components/admin/ui';

export interface OrderRow {
  id: string;
  titleKa: string;
  titleEn: string;
  category: 'ARCHITECTURE' | 'URBAN' | string;
  thumbnail: string | null;
  featured: boolean;
  featuredOrder: number | null;
  displayOrder: number;
}

interface Props {
  projects: OrderRow[];
}

export default function ProjectsOrderClient({ projects: initial }: Props) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const initiallyFeatured = useMemo(() => {
    return [...initial]
      .filter((p) => p.featured)
      .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999))
      .slice(0, 5)
      .map((p) => p.id);
  }, [initial]);

  const [featuredIds, setFeaturedIds] = useState<string[]>(initiallyFeatured);
  const [allOrder, setAllOrder] = useState<string[]>(
    initial.map((p) => p.id),
  );

  const byId = useMemo(() => {
    const map: Record<string, OrderRow> = {};
    for (const p of initial) map[p.id] = p;
    return map;
  }, [initial]);

  const moveFeatured = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= featuredIds.length) return;
    const next = [...featuredIds];
    const [item] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, item);
    setFeaturedIds(next);
  };

  const setFeaturedPosition = (currentIdx: number, newPos: number) => {
    const targetIdx = newPos - 1;
    if (targetIdx === currentIdx) return;
    moveFeatured(currentIdx, targetIdx);
  };

  const removeFeatured = (idx: number) => {
    setFeaturedIds((prev) => prev.filter((_, i) => i !== idx));
  };

  const addFeatured = (id: string) => {
    if (!id || featuredIds.includes(id) || featuredIds.length >= 5) return;
    setFeaturedIds((prev) => [...prev, id]);
  };

  const moveAll = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= allOrder.length) return;
    setAllOrder((prev) => {
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const featured = featuredIds.map((id, idx) => ({
        id,
        position: idx + 1,
      }));
      const display = allOrder.map((id, idx) => ({
        id,
        displayOrder: idx,
      }));
      const res = await fetch('/api/admin/projects/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured, display }),
      });
      if (res.ok) {
        toast.success('განლაგება შენახულია');
      } else {
        toast.error('შენახვა ვერ მოხერხდა');
      }
    } catch {
      toast.error('შეცდომა');
    } finally {
      setSaving(false);
    }
  };

  const availableForFeatured = initial.filter(
    (p) => !featuredIds.includes(p.id),
  );

  return (
    <div className="space-y-10">
      {/* Featured 5 section */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold text-dark-900">
              <Star className="h-4 w-4 text-amber-500" />
              მთავარი გვერდი — 5 პროექტი
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              ეს პროექტები გამოჩნდება მთავარ გვერდზე ამ თანმიმდევრობით.
              პოზიციის შესაცვლელად აირჩიე ნომერი — სხვები ავტომატურად დაიძვრება.
            </p>
          </div>
        </div>

        <Card padded>
          {featuredIds.length === 0 ? (
            <p className="text-sm text-neutral-500 py-6 text-center">
              ჯერ არცერთი პროექტი არ გაქვს მთავარ გვერდზე.
            </p>
          ) : (
            <ul className="space-y-2">
              {featuredIds.map((id, idx) => {
                const p = byId[id];
                if (!p) return null;
                return (
                  <li
                    key={id}
                    className="flex items-center gap-3 rounded-lg border border-neutral-200/70 bg-white p-2.5"
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-amber-50 text-sm font-semibold text-amber-700 ring-1 ring-amber-200/60">
                      {idx + 1}
                    </span>
                    <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100 ring-1 ring-neutral-200/60">
                      {p.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.thumbnail}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-neutral-400">
                          <ImageOff className="h-4 w-4" />
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
                    <div className="w-28 flex-shrink-0">
                      <Select
                        value={idx + 1}
                        onChange={(e) =>
                          setFeaturedPosition(idx, Number(e.target.value))
                        }
                      >
                        {Array.from({ length: featuredIds.length }, (_, i) => (
                          <option key={i} value={i + 1}>
                            პოზიცია {i + 1}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveFeatured(idx, idx - 1)}
                        disabled={idx === 0}
                        className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-dark-900 disabled:opacity-30 disabled:hover:bg-transparent"
                        aria-label="ზემოთ"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFeatured(idx, idx + 1)}
                        disabled={idx === featuredIds.length - 1}
                        className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-dark-900 disabled:opacity-30 disabled:hover:bg-transparent"
                        aria-label="ქვემოთ"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFeatured(idx)}
                        className="rounded-md p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                        aria-label="ამოშლა"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {featuredIds.length < 5 && availableForFeatured.length > 0 && (
            <div className="mt-4 flex items-center gap-3 border-t border-neutral-200/70 pt-4">
              <Plus className="h-4 w-4 text-neutral-400" />
              <span className="text-sm text-neutral-600">
                პროექტის დამატება ({featuredIds.length}/5)
              </span>
              <div className="flex-1 max-w-xs">
                <Select
                  value=""
                  onChange={(e) => {
                    addFeatured(e.target.value);
                    e.currentTarget.value = '';
                  }}
                >
                  <option value="">— აირჩიე პროექტი —</option>
                  {availableForFeatured.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.titleKa}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* All projects section */}
      <section>
        <div className="mb-3">
          <h2 className="text-base font-semibold text-dark-900">
            ყველა პროექტი — განლაგება პროექტების გვერდზე
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            ↑↓ ღილაკებით განათავსე პროექტები. ეს თანმიმდევრობა გამოიყენება{' '}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-[11px]">
              /projects
            </code>{' '}
            გვერდზე.
          </p>
        </div>

        <Card className="overflow-hidden">
          <ul className="divide-y divide-neutral-200/70">
            {allOrder.map((id, idx) => {
              const p = byId[id];
              if (!p) return null;
              return (
                <li
                  key={id}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50/60"
                >
                  <span className="w-8 flex-shrink-0 text-center text-xs font-mono text-neutral-400">
                    {idx + 1}
                  </span>
                  <div className="h-10 w-14 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100 ring-1 ring-neutral-200/60">
                    {p.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.thumbnail}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-400">
                        <ImageOff className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-dark-900">
                      {p.titleKa}
                    </p>
                    <p className="truncate text-xs text-neutral-500">
                      {p.category === 'ARCHITECTURE'
                        ? 'არქიტექტურა'
                        : 'ურბანული'}
                      {p.featured && ' · მთავარ გვერდზე'}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveAll(idx, -1)}
                      disabled={idx === 0}
                      className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-dark-900 disabled:opacity-30 disabled:hover:bg-transparent"
                      aria-label="ზემოთ"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveAll(idx, 1)}
                      disabled={idx === allOrder.length - 1}
                      className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-dark-900 disabled:opacity-30 disabled:hover:bg-transparent"
                      aria-label="ქვემოთ"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <Button
          leftIcon={<Save className="h-4 w-4" />}
          onClick={handleSave}
          loading={saving}
        >
          შენახვა
        </Button>
      </div>
    </div>
  );
}
