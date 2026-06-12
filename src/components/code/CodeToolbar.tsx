"use client";

import { Eye, Code2, Download, Copy, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";

interface CodeToolbarProps {
  activeTab: "editor" | "preview";
  onTabChange: (tab: "editor" | "preview") => void;
  onDownload: () => void;
  onCopy: () => void;
  onClose: () => void;
}

function TabButton({
  icon: Icon,
  tab,
  activeTab,
  onClick,
}: {
  icon: React.ElementType;
  tab: "editor" | "preview";
  activeTab: "editor" | "preview";
  onClick: (tab: "editor" | "preview") => void;
}) {
  return (
    <button
      onClick={() => onClick(tab)}
      className={cn(
        "p-1.5 rounded-md transition-colors",
        activeTab === tab
          ? "bg-[#3A3A39] text-[#F0EFED]"
          : "text-[#6B6B69] hover:text-[#F0EFED]"
      )}
    >
      <Icon size={16} />
    </button>
  );
}

function IconButton({
  icon: Icon,
  tooltip,
  onClick,
}: {
  icon: React.ElementType;
  tooltip: string;
  onClick: () => void;
}) {
  return (
    <Tooltip content={tooltip}>
      <button
        onClick={onClick}
        className="p-1.5 rounded-md text-[#9B9B99] hover:text-[#F0EFED] hover:bg-[#2A2A29] transition-colors"
      >
        <Icon size={16} />
      </button>
    </Tooltip>
  );
}

export function CodeToolbar({
  activeTab,
  onTabChange,
  onDownload,
  onCopy,
  onClose,
}: CodeToolbarProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-[#3A3A39] bg-[#1F1F1E]">
      <div className="flex items-center gap-1">
        <TabButton icon={Eye} tab="preview" activeTab={activeTab} onClick={onTabChange} />
        <TabButton icon={Code2} tab="editor" activeTab={activeTab} onClick={onTabChange} />
      </div>
      <div className="flex items-center gap-2">
        <IconButton icon={Download} tooltip="Download" onClick={onDownload} />
        <IconButton icon={Copy} tooltip="Copy" onClick={onCopy} />
        <IconButton icon={X} tooltip="Close" onClick={onClose} />
      </div>
    </div>
  );
}
