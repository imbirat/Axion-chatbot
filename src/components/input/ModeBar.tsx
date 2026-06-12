"use client";

import { useRouter } from "next/navigation";
import { PenLine, Code2, FlaskConical, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeBarProps {
  onModeSelect: (mode: string) => void;
  onSuggestionClick: (text: string) => void;
}

const modes = [
  {
    id: "write",
    icon: PenLine,
    label: "Write",
    suggestions: [
      "Write an essay about...",
      "Draft an email to...",
      "Create a short story about...",
    ],
  },
  {
    id: "code",
    icon: Code2,
    label: "Code",
    suggestions: [
      "Build a React component for...",
      "Debug this code...",
      "Write a Python script that...",
    ],
  },
  {
    id: "deepresearch",
    icon: FlaskConical,
    label: "Deep Research",
    suggestions: [
      "Research the latest in...",
      "Find recent papers on...",
      "Compare and summarize...",
    ],
  },
  {
    id: "learn",
    icon: BookOpen,
    label: "Learn",
    suggestions: [
      "Explain how... works",
      "Teach me the basics of...",
      "What is the difference between...",
    ],
  },
];

export function ModeBar({ onModeSelect, onSuggestionClick }: ModeBarProps) {
  const router = useRouter();

  function handleModeClick(modeId: string) {
    if (modeId === "code") {
      router.push("/code/new");
      return;
    }
    onModeSelect(modeId);
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 w-full">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => handleModeClick(mode.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-base-hover border border-base-border transition-all hover:-translate-y-px hover:border-accent/50"
              )}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
        {modes.map((mode) => (
          <div key={mode.id} className="flex gap-1.5">
            {mode.suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => onSuggestionClick(suggestion)}
                className="flex-1 text-left px-2.5 py-1.5 rounded-md text-xs text-text-muted hover:text-text-secondary hover:bg-base-hover border border-transparent hover:border-base-border transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
