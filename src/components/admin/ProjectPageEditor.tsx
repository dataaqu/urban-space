'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';

interface ProjectPageData {
  id: string;
  type: 'SINGLE_IMAGE' | 'DOUBLE_IMAGE';
  order: number;
  image1: string;
  image2: string | null;
  textKa: string | null;
  textEn: string | null;
  textRightKa: string | null;
  textRightEn: string | null;
}

interface ProjectPageEditorProps {
  projectId: string;
  pages: ProjectPageData[];
}

export default function ProjectPageEditor({ projectId, pages: initialPages }: ProjectPageEditorProps) {
  const router = useRouter();
  const [pages, setPages] = useState<ProjectPageData[]>(initialPages);
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProjectPageData>>({});
  const [saving, setSaving] = useState(false);
  const [addingType, setAddingType] = useState<'SINGLE_IMAGE' | 'DOUBLE_IMAGE' | null>(null);
  const [newPage, setNewPage] = useState<Partial<ProjectPageData>>({
    image1: '',
    image2: '',
    textKa: '',
    textEn: '',
    textRightKa: '',
    textRightEn: '',
  });

  const handleAddPage = async () => {
    if (!addingType || !newPage.image1) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: addingType,
          image1: newPage.image1,
          image2: addingType === 'DOUBLE_IMAGE' ? newPage.image2 : null,
          textKa: newPage.textKa || null,
          textEn: newPage.textEn || null,
          textRightKa: newPage.textRightKa || null,
          textRightEn: newPage.textRightEn || null,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setPages((prev) => [...prev, created]);
        setAddingType(null);
        setNewPage({ image1: '', image2: '', textKa: '', textEn: '', textRightKa: '', textRightEn: '' });
        router.refresh();
      }
    } catch {
      alert('შეცდომა');
    } finally {
      setSaving(false);
    }
  };

  const handleEditPage = (page: ProjectPageData) => {
    setEditingPage(page.id);
    setEditForm({ ...page });
  };

  const handleSaveEdit = async () => {
    if (!editingPage) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/pages/${editingPage}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        const updated = await res.json();
        setPages((prev) => prev.map((p) => (p.id === editingPage ? updated : p)));
        setEditingPage(null);
        router.refresh();
      }
    } catch {
      alert('შეცდომა');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('წაშალოთ ეს გვერდი?')) return;

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/pages/${pageId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPages((prev) => prev.filter((p) => p.id !== pageId));
        router.refresh();
      }
    } catch {
      alert('შეცდომა');
    }
  };

  const handleReorder = async (pageId: string, direction: 'up' | 'down') => {
    const index = pages.findIndex((p) => p.id === pageId);
    if ((direction === 'up' && index <= 0) || (direction === 'down' && index >= pages.length - 1)) return;

    const newPages = [...pages];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newPages[index], newPages[swapIndex]] = [newPages[swapIndex], newPages[index]];

    const reordered = newPages.map((p, i) => ({ ...p, order: i }));
    setPages(reordered);

    try {
      await fetch(`/api/admin/projects/${projectId}/pages/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages: reordered.map((p) => ({ id: p.id, order: p.order })) }),
      });
    } catch {
      alert('შეცდომა');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-secondary-900">გვერდები ({pages.length})</h2>
      </div>

      {/* Pages list */}
      <div className="space-y-4">
        {pages.map((page, index) => (
          <div key={page.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            {editingPage === page.id ? (
              /* Edit mode */
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-secondary-500">
                    გვერდი {index + 1} — {page.type === 'SINGLE_IMAGE' ? '1 სურათი + ტექსტი' : '2 სურათი'}
                  </span>
                </div>

                {editForm.type === 'SINGLE_IMAGE' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-1">მარცხენა (ქართ.)</label>
                          <RichTextEditor
                            content={editForm.textKa || ''}
                            onChange={(html) => setEditForm((prev) => ({ ...prev, textKa: html }))}
                            placeholder="ქართული ტექსტი..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-1">მარცხენა (ინგ.)</label>
                          <RichTextEditor
                            content={editForm.textEn || ''}
                            onChange={(html) => setEditForm((prev) => ({ ...prev, textEn: html }))}
                            placeholder="English text..."
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">სურათი</label>
                        <ImageUpload
                          value={editForm.image1}
                          onChange={(url) => setEditForm((prev) => ({ ...prev, image1: url }))}
                          onRemove={() => setEditForm((prev) => ({ ...prev, image1: '' }))}
                          folder="urban-space/projects"
                        />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-1">მარჯვენა (ქართ.)</label>
                          <RichTextEditor
                            content={editForm.textRightKa || ''}
                            onChange={(html) => setEditForm((prev) => ({ ...prev, textRightKa: html }))}
                            placeholder="ქართული ტექსტი..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-1">მარჯვენა (ინგ.)</label>
                          <RichTextEditor
                            content={editForm.textRightEn || ''}
                            onChange={(html) => setEditForm((prev) => ({ ...prev, textRightEn: html }))}
                            placeholder="English text..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">სურათი 1</label>
                      <ImageUpload
                        value={editForm.image1}
                        onChange={(url) => setEditForm((prev) => ({ ...prev, image1: url }))}
                        onRemove={() => setEditForm((prev) => ({ ...prev, image1: '' }))}
                        folder="urban-space/projects"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">სურათი 2</label>
                      <ImageUpload
                        value={editForm.image2 || undefined}
                        onChange={(url) => setEditForm((prev) => ({ ...prev, image2: url }))}
                        onRemove={() => setEditForm((prev) => ({ ...prev, image2: '' }))}
                        folder="urban-space/projects"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {saving ? 'შენახვა...' : 'შენახვა'}
                  </button>
                  <button
                    onClick={() => setEditingPage(null)}
                    className="px-4 py-2 border border-gray-200 text-secondary-700 text-sm rounded-lg hover:bg-gray-50"
                  >
                    გაუქმება
                  </button>
                </div>
              </div>
            ) : (
              /* View mode */
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleReorder(page.id, 'up')}
                    disabled={index === 0}
                    className="text-xs text-secondary-400 hover:text-secondary-700 disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => handleReorder(page.id, 'down')}
                    disabled={index === pages.length - 1}
                    className="text-xs text-secondary-400 hover:text-secondary-700 disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>

                <div className="flex gap-3 flex-shrink-0">
                  <img src={page.image1} alt="" className="w-20 h-14 object-cover rounded" />
                  {page.image2 && (
                    <img src={page.image2} alt="" className="w-20 h-14 object-cover rounded" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-secondary-900">
                    გვერდი {index + 1}
                  </span>
                  <span className="text-xs text-secondary-400 ml-2">
                    {page.type === 'SINGLE_IMAGE' ? '1 სურათი + ტექსტი' : '2 სურათი'}
                  </span>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEditPage(page)}
                    className="px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg"
                  >
                    რედაქტირება
                  </button>
                  {index > 0 && (
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      წაშლა
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new page */}
      {addingType ? (
        <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-primary-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-secondary-900">
              ახალი გვერდი — {addingType === 'SINGLE_IMAGE' ? '1 სურათი + ტექსტი' : '2 სურათი'}
            </span>
            <button
              onClick={() => { setAddingType(null); setNewPage({ image1: '', image2: '', textKa: '', textEn: '' }); }}
              className="text-sm text-secondary-400 hover:text-secondary-700"
            >
              გაუქმება
            </button>
          </div>

          {addingType === 'SINGLE_IMAGE' ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">მარცხენა (ქართ.)</label>
                  <RichTextEditor
                    content={newPage.textKa || ''}
                    onChange={(html) => setNewPage((prev) => ({ ...prev, textKa: html }))}
                    placeholder="ქართული ტექსტი..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">მარცხენა (ინგ.)</label>
                  <RichTextEditor
                    content={newPage.textEn || ''}
                    onChange={(html) => setNewPage((prev) => ({ ...prev, textEn: html }))}
                    placeholder="English text..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">სურათი</label>
                <ImageUpload
                  value={newPage.image1 || undefined}
                  onChange={(url) => setNewPage((prev) => ({ ...prev, image1: url }))}
                  onRemove={() => setNewPage((prev) => ({ ...prev, image1: '' }))}
                  folder="urban-space/projects"
                />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">მარჯვენა (ქართ.)</label>
                  <RichTextEditor
                    content={newPage.textRightKa || ''}
                    onChange={(html) => setNewPage((prev) => ({ ...prev, textRightKa: html }))}
                    placeholder="ქართული ტექსტი..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">მარჯვენა (ინგ.)</label>
                  <RichTextEditor
                    content={newPage.textRightEn || ''}
                    onChange={(html) => setNewPage((prev) => ({ ...prev, textRightEn: html }))}
                    placeholder="English text..."
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">სურათი 1</label>
                <ImageUpload
                  value={newPage.image1 || undefined}
                  onChange={(url) => setNewPage((prev) => ({ ...prev, image1: url }))}
                  onRemove={() => setNewPage((prev) => ({ ...prev, image1: '' }))}
                  folder="urban-space/projects"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">სურათი 2</label>
                <ImageUpload
                  value={newPage.image2 || undefined}
                  onChange={(url) => setNewPage((prev) => ({ ...prev, image2: url }))}
                  onRemove={() => setNewPage((prev) => ({ ...prev, image2: '' }))}
                  folder="urban-space/projects"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleAddPage}
            disabled={saving || !newPage.image1}
            className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? 'შენახვა...' : 'დამატება'}
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => setAddingType('SINGLE_IMAGE')}
            className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-secondary-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
          >
            + 1 სურათი + ტექსტი
          </button>
          <button
            onClick={() => setAddingType('DOUBLE_IMAGE')}
            className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-secondary-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
          >
            + 2 სურათი
          </button>
        </div>
      )}
    </div>
  );
}
