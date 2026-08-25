import React from 'react';
import { ChatMessage } from '../../services/chatbotService';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

interface AIChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  messages: ChatMessage[];
  isTyping: boolean;
  inputText: string;
  setInputText: (val: string) => void;
  onSend: (customQuery?: string) => void;
  onClear: () => void;
  speakingMessageId: string | null;
  onSpeak: (msg: ChatMessage) => void;
  isListening: boolean;
  onToggleVoice: () => void;
  onCancelVoice: () => void;
}

export const AIChatWindow: React.FC<AIChatWindowProps> = ({
  isOpen,
  onClose,
  onMinimize,
  messages,
  isTyping,
  inputText,
  setInputText,
  onSend,
  onClear,
  speakingMessageId,
  onSpeak,
  isListening,
  onToggleVoice,
  onCancelVoice,
}) => {
  if (!isOpen) return null;

  return (
    <aside
      role="dialog"
      aria-label="Aarogyam AI Virtual Health Assistant"
      className="ai-assistant-window fixed bottom-[84px] right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[390px] h-[calc(100vh-100px)] max-h-[600px] bg-surface border border-border rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden animate-slide-up select-none"
    >
      {/* 1. Header */}
      <ChatHeader onClose={onClose} onMinimize={onMinimize} onClear={onClear} />

      {/* 2. Scrollable Messages Viewport */}
      <ChatMessages
        messages={messages}
        isTyping={isTyping}
        speakingMessageId={speakingMessageId}
        onSpeak={onSpeak}
        onSelectSuggestion={(query) => onSend(query)}
      />

      {/* 3. Input & Voice Controls */}
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        onSend={() => onSend()}
        disabled={isTyping}
        isListening={isListening}
        onToggleVoice={onToggleVoice}
        onCancelVoice={onCancelVoice}
      />
    </aside>
  );
};
