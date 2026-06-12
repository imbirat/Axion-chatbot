"use client";

import { useState, useCallback } from "react";
import { Sparkles, Send } from "lucide-react";
import { useAgent } from "@/hooks/useAgent";
import { SubAgentBlock } from "@/components/agent/SubAgentBlock";
import { FileWriteBlock } from "@/components/agent/FileWriteBlock";
import { FileEditBlock } from "@/components/agent/FileEditBlock";

export default function AgentPage() {
  const agent = useAgent();
  const [input, setInput] = useState("");

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    agent.sendMessage(input.trim());
    setInput("");
  }, [input, agent]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {agent.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
              <div className="rounded-full p-3 bg-accent-subtle mb-4">
                <Sparkles size={24} className="text-accent" />
              </div>
              <h2 className="text-lg text-text-secondary mb-2">Agent Mode</h2>
              <p className="text-sm text-text-muted text-center max-w-md">
                Axion 4.7 orchestrates sub-agents to complete complex tasks.
                Describe what you want to build.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {agent.messages.map((msg, i) => (
                <div key={i}>
                  {msg.role === "user" ? (
                    <div className="flex justify-end mb-4">
                      <div className="bg-base-surface rounded-chat p-3 text-sm text-text-primary max-w-[70%]">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 mb-4">
                      <div className="rounded-full p-1 bg-accent-subtle mt-0.5">
                        <Sparkles size={14} className="text-accent" />
                      </div>
                      <div className="flex-1 text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {agent.currentText && (
                <div className="flex items-start gap-2 mb-4">
                  <div className="rounded-full p-1 bg-accent-subtle mt-0.5">
                    <Sparkles size={14} className="text-accent" />
                  </div>
                  <div className="flex-1 text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                    {agent.currentText}
                    <span className="streaming-cursor" />
                  </div>
                </div>
              )}

              {agent.currentWrites.map((w, i) => (
                <FileWriteBlock
                  key={`write-${i}`}
                  filename={w.filename}
                  content={w.content}
                  language={w.language}
                  status={w.status}
                />
              ))}

              {agent.currentEdits.map((e, i) => (
                <FileEditBlock
                  key={`edit-${i}`}
                  filename={e.filename}
                  additions={e.additions}
                  deletions={e.deletions}
                />
              ))}

              {agent.currentSubAgent && (
                <SubAgentBlock
                  model={agent.currentSubAgent.model as "axion-4.6" | "axion-4.6-coder"}
                  task={agent.currentSubAgent.task}
                  status={agent.currentSubAgent.status}
                  thread={agent.currentSubAgent.thread}
                />
              )}

              {agent.subAgents.map((sa, i) => (
                <SubAgentBlock
                  key={`sa-${i}`}
                  model={sa.model as "axion-4.6" | "axion-4.6-coder"}
                  task={sa.task}
                  status={sa.status}
                  thread={sa.thread}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 pt-2 border-t border-[#3A3A39]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 bg-base-surface border border-base-border rounded-input px-3 py-2 focus-within:border-accent/50 transition-colors">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-accent-subtle border border-accent/30 text-xs text-accent">
              <Sparkles size={12} />
              <span>Axion 4.7 &middot; Agent</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Describe what you want to build..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none max-h-[200px] py-1.5"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || agent.isLoading}
              className="p-2 rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.95] transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
