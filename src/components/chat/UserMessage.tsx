"use client";

import { useState } from "react";
import { MessageActions } from "./MessageActions";

interface UserMessageProps {
  content: string;
  onEdit: (newContent: string) => void;
  onCopy: () => void;
  onRetry: () => void;
}

export function UserMessage({ content, onEdit, onCopy, onRetry }: UserMessageProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);

  function handleSave() {
    onEdit(editValue);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setEditing(false);
      setEditValue(content);
    }
  }

  return (
    <div className="flex justify-end mb-6 group">
      <div className="max-w-[70%]">
        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-base-surface border border-accent rounded-chat p-3 text-sm text-text-primary resize-none focus:outline-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setEditing(false); setEditValue(content); }}
                className="text-xs text-text-muted hover:text-text-primary px-2 py-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="text-xs text-accent hover:text-accent-hover px-2 py-1"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-base-surface rounded-chat p-3 text-sm text-text-primary whitespace-pre-wrap">
            {content}
          </div>
        )}
        <MessageActions
          role="user"
          onEdit={() => setEditing(true)}
          onCopy={onCopy}
          onRetry={onRetry}
          className="mt-1 pr-1"
        />
      </div>
    </div>
  );
}
