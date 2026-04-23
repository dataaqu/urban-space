import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ padded = false, interactive = false, className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'bg-white rounded-xl border border-neutral-200/70 shadow-sm',
          padded && 'p-6',
          interactive &&
            'transition-all duration-150 hover:border-neutral-300 hover:shadow-md cursor-pointer',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = 'Card';

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'flex items-start justify-between gap-4 px-6 py-4 border-b border-neutral-200/70',
        className,
      )}
    >
      <div>
        <h3 className="text-base font-semibold text-dark-900 tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={clsx('p-6', className)}>{children}</div>;
}

export function CardFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={clsx(
        'px-6 py-3.5 border-t border-neutral-200/70 bg-neutral-50/40 rounded-b-xl',
        className,
      )}
    >
      {children}
    </div>
  );
}
