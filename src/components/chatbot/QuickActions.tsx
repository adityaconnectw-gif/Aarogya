import React from 'react';

interface QuickActionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ suggestions, onSelect, disabled }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="ai-assistant-quick-actions pt-2 space-y-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block px-1">
        Suggested Topics:
      </span>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item)}
            className="ai-assistant-quick-btn text-left text-[11px] font-medium px-2.5 py-1 rounded bg-surface border border-border hover:border-primary hover:bg-primary/5 text-foreground transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-xs"
            aria-label={`Ask suggestion: ${item}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};
