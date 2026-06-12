"use client";

import { useState } from "react";
import { FilePlus, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { mapLanguageToMonaco } from "@/lib/models";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface FileWriteBlockProps {
  filename: string;
  content: string;
  language: string;
  status: "streaming" | "done";
}

export function FileWriteBlock({ filename, content, language, status }: FileWriteBlockProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#2A2A29] border border-[#3A3A39] rounded-lg overflow-hidden">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#303030] transition-colors"
      >
        <FilePlus size={16} className="text-[#7C6FEC]" />
        <span className="text-xs text-[#9B9B99]">write</span>
        <span className="text-sm text-[#F0EFED] font-mono">{filename}</span>
        <div className="ml-auto">
          {expanded ? (
            <ChevronUp size={16} className="text-[#9B9B99]" />
          ) : (
            <ChevronDown size={16} className="text-[#9B9B99]" />
          )}
        </div>
      </div>
      {expanded && (
        <>
          <div className="border-t border-[#3A3A39]" />
          <div className="max-h-64 overflow-y-auto">
            <SyntaxHighlighter
              language={mapLanguageToMonaco(language)}
              style={oneDark}
              customStyle={{ margin: 0, borderRadius: 0, fontSize: "11px" }}
              showLineNumbers
            >
              {content}
            </SyntaxHighlighter>
            {status === "streaming" && (
              <span className="streaming-cursor text-accent ml-1" />
            )}
          </div>
        </>
      )}
    </div>
  );
}
