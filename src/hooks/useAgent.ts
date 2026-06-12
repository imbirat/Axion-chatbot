"use client";

import { useState, useCallback, useRef } from "react";
import { SubAgentStep, AgentEvent, AgentStatus } from "@/types";

export function useAgent() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currentText, setCurrentText] = useState("");
  const currentTextRef = useRef(currentText);
  currentTextRef.current = currentText;

  const [currentWrites, setCurrentWrites] = useState<{ filename: string; language: string; content: string; status: "streaming" | "done" }[]>([]);
  const [currentEdits, setCurrentEdits] = useState<{ filename: string; additions: number; deletions: number }[]>([]);
  const [subAgents, setSubAgents] = useState<{
    model: string;
    task: string;
    status: AgentStatus;
    thread: SubAgentStep[];
  }[]>([]);
  const [currentSubAgent, setCurrentSubAgent] = useState<{
    model: string;
    task: string;
    status: AgentStatus;
    thread: SubAgentStep[];
  } | null>(null);

  const sendMessage = useCallback(async (content: string, conversationId?: string) => {
    const userMsg = { role: "user" as const, content };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setCurrentText("");
    setCurrentWrites([]);
    setCurrentEdits([]);
    setCurrentSubAgent(null);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, conversationId }),
      });

      if (!res.ok) throw new Error("Agent request failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event: AgentEvent = JSON.parse(line);
            handleAgentEvent(event);
          } catch {}
        }
      }
    } catch (err) {
      console.error("Agent error:", err);
    } finally {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: currentTextRef.current },
      ]);
    }
  }, []);

  function handleAgentEvent(event: AgentEvent) {
    switch (event.type) {
      case "text":
        setCurrentText((prev) => prev + (event.delta || ""));
        break;
      case "write_start":
        setCurrentWrites((prev) => [
          ...prev,
          { filename: event.filename || "", language: event.language || "text", content: "", status: "streaming" },
        ]);
        break;
      case "write_chunk":
        setCurrentWrites((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last) last.content += event.delta || "";
          return copy;
        });
        break;
      case "write_done":
        setCurrentWrites((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last) last.status = "done";
          return copy;
        });
        break;
      case "edit":
        setCurrentEdits((prev) => [
          ...prev,
          { filename: event.filename || "", additions: event.additions || 0, deletions: event.deletions || 0 },
        ]);
        break;
      case "subagent_start":
        setCurrentSubAgent({
          model: event.model || "axion-4.6",
          task: event.task || "",
          status: "running",
          thread: [],
        });
        break;
      case "subagent_text":
        setCurrentSubAgent((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            thread: [...prev.thread, { type: "text", content: event.delta || "" }],
          };
        });
        break;
      case "subagent_write_start":
        setCurrentSubAgent((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            thread: [...prev.thread, {
              type: "write",
              filename: event.filename || "",
              language: event.language || "text",
              content: "",
              fileStatus: "streaming",
            }],
          };
        });
        break;
      case "subagent_write_chunk":
        setCurrentSubAgent((prev) => {
          if (!prev) return prev;
          const copy = { ...prev, thread: [...prev.thread] };
          const last = copy.thread[copy.thread.length - 1];
          if (last && last.type === "write") {
            last.content = (last.content || "") + (event.delta || "");
          }
          return copy;
        });
        break;
      case "subagent_write_done":
        setCurrentSubAgent((prev) => {
          if (!prev) return prev;
          const copy = { ...prev, thread: [...prev.thread] };
          const last = copy.thread[copy.thread.length - 1];
          if (last && last.type === "write") last.fileStatus = "done";
          return copy;
        });
        break;
      case "subagent_edit":
        setCurrentSubAgent((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            thread: [...prev.thread, {
              type: "edit",
              filename: event.filename || "",
              additions: event.additions || 0,
              deletions: event.deletions || 0,
            }],
          };
        });
        break;
      case "subagent_done":
        setCurrentSubAgent((prev) => {
          if (!prev) return prev;
          const updated = {
            ...prev,
            status: "done" as AgentStatus,
            thread: [...prev.thread, { type: "summary" as const, content: event.summary || "Done" }],
          };
          setSubAgents((agents) => [...agents, updated]);
          return null;
        });
        break;
    }
  }

  return {
    messages,
    isLoading,
    currentText,
    currentWrites,
    currentEdits,
    currentSubAgent,
    subAgents,
    sendMessage,
  };
}
