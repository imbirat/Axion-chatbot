"use client";

import { useState } from "react";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface DictateButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

declare global {
  interface Window {
    _dictation?: { stop: () => void };
  }
}

type SpeechRecognitionResult = { transcript: string };
type SpeechRecognitionAlternative = SpeechRecognitionResult & { isFinal?: boolean };

type SpeechRecognitionEvent = {
  results: ArrayLike<ArrayLike<SpeechRecognitionAlternative>>;
};

type SpeechRecognitionConstructor = new () => {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
};

export function DictateButton({ onTranscript, className }: DictateButtonProps) {
  const [listening, setListening] = useState(false);

  function toggle() {
    if (!listening) {
      const SR = (window as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition
        || (window as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;
      if (!SR) return;

      const recognition = new SR();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((r) => r[0].transcript)
          .join("");
        onTranscript(transcript);
      };
      recognition.onend = () => setListening(false);
      window._dictation = recognition;
      recognition.start();
      setListening(true);
    } else {
      if (window._dictation) {
        window._dictation.stop();
        window._dictation = undefined;
      }
      setListening(false);
    }
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "p-2 rounded-lg transition-all",
        listening
          ? "bg-danger/20 text-danger border border-danger/30 animate-pulse"
          : "text-text-muted hover:text-text-primary hover:bg-base-hover",
        className
      )}
      title={listening ? "Stop dictation" : "Start dictation"}
    >
      {listening ? <Square size={16} /> : <Mic size={16} />}
    </button>
  );
}
