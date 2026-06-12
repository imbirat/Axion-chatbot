"use client";

import { useState } from "react";
import { ChevronDown, Brain, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODELS, QUICK_MODELS } from "@/lib/models";
import { ModelConfig, Mode } from "@/types";

interface ModelSelectorProps {
  selected: string;
  onSelect: (modelId: string) => void;
  mode: Mode;
  thinkingEnabled: boolean;
  onThinkingToggle: () => void;
  disabled?: boolean;
}

export function ModelSelector({
  selected,
  onSelect,
  mode,
  thinkingEnabled,
  onThinkingToggle,
  disabled,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const selectedModel = MODELS.find((m) => m.id === selected) || MODELS[0];

  const isAgentMode = mode === "agent";
  const isCodeMode = mode === "code";

  function isSelectable(model: ModelConfig): boolean {
    if (isCodeMode && !model.coderModel) return false;
    if (isAgentMode && !model.agentPrimary) return false;
    return model.modes.includes(mode);
  }

  if (disabled || isAgentMode) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-accent-subtle border border-accent/30 text-xs text-accent cursor-default">
        <Bot size={14} />
        <span>Axion 4.7 &middot; Agent</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-base-hover border border-base-border transition-colors",
          thinkingEnabled && "border-accent/50"
        )}
      >
        {thinkingEnabled && <Brain size={12} className="text-accent" />}
        <Sparkles size={12} />
        <span className="font-medium">{selectedModel.name}</span>
        <ChevronDown size={12} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setShowMore(false); }} />
          <div className="absolute bottom-full mb-2 left-0 z-50 w-64 bg-base-surface border border-base-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 origin-bottom">
            <div className="p-1.5">
              {QUICK_MODELS.map((model) => {
                const selectable = isSelectable(model);
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      if (selectable) {
                        onSelect(model.id);
                        setOpen(false);
                      }
                    }}
                    disabled={!selectable}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-colors",
                      selected === model.id
                        ? "bg-accent-subtle text-accent"
                        : selectable
                          ? "text-text-primary hover:bg-base-hover"
                          : "text-text-muted cursor-not-allowed opacity-50"
                    )}
                    title={!selectable ? (isCodeMode ? "Only Coder models available in Code mode" : "Not available in this mode") : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} />
                      <span>{model.name}</span>
                    </div>
                    <span className="text-xs text-text-muted">{model.provider === "groq" ? "Groq" : "Gemini"}</span>
                  </button>
                );
              })}

              <div className="border-t border-base-border my-1" />

              <button
                onClick={() => setShowMore(!showMore)}
                className="flex items-center justify-between w-full px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-base-hover rounded-lg transition-colors"
              >
                <span>More models</span>
                <ChevronDown size={14} className={cn("transition-transform", showMore && "rotate-180")} />
              </button>

              {showMore && (
                <div className="space-y-0.5">
                  {MODELS.filter((m) => !m.showInQuickPicker).map((model) => {
                    const selectable = isSelectable(model);
                    return (
                      <button
                        key={model.id}
                        onClick={() => {
                          if (selectable) {
                            onSelect(model.id);
                            setOpen(false);
                          }
                        }}
                        disabled={!selectable}
                        className={cn(
                          "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-colors pl-8",
                          selected === model.id
                            ? "bg-accent-subtle text-accent"
                            : selectable
                              ? "text-text-primary hover:bg-base-hover"
                              : "text-text-muted cursor-not-allowed opacity-50"
                        )}
                      >
                        <span>{model.name}</span>
                        <span className="text-xs text-text-muted">{model.provider === "groq" ? "Groq" : "Gemini"}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedModel.supportsThinking && (
              <div className="border-t border-base-border px-3 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain size={14} className="text-accent" />
                  <span className="text-xs text-text-secondary">Thinking</span>
                </div>
                <button
                  onClick={onThinkingToggle}
                  className={cn(
                    "w-8 h-4 rounded-full transition-colors relative",
                    thinkingEnabled ? "bg-accent" : "bg-base-border"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform",
                      thinkingEnabled ? "translate-x-4" : "translate-x-0.5"
                    )}
                  />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
