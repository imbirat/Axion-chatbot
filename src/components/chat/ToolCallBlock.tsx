"use client";

import { useState } from "react";
import { Wrench, CheckCircle } from "lucide-react";
import { ToolCall } from "@/types";

interface ToolCallBlockProps {
  toolCall: ToolCall;
}

export function ToolCallBlock({ toolCall }: ToolCallBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const isRunning = toolCall.status === "running";
  const isDone = toolCall.status === "completed";

  return (
    <div className="bg-base-surface border border-base-border rounded-lg overflow-hidden mb-2">
      <div className="flex items-center gap-2 px-3 py-2">
        <Wrench size={14} className="text-text-muted" />
        <span className="text-xs text-text-secondary font-medium">Tool: {toolCall.tool}</span>
        <div className="ml-auto flex items-center gap-1.5">
          {isRunning && (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
              <span className="text-xs text-text-muted">running...</span>
            </>
          )}
          {isDone && (
            <>
              <CheckCircle size={14} className="text-success" />
              <span className="text-xs text-text-muted">completed</span>
            </>
          )}
        </div>
      </div>
      {toolCall.output && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-3 py-1.5 text-xs text-left text-text-muted hover:text-text-primary border-t border-base-border transition-colors"
        >
          {expanded ? toolCall.output : `Output: ${toolCall.output.slice(0, 80)}${toolCall.output.length > 80 ? "..." : ""}`}
        </button>
      )}
    </div>
  );
}
