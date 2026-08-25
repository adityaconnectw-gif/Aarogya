import React from 'react';
import { Minus, X, RotateCcw, ShieldCheck } from 'lucide-react';
import { AarogyamLogo } from '../common/AarogyamLogo';

interface ChatHeaderProps {
  onClose: () => void;
  onMinimize: () => void;
  onClear: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, onMinimize, onClear }) => {
  const handleClearWithConfirm = () => {
    if (window.confirm('Clear current assistant conversation and reset to welcome message?')) {
      onClear();
    }
  };

  return (
    <header className="ai-assistant-header bg-[#004b87] text-white px-4 py-3 rounded-t-lg flex items-center justify-between shadow-xs select-none">
      {/* Brand & Assistant Info */}
      <div className="flex items-center gap-2.5">
        <AarogyamLogo size="xs" imgClassName="ring-1 ring-white/40" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs sm:text-sm tracking-tight text-white leading-none">
              Aarogyam AI Assistant
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          </div>
          <span className="text-[10px] text-white/80 font-medium leading-tight">
            Virtual Health Assistant • Assistant ready
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleClearWithConfirm}
          className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          title="Reset conversation"
          aria-label="Reset conversation"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onMinimize}
          className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          title="Minimize assistant"
          aria-label="Minimize assistant"
        >
          <Minus className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors ml-0.5"
          title="Close assistant"
          aria-label="Close assistant"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
