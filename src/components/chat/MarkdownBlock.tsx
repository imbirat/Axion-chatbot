"use client";

import { Download, Copy } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

interface MarkdownBlockProps {
  content: string;
  filename?: string;
}

export function MarkdownBlock({ content, filename }: MarkdownBlockProps) {
  function handleCopy() {
    navigator.clipboard.writeText(content);
  }

  function handleDownload() {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "document.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-base-surface border border-base-border rounded-lg overflow-hidden my-2">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-base-border">
        <span className="text-xs text-text-muted">markdown</span>
        <div className="flex items-center gap-1">
          <Tooltip content="Download">
            <button onClick={handleDownload} className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-base-hover transition-colors">
              <Download size={14} />
            </button>
          </Tooltip>
          <Tooltip content="Copy">
            <button onClick={handleCopy} className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-base-hover transition-colors">
              <Copy size={14} />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="prose prose-invert prose-sm max-h-[480px] overflow-y-auto p-4">
        {content}
      </div>
    </div>
  );
}
