"use client";

import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
}

declare global {
  interface Window {
    _recognition?: { stop: () => void };
  }
}

type SR_Result = { transcript: string };
type SR_Alt = SR_Result & { isFinal?: boolean };

type SR_Event = {
  results: ArrayLike<ArrayLike<SR_Alt>>;
};

type SR_Constructor = new () => {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SR_Event) => void;
  start: () => void;
  stop: () => void;
};

export function VoiceButton({ onTranscript }: VoiceButtonProps) {
  const [listening, setListening] = useState(false);

  function toggleListening() {
    if (!listening) {
      const SR = (window as { SpeechRecognition?: SR_Constructor; webkitSpeechRecognition?: SR_Constructor }).SpeechRecognition
        || (window as { SpeechRecognition?: SR_Constructor; webkitSpeechRecognition?: SR_Constructor }).webkitSpeechRecognition;
      if (SR) {
        const recognition = new SR();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event: SR_Event) => {
          const transcript = Array.from(event.results)
            .map((r) => r[0].transcript)
            .join("");
          onTranscript(transcript);
        };
        window._recognition = recognition;
        recognition.start();
        setListening(true);
      }
    } else {
      if (window._recognition) {
        window._recognition.stop();
        window._recognition = undefined;
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
