'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type InputVariant = 'default' | 'floating' | 'premium';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, variant = 'default', leftIcon, rightIcon, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(props.value || props.defaultValue));

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(Boolean(e.target.value));
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value));
      props.onChange?.(e);
    };

    if (variant === 'floating') {
      return (
        <div className="w-full">
          <div className="relative">
            <input
              ref={ref}
              id={id}
              placeholder=" "
              className={cn(
                'peer w-full px-4 pt-6 pb-2 border rounded-lg bg-white/50 transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
                'placeholder-transparent',
                error
                  ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                  : 'border-secondary-200 hover:border-secondary-300',
                leftIcon && 'pl-11',
                rightIcon && 'pr-11',
                className
              )}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              {...props}
            />
            {leftIcon && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                {leftIcon}
              </span>
            )}
            {rightIcon && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400">
                {rightIcon}
              </span>
            )}
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  'absolute left-4 transition-all duration-200 pointer-events-none',
                  'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-secondary-400',
                  'peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary-600',
                  'top-3 translate-y-0 text-xs',
                  error ? 'text-red-500' : 'text-secondary-500',
                  leftIcon && 'peer-placeholder-shown:left-11 left-4'
                )}
              >
                {label}
              </label>
            )}
          </div>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Premium variant
    if (variant === 'premium') {
      return (
        <div className="w-full">
          {label && (
            <label
              htmlFor={id}
              className="block text-sm font-medium text-secondary-700 mb-2"
            >
              {label}
            </label>
          )}
          <div className="relative">
            {leftIcon && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                {leftIcon}
              </span>
            )}
            <input
              ref={ref}
              id={id}
              className={cn(
                'w-full px-4 py-3 border rounded-lg transition-all duration-300',
                'bg-white/50 backdrop-blur-sm',
                'focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500',
                'hover:border-secondary-300',
                error
                  ? 'border-red-500 focus:ring-red-500/10 focus:border-red-500'
                  : 'border-secondary-200',
                leftIcon && 'pl-11',
                rightIcon && 'pr-11',
                className
              )}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              {...props}
            />
            {rightIcon && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400">
                {rightIcon}
              </span>
            )}

            {/* Gold Focus Ring */}
            <motion.div
              initial={false}
              animate={{
                opacity: isFocused ? 1 : 0,
                scale: isFocused ? 1 : 0.98,
              }}
              className="absolute inset-0 rounded-lg ring-2 ring-primary-500/20 pointer-events-none"
            />
          </div>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Default variant
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-secondary-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full px-4 py-2.5 border rounded-lg shadow-sm transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
              error
                ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                : 'border-secondary-200',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">
              {rightIcon}
            </span>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-1 text-sm text-red-500"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'premium';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, variant = 'default', ...props }, ref) => {
    const isPremium = variant === 'premium';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-secondary-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 resize-none',
            'focus:outline-none focus:ring-2 focus:border-primary-500',
            isPremium
              ? 'bg-white/50 backdrop-blur-sm focus:ring-primary-500/10 focus:ring-4 hover:border-secondary-300'
              : 'focus:ring-primary-500/50',
            error
              ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
              : 'border-secondary-200',
            className
          )}
          {...props}
        />
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-1 text-sm text-red-500"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Input;
