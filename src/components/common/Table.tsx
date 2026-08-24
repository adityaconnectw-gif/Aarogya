import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-md border border-border bg-surface">
      <table
        className={twMerge(
          clsx('w-full caption-bottom text-xs sm:text-sm text-left border-collapse', className)
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <thead
      className={twMerge(
        clsx('bg-surface-alt border-b border-border text-muted-foreground text-xs uppercase font-medium tracking-wider', className)
      )}
      {...props}
    >
      {children}
    </thead>
  );
};

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <tbody className={twMerge(clsx('divide-y divide-border/60', className))} {...props}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <tr
      className={twMerge(
        clsx('hover:bg-surface-alt/60 transition-colors', className)
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <th
      className={twMerge(
        clsx('h-10 px-3 sm:px-4 text-left align-middle font-semibold text-foreground/80', className)
      )}
      {...props}
    >
      {children}
    </th>
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <td
      className={twMerge(clsx('p-3 sm:p-4 align-middle text-foreground', className))}
      {...props}
    >
      {children}
    </td>
  );
};
