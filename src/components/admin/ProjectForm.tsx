'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Star } from 'lucide-react';
import ImageUpload from './ImageUpload';
import {
  Button,
  Card,
  Input,
  Select,
  useToast,
} from './ui';

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
  const toast = useToast();
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
        featuredOrder: form.featuredOrder
          ? Number(form.featuredOrder)
          : null,
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
        toast.success(
          project ? 'პროექტი განახლდა' : 'პროექტი შეიქმნა',
        );
        if (!project) {
          router.push(`/admin/projects/${data.id}/edit`);
        } else {
          router.refresh();
        }
      } else {
        toast.error('შეცდომა მოხდა');
      }
    } catch {
      toast.error('შეცდომა მოხდა');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <Card padded>
        <div className="mb-6">
          <h2 className="text-base font-semibold text-dark-900">
            ძირითადი ინფორმაცია
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            პროექტის სახელი, კატეგორია და მდებარეობა.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="სახელი (ქართ.)"
            name="titleKa"
            value={form.titleKa}
            onChange={handleChange}
            required
          />
          <Input
            label="სახელი (ინგ.)"
            name="titleEn"
            value={form.titleEn}
            onChange={handleChange}
            required
            hint="ეს გამოიყენება URL-ში"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <Select
            label="კატეგორია"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="ARCHITECTURE">არქიტექტურა</option>
            <option value="URBAN">ურბანული</option>
          </Select>
          <Input
            label="აღწერა (ქართ.)"
            name="locationKa"
            value={form.locationKa}
            onChange={handleChange}
            placeholder="მოკლე აღწერა"
          />
          <Input
            label="აღწერა (ინგ.)"
            name="locationEn"
            value={form.locationEn}
            onChange={handleChange}
            placeholder="Short description"
          />
        </div>
      </Card>

      <Card padded>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-dark-900">
            Featured სურათი
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            ეს სურათი გამოჩნდება პროექტების სიაში და მთავარ გვერდზე.
          </p>
        </div>
        <ImageUpload
          value={form.featuredImage || undefined}
          onChange={(url) =>
            setForm((prev) => ({ ...prev, featuredImage: url }))
          }
          onRemove={() =>
            setForm((prev) => ({ ...prev, featuredImage: '' }))
          }
          folder="urban-space/projects"
        />
      </Card>

      <Card padded>
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700 ring-1 ring-primary-100">
            <Star className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-dark-900">
              Featured ვიზიტი
            </h2>
            <p className="mt-0.5 text-sm text-neutral-500">
              გამოჩნდეს თუ არა მთავარ გვერდზე Selected Work სექციაში.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-dark-800">
              მთავარ გვერდზე ჩვენება
            </span>
          </label>

          {form.featured && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600">რიგითობა:</span>
              <select
                name="featuredOrder"
                value={form.featuredOrder}
                onChange={handleChange}
                className="h-9 rounded-lg border border-neutral-200 bg-white px-3 pr-8 text-sm hover:border-neutral-300 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
              >
                <option value="">არჩევა</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Card>

      <div className="flex items-center gap-2 pt-2">
        <Button
          type="submit"
          loading={loading}
          leftIcon={<Save className="h-4 w-4" />}
        >
          {project ? 'განახლება' : 'შექმნა'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => router.back()}
          disabled={loading}
        >
          გაუქმება
        </Button>
      </div>
    </form>
  );
}
