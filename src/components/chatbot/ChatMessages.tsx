import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../../services/chatbotService';
import { ChatMessageItem } from './ChatMessageItem';
import { TypingIndicator } from './TypingIndicator';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  speakingMessageId: string | null;
  onSpeak: (message: ChatMessage) => void;
  onSelectSuggestion: (query: string) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isTyping,
  speakingMessageId,
  onSpeak,
  onSelectSuggestion,
}) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="ai-assistant-messages flex-1 overflow-y-auto p-4 space-y-4 text-xs select-text">
      {/* Official Government Assistant Notice */}
      <div className="text-center py-1">
        <span className="inline-block px-2.5 py-1 rounded bg-surface-alt border border-border text-[10px] text-muted-foreground">
          🛡️ Aarogyam Digital Assistant • Frontend Public Service Prototype
        </span>
      </div>

      {messages.map((msg, index) => (
        <ChatMessageItem
          key={msg.id}
          message={msg}
          isLatest={index === messages.length - 1}
          speakingMessageId={speakingMessageId}
          onSpeak={onSpeak}
          onSelectSuggestion={onSelectSuggestion}
          isTyping={isTyping}
        />
      ))}

      {isTyping && (
        <div className="pl-8">
          <TypingIndicator />
        </div>
      )}

      <div ref={scrollEndRef} />
    </div>
  );
};
