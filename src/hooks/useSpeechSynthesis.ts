import { useState, useEffect } from 'react';

interface SpeechSynthesisHook {
  speak: (text: string) => void;
  cancel: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSupported = 'speechSynthesis' in window;

  useEffect(() => {
    if (!isSupported) return;

    const handleStart = () => setIsSpeaking(true);
    const handleEnd = () => setIsSpeaking(false);
    const handleError = () => setIsSpeaking(false);

    speechSynthesis.addEventListener('start', handleStart);
    speechSynthesis.addEventListener('end', handleEnd);
    speechSynthesis.addEventListener('error', handleError);

    return () => {
      speechSynthesis.removeEventListener('start', handleStart);
      speechSynthesis.removeEventListener('end', handleEnd);
      speechSynthesis.removeEventListener('error', handleError);
    };
  }, [isSupported]);

  const speak = (text: string) => {
    if (!isSupported) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (!isSupported) return;
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return {
    speak,
    cancel,
    isSpeaking,
    isSupported,
  };
}