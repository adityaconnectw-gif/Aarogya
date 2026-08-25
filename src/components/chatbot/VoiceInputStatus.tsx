import React from 'react';
import { Mic, X } from 'lucide-react';

interface VoiceInputStatusProps {
  isListening: boolean;
  onCancel: () => void;
}

export const VoiceInputStatus: React.FC<VoiceInputStatusProps> = ({ isListening, onCancel }) => {
  if (!isListening) return null;

  return (
    <div className="ai-assistant-voice-status px-3 py-2 bg-rose-50 dark:bg-rose-950/40 border-t border-rose-200 dark:border-rose-900/60 flex items-center justify-between text-xs text-rose-900 dark:text-rose-200 animate-slide-up">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
        </span>
        <Mic className="h-3.5 w-3.5 text-rose-600 animate-pulse" />
        <span className="font-semibold text-[11px]">Listening... Speak clearly now</span>
      </div>

      <button
        onClick={onCancel}
        type="button"
        className="p-1 rounded text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-[11px] font-medium flex items-center gap-0.5"
        title="Stop listening"
        aria-label="Stop speech recognition"
      >
        <span>Stop</span>
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};
