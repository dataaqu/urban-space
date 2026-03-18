'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';

interface Partner {
  id: string;
  name: string;
  logo: string | null;
  website: string | null;
  order: number;
}

export function PartnersManager({ initialPartners }: { initialPartners: Partner[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState({ name: '', logo: '', website: '' });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setForm({ name: '', logo: '', website: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editing ? `/api/admin/partners/${editing.id}` : '/api/admin/partners';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { resetForm(); router.refresh(); }
    } catch { alert('შეცდომა'); } finally { setLoading(false); }
  };

  const handleEdit = (p: Partner) => {
    setEditing(p);
    setForm({ name: p.name, logo: p.logo || '', website: p.website || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('დარწმუნებული ხართ?')) return;
    const res = await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
  };

  return (
    <div>
      <button onClick={() => { resetForm(); setShowForm(true); }} className="mb-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
        + პარტნიორის დამატება
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6 space-y-4">
          <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="სახელი" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
          <input value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} placeholder="ვებსაიტი (URL)" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
          <ImageUpload value={form.logo || undefined} onChange={(url) => setForm((p) => ({ ...p, logo: url }))} onRemove={() => setForm((p) => ({ ...p, logo: '' }))} folder="urban-space/partners" />
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50">{loading ? '...' : editing ? 'განახლება' : 'დამატება'}</button>
            <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">გაუქმება</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {initialPartners.map((partner) => (
          <div key={partner.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            {partner.logo ? (
              <img src={partner.logo} alt="" className="w-14 h-14 rounded object-contain bg-gray-50 p-1" />
            ) : (
              <div className="w-14 h-14 rounded bg-gray-100 flex items-center justify-center text-xl">🤝</div>
            )}
            <div className="flex-1">
              <p className="font-medium text-secondary-900">{partner.name}</p>
              {partner.website && <p className="text-sm text-secondary-500">{partner.website}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(partner)} className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded">რედაქტირება</button>
              <button onClick={() => handleDelete(partner.id)} className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">წაშლა</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
