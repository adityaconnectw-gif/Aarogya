import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { ChatMessage } from '../../services/chatbotService';
import { QuickActions } from './QuickActions';
import { AarogyamLogo } from '../common/AarogyamLogo';

interface ChatMessageItemProps {
  message: ChatMessage;
  isLatest: boolean;
  speakingMessageId: string | null;
  onSpeak: (message: ChatMessage) => void;
  onSelectSuggestion: (query: string) => void;
  isTyping: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isLatest,
  speakingMessageId,
  onSpeak,
  onSelectSuggestion,
  isTyping,
}) => {
  const isUser = message.sender === 'user';
  const isSpeaking = speakingMessageId === message.id;

  return (
    <div
      className={`ai-assistant-message-row flex flex-col ${
        isUser ? 'items-end' : 'items-start'
      } space-y-1 w-full animate-fade-in`}
    >
      <div className={`flex items-end gap-2 max-w-[88%] sm:max-w-[82%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
          <div className="shrink-0 mb-1">
            <AarogyamLogo size="xs" imgClassName="ring-1 ring-border shadow-xs" />
          </div>
        )}

        <div
          className={`ai-assistant-message-bubble px-3.5 py-2.5 rounded-lg text-xs leading-relaxed transition-shadow duration-150 ${
            isUser
              ? 'bg-primary text-primary-foreground font-normal rounded-br-xs shadow-xs'
              : 'bg-surface-alt border border-border text-foreground rounded-bl-xs shadow-xs'
          }`}
        >
          {/* Message Text with simple line break and bullet support */}
          <div className="whitespace-pre-wrap font-sans text-xs space-y-1">
            {message.text}
          </div>

          {/* Assistant message footer: timestamp and speaker TTS button */}
          <div
            className={`flex items-center justify-between gap-2 mt-1.5 pt-1 border-t ${
              isUser ? 'border-white/20 text-white/70' : 'border-border/60 text-muted-foreground'
            } text-[10px]`}
          >
            <span>{message.timestamp}</span>

            {!isUser && (
              <button
                type="button"
                onClick={() => onSpeak(message)}
                className={`p-1 rounded transition-colors flex items-center gap-1 ${
                  isSpeaking
                    ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 font-bold'
                    : 'text-muted-foreground hover:text-primary hover:bg-surface'
                }`}
                title={isSpeaking ? 'Stop reading' : 'Read message aloud (Text-to-Speech)'}
                aria-label={isSpeaking ? 'Stop reading message' : 'Read message aloud'}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-3 w-3 animate-pulse" />
                    <span className="text-[9px]">Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3 w-3" />
                    <span className="text-[9px]">Listen</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Suggested quick actions if latest assistant message */}
      {!isUser && isLatest && message.suggestions && message.suggestions.length > 0 && (
        <div className="pl-8 pr-2 w-full">
          <QuickActions
            suggestions={message.suggestions}
            onSelect={onSelectSuggestion}
            disabled={isTyping}
          />
        </div>
      )}
    </div>
  );
};
