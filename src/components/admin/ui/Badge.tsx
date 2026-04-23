import { HTMLAttributes } from 'react';
import clsx from 'clsx';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'gold' | 'muted';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  default: 'bg-neutral-100 text-dark-700 border-neutral-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  gold: 'bg-primary-50 text-primary-800 border-primary-200',
  muted: 'bg-neutral-50 text-neutral-600 border-neutral-200',
};

export function Badge({
  variant = 'default',
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
