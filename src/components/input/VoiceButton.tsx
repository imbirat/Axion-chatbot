"use client";

import { useState } from "react";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
}

export function VoiceButton({ onTranscript }: VoiceButtonProps) {
  const [listening, setListening] = useState(false);

  function toggleListening() {
    if (!listening) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((r: any) => r[0].transcript)
            .join("");
          onTranscript(transcript);
        };
        (window as any)._recognition = recognition;
        recognition.start();
        setListening(true);
      }
    } else {
      if ((window as any)._recognition) {
        (window as any)._recognition.stop();
        (window as any)._recognition = null;
      }
      setListening(false);
    }
  }

  return (
    <button
      onClick={toggleListening}
      className={cn(
        "p-2 rounded-lg transition-all",
        listening
          ? "bg-danger/20 text-danger border border-danger/30"
          : "text-text-muted hover:text-text-primary hover:bg-base-hover"
      )}
      title={listening ? "Stop listening" : "Dictate"}
    >
      {listening ? <MicOff size={16} /> : <Mic size={16} />}
    </button>
  );
}
