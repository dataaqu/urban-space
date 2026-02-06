'use client';

import { forwardRef, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type IconAnimation = 'none' | 'slide' | 'bounce';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-animated' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconAnimation?: IconAnimation;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      leftIcon,
      rightIcon,
      iconAnimation = 'slide',
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center font-medium rounded-md transition-all duration-300',
      'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2',
      'disabled:opacity-50 disabled:pointer-events-none',
      'relative overflow-hidden'
    );

    const variants = {
      primary: cn(
        'bg-primary-500 text-white',
        'hover:bg-primary-600 hover:shadow-glow-gold',
        'active:bg-primary-700'
      ),
      secondary: cn(
        'bg-secondary-900 text-white',
        'hover:bg-secondary-800',
        'active:bg-secondary-950'
      ),
      outline: cn(
        'border-2 border-primary-500 text-primary-600',
        'hover:bg-primary-50 hover:border-primary-600',
        'active:bg-primary-100'
      ),
      'outline-animated': cn(
        'border-2 border-white/30 text-white bg-transparent',
        'hover:border-primary-400 hover:text-primary-400',
        'active:border-primary-500',
        'group'
      ),
      ghost: cn(
        'text-secondary-700 bg-transparent',
        'hover:bg-secondary-100 hover:text-secondary-900',
        'active:bg-secondary-200'
      ),
      gold: cn(
        'bg-gradient-gold text-dark-900 font-semibold',
        'hover:shadow-glow-gold',
        'active:opacity-90'
      ),
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-8 py-3.5 text-base gap-2.5',
    };

    const iconAnimations = {
      none: {},
      slide: {
        initial: { x: 0 },
        animate: { x: 0 },
        whileHover: { x: 4 },
      },
      bounce: {
        initial: { y: 0 },
        animate: { y: 0 },
        whileHover: { y: [0, -3, 0] },
        transition: { duration: 0.5, repeat: Infinity },
      },
    };

    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    const renderIcon = (icon: ReactNode, position: 'left' | 'right') => {
      if (!icon) return null;

      const animation = iconAnimation !== 'none' ? iconAnimations[iconAnimation] : {};

      return (
        <motion.span
          className={cn(
            'inline-flex items-center justify-center',
            position === 'right' && 'transition-transform duration-300 group-hover:translate-x-1'
          )}
          {...(position === 'right' ? animation : {})}
        >
          {icon}
        </motion.span>
      );
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Sweep Effect Background for outline-animated variant */}
        {variant === 'outline-animated' && (
          <span className="absolute inset-0 w-0 bg-primary-500/10 transition-all duration-500 ease-out-expo group-hover:w-full" />
        )}

        {/* Content */}
        <span className="relative z-10 inline-flex items-center gap-2">
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span>Loading...</span>
            </>
          ) : (
            <>
              {renderIcon(leftIcon, 'left')}
              <span>{children}</span>
              {renderIcon(rightIcon, 'right')}
            </>
          )}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
