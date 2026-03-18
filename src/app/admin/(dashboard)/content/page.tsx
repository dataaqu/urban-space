'use client';

import { useState, useEffect } from 'react';

interface ContentItem {
  id?: string;
  section: string;
  key: string;
  valueKa: string;
  valueEn: string;
  type: string;
}

const SECTIONS = [
  { id: 'home.hero', label: 'მთავარი - Hero' },
  { id: 'home.stats', label: 'მთავარი - სტატისტიკა' },
  { id: 'home.cta', label: 'მთავარი - CTA' },
  { id: 'studio.about', label: 'სტუდია - შესახებ' },
  { id: 'studio.principles', label: 'სტუდია - პრინციპები' },
  { id: 'contact', label: 'კონტაქტი' },
  { id: 'footer', label: 'Footer' },
];

export default function AdminContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => res.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = items.filter((item) => item.section === activeSection);

  const updateItem = (key: string, field: 'valueKa' | 'valueEn', value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.section === activeSection && item.key === key
          ? { ...item, [field]: value }
          : item
      )
    );
    setHasChanges(true);
  };

  const addItem = () => {
    const key = prompt('Key (მაგ: title, description):');
    if (!key) return;

    setItems((prev) => [
      ...prev,
      {
        section: activeSection,
        key,
        valueKa: '',
        valueEn: '',
        type: 'TEXT',
      },
    ]);
    setHasChanges(true);
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const sectionItems = items.filter((item) => item.section === activeSection);
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: sectionItems }),
      });

      if (res.ok) {
        setHasChanges(false);
        alert('შენახულია!');
      }
    } catch {
      alert('შეცდომა მოხდა');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-secondary-400">იტვირთება...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">ტექსტური კონტენტი</h1>
        <div className="flex gap-3">
          <button
            onClick={addItem}
            className="px-4 py-2 border border-gray-200 text-secondary-700 rounded-lg hover:bg-gray-50"
          >
            + ველის დამატება
          </button>
          {hasChanges && (
            <button
              onClick={saveChanges}
              disabled={saving}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? 'შენახვა...' : 'შენახვა'}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div key={item.key} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-mono text-secondary-400 mb-3">
              {item.section}.{item.key}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-secondary-500 mb-1">ქართული</label>
                <textarea
                  value={item.valueKa}
                  onChange={(e) => updateItem(item.key, 'valueKa', e.target.value)}
                  rows={item.valueKa.length > 100 ? 4 : 2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-500 mb-1">English</label>
                <textarea
                  value={item.valueEn}
                  onChange={(e) => updateItem(item.key, 'valueEn', e.target.value)}
                  rows={item.valueEn.length > 100 ? 4 : 2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-secondary-400 border border-gray-100">
            ამ სექციაში კონტენტი არ არის. დააკლიკეთ "+ ველის დამატება" ახლის შესაქმნელად.
          </div>
        )}
      </div>
    </div>
  );
}
