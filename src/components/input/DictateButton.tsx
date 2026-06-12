"use client";

import { useState } from "react";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface DictateButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function DictateButton({ onTranscript, className }: DictateButtonProps) {
  const [listening, setListening] = useState(false);

  function toggle() {
    if (!listening) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join("");
        onTranscript(transcript);
      };
      recognition.onend = () => setListening(false);
      (window as any)._dictation = recognition;
      recognition.start();
      setListening(true);
    } else {
      if ((window as any)._dictation) {
        (window as any)._dictation.stop();
        (window as any)._dictation = null;
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
