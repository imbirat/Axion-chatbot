"use client";

import { useEffect, useState } from "react";
import { Download, Copy } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { mapLanguageToMonaco } from "@/lib/models";

interface InlineCodeBlockProps {
  code: string;
  language: string;
  onOpen?: () => void;
}

export function InlineCodeBlock({ code, language, onOpen }: InlineCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const monacoLang = mapLanguageToMonaco(language);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const ext = language === "typescript" ? "ts" : language === "javascript" ? "js" : language;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `untitled.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      onClick={onOpen}
      className="group bg-base-surface border border-base-border rounded-lg overflow-hidden my-2 cursor-pointer hover:border-accent transition-colors"
      title="Click to open in editor"
    >
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-base-border">
        <span className="text-xs text-text-muted">{language}</span>
        <div className="flex items-center gap-1">
          <Tooltip content="Download">
            <button
              onClick={(e) => { e.stopPropagation(); handleDownload(); }}
              className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-base-hover transition-colors"
            >
              <Download size={14} />
            </button>
          </Tooltip>
          <Tooltip content={copied ? "Copied!" : "Copy"}>
            <button
              onClick={(e) => { e.stopPropagation(); handleCopy(); }}
              className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-base-hover transition-colors"
            >
              <Copy size={14} />
            </button>
          </Tooltip>
        </div>
      </div>
      <pre className="p-3 text-sm font-mono text-text-primary overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
