'use client';

import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftIcon, rightSlot, className, id, ...rest }, ref) => {
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
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400 [&_svg]:h-4 [&_svg]:w-4">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full h-10 rounded-lg border bg-white text-sm text-dark-900 placeholder:text-neutral-400',
              'transition-colors duration-150 outline-none',
              'focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
              'disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed',
              leftIcon ? 'pl-9' : 'pl-3.5',
              rightSlot ? 'pr-10' : 'pr-3.5',
              error
                ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                : 'border-neutral-200 hover:border-neutral-300',
              className,
            )}
            {...rest}
          />
          {rightSlot && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
              {rightSlot}
            </span>
          )}
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
Input.displayName = 'Input';
