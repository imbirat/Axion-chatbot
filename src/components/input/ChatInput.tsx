"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModelSelector } from "./ModelSelector";
import { ModePill } from "./ModePill";
import { VoiceButton } from "./VoiceButton";
import { Mode } from "@/types";

interface ChatInputProps {
  onSend: (message: string, mode?: string) => void;
  modelId: string;
  onModelChange: (modelId: string) => void;
  mode: Mode;
  thinkingEnabled: boolean;
  onThinkingToggle: () => void;
  modelSelectorDisabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  modelId,
  onModelChange,
  mode,
  thinkingEnabled,
  onThinkingToggle,
  modelSelectorDisabled,
  placeholder = "Write a message...",
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [text]);

  function handleSend() {
    if (!text.trim()) return;
    onSend(text.trim(), activeMode || undefined);
    setText("");
    setActiveMode(null);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTranscript(transcript: string) {
    setText((prev) => prev + transcript);
  }

  return (
    <div className="flex flex-col gap-2">
      {activeMode && (
        <ModePill mode={activeMode} onRemove={() => setActiveMode(null)} />
      )}
      <div className="flex items-end gap-2 bg-base-surface border border-base-border rounded-input px-3 py-2 focus-within:border-accent/50 transition-colors">
        <button
          onClick={() => setActiveMode(activeMode ? null : "deepresearch")}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-base-hover transition-colors shrink-0 self-end mb-0.5"
          title="Attach or set mode"
        >
          <Plus size={18} />
        </button>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none max-h-[200px] py-1.5"
        />
        <div className="flex items-center gap-1 shrink-0 self-end mb-0.5">
          <VoiceButton onTranscript={handleTranscript} />
          <ModelSelector
            selected={modelId}
            onSelect={onModelChange}
            mode={mode}
            thinkingEnabled={thinkingEnabled}
            onThinkingToggle={onThinkingToggle}
            disabled={modelSelectorDisabled}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className={cn(
              "p-2 rounded-lg transition-all",
              text.trim()
                ? "bg-accent text-white hover:bg-accent-hover active:scale-[0.95]"
                : "bg-base-border text-text-muted cursor-not-allowed"
            )}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
