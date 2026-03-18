export const dynamic = 'force-dynamic';

'use client';

import { useState, useEffect } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';

interface Settings {
  id: string;
  logo: string | null;
  favicon: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  mapLat: number | null;
  mapLng: number | null;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) alert('შენახულია!');
    } catch {
      alert('შეცდომა მოხდა');
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof Settings, value: any) => {
    setSettings((prev) => prev ? { ...prev, [field]: value } : null);
  };

  if (loading || !settings) return <div className="text-secondary-400">იტვირთება...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">პარამეტრები</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? 'შენახვა...' : 'შენახვა'}
        </button>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-secondary-900">ბრენდინგი</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">ლოგო</label>
              <ImageUpload
                value={settings.logo || undefined}
                onChange={(url) => update('logo', url)}
                onRemove={() => update('logo', null)}
                folder="urban-space/branding"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Favicon</label>
              <ImageUpload
                value={settings.favicon || undefined}
                onChange={(url) => update('favicon', url)}
                onRemove={() => update('favicon', null)}
                folder="urban-space/branding"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-secondary-900">საკონტაქტო ინფორმაცია</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">მისამართი</label>
              <input value={settings.address || ''} onChange={(e) => update('address', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">ელ-ფოსტა</label>
              <input value={settings.email || ''} onChange={(e) => update('email', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">ტელეფონი</label>
              <input value={settings.phone || ''} onChange={(e) => update('phone', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-secondary-900">სოციალური ქსელები</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Facebook URL</label>
              <input value={settings.facebookUrl || ''} onChange={(e) => update('facebookUrl', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Instagram URL</label>
              <input value={settings.instagramUrl || ''} onChange={(e) => update('instagramUrl', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">LinkedIn URL</label>
              <input value={settings.linkedinUrl || ''} onChange={(e) => update('linkedinUrl', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-secondary-900">რუკის კოორდინატები</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Latitude</label>
              <input type="number" step="any" value={settings.mapLat || ''} onChange={(e) => update('mapLat', parseFloat(e.target.value) || null)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Longitude</label>
              <input type="number" step="any" value={settings.mapLng || ''} onChange={(e) => update('mapLng', parseFloat(e.target.value) || null)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}