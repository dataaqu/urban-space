'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, className, id, children, ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-dark-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full h-10 rounded-lg border bg-white pl-3.5 pr-9 text-sm text-dark-900 appearance-none cursor-pointer',
              'transition-colors duration-150 outline-none',
              'focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
              'disabled:bg-neutral-50 disabled:text-neutral-500',
              error
                ? 'border-red-400'
                : 'border-neutral-200 hover:border-neutral-300',
              className,
            )}
            {...rest}
          >
            {children}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
            aria-hidden
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-red-600">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-neutral-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Select.displayName = 'Select';
