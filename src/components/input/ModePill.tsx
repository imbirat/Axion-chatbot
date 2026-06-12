"use client";

import { X, FlaskConical, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModePillProps {
  mode: string;
  onRemove: () => void;
}

const modeConfig: Record<string, { icon: React.ElementType; label: string }> = {
  deepresearch: { icon: FlaskConical, label: "deepresearch" },
  learn: { icon: BookOpen, label: "learn" },
};

export function ModePill({ mode, onRemove }: ModePillProps) {
  const config = modeConfig[mode];
  if (!config) return null;

  const { icon: Icon, label } = config;

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent-subtle border border-accent/30 text-xs text-accent">
      <Icon size={12} />
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="p-0.5 rounded hover:bg-accent/20 transition-colors"
      >
        <X size={10} />
      </button>
    </div>
  );
}
