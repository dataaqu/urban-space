'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteButtonProps {
  id: string;
  endpoint: string;
  label?: string;
}

export function DeleteButton({ id, endpoint, label = 'წაშლა' }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('დარწმუნებული ხართ, რომ გსურთ წაშლა?')) return;

    setLoading(true);
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('წაშლა ვერ მოხერხდა');
      }
    } catch {
      alert('შეცდომა მოხდა');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
    >
      {loading ? '...' : label}
    </button>
  );
}
