import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div className={twMerge(clsx('border-b border-border', className))}>
      <nav className="-mb-px flex space-x-1 sm:space-x-4 overflow-x-auto pb-px" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={twMerge(
                clsx(
                  'whitespace-nowrap py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 transition-colors flex items-center gap-2 rounded-t',
                  isActive
                    ? 'border-primary text-primary bg-primary-muted/40 font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={twMerge(
                    clsx(
                      'ml-1 px-1.5 py-0.5 rounded text-[11px] font-semibold leading-none',
                      isActive
                        ? 'bg-primary text-white'
                        : 'bg-surface-alt text-muted-foreground border border-border'
                    )
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
