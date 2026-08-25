import React from 'react';
import { MessageSquareText, Sparkles, X } from 'lucide-react';
import { AarogyamLogo } from '../common/AarogyamLogo';

interface AIChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const AIChatButton: React.FC<AIChatButtonProps> = ({ isOpen, onClick }) => {
  return (
    <div className="ai-assistant-button-wrapper fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group">
      {/* Tooltip on hover */}
      {!isOpen && (
        <div
          role="tooltip"
          className="ai-assistant-tooltip absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900/90 text-white text-xs font-semibold rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:flex items-center gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>Ask AI Assistant</span>
          <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900/90 rotate-45" />
        </div>
      )}

      {/* Floating Button */}
      <button
        type="button"
        onClick={onClick}
        className={`ai-assistant-button h-[54px] w-[54px] sm:h-[60px] sm:w-[60px] rounded-full shadow-xl flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-[#004b87]/40 active:scale-95 ${
          isOpen
            ? 'bg-slate-800 text-white hover:bg-slate-900 rotate-90'
            : 'bg-[#004b87] hover:bg-[#003d6e] text-white hover:scale-105'
        }`}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform duration-150" />
        ) : (
          <div className="relative flex items-center justify-center">
            {/* Friendly Chat Icon with small AI indicator */}
            <MessageSquareText className="h-7 w-7 text-white" />
            <span className="absolute -top-1 -right-1.5 px-1 py-0.2 rounded-full bg-emerald-400 text-[#004b87] font-black text-[9px] uppercase tracking-tighter shadow-xs">
              AI
            </span>
          </div>
        )}
      </button>
    </div>
  );
};
