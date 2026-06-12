"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { StreamingText } from "./StreamingText";
import { MessageActions } from "./MessageActions";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { ToolCallBlock } from "./ToolCallBlock";
import { InlineCodeBlock } from "./InlineCodeBlock";
import { MarkdownBlock } from "./MarkdownBlock";
import { AIState, ToolCall, Source } from "@/types";

interface AIMessageProps {
  content: string;
  isStreaming?: boolean;
  aiState?: AIState;
  toolCalls?: ToolCall[];
  sources?: Source[];
  thinking?: string;
  onCopy: () => void;
  onRetry?: () => void;
  onFeedback?: (type: "good" | "bad") => void;
  onOpenCode?: (code: string, language: string) => void;
}

function parseCodeBlocks(text: string): { type: "text" | "code" | "markdown"; content: string; language?: string }[] {
  const parts: { type: "text" | "code" | "markdown"; content: string; language?: string }[] = [];
  const regex = /```(\w+)?\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    const lang = match[1]?.toLowerCase() || "";
    const code = match[2].trim();
    if (lang === "md" || lang === "markdown") {
      parts.push({ type: "markdown", content: code });
    } else {
      parts.push({ type: "code", content: code, language: lang });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  return parts;
}

export function AIMessage({
  content,
  isStreaming = false,
  aiState,
  toolCalls,
  sources,
  thinking,
  onCopy,
  onRetry,
  onFeedback,
  onOpenCode,
}: AIMessageProps) {
  const [showSources, setShowSources] = useState(false);
  const parts = parseCodeBlocks(content);
  const done = aiState === "done" || (!isStreaming && content.length > 0);

  return (
    <div className="flex justify-start mb-6 group">
      <div className="max-w-full flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="rounded-full p-1 bg-accent-subtle">
            <Sparkles size={14} className="text-accent" />
          </div>
          <span className="text-xs text-text-muted">Axion AI</span>
        </div>

        {aiState && aiState !== "done" && (
          <ThinkingIndicator state={aiState} />
        )}

        {parts.map((part, i) => {
          if (part.type === "text") {
            return isStreaming ? (
              <StreamingText key={i} content={part.content} isStreaming={true} />
            ) : (
              <div key={i} className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                {part.content}
              </div>
            );
          }
          if (part.type === "markdown") {
            return <MarkdownBlock key={i} content={part.content} />;
          }
          if (part.type === "code" && part.language !== undefined) {
            return (
              <InlineCodeBlock
                key={i}
                code={part.content}
                language={part.language}
                onOpen={() => onOpenCode?.(part.content, part.language || "text")}
              />
            );
          }
          return null;
        })}

        {isStreaming && parts.length === 0 && content.length === 0 && (
          <div className="flex items-center gap-2 text-text-muted">
            <span className="streaming-cursor text-accent"> </span>
          </div>
        )}

        {toolCalls?.map((tc, i) => (
          <ToolCallBlock key={i} toolCall={tc} />
        ))}

        {done && (
          <MessageActions
            role="assistant"
            onCopy={onCopy}
            onRetry={onRetry}
            onFeedback={onFeedback}
            hasSources={!!sources?.length}
            onSource={() => setShowSources(!showSources)}
            className="mt-1"
          />
        )}

        {showSources && sources && sources.length > 0 && (
          <div className="mt-2 p-3 bg-base-surface border border-base-border rounded-lg">
            <p className="text-xs font-medium text-text-secondary mb-2">Sources</p>
            {sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-accent hover:text-accent-hover py-1"
              >
                {source.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
