"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { CodeToolbar } from "./CodeToolbar";
import { CodeEditor } from "./CodeEditor";
import { CodePreview } from "./CodePreview";

interface CodeLayoutProps {
  code: string;
  language: string;
  activeTab: "editor" | "preview";
  onTabChange: (tab: "editor" | "preview") => void;
  onDownload: () => void;
  onCopy: () => void;
  onClose: () => void;
  onCodeChange?: (value: string) => void;
  readOnly?: boolean;
}

export function CodeLayout({
  code,
  language,
  activeTab,
  onTabChange,
  onDownload,
  onCopy,
  onClose,
  onCodeChange,
  readOnly = false,
}: CodeLayoutProps) {
  return (
    <div className="h-full flex flex-col bg-[#1F1F1E] border-l border-[#3A3A39] code-panel-enter">
      <CodeToolbar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onDownload={onDownload}
        onCopy={onCopy}
        onClose={onClose}
      />
      <div className="flex-1 overflow-hidden">
        {activeTab === "editor" ? (
          <CodeEditor
            code={code}
            language={language}
            onChange={onCodeChange}
            readOnly={readOnly}
          />
        ) : (
          <CodePreview code={code} language={language} />
        )}
      </div>
    </div>
  );
}
