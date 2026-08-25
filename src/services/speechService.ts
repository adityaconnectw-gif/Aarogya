/**
 * Aarogyam AI Assistant - Browser Native Speech Service
 * 
 * Provides safe wrappers for Web Speech Recognition (STT) and Web Speech Synthesis (TTS).
 */

// Extend window for WebkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
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
    onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or a modern browser.');
    onEnd();
    return () => {};
  }

  try {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;
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
      let errMsg = 'Speech recognition error';
      if (event.error === 'not-allowed') {
        errMsg = 'Microphone permission denied. Please allow microphone access in your browser.';
      } else if (event.error === 'no-speech') {
        errMsg = 'No speech detected. Please try again.';
      } else if (event.error === 'network') {
        errMsg = 'Network error occurred during speech recognition.';
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
    onError(err.message || 'Unable to start speech recognition.');
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
 * Speaks text using the browser's native SpeechSynthesis API.
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

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = language;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick a natural English/Indian English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => (v.lang === 'en-IN' || v.lang === 'en-GB' || v.lang.startsWith('en')) && v.name.includes('Google')
    ) || voices.find((v) => v.lang.startsWith('en'));

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
