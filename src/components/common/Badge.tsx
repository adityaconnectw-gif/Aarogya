import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getStatusBadgeVariant } from '../../utils/formatters';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'auto';
  status?: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'auto',
  status,
  size = 'md',
  dot = false,
  className,
  ...props
}) => {
  let colorStyles = 'bg-surface-alt text-foreground border-border';

  if (variant === 'auto' && status) {
    const s = getStatusBadgeVariant(status);
    colorStyles = `${s.bg} ${s.text} ${s.border}`;
  } else if (variant === 'primary') {
    colorStyles = 'bg-primary-muted text-primary border-primary/20';
  } else if (variant === 'success') {
    colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
  } else if (variant === 'warning') {
    colorStyles = 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
  } else if (variant === 'danger') {
    colorStyles = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
  } else if (variant === 'info') {
    colorStyles = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800';
  } else if (variant === 'outline') {
    colorStyles = 'bg-transparent text-foreground border-border';
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs font-medium',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-full border font-medium tracking-tight',
          colorStyles,
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-current shrink-0"
          aria-hidden="true"
        />
      )}
      {children || status}
    </span>
  );
};
