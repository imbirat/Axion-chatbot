"use client";

import { useState, useCallback } from "react";
import { AIState, ToolCall, Source } from "@/types";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCall[];
  sources?: Source[];
  thinking?: string;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [aiState, setAiState] = useState<AIState>("done");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string, modelId: string, conversationId?: string, mode?: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setAiState("thinking");
    setStreamingContent("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages.map((m) => ({ role: m.role, content: m.content })), { role: "user", content }],
          modelId,
          conversationId,
          mode: mode || "chat",
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setAiState("writing");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;
        setStreamingContent(fullContent);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fullContent,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingContent("");
      setAiState("done");
    } catch (err) {
      console.error("Chat error:", err);
      setAiState("done");
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const editMessage = useCallback((id: string, newContent: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: newContent } : m)));
  }, []);

  const copyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  const retryMessage = useCallback(async (id: string) => {
    const msgIndex = messages.findIndex((m) => m.id === id);
    if (msgIndex === -1) return;

    const userMsg = messages[msgIndex - 1];
    if (!userMsg || userMsg.role !== "user") return;

    setMessages((prev) => prev.slice(0, msgIndex));
    await sendMessage(userMsg.content, "axion-4.7");
  }, [messages, sendMessage]);

  const feedback = useCallback((id: string, type: "good" | "bad") => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, feedback: type } : m)));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setStreamingContent("");
    setAiState("done");
  }, []);

  return {
    messages,
    streamingContent,
    aiState,
    isLoading,
    sendMessage,
    editMessage,
    copyMessage,
    retryMessage,
    feedback,
    clearMessages,
  };
}
