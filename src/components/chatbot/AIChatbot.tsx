import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChatMessage,
  WELCOME_MESSAGE,
  getChatbotResponse,
} from '../../services/chatbotService';
import {
  speakText,
  stopSpeaking,
  startSpeechRecognition,
} from '../../services/speechService';
import { AIChatButton } from './AIChatButton';
import { AIChatWindow } from './AIChatWindow';

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const stopVoiceRef = useRef<(() => void) | null>(null);

  // Clean up any active speech synthesis or recognition on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (stopVoiceRef.current) {
        stopVoiceRef.current();
      }
    };
  }, []);

  // Handle sending a message (either typed or triggered from quick actions)
  const handleSendMessage = useCallback(
    async (customText?: string) => {
      const textToSend = (customText || inputText).trim();
      if (!textToSend || isTyping) return;

      // Stop any current voice recording or active speech synthesis
      if (stopVoiceRef.current) {
        stopVoiceRef.current();
        setIsListening(false);
      }
      stopSpeaking();
      setSpeakingMessageId(null);

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: textToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputText('');
      setIsTyping(true);

      try {
        const responseMsg = await getChatbotResponse(textToSend);
        setMessages((prev) => [...prev, responseMsg]);
      } catch (err) {
        console.error('Chatbot error:', err);
      } finally {
        setIsTyping(false);
      }
    },
    [inputText, isTyping]
  );

  // Handle clearing conversation history
  const handleClearConversation = useCallback(() => {
    stopSpeaking();
    setSpeakingMessageId(null);
    if (stopVoiceRef.current) {
      stopVoiceRef.current();
      setIsListening(false);
    }
    setMessages([
      {
        ...WELCOME_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  // Handle Text-to-Speech (TTS)
  const handleSpeakMessage = useCallback(
    (msg: ChatMessage) => {
      if (speakingMessageId === msg.id) {
        stopSpeaking();
        setSpeakingMessageId(null);
      } else {
        stopSpeaking();
        setSpeakingMessageId(msg.id);
        speakText(
          msg.text,
          () => setSpeakingMessageId(msg.id),
          () => setSpeakingMessageId(null)
        );
      }
    },
    [speakingMessageId]
  );

  // Handle Voice Input (STT)
  const handleToggleVoice = useCallback(() => {
    if (isListening) {
      if (stopVoiceRef.current) {
        stopVoiceRef.current();
        stopVoiceRef.current = null;
      }
      setIsListening(false);
    } else {
      setIsListening(true);
      const stopFn = startSpeechRecognition(
        (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        (error) => {
          console.warn('Speech recognition notice:', error);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
      stopVoiceRef.current = stopFn;
    }
  }, [isListening]);

  const handleCancelVoice = useCallback(() => {
    if (stopVoiceRef.current) {
      stopVoiceRef.current();
      stopVoiceRef.current = null;
    }
    setIsListening(false);
  }, []);

  return (
    <div className="ai-assistant-widget select-none">
      {/* 1. Chat Dialog Window (Overlay) */}
      <AIChatWindow
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          stopSpeaking();
          handleCancelVoice();
        }}
        onMinimize={() => {
          setIsOpen(false);
        }}
        messages={messages}
        isTyping={isTyping}
        inputText={inputText}
        setInputText={setInputText}
        onSend={handleSendMessage}
        onClear={handleClearConversation}
        speakingMessageId={speakingMessageId}
        onSpeak={handleSpeakMessage}
        isListening={isListening}
        onToggleVoice={handleToggleVoice}
        onCancelVoice={handleCancelVoice}
      />

      {/* 2. Floating Circular Launcher Button */}
      <AIChatButton
        isOpen={isOpen}
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (isOpen) {
            stopSpeaking();
            handleCancelVoice();
          }
        }}
      />
    </div>
  );
};
