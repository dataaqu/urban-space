'use client';

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

type Variant = 'ghost' | 'ghostDanger' | 'solid';
type Size = 'sm' | 'md' | 'lg';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon: ReactNode;
  'aria-label': string;
}

const base =
  'inline-flex items-center justify-center rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-40 disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  ghost: 'text-dark-600 hover:bg-neutral-100 hover:text-dark-900',
  ghostDanger: 'text-neutral-500 hover:bg-red-50 hover:text-red-600',
  solid: 'bg-dark-900 text-white hover:bg-dark-800',
};

const sizes: Record<Size, string> = {
  sm: 'h-7 w-7 [&_svg]:h-3.5 [&_svg]:w-3.5',
  md: 'h-9 w-9 [&_svg]:h-4 [&_svg]:w-4',
  lg: 'h-10 w-10 [&_svg]:h-5 [&_svg]:w-5',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'md', icon, className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...rest}
      >
        {icon}
      </button>
    );
  },
);
IconButton.displayName = 'IconButton';
