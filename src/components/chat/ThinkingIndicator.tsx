"use client";

import React from "react";
import { Brain, Globe, PenLine } from "lucide-react";
import { AIState } from "@/types";

interface ThinkingIndicatorProps {
  state: AIState;
}

export function ThinkingIndicator({ state }: ThinkingIndicatorProps) {
  if (state === "done") return null;

  type ConfigEntry = {
    icon: React.ElementType;
    label: string;
    subtext: string;
    className: string;
    spin?: boolean;
  };

  const config: Record<string, ConfigEntry> = {
    thinking: {
      icon: Brain,
      label: "Thinking...",
      subtext: "Reasoning about your request",
      className: "thinking-glow rounded-full p-1.5 bg-white/10",
    },
    searching: {
      icon: Globe,
      label: "Searching...",
      subtext: "Querying the web for relevant results",
      className: "rounded-full p-1.5 bg-accent-subtle",
      spin: true,
    },
    writing: {
      icon: PenLine,
      label: "Writing...",
      subtext: "",
      className: "rounded-full p-1.5 bg-white/5",
    },
  };

  const { icon: Icon, label, subtext, className, spin } = config[state];

  return (
    <div className="flex items-start gap-3 mb-4 fade-in animate-in fade-in-0 duration-200">
      <div className={className}>
        <Icon size={16} className={`text-white ${spin ? "animate-spin duration-1000" : ""}`} />
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-text-secondary">{label}</span>
        {subtext && (
          <span className="text-xs text-text-muted mt-0.5">{subtext}</span>
        )}
      </div>
    </div>
  );
}
