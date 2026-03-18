'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  titleKa: string;
  titleEn: string;
  descriptionKa: string | null;
  descriptionEn: string | null;
  icon: string | null;
  order: number;
}

export function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({
    titleKa: '', titleEn: '', descriptionKa: '', descriptionEn: '', icon: '',
  });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setForm({ titleKa: '', titleEn: '', descriptionKa: '', descriptionEn: '', icon: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editing ? `/api/admin/services/${editing.id}` : '/api/admin/services';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { resetForm(); router.refresh(); }
    } catch { alert('შეცდომა'); } finally { setLoading(false); }
  };

  const handleEdit = (s: Service) => {
    setEditing(s);
    setForm({
      titleKa: s.titleKa, titleEn: s.titleEn,
      descriptionKa: s.descriptionKa || '', descriptionEn: s.descriptionEn || '',
      icon: s.icon || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('დარწმუნებული ხართ?')) return;
    const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
  };

  return (
    <div>
      <button onClick={() => { resetForm(); setShowForm(true); }} className="mb-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
        + სერვისის დამატება
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input value={form.titleKa} onChange={(e) => setForm((p) => ({ ...p, titleKa: e.target.value }))} placeholder="სახელი (ქართ.)" required className="px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
            <input value={form.titleEn} onChange={(e) => setForm((p) => ({ ...p, titleEn: e.target.value }))} placeholder="Title (En)" required className="px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <textarea value={form.descriptionKa} onChange={(e) => setForm((p) => ({ ...p, descriptionKa: e.target.value }))} placeholder="აღწერა (ქართ.)" rows={3} className="px-4 py-2.5 border border-gray-200 rounded-lg outline-none resize-none" />
            <textarea value={form.descriptionEn} onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))} placeholder="Description (En)" rows={3} className="px-4 py-2.5 border border-gray-200 rounded-lg outline-none resize-none" />
          </div>
          <input value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} placeholder="Icon (emoji)" className="w-32 px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50">{loading ? '...' : editing ? 'განახლება' : 'დამატება'}</button>
            <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">გაუქმება</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {initialServices.map((service) => (
          <div key={service.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <span className="text-2xl">{service.icon || '⚡'}</span>
            <div className="flex-1">
              <p className="font-medium text-secondary-900">{service.titleKa}</p>
              <p className="text-sm text-secondary-500">{service.titleEn}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(service)} className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded">რედაქტირება</button>
              <button onClick={() => handleDelete(service.id)} className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">წაშლა</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
