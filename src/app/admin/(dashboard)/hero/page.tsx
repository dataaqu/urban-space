export const dynamic = 'force-dynamic';

'use client';

import { useState, useEffect } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';

interface HeroSlide {
  id: string;
  image: string;
  titleKa: string | null;
  titleEn: string | null;
  order: number;
  active: boolean;
}

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/hero')
      .then((res) => res.json())
      .then(setSlides)
      .finally(() => setLoading(false));
  }, []);

  const addSlide = async (imageUrl: string) => {
    const res = await fetch('/api/admin/hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageUrl }),
    });
    if (res.ok) {
      const slide = await res.json();
      setSlides((prev) => [...prev, slide]);
    }
  };

  const updateSlide = async (id: string, data: Partial<HeroSlide>) => {
    const res = await fetch(`/api/admin/hero/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    }
  };

  const deleteSlide = async (id: string) => {
    if (!confirm('დარწმუნებული ხართ?')) return;
    const res = await fetch(`/api/admin/hero/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSlides((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const moveSlide = async (index: number, direction: -1 | 1) => {
    const newSlides = [...slides];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;

    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
    const reordered = newSlides.map((s, i) => ({ ...s, order: i }));
    setSlides(reordered);

    setSaving(true);
    await fetch('/api/admin/hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slides: reordered.map((s) => ({ id: s.id, order: s.order })) }),
    });
    setSaving(false);
  };

  if (loading) return <div className="text-secondary-400">იტვირთება...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">Hero სლაიდერი</h1>
        {saving && <span className="text-sm text-secondary-400">შენახვა...</span>}
      </div>

      <div className="space-y-4">
        {slides.map((slide, index) => (
          <div key={slide.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4 items-start">
            <div className="flex flex-col gap-1">
              <button onClick={() => moveSlide(index, -1)} disabled={index === 0} className="px-2 py-1 text-xs bg-gray-100 rounded disabled:opacity-30 hover:bg-gray-200">↑</button>
              <button onClick={() => moveSlide(index, 1)} disabled={index === slides.length - 1} className="px-2 py-1 text-xs bg-gray-100 rounded disabled:opacity-30 hover:bg-gray-200">↓</button>
            </div>

            <img src={slide.image} alt="" className="w-48 h-28 object-cover rounded-lg" />

            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={slide.titleKa || ''}
                  onChange={(e) => updateSlide(slide.id, { titleKa: e.target.value })}
                  placeholder="სათაური (ქართ.)"
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  value={slide.titleEn || ''}
                  onChange={(e) => updateSlide(slide.id, { titleEn: e.target.value })}
                  placeholder="Title (En)"
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={slide.active}
                  onChange={(e) => updateSlide(slide.id, { active: e.target.checked })}
                  className="rounded border-gray-300"
                />
                აქტიური
              </label>
            </div>

            <button
              onClick={() => deleteSlide(slide.id)}
              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              წაშლა
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-secondary-700 mb-2">ახალი სლაიდის დამატება</h3>
        <ImageUpload onChange={addSlide} folder="urban-space/hero" />
      </div>
    </div>
  );
}