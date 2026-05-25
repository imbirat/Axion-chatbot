'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useVoiceStore } from '@/store/voiceStore';

export function useVoice() {
  const { isRecording, setIsRecording, transcript, setTranscript, appendTranscript, setIsSpeaking, setSpeakingMessageId, speakingMessageId } = useVoiceStore();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef(window.speechSynthesis);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      if (final) appendTranscript(final);
      else setTranscript(interim);

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (recognition) recognition.stop();
      }, 1500);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
    setTranscript('');
  }, [appendTranscript, setTranscript, setIsRecording]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
  }, [setIsRecording]);

  const speakText = useCallback((text: string, messageId: string) => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
      setSpeakingMessageId(null);
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setSpeakingMessageId(messageId);
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  }, [setSpeakingMessageId, setIsSpeaking]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    setSpeakingMessageId(null);
    setIsSpeaking(false);
  }, [setSpeakingMessageId, setIsSpeaking]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current.speaking) synthRef.current.cancel();
    };
  }, []);

  return { isRecording, transcript, startRecording, stopRecording, speakText, stopSpeaking, isSpeaking: useVoiceStore((s) => s.isSpeaking), speakingMessageId };
}
