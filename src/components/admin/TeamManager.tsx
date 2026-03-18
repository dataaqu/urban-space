'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';

interface TeamMember {
  id: string;
  nameKa: string;
  nameEn: string;
  positionKa: string;
  positionEn: string;
  image: string | null;
  order: number;
}

export function TeamManager({ initialMembers }: { initialMembers: TeamMember[] }) {
  const router = useRouter();
  const [members] = useState(initialMembers);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState({
    nameKa: '', nameEn: '', positionKa: '', positionEn: '', image: '',
  });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setForm({ nameKa: '', nameEn: '', positionKa: '', positionEn: '', image: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editing ? `/api/admin/team/${editing.id}` : '/api/admin/team';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        resetForm();
        router.refresh();
      }
    } catch {
      alert('შეცდომა მოხდა');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditing(member);
    setForm({
      nameKa: member.nameKa,
      nameEn: member.nameEn,
      positionKa: member.positionKa,
      positionEn: member.positionEn,
      image: member.image || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('დარწმუნებული ხართ?')) return;
    const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
  };

  return (
    <div>
      <button
        onClick={() => { resetForm(); setShowForm(true); }}
        className="mb-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        + წევრის დამატება
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="nameKa" value={form.nameKa} onChange={(e) => setForm((p) => ({ ...p, nameKa: e.target.value }))} placeholder="სახელი (ქართ.)" required className="px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
            <input name="nameEn" value={form.nameEn} onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))} placeholder="Name (En)" required className="px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
            <input name="positionKa" value={form.positionKa} onChange={(e) => setForm((p) => ({ ...p, positionKa: e.target.value }))} placeholder="პოზიცია (ქართ.)" required className="px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
            <input name="positionEn" value={form.positionEn} onChange={(e) => setForm((p) => ({ ...p, positionEn: e.target.value }))} placeholder="Position (En)" required className="px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
          </div>
          <ImageUpload value={form.image || undefined} onChange={(url) => setForm((p) => ({ ...p, image: url }))} onRemove={() => setForm((p) => ({ ...p, image: '' }))} folder="urban-space/team" />
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
              {loading ? 'შენახვა...' : editing ? 'განახლება' : 'დამატება'}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">გაუქმება</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            {member.image ? (
              <img src={member.image} alt="" className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-xl">👤</div>
            )}
            <div className="flex-1">
              <p className="font-medium text-secondary-900">{member.nameKa}</p>
              <p className="text-sm text-secondary-500">{member.positionKa}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(member)} className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded">რედაქტირება</button>
              <button onClick={() => handleDelete(member.id)} className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">წაშლა</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
