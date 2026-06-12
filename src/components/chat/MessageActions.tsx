"use client";

import { Edit, Copy, RotateCcw, ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

interface MessageActionsProps {
  role: "user" | "assistant";
  onEdit?: () => void;
  onCopy: () => void;
  onRetry?: () => void;
  onFeedback?: (type: "good" | "bad") => void;
  hasSources?: boolean;
  onSource?: () => void;
  className?: string;
}

export function MessageActions({
  role,
  onEdit,
  onCopy,
  onRetry,
  onFeedback,
  hasSources,
  onSource,
  className,
}: MessageActionsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
        role === "user" ? "justify-end" : "justify-start",
        className
      )}
    >
      {role === "user" && onEdit && (
        <Tooltip content="Edit">
          <button onClick={onEdit} className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-base-hover transition-colors">
            <Edit size={14} />
          </button>
        </Tooltip>
      )}
      <Tooltip content="Copy">
        <button onClick={onCopy} className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-base-hover transition-colors">
          <Copy size={14} />
        </button>
      </Tooltip>
      {onRetry && (
        <Tooltip content="Retry">
          <button onClick={onRetry} className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-base-hover transition-colors">
            <RotateCcw size={14} />
          </button>
        </Tooltip>
      )}
      {role === "assistant" && onFeedback && (
        <>
          <div className="w-px h-4 bg-base-border mx-1" />
          <Tooltip content="Good response">
            <button onClick={() => onFeedback("good")} className="p-1 rounded text-text-muted hover:text-success transition-colors">
              <ThumbsUp size={14} />
            </button>
          </Tooltip>
          <Tooltip content="Bad response">
            <button onClick={() => onFeedback("bad")} className="p-1 rounded text-text-muted hover:text-danger transition-colors">
              <ThumbsDown size={14} />
            </button>
          </Tooltip>
        </>
      )}
      {hasSources && onSource && (
        <Tooltip content="View sources">
          <button onClick={onSource} className="p-1 rounded text-text-muted hover:text-accent transition-colors">
            <ExternalLink size={14} />
          </button>
        </Tooltip>
      )}
    </div>
  );
}
