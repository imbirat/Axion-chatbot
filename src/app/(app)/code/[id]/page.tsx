"use client";

import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useChat } from "@/hooks/useChat";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatInput } from "@/components/input/ChatInput";
import { CodeLayout } from "@/components/code/CodeLayout";
import { mapLanguageToMonaco } from "@/lib/models";
import { Mode } from "@/types";

export default function CodePage() {
  const [modelId] = useState("axion-4.6-coder");
  const [thinkingEnabled] = useState(false);
  const mode: Mode = "code";
  const chat = useChat();

  const [codePanelOpen, setCodePanelOpen] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");

  function handleSend(text: string, activeMode?: string) {
    chat.sendMessage(text, modelId, undefined, activeMode || mode);
  }

  function handleOpenCode(newCode: string, newLanguage: string) {
    setCode(newCode);
    setLanguage(mapLanguageToMonaco(newLanguage));
    setCodePanelOpen(true);
    setActiveTab("editor");
  }

  function handleClosePanel() {
    setCodePanelOpen(false);
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

  function handleCopy() {
    navigator.clipboard.writeText(code);
  }

  return (
    <div className="flex-1 flex h-full">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={codePanelOpen ? 50 : 100} minSize={30}>
          <div className="flex flex-col h-full">
            <ChatWindow
              messages={chat.messages}
              aiState={chat.aiState}
              streamingContent={chat.streamingContent}
              onEditMessage={chat.editMessage}
              onCopyMessage={chat.copyMessage}
              onRetryMessage={(id) => chat.retryMessage(id)}
              onFeedback={chat.feedback}
              onOpenCode={handleOpenCode}
            />
            <div className="px-4 pb-4 pt-2 border-t border-[#3A3A39]">
              <div className="max-w-3xl mx-auto">
                <ChatInput
                  onSend={handleSend}
                  modelId={modelId}
                  onModelChange={() => {}}
                  mode={mode}
                  thinkingEnabled={thinkingEnabled}
                  onThinkingToggle={() => {}}
                  modelSelectorDisabled={true}
                />
              </div>
            </div>
          </div>
        </Panel>
        {codePanelOpen && (
          <>
            <PanelResizeHandle className="w-1 bg-[#3A3A39] hover:bg-accent transition-colors cursor-col-resize" />
            <Panel defaultSize={50} minSize={20}>
              <CodeLayout
                code={code}
                language={language}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onDownload={handleDownload}
                onCopy={handleCopy}
                onClose={handleClosePanel}
                onCodeChange={setCode}
                readOnly={false}
              />
            </Panel>
          </>
        )}
      </PanelGroup>
    </div>
  );
}
