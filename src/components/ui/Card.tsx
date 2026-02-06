'use client';

import { forwardRef, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { scrollReveal } from '@/lib/animations';

type CardVariant = 'default' | 'glass' | 'dark' | 'outline';
type CardElevation = 0 | 1 | 2 | 3 | 4;

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  children: ReactNode;
  variant?: CardVariant;
  elevation?: CardElevation;
  hover?: boolean;
}

const elevationClasses: Record<CardElevation, string> = {
  0: 'shadow-none',
  1: 'shadow-subtle',
  2: 'shadow-sm',
  3: 'shadow-md',
  4: 'shadow-lg',
};

const hoverElevationClasses: Record<CardElevation, string> = {
  0: 'hover:shadow-sm',
  1: 'hover:shadow-md',
  2: 'hover:shadow-lg',
  3: 'hover:shadow-xl',
  4: 'hover:shadow-2xl',
};

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white border border-secondary-100',
  glass: 'glass',
  dark: 'glass-dark text-white',
  outline: 'bg-transparent border-2 border-secondary-200 hover:border-primary-500/50',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      children,
      variant = 'default',
      elevation = 2,
      hover = true,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        whileHover={hover ? { y: -4 } : undefined}
        transition={{ duration: 0.3 }}
        className={cn(
          'rounded-lg overflow-hidden transition-all duration-300',
          variantClasses[variant],
          elevationClasses[elevation],
          hover && hoverElevationClasses[elevation],
          hover && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'landscape' | 'golden';
  overlay?: boolean;
}

const aspectRatioClasses = {
  video: 'aspect-video',
  square: 'aspect-square',
  portrait: 'aspect-portrait',
  landscape: 'aspect-landscape',
  golden: 'aspect-golden',
};

export function CardImage({
  src,
  alt,
  className,
  aspectRatio = 'landscape',
  overlay = false,
}: CardImageProps) {
  return (
    <div className={cn('relative overflow-hidden img-zoom-container', aspectRatioClasses[aspectRatio], className)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
      {overlay && (
        <div className="overlay-dark" />
      )}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn('p-5 pb-0', className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('p-5 pt-0 mt-auto', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h2' | 'h3' | 'h4';
}

export function CardTitle({ children, className, as: Component = 'h3' }: CardTitleProps) {
  return (
    <Component className={cn('font-display text-lg font-semibold text-secondary-900', className)}>
      {children}
    </Component>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn('text-sm text-secondary-500 mt-2 leading-relaxed', className)}>
      {children}
    </p>
  );
}

interface CardBadgeProps {
  children: ReactNode;
  variant?: 'gold' | 'default' | 'success' | 'warning';
  className?: string;
}

export function CardBadge({ children, variant = 'default', className }: CardBadgeProps) {
  const badgeClasses = {
    gold: 'badge-gold',
    default: 'bg-secondary-100 text-secondary-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full',
      badgeClasses[variant],
      className
    )}>
      {children}
    </span>
  );
}

export default Card;
