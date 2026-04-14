'use client';

import { useState, useEffect } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';
import VideoUpload from '@/components/admin/VideoUpload';

interface HeroSlide {
  id: string;
  image: string;
  videoUrl: string | null;
  type: 'IMAGE' | 'VIDEO';
  titleKa: string | null;
  titleEn: string | null;
  order: number;
  active: boolean;
}

export default function HeroManagerPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<HeroSlide>>({});
  const [adding, setAdding] = useState(false);
  const [newSlide, setNewSlide] = useState({ image: '', videoUrl: '', type: 'IMAGE' as 'IMAGE' | 'VIDEO' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/hero')
      .then((res) => res.json())
      .then((data) => { setSlides(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (newSlide.type === 'IMAGE' && !newSlide.image) return;
    if (newSlide.type === 'VIDEO' && !newSlide.videoUrl) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: newSlide.image || '',
          videoUrl: newSlide.videoUrl || null,
          type: newSlide.type,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setSlides((prev) => [...prev, created]);
        setAdding(false);
        setNewSlide({ image: '', videoUrl: '', type: 'IMAGE' });
      }
    } catch { alert('შეცდომა'); }
    finally { setSaving(false); }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide.id);
    setEditForm({ ...slide });
  };

  const handleSaveEdit = async () => {
    if (!editingSlide) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/hero/${editingSlide}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setSlides((prev) => prev.map((s) => (s.id === editingSlide ? updated : s)));
        setEditingSlide(null);
      }
    } catch { alert('შეცდომა'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('წაშალოთ ეს სლაიდი?')) return;
    try {
      const res = await fetch(`/api/admin/hero/${id}`, { method: 'DELETE' });
      if (res.ok) setSlides((prev) => prev.filter((s) => s.id !== id));
    } catch { alert('შეცდომა'); }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const idx = slides.findIndex((s) => s.id === id);
    if ((direction === 'up' && idx <= 0) || (direction === 'down' && idx >= slides.length - 1)) return;
    const newSlides = [...slides];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newSlides[idx], newSlides[swapIdx]] = [newSlides[swapIdx], newSlides[idx]];
    const reordered = newSlides.map((s, i) => ({ ...s, order: i }));
    setSlides(reordered);
    try {
      await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides: reordered.map((s) => ({ id: s.id, order: s.order })) }),
      });
    } catch { alert('შეცდომა'); }
  };

  if (loading) return <div className="text-secondary-500">იტვირთება...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">Hero სლაიდერი</h1>
      </div>

      <div className="space-y-4">
        {slides.map((slide, index) => (
          <div key={slide.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            {editingSlide === slide.id ? (
              <div className="space-y-4">
                {/* Type selector */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">ტიპი</label>
                  <select
                    value={editForm.type || 'IMAGE'}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, type: e.target.value as 'IMAGE' | 'VIDEO' }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                  >
                    <option value="IMAGE">სურათი</option>
                    <option value="VIDEO">ვიდეო</option>
                  </select>
                </div>

                {editForm.type === 'VIDEO' ? (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">ვიდეო</label>
                    <VideoUpload
                      value={editForm.videoUrl || undefined}
                      onChange={(url) => setEditForm((prev) => ({ ...prev, videoUrl: url }))}
                      onRemove={() => setEditForm((prev) => ({ ...prev, videoUrl: '' }))}
                      folder="urban-space/hero"
                    />
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-secondary-700 mb-1">Cover სურათი (ოფციონალური)</label>
                      <ImageUpload
                        value={editForm.image}
                        onChange={(url) => setEditForm((prev) => ({ ...prev, image: url }))}
                        onRemove={() => setEditForm((prev) => ({ ...prev, image: '' }))}
                        folder="urban-space/hero"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">სურათი</label>
                    <ImageUpload
                      value={editForm.image}
                      onChange={(url) => setEditForm((prev) => ({ ...prev, image: url }))}
                      onRemove={() => setEditForm((prev) => ({ ...prev, image: '' }))}
                      folder="urban-space/hero"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={handleSaveEdit} disabled={saving} className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50">
                    {saving ? 'შენახვა...' : 'შენახვა'}
                  </button>
                  <button onClick={() => setEditingSlide(null)} className="px-4 py-2 border border-gray-200 text-secondary-700 text-sm rounded-lg hover:bg-gray-50">
                    გაუქმება
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <button onClick={() => handleReorder(slide.id, 'up')} disabled={index === 0} className="text-xs text-secondary-400 hover:text-secondary-700 disabled:opacity-30">▲</button>
                  <button onClick={() => handleReorder(slide.id, 'down')} disabled={index === slides.length - 1} className="text-xs text-secondary-400 hover:text-secondary-700 disabled:opacity-30">▼</button>
                </div>
                {slide.type === 'VIDEO' ? (
                  <div className="w-24 h-16 bg-gray-900 rounded flex items-center justify-center text-white text-lg">▶</div>
                ) : (
                  <img src={slide.image} alt="" className="w-24 h-16 object-cover rounded" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900">სლაიდი {index + 1}</p>
                  <p className="text-xs text-secondary-400">{slide.type === 'VIDEO' ? 'ვიდეო' : 'სურათი'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(slide)} className="px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg">რედაქტირება</button>
                  <button onClick={() => handleDelete(slide.id)} className="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg">წაშლა</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new slide */}
      {adding ? (
        <div className="mt-4 bg-white rounded-xl p-5 shadow-sm border-2 border-primary-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">ტიპი</label>
            <select
              value={newSlide.type}
              onChange={(e) => setNewSlide((prev) => ({ ...prev, type: e.target.value as 'IMAGE' | 'VIDEO' }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
            >
              <option value="IMAGE">სურათი</option>
              <option value="VIDEO">ვიდეო</option>
            </select>
          </div>

          {newSlide.type === 'VIDEO' ? (
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">ვიდეო</label>
              <VideoUpload
                value={newSlide.videoUrl || undefined}
                onChange={(url) => setNewSlide((prev) => ({ ...prev, videoUrl: url }))}
                onRemove={() => setNewSlide((prev) => ({ ...prev, videoUrl: '' }))}
                folder="urban-space/hero"
              />
              <div className="mt-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1">Cover სურათი (ოფციონალური)</label>
                <ImageUpload
                  value={newSlide.image || undefined}
                  onChange={(url) => setNewSlide((prev) => ({ ...prev, image: url }))}
                  onRemove={() => setNewSlide((prev) => ({ ...prev, image: '' }))}
                  folder="urban-space/hero"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">სურათი</label>
              <ImageUpload
                value={newSlide.image || undefined}
                onChange={(url) => setNewSlide((prev) => ({ ...prev, image: url }))}
                onRemove={() => setNewSlide((prev) => ({ ...prev, image: '' }))}
                folder="urban-space/hero"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={saving || (newSlide.type === 'IMAGE' ? !newSlide.image : !newSlide.videoUrl)}
              className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? 'შენახვა...' : 'დამატება'}
            </button>
            <button
              onClick={() => { setAdding(false); setNewSlide({ image: '', videoUrl: '', type: 'IMAGE' }); }}
              className="px-4 py-2 border border-gray-200 text-secondary-700 text-sm rounded-lg hover:bg-gray-50"
            >
              გაუქმება
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-secondary-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
        >
          + სლაიდის დამატება
        </button>
      )}
    </div>
  );
}
