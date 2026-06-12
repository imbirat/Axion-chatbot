"use client";

import { useState, useEffect } from "react";
import { Bot, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileWriteBlock } from "./FileWriteBlock";
import { FileEditBlock } from "./FileEditBlock";
import { SubAgentStep, AgentStatus } from "@/types";
import { Tooltip } from "@/components/ui/Tooltip";

interface SubAgentBlockProps {
  model: "axion-4.6" | "axion-4.6-coder";
  task: string;
  status: AgentStatus;
  thread: SubAgentStep[];
}

export function SubAgentBlock({ model: _model, task, status, thread }: SubAgentBlockProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (status === "done") {
      setExpanded(true);
    }
  }, [status]);

  const headerColor =
    status === "running" ? "text-[#9B9B99]" :
    status === "done" ? "text-[#4CAF82]" :
    "text-[#E5554A]";

  return (
    <div className="bg-[#252524] border border-[#3A3A39] rounded-lg overflow-hidden my-2">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none"
      >
        <span className={cn("thinking-glow rounded-full p-1 bg-white/5", status === "running" ? "opacity-70" : "opacity-0")} />
        <Bot size={16} className="text-[#7C6FEC]" />
        <span className={cn("text-sm flex-1", headerColor)}>{task}</span>
        {expanded ? (
          <ChevronUp size={16} className="text-[#9B9B99]" />
        ) : (
          <ChevronDown size={16} className="text-[#9B9B99]" />
        )}
      </div>
      {expanded && (
        <>
          <div className="border-t border-[#3A3A39]" />
          <div className="px-3 py-3">
            <div className="border-l-2 border-[#3A3A39] pl-3 flex flex-col gap-2">
              {thread.map((step, i) => {
                if (step.type === "text") {
                  return (
                    <div key={i} className="text-sm text-[#F0EFED] leading-relaxed">
                      {step.content}
                    </div>
                  );
                }
                if (step.type === "write" && step.filename && step.content !== undefined) {
                  return (
                    <FileWriteBlock
                      key={i}
                      filename={step.filename}
                      content={step.content}
                      language={step.language || "text"}
                      status={step.fileStatus || "done"}
                    />
                  );
                }
                if (step.type === "edit" && step.filename) {
                  return (
                    <FileEditBlock
                      key={i}
                      filename={step.filename}
                      additions={step.additions || 0}
                      deletions={step.deletions || 0}
                    />
                  );
                }
                if (step.type === "summary" && step.content) {
                  return (
                    <div key={i} className="flex items-start gap-2 text-sm text-[#F0EFED]">
                      <span className="flex-1">{step.content}</span>
                      <Tooltip content="Copy">
                        <button
                          onClick={() => navigator.clipboard.writeText(step.content || "")}
                          className="p-1 rounded text-[#9B9B99] hover:text-[#F0EFED] hover:bg-[#2A2A29] transition-colors"
                        >
                          <Copy size={14} />
                        </button>
                      </Tooltip>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
