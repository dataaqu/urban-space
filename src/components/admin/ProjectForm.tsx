'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';

interface ProjectFormProps {
  project?: {
    id: string;
    titleKa: string;
    titleEn: string;
    category: string;
    locationKa: string | null;
    locationEn: string | null;
    featuredImage: string | null;
    featured: boolean;
    featuredOrder: number | null;
  };
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titleKa: project?.titleKa || '',
    titleEn: project?.titleEn || '',
    category: project?.category || 'ARCHITECTURE',
    locationKa: project?.locationKa || '',
    locationEn: project?.locationEn || '',
    featuredImage: project?.featuredImage || '',
    featured: project?.featured || false,
    featuredOrder: project?.featuredOrder ?? '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = form.titleEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const body = {
        ...form,
        slug,
        locationKa: form.locationKa || null,
        locationEn: form.locationEn || null,
        featuredImage: form.featuredImage || null,
        featuredOrder: form.featuredOrder ? Number(form.featuredOrder) : null,
      };

      const url = project
        ? `/api/admin/projects/${project.id}`
        : '/api/admin/projects';

      const res = await fetch(url, {
        method: project ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        if (!project) {
          router.push(`/admin/projects/${data.id}/edit`);
        } else {
          router.refresh();
        }
      } else {
        alert('შეცდომა მოხდა');
      }
    } catch {
      alert('შეცდომა მოხდა');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-lg font-semibold text-secondary-900">
          {project ? 'პროექტის რედაქტირება' : 'ახალი პროექტი'}
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              სახელი (ქართ.)
            </label>
            <input
              name="titleKa"
              value={form.titleKa}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              სახელი (ინგ.)
            </label>
            <input
              name="titleEn"
              value={form.titleEn}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">კატეგორია</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none"
            >
              <option value="ARCHITECTURE">არქიტექტურა</option>
              <option value="URBAN">ურბანული</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">ლოკაცია (ქართ.)</label>
            <input
              name="locationKa"
              value={form.locationKa}
              onChange={handleChange}
              placeholder="თბილისი, საქართველო"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">ლოკაცია (ინგ.)</label>
            <input
              name="locationEn"
              value={form.locationEn}
              onChange={handleChange}
              placeholder="Tbilisi, Georgia"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">Featured სურათი</label>
          <p className="text-xs text-secondary-400 mb-2">ეს სურათი გამოჩნდება პროექტების სიაში და მთავარ გვერდზე</p>
          <ImageUpload
            value={form.featuredImage || undefined}
            onChange={(url) => setForm((prev) => ({ ...prev, featuredImage: url }))}
            onRemove={() => setForm((prev) => ({ ...prev, featuredImage: '' }))}
            folder="urban-space/projects"
          />
        </div>

        {/* Featured toggle and order */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-secondary-700">მთავარ გვერდზე ჩვენება</span>
          </label>
          {form.featured && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-secondary-700">რიგითობა:</label>
              <select
                name="featuredOrder"
                value={form.featuredOrder}
                onChange={handleChange}
                className="px-3 py-1.5 border border-gray-200 rounded-lg outline-none text-sm"
              >
                <option value="">არჩევა</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'შენახვა...' : project ? 'განახლება' : 'შექმნა'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-gray-200 text-secondary-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          გაუქმება
        </button>
      </div>
    </form>
  );
}
