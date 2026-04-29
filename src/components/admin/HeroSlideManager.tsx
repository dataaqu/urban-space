'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  Play,
  ImageOff,
  X,
  Images,
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import VideoUpload from '@/components/admin/VideoUpload';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  IconButton,
  Select,
  Skeleton,
  useToast,
} from '@/components/admin/ui';

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

export default function HeroSlideManager() {
  const toast = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<HeroSlide>>({});
  const [adding, setAdding] = useState(false);
  const [newSlide, setNewSlide] = useState({
    image: '',
    videoUrl: '',
    type: 'IMAGE' as 'IMAGE' | 'VIDEO',
  });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/hero')
      .then((res) => res.json())
      .then((data) => {
        setSlides(data);
        setLoading(false);
      })
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
        toast.success('სლაიდი დაემატა');
      } else {
        toast.error('დამატება ვერ მოხერხდა');
      }
    } catch {
      toast.error('შეცდომა');
    } finally {
      setSaving(false);
    }
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
        setSlides((prev) =>
          prev.map((s) => (s.id === editingSlide ? updated : s)),
        );
        setEditingSlide(null);
        toast.success('ცვლილებები შენახულია');
      } else {
        toast.error('შენახვა ვერ მოხერხდა');
      }
    } catch {
      toast.error('შეცდომა');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/hero/${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSlides((prev) => prev.filter((s) => s.id !== deleteId));
        toast.success('სლაიდი წაიშალა');
      } else {
        toast.error('წაშლა ვერ მოხერხდა');
      }
    } catch {
      toast.error('შეცდომა');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const idx = slides.findIndex((s) => s.id === id);
    if (
      (direction === 'up' && idx <= 0) ||
      (direction === 'down' && idx >= slides.length - 1)
    )
      return;
    const newSlides = [...slides];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newSlides[idx], newSlides[swapIdx]] = [newSlides[swapIdx], newSlides[idx]];
    const reordered = newSlides.map((s, i) => ({ ...s, order: i }));
    setSlides(reordered);
    try {
      await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slides: reordered.map((s) => ({ id: s.id, order: s.order })),
        }),
      });
    } catch {
      toast.error('რიგის განახლება ვერ მოხერხდა');
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-dark-900">
            <Images className="h-4 w-4 text-neutral-500" />
            Hero სლაიდერი
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            მართე მთავარ გვერდზე განთავსებული ფონური სურათები და ვიდეოები.
          </p>
        </div>
        {!adding && !loading && (
          <Button
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setAdding(true)}
          >
            სლაიდის დამატება
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-24" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/5" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : slides.length === 0 && !adding ? (
        <Card>
          <EmptyState
            icon={<Images />}
            title="სლაიდი ჯერ არ გაქვს"
            description="დაამატე პირველი სურათი ან ვიდეო Hero სექციისთვის."
            action={
              <Button
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setAdding(true)}
              >
                სლაიდის დამატება
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, index) => (
            <Card key={slide.id} className="overflow-hidden">
              {editingSlide === slide.id ? (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200/70 pb-3">
                    <h3 className="text-sm font-semibold text-dark-900">
                      სლაიდის რედაქტირება
                    </h3>
                    <IconButton
                      icon={<X />}
                      aria-label="Cancel"
                      onClick={() => setEditingSlide(null)}
                    />
                  </div>

                  <Select
                    label="ტიპი"
                    value={editForm.type || 'IMAGE'}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        type: e.target.value as 'IMAGE' | 'VIDEO',
                      }))
                    }
                  >
                    <option value="IMAGE">სურათი</option>
                    <option value="VIDEO">ვიდეო</option>
                  </Select>

                  {editForm.type === 'VIDEO' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1.5">
                          ვიდეო
                        </label>
                        <VideoUpload
                          value={editForm.videoUrl || undefined}
                          onChange={(url) =>
                            setEditForm((prev) => ({ ...prev, videoUrl: url }))
                          }
                          onRemove={() =>
                            setEditForm((prev) => ({ ...prev, videoUrl: '' }))
                          }
                          folder="urban-space/hero"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1.5">
                          Cover სურათი{' '}
                          <span className="text-neutral-400 font-normal">
                            (ოფციონალური)
                          </span>
                        </label>
                        <ImageUpload
                          value={editForm.image}
                          onChange={(url) =>
                            setEditForm((prev) => ({ ...prev, image: url }))
                          }
                          onRemove={() =>
                            setEditForm((prev) => ({ ...prev, image: '' }))
                          }
                          folder="urban-space/hero"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1.5">
                        სურათი
                      </label>
                      <ImageUpload
                        value={editForm.image}
                        onChange={(url) =>
                          setEditForm((prev) => ({ ...prev, image: url }))
                        }
                        onRemove={() =>
                          setEditForm((prev) => ({ ...prev, image: '' }))
                        }
                        folder="urban-space/hero"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSaveEdit} loading={saving}>
                      შენახვა
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setEditingSlide(null)}
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
                      onClick={() => handleReorder(slide.id, 'up')}
                      disabled={index === 0}
                    />
                    <IconButton
                      icon={<ChevronDown />}
                      aria-label="Move down"
                      size="sm"
                      onClick={() => handleReorder(slide.id, 'down')}
                      disabled={index === slides.length - 1}
                    />
                  </div>
                  <div className="h-16 w-28 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100 ring-1 ring-neutral-200/60">
                    {slide.type === 'VIDEO' ? (
                      <div className="flex h-full w-full items-center justify-center bg-dark-900 text-white">
                        <Play className="h-5 w-5 fill-white" />
                      </div>
                    ) : slide.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={slide.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-400">
                        <ImageOff className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-dark-900">
                        სლაიდი {index + 1}
                      </p>
                      <Badge variant={slide.type === 'VIDEO' ? 'gold' : 'muted'}>
                        {slide.type === 'VIDEO' ? 'ვიდეო' : 'სურათი'}
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
                      onClick={() => handleEdit(slide)}
                    >
                      რედაქტირება
                    </Button>
                    <Button
                      variant="dangerGhost"
                      size="sm"
                      leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                      onClick={() => setDeleteId(slide.id)}
                    >
                      წაშლა
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {adding && (
        <Card className="mt-4 overflow-hidden border-primary-200 ring-1 ring-primary-200/50">
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200/70 pb-3">
              <h3 className="text-sm font-semibold text-dark-900">
                ახალი სლაიდი
              </h3>
              <IconButton
                icon={<X />}
                aria-label="Cancel"
                onClick={() => {
                  setAdding(false);
                  setNewSlide({ image: '', videoUrl: '', type: 'IMAGE' });
                }}
              />
            </div>

            <Select
              label="ტიპი"
              value={newSlide.type}
              onChange={(e) =>
                setNewSlide((prev) => ({
                  ...prev,
                  type: e.target.value as 'IMAGE' | 'VIDEO',
                }))
              }
            >
              <option value="IMAGE">სურათი</option>
              <option value="VIDEO">ვიდეო</option>
            </Select>

            {newSlide.type === 'VIDEO' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">
                    ვიდეო
                  </label>
                  <VideoUpload
                    value={newSlide.videoUrl || undefined}
                    onChange={(url) =>
                      setNewSlide((prev) => ({ ...prev, videoUrl: url }))
                    }
                    onRemove={() =>
                      setNewSlide((prev) => ({ ...prev, videoUrl: '' }))
                    }
                    folder="urban-space/hero"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">
                    Cover სურათი{' '}
                    <span className="text-neutral-400 font-normal">
                      (ოფციონალური)
                    </span>
                  </label>
                  <ImageUpload
                    value={newSlide.image || undefined}
                    onChange={(url) =>
                      setNewSlide((prev) => ({ ...prev, image: url }))
                    }
                    onRemove={() =>
                      setNewSlide((prev) => ({ ...prev, image: '' }))
                    }
                    folder="urban-space/hero"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">
                  სურათი
                </label>
                <ImageUpload
                  value={newSlide.image || undefined}
                  onChange={(url) =>
                    setNewSlide((prev) => ({ ...prev, image: url }))
                  }
                  onRemove={() =>
                    setNewSlide((prev) => ({ ...prev, image: '' }))
                  }
                  folder="urban-space/hero"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleAdd}
                loading={saving}
                disabled={
                  newSlide.type === 'IMAGE'
                    ? !newSlide.image
                    : !newSlide.videoUrl
                }
              >
                დამატება
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setAdding(false);
                  setNewSlide({ image: '', videoUrl: '', type: 'IMAGE' });
                }}
                disabled={saving}
              >
                გაუქმება
              </Button>
            </div>
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="წაშალოთ ეს სლაიდი?"
        description="სლაიდი სამუდამოდ წაიშლება."
        confirmLabel="წაშლა"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
