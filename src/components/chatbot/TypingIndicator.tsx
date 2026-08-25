import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="ai-assistant-typing flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-alt/90 border border-border/80 text-muted-foreground w-fit animate-fade-in text-xs shadow-xs">
      <span className="text-[11px] font-medium text-foreground/80 mr-1">Aarogyam Assistant is thinking</span>
      <div className="flex items-center gap-1">
        <span
          className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce"
          style={{ animationDuration: '0.9s', animationDelay: '0ms' }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce"
          style={{ animationDuration: '0.9s', animationDelay: '200ms' }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce"
          style={{ animationDuration: '0.9s', animationDelay: '400ms' }}
        />
      </div>
    </div>
  );
};
