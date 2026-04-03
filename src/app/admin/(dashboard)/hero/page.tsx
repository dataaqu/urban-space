'use client';

import { useState, useEffect, useRef } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';

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

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

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
      body: JSON.stringify({ image: imageUrl, type: 'IMAGE' }),
    });
    if (res.ok) {
      const slide = await res.json();
      setSlides((prev) => [...prev, slide]);
    }
  };

  const uploadVideo = async (file: File) => {
    setVideoUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'urban-space/hero');

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      const { url } = await uploadRes.json();

      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: url,
          videoUrl: url,
          type: 'VIDEO',
        }),
      });
      if (res.ok) {
        const slide = await res.json();
        setSlides((prev) => [...prev, slide]);
      }
    } catch (error) {
      console.error('Video upload error:', error);
      alert('ვიდეოს ატვირთვა ვერ მოხერხდა');
    } finally {
      setVideoUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
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

            {slide.type === 'VIDEO' ? (
              <div className="w-48 h-28 rounded-lg bg-gray-900 flex items-center justify-center text-white text-xs">
                <div className="text-center">
                  <span className="text-2xl block mb-1">▶</span>
                  <span className="text-gray-400 text-[10px] break-all px-2">{slide.videoUrl?.slice(0, 40)}...</span>
                </div>
              </div>
            ) : (
              <img src={slide.image} alt="" className="w-48 h-28 object-cover rounded-lg" />
            )}

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${slide.type === 'VIDEO' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {slide.type === 'VIDEO' ? 'ვიდეო' : 'სურათი'}
                </span>
              </div>

              {slide.type === 'VIDEO' && (
                <input
                  value={slide.videoUrl || ''}
                  onChange={(e) => updateSlide(slide.id, { videoUrl: e.target.value })}
                  placeholder="ვიდეოს URL"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                />
              )}

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

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-secondary-700 mb-2">სურათის დამატება</h3>
          <ImageUpload onChange={addSlide} folder="urban-space/hero" />
        </div>

        <div>
          <h3 className="text-sm font-medium text-secondary-700 mb-2">ვიდეოს ატვირთვა</h3>
          <div
            onClick={() => !videoUploading && videoInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              videoUploading ? 'border-purple-300 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
            }`}
          >
            {videoUploading ? (
              <div className="text-secondary-500">
                <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-sm">ვიდეო იტვირთება...</p>
              </div>
            ) : (
              <div className="text-secondary-400">
                <p className="text-3xl mb-2">🎬</p>
                <p className="text-sm">დააკლიკეთ ვიდეოს ასატვირთად (MP4, WebM)</p>
              </div>
            )}
          </div>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadVideo(file);
            }}
            className="hidden"
          />
          <div className="mt-3 text-xs text-gray-400 space-y-1">
            <p className="font-medium text-gray-500">რეკომენდაციები:</p>
            <p>ხანგრძლივობა: 15-30 წამი (loop-ში იქნება)</p>
            <p>ზომა: 5-15MB იდეალურია</p>
            <p>რეზოლუცია: 1920x1080 საკმარისია</p>
            <p>ფორმატი: MP4 (H.264) — ყველაზე თავსებადი</p>
          </div>
        </div>
      </div>
    </div>
  );
}
