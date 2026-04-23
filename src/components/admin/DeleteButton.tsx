'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button, ConfirmDialog, useToast } from './ui';

interface DeleteButtonProps {
  id: string;
  endpoint: string;
  label?: string;
  itemName?: string;
}

export function DeleteButton({
  id,
  endpoint,
  label = 'წაშლა',
  itemName,
}: DeleteButtonProps) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('წარმატებით წაიშალა');
        setOpen(false);
        router.refresh();
      } else {
        toast.error('წაშლა ვერ მოხერხდა');
      }
    } catch {
      toast.error('შეცდომა მოხდა');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="dangerGhost"
        size="sm"
        leftIcon={<Trash2 className="h-3.5 w-3.5" />}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      <ConfirmDialog
        open={open}
        title="დარწმუნებული ხართ?"
        description={
          itemName ? (
            <>
              ნაერთი <strong className="text-dark-900">{itemName}</strong>{' '}
              სამუდამოდ წაიშლება. ამ მოქმედების გაუქმება შეუძლებელია.
            </>
          ) : (
            'ჩანაწერი სამუდამოდ წაიშლება. ამ მოქმედების გაუქმება შეუძლებელია.'
          )
        }
        confirmLabel="წაშლა"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
        loading={loading}
      />
    </>
  );
}
