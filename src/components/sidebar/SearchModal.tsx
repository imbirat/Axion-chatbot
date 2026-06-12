"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MessageSquare, Bot, Code2 } from "lucide-react";
import { Conversation } from "@/types";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversations: Conversation[];
}

export function SearchModal({ open, onOpenChange, conversations }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
    }
  }, [open]);

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  function handleSelect(conv: Conversation) {
    router.push(`/${conv.mode}/${conv.id}`);
    onOpenChange(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/60" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-full max-w-lg bg-base-surface border border-base-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-base-border">
          <Search size={16} className="text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-xs text-text-muted bg-base-bg rounded border border-base-border">
            ESC
          </kbd>
        </div>
        <div className="max-h-64 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-8">
              {query ? "No conversations found" : "Start typing to search"}
            </p>
          ) : (
            filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelect(conv)}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-text-primary hover:bg-base-hover rounded-lg transition-colors"
              >
                {conv.mode === "agent" ? (
                  <Bot size={14} className="text-accent shrink-0" />
                ) : conv.mode === "code" ? (
                  <Code2 size={14} className="text-warning shrink-0" />
                ) : (
                  <MessageSquare size={14} className="text-text-muted shrink-0" />
                )}
                <span className="truncate">{conv.title}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
