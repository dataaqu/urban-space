'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  X,
  ImageOff,
  FileImage,
  Rows2,
} from 'lucide-react';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  IconButton,
  useToast,
} from './ui';

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

export default function ProjectPageEditor({
  projectId,
  pages: initialPages,
}: ProjectPageEditorProps) {
  const router = useRouter();
  const toast = useToast();
  const [pages, setPages] = useState<ProjectPageData[]>(initialPages);
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProjectPageData>>({});
  const [saving, setSaving] = useState(false);
  const [addingType, setAddingType] = useState<
    'SINGLE_IMAGE' | 'DOUBLE_IMAGE' | null
  >(null);
  const [newPage, setNewPage] = useState<Partial<ProjectPageData>>({
    image1: '',
    image2: '',
    textKa: '',
    textEn: '',
    textRightKa: '',
    textRightEn: '',
  });
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const resetNewPage = () =>
    setNewPage({
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
        resetNewPage();
        toast.success('გვერდი დაემატა');
        router.refresh();
      } else {
        toast.error('დამატება ვერ მოხერხდა');
      }
    } catch {
      toast.error('შეცდომა');
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
      const res = await fetch(
        `/api/admin/projects/${projectId}/pages/${editingPage}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editForm),
        },
      );
      if (res.ok) {
        const updated = await res.json();
        setPages((prev) =>
          prev.map((p) => (p.id === editingPage ? updated : p)),
        );
        setEditingPage(null);
        toast.success('გვერდი შენახულია');
        router.refresh();
      } else {
        toast.error('შენახვა ვერ მოხერხდა');
      }
    } catch {
      toast.error('შეცდომა');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async () => {
    if (!deletePageId) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/projects/${projectId}/pages/${deletePageId}`,
        { method: 'DELETE' },
      );
      if (res.ok) {
        setPages((prev) => prev.filter((p) => p.id !== deletePageId));
        toast.success('გვერდი წაიშალა');
        router.refresh();
      } else {
        toast.error('წაშლა ვერ მოხერხდა');
      }
    } catch {
      toast.error('შეცდომა');
    } finally {
      setDeleting(false);
      setDeletePageId(null);
    }
  };

  const handleReorder = async (pageId: string, direction: 'up' | 'down') => {
    const index = pages.findIndex((p) => p.id === pageId);
    if (
      (direction === 'up' && index <= 0) ||
      (direction === 'down' && index >= pages.length - 1)
    )
      return;

    const newPages = [...pages];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newPages[index], newPages[swapIndex]] = [
      newPages[swapIndex],
      newPages[index],
    ];
    const reordered = newPages.map((p, i) => ({ ...p, order: i }));
    setPages(reordered);
    try {
      await fetch(`/api/admin/projects/${projectId}/pages/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pages: reordered.map((p) => ({ id: p.id, order: p.order })),
        }),
      });
    } catch {
      toast.error('რიგის შეცვლა ვერ მოხერხდა');
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-dark-900">
            გვერდები{' '}
            <span className="text-neutral-400 font-normal">
              ({pages.length})
            </span>
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            პროექტის შიდა გვერდები — სურათი/ტექსტი ან ორი სურათი.
          </p>
        </div>
      </div>

      {pages.length > 0 && (
        <div className="space-y-3 mb-4">
          {pages.map((page, index) => (
            <Card key={page.id} className="overflow-hidden">
              {editingPage === page.id ? (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200/70 pb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-dark-900">
                        გვერდი {index + 1}
                      </h3>
                      <Badge>
                        {page.type === 'SINGLE_IMAGE'
                          ? 'სურათი + ტექსტი'
                          : '2 სურათი'}
                      </Badge>
                    </div>
                    <IconButton
                      icon={<X />}
                      aria-label="Cancel"
                      onClick={() => setEditingPage(null)}
                    />
                  </div>

                  {editForm.type === 'SINGLE_IMAGE' ? (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-dark-700 mb-1.5">
                            მარცხენა (ქართ.)
                          </label>
                          <RichTextEditor
                            content={editForm.textKa || ''}
                            onChange={(html) =>
                              setEditForm((prev) => ({ ...prev, textKa: html }))
                            }
                            placeholder="ქართული ტექსტი..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-dark-700 mb-1.5">
                            მარცხენა (ინგ.)
                          </label>
                          <RichTextEditor
                            content={editForm.textEn || ''}
                            onChange={(html) =>
                              setEditForm((prev) => ({ ...prev, textEn: html }))
                            }
                            placeholder="English text..."
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1.5">
                          სურათი
                        </label>
                        <ImageUpload
                          value={editForm.image1}
                          onChange={(url) =>
                            setEditForm((prev) => ({ ...prev, image1: url }))
                          }
                          onRemove={() =>
                            setEditForm((prev) => ({ ...prev, image1: '' }))
                          }
                          folder="urban-space/projects"
                        />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-dark-700 mb-1.5">
                            მარჯვენა (ქართ.)
                          </label>
                          <RichTextEditor
                            content={editForm.textRightKa || ''}
                            onChange={(html) =>
                              setEditForm((prev) => ({
                                ...prev,
                                textRightKa: html,
                              }))
                            }
                            placeholder="ქართული ტექსტი..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-dark-700 mb-1.5">
                            მარჯვენა (ინგ.)
                          </label>
                          <RichTextEditor
                            content={editForm.textRightEn || ''}
                            onChange={(html) =>
                              setEditForm((prev) => ({
                                ...prev,
                                textRightEn: html,
                              }))
                            }
                            placeholder="English text..."
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1.5">
                          სურათი 1
                        </label>
                        <ImageUpload
                          value={editForm.image1}
                          onChange={(url) =>
                            setEditForm((prev) => ({ ...prev, image1: url }))
                          }
                          onRemove={() =>
                            setEditForm((prev) => ({ ...prev, image1: '' }))
                          }
                          folder="urban-space/projects"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1.5">
                          სურათი 2
                        </label>
                        <ImageUpload
                          value={editForm.image2 || undefined}
                          onChange={(url) =>
                            setEditForm((prev) => ({ ...prev, image2: url }))
                          }
                          onRemove={() =>
                            setEditForm((prev) => ({ ...prev, image2: '' }))
                          }
                          folder="urban-space/projects"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSaveEdit} loading={saving}>
                      შენახვა
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setEditingPage(null)}
                      disabled={saving}
                    >
                      გაუქმება
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4">
                  <div className="flex flex-col">
                    <IconButton
                      icon={<ChevronUp />}
                      aria-label="Move up"
                      size="sm"
                      onClick={() => handleReorder(page.id, 'up')}
                      disabled={index === 0}
                    />
                    <IconButton
                      icon={<ChevronDown />}
                      aria-label="Move down"
                      size="sm"
                      onClick={() => handleReorder(page.id, 'down')}
                      disabled={index === pages.length - 1}
                    />
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {[page.image1, page.image2].filter(Boolean).map((src, i) => (
                      <div
                        key={i}
                        className="h-14 w-20 overflow-hidden rounded-md bg-neutral-100 ring-1 ring-neutral-200/60"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src as string}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                    {!page.image1 && !page.image2 && (
                      <div className="h-14 w-20 flex items-center justify-center rounded-md bg-neutral-100 text-neutral-400">
                        <ImageOff className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-dark-900">
                        გვერდი {index + 1}
                      </p>
                      <Badge>
                        {page.type === 'SINGLE_IMAGE'
                          ? 'სურათი + ტექსტი'
                          : '2 სურათი'}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      რიგი #{index + 1}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Pencil className="h-3.5 w-3.5" />}
                      onClick={() => handleEditPage(page)}
                    >
                      რედაქტირება
                    </Button>
                    {index > 0 && (
                      <Button
                        variant="dangerGhost"
                        size="sm"
                        leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                        onClick={() => setDeletePageId(page.id)}
                      >
                        წაშლა
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add new page */}
      {addingType ? (
        <Card className="overflow-hidden border-primary-200 ring-1 ring-primary-200/50">
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200/70 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-dark-900">
                  ახალი გვერდი
                </h3>
                <Badge>
                  {addingType === 'SINGLE_IMAGE'
                    ? 'სურათი + ტექსტი'
                    : '2 სურათი'}
                </Badge>
              </div>
              <IconButton
                icon={<X />}
                aria-label="Cancel"
                onClick={() => {
                  setAddingType(null);
                  resetNewPage();
                }}
              />
            </div>

            {addingType === 'SINGLE_IMAGE' ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1.5">
                      მარცხენა (ქართ.)
                    </label>
                    <RichTextEditor
                      content={newPage.textKa || ''}
                      onChange={(html) =>
                        setNewPage((prev) => ({ ...prev, textKa: html }))
                      }
                      placeholder="ქართული ტექსტი..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1.5">
                      მარცხენა (ინგ.)
                    </label>
                    <RichTextEditor
                      content={newPage.textEn || ''}
                      onChange={(html) =>
                        setNewPage((prev) => ({ ...prev, textEn: html }))
                      }
                      placeholder="English text..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">
                    სურათი
                  </label>
                  <ImageUpload
                    value={newPage.image1 || undefined}
                    onChange={(url) =>
                      setNewPage((prev) => ({ ...prev, image1: url }))
                    }
                    onRemove={() =>
                      setNewPage((prev) => ({ ...prev, image1: '' }))
                    }
                    folder="urban-space/projects"
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1.5">
                      მარჯვენა (ქართ.)
                    </label>
                    <RichTextEditor
                      content={newPage.textRightKa || ''}
                      onChange={(html) =>
                        setNewPage((prev) => ({ ...prev, textRightKa: html }))
                      }
                      placeholder="ქართული ტექსტი..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1.5">
                      მარჯვენა (ინგ.)
                    </label>
                    <RichTextEditor
                      content={newPage.textRightEn || ''}
                      onChange={(html) =>
                        setNewPage((prev) => ({ ...prev, textRightEn: html }))
                      }
                      placeholder="English text..."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">
                    სურათი 1
                  </label>
                  <ImageUpload
                    value={newPage.image1 || undefined}
                    onChange={(url) =>
                      setNewPage((prev) => ({ ...prev, image1: url }))
                    }
                    onRemove={() =>
                      setNewPage((prev) => ({ ...prev, image1: '' }))
                    }
                    folder="urban-space/projects"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">
                    სურათი 2
                  </label>
                  <ImageUpload
                    value={newPage.image2 || undefined}
                    onChange={(url) =>
                      setNewPage((prev) => ({ ...prev, image2: url }))
                    }
                    onRemove={() =>
                      setNewPage((prev) => ({ ...prev, image2: '' }))
                    }
                    folder="urban-space/projects"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleAddPage}
                loading={saving}
                disabled={!newPage.image1}
              >
                დამატება
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setAddingType(null);
                  resetNewPage();
                }}
                disabled={saving}
              >
                გაუქმება
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={() => setAddingType('SINGLE_IMAGE')}
            className="group flex items-center gap-3 rounded-xl border-2 border-dashed border-neutral-300 bg-white px-5 py-4 text-left transition-all hover:border-primary-400 hover:bg-primary-50/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors">
              <FileImage className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-dark-900">
                სურათი + ტექსტი
              </p>
              <p className="text-xs text-neutral-500">
                ერთი სურათი, ტექსტი ორივე მხარეს
              </p>
            </div>
            <Plus className="h-4 w-4 text-neutral-400 group-hover:text-primary-600" />
          </button>
          <button
            onClick={() => setAddingType('DOUBLE_IMAGE')}
            className="group flex items-center gap-3 rounded-xl border-2 border-dashed border-neutral-300 bg-white px-5 py-4 text-left transition-all hover:border-primary-400 hover:bg-primary-50/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors">
              <Rows2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-dark-900">
                2 სურათი
              </p>
              <p className="text-xs text-neutral-500">
                ორი სურათი გვერდიგვერდ
              </p>
            </div>
            <Plus className="h-4 w-4 text-neutral-400 group-hover:text-primary-600" />
          </button>
        </div>
      )}

      <ConfirmDialog
        open={deletePageId !== null}
        title="წაშალოთ ეს გვერდი?"
        description="გვერდი სამუდამოდ წაიშლება."
        confirmLabel="წაშლა"
        onConfirm={handleDeletePage}
        onCancel={() => setDeletePageId(null)}
        loading={deleting}
      />
    </div>
  );
}
