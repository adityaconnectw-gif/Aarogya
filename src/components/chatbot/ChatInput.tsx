import React, { useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { VoiceInputStatus } from './VoiceInputStatus';

interface ChatInputProps {
  inputText: string;
  setInputText: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
  isListening: boolean;
  onToggleVoice: () => void;
  onCancelVoice: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  setInputText,
  onSend,
  disabled,
  isListening,
  onToggleVoice,
  onCancelVoice,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && !isListening) {
      inputRef.current?.focus();
    }
  }, [disabled, isListening]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim() && !disabled) {
        onSend();
      }
    }
  };

  const isSendDisabled = !inputText.trim() || disabled;

  return (
    <div className="ai-assistant-input-container bg-surface border-t border-border rounded-b-lg">
      {/* Listening Status Banner */}
      <VoiceInputStatus isListening={isListening} onCancel={onCancelVoice} />

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isSendDisabled) onSend();
        }}
        className="p-2.5 flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening to your voice...' : 'Type your message (e.g. book doctor, records)...'}
          disabled={disabled}
          className="ai-assistant-input flex-1 h-9 px-3 text-xs bg-surface-alt border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#004b87] focus:border-[#004b87] transition-all"
          aria-label="Type your message for AI assistant"
        />

        {/* Microphone Button */}
        <button
          type="button"
          onClick={onToggleVoice}
          className={`ai-assistant-mic-btn p-2 rounded-md transition-colors flex items-center justify-center shrink-0 ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse shadow-xs'
              : 'bg-surface-alt text-muted-foreground hover:text-primary hover:bg-surface border border-border'
          }`}
          title={isListening ? 'Stop voice recognition' : 'Speak message (Voice Recognition)'}
          aria-label={isListening ? 'Stop voice recognition' : 'Start voice input'}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={isSendDisabled}
          className={`ai-assistant-send-btn p-2 rounded-md text-white transition-all flex items-center justify-center shrink-0 ${
            isSendDisabled
              ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
              : 'bg-[#004b87] hover:bg-[#003d6e] text-white shadow-xs active:scale-95'
          }`}
          title="Send message"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
