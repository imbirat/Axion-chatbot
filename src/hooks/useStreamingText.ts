'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

export function useStreamingText() {
  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const fullText = useRef('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const appendText = useCallback((text: string) => {
    fullText.current += text;
    setDisplayedText(fullText.current);
  }, []);

  const startStream = useCallback(() => {
    setIsStreaming(true);
    setIsComplete(false);
    fullText.current = '';
    setDisplayedText('');
  }, []);

  const completeStream = useCallback(() => {
    setIsStreaming(false);
    setIsComplete(true);
  }, []);

  const reset = useCallback(() => {
    fullText.current = '';
    setDisplayedText('');
    setIsStreaming(false);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { displayedText, isStreaming, isComplete, appendText, startStream, completeStream, reset };
}
