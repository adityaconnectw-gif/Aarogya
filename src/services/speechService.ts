/**
 * Aarogyam AI Assistant - Browser Native Speech Service
 * 
 * Provides safe wrappers for Web Speech Recognition (STT) and Web Speech Synthesis (TTS)
 * with robust multilingual Indian BCP-47 language tag mappings and graceful fallbacks.
 */

// Extend window for WebkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

/**
 * Maps common language names or ISO codes to standard Indian BCP-47 locale tags.
 */
export function getLanguageBCP47(lang: string): string {
  const normalized = (lang || '').toLowerCase().trim();
  if (normalized.includes('hi') || normalized.includes('hindi')) return 'hi-IN';
  if (normalized.includes('ta') || normalized.includes('tamil')) return 'ta-IN';
  if (normalized.includes('bn') || normalized.includes('bengali') || normalized.includes('bangla')) return 'bn-IN';
  if (normalized.includes('te') || normalized.includes('telugu')) return 'te-IN';
  if (normalized.includes('mr') || normalized.includes('marathi')) return 'mr-IN';
  if (normalized.includes('gu') || normalized.includes('gujarati')) return 'gu-IN';
  if (normalized.includes('kn') || normalized.includes('kannada')) return 'kn-IN';
  if (normalized.includes('ml') || normalized.includes('malayalam')) return 'ml-IN';
  if (normalized.includes('pa') || normalized.includes('punjabi')) return 'pa-IN';
  if (normalized.includes('or') || normalized.includes('odia')) return 'or-IN';
  return 'en-IN';
}

/**
 * Check if the current browser environment supports Speech Recognition.
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Check if the current browser environment supports Speech Synthesis (Text-to-Speech).
 */
export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

/**
 * Starts speech recognition listening session.
 * Returns a cleanup/stop function.
 */
export function startSpeechRecognition(
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void,
  language = 'en-IN'
): () => void {
  if (!isSpeechRecognitionSupported()) {
    onError('Speech recognition is not supported in this browser. Please use touch buttons or a supported browser like Chrome/Edge.');
    onEnd();
    return () => {};
  }

  try {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();

    const localeTag = getLanguageBCP47(language);
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = localeTag;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      onResult(text, !!finalTranscript);
    };

    recognition.onerror = (event: any) => {
      let errMsg = 'Speech recognition was interrupted.';
      if (event.error === 'not-allowed') {
        errMsg = 'Microphone access was denied. Please allow microphone permissions or use touch selection.';
      } else if (event.error === 'no-speech') {
        errMsg = 'No voice input was heard. Please speak again or select an option.';
      } else if (event.error === 'network') {
        errMsg = 'Speech service network issue. Please continue using touch options.';
      }
      onError(errMsg);
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();

    return () => {
      try {
        recognition.stop();
      } catch {
        // Ignore if already stopped
      }
    };
  } catch (err: any) {
    onError(err.message || 'Unable to start speech input.');
    onEnd();
    return () => {};
  }
}

/**
 * Clean text formatting before feeding into speech synthesizer.
 */
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/[•*#_-]/g, ' ')
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Speaks text using the browser's native SpeechSynthesis API with localized voice matching.
 */
export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  language = 'en-IN'
): void {
  if (!isSpeechSynthesisSupported()) return;

  try {
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const cleanedText = cleanTextForSpeech(text);
    if (!cleanedText) return;

    const localeTag = getLanguageBCP47(language);
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = localeTag;
    utterance.rate = 0.95; // Slightly slower for patient clarity
    utterance.pitch = 1.0;

    // Pick matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang === localeTag) ||
      voices.find((v) => v.lang.startsWith(localeTag.substring(0, 2))) ||
      voices.find((v) => v.lang.includes('IN') || v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('TTS speech error:', err);
    if (onEnd) onEnd();
  }
}

/**
 * Stops any active speech synthesis.
 */
export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}

/**
 * Checks if speech is currently playing.
 */
export function isSpeaking(): boolean {
  if (!isSpeechSynthesisSupported()) return false;
  return window.speechSynthesis.speaking;
}
