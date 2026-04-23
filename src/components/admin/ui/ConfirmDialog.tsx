'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import clsx from 'clsx';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'დადასტურება',
  cancelLabel = 'გაუქმება',
  destructive = true,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => setEnter(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setEnter(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className={clsx(
        'fixed inset-0 z-[90] flex items-center justify-center px-4',
        'transition-opacity duration-150',
        enter ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div
        className="absolute inset-0 bg-dark-900/50 backdrop-blur-sm"
        onClick={() => !loading && onCancel()}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={clsx(
          'relative w-full max-w-md rounded-2xl bg-white shadow-xl',
          'transition-transform duration-200 ease-out',
          enter ? 'scale-100' : 'scale-95',
        )}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={clsx(
                'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
                destructive
                  ? 'bg-red-50 text-red-600'
                  : 'bg-primary-50 text-primary-600',
              )}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-dark-900">{title}</h3>
              {description && (
                <div className="mt-1.5 text-sm text-neutral-600 leading-relaxed">
                  {description}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={destructive ? 'danger' : 'primary'}
              onClick={onConfirm}
              loading={loading}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
