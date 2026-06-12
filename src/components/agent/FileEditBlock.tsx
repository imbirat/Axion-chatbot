"use client";

import { FilePen } from "lucide-react";

interface FileEditBlockProps {
  filename: string;
  additions: number;
  deletions: number;
}

export function FileEditBlock({ filename, additions, deletions }: FileEditBlockProps) {
  return (
    <div className="bg-[#2A2A29] border border-[#3A3A39] rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2">
        <FilePen size={16} className="text-[#E5A44A]" />
        <span className="text-xs text-[#9B9B99]">edit</span>
        <span className="text-sm text-[#F0EFED] font-mono">{filename}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="bg-[#1a3a2a] text-[#4CAF82] text-xs font-mono px-1.5 py-0.5 rounded">+{additions}</span>
          <span className="bg-[#3a1a1a] text-[#E5554A] text-xs font-mono px-1.5 py-0.5 rounded">-{deletions}</span>
        </div>
      </div>
    </div>
  );
}
