'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className, id, rows = 3, ...rest }, ref) => {
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
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={clsx(
            'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-dark-900 placeholder:text-neutral-400',
            'transition-colors duration-150 outline-none resize-none',
            'focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
            'disabled:bg-neutral-50 disabled:text-neutral-500',
            error
              ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
              : 'border-neutral-200 hover:border-neutral-300',
            className,
          )}
          {...rest}
        />
        {error ? (
          <p className="mt-1.5 text-xs text-red-600">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-neutral-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
