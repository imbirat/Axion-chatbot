"use client";

import { useRef, useEffect } from "react";
import { UserMessage } from "./UserMessage";
import { AIMessage } from "./AIMessage";
import { AIState, ToolCall, Source } from "@/types";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCall[];
  sources?: Source[];
  thinking?: string;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  aiState?: AIState;
  streamingContent?: string;
  onEditMessage: (id: string, content: string) => void;
  onCopyMessage: (content: string) => void;
  onRetryMessage: (id: string) => void;
  onFeedback: (id: string, type: "good" | "bad") => void;
  onOpenCode?: (code: string, language: string) => void;
}

export function ChatWindow({
  messages,
  aiState,
  streamingContent,
  onEditMessage,
  onCopyMessage,
  onRetryMessage,
  onFeedback,
  onOpenCode,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <UserMessage
              key={msg.id}
              content={msg.content}
              onEdit={(newContent) => onEditMessage(msg.id, newContent)}
              onCopy={() => onCopyMessage(msg.content)}
              onRetry={() => onRetryMessage(msg.id)}
            />
          ) : (
            <AIMessage
              key={msg.id}
              content={msg.content}
              toolCalls={msg.toolCalls}
              sources={msg.sources}
              thinking={msg.thinking}
              onCopy={() => onCopyMessage(msg.content)}
              onRetry={() => onRetryMessage(msg.id)}
              onFeedback={(type) => onFeedback(msg.id, type)}
              onOpenCode={onOpenCode}
            />
          )
        )}

        {streamingContent !== undefined && (
          <AIMessage
            content={streamingContent}
            isStreaming={true}
            aiState={aiState}
            onCopy={() => {}}
          />
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
