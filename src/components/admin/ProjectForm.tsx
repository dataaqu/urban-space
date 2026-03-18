'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';

interface ProjectFormProps {
  project?: any;
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(project?.images || []);
  const [form, setForm] = useState({
    titleKa: project?.titleKa || '',
    titleEn: project?.titleEn || '',
    descriptionKa: project?.descriptionKa || '',
    descriptionEn: project?.descriptionEn || '',
    category: project?.category || 'ARCHITECTURE',
    type: project?.type || 'RESIDENTIAL_MULTI',
    status: project?.status || 'ONGOING',
    year: project?.year || new Date().getFullYear(),
    location: project?.location || '',
    area: project?.area || '',
    featured: project?.featured || false,
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
        images,
        year: Number(form.year),
        area: form.area ? Number(form.area) : null,
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
        router.push('/admin/projects');
        router.refresh();
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addImage = (url: string) => {
    setImages((prev) => [...prev, url]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-lg font-semibold text-secondary-900">ძირითადი ინფორმაცია</h2>

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

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              აღწერა (ქართ.)
            </label>
            <textarea
              name="descriptionKa"
              value={form.descriptionKa}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              აღწერა (ინგ.)
            </label>
            <textarea
              name="descriptionEn"
              value={form.descriptionEn}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">კატეგორია</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none">
              <option value="ARCHITECTURE">არქიტექტურა</option>
              <option value="URBAN">ურბანული</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">ტიპი</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none">
              <option value="RESIDENTIAL_MULTI">მრავალბინიანი საცხოვრებელი</option>
              <option value="PUBLIC_MULTIFUNCTIONAL">საზოგადოებრივი მრავალფუნქციური</option>
              <option value="INDIVIDUAL_HOUSE">ინდივიდუალური სახლი</option>
              <option value="URBAN_PLANNING">ურბანული დაგეგმარება</option>
              <option value="COMPETITION">კონკურსი</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">სტატუსი</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none">
              <option value="ONGOING">მიმდინარე</option>
              <option value="COMPLETED">დასრულებული</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">წელი</label>
            <input name="year" type="number" value={form.year} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">ლოკაცია</label>
            <input name="location" value={form.location} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">ფართი (მ2)</label>
            <input name="area" type="number" value={form.area} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-secondary-700">Featured პროექტი</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-semibold text-secondary-900">სურათები</h2>

        <div className="grid grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200">
              <img src={img} alt="" className="w-full h-32 object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                X
              </button>
            </div>
          ))}
          <ImageUpload
            onChange={addImage}
            folder="urban-space/projects"
          />
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
