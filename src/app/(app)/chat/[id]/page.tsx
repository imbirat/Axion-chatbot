"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useChat } from "@/hooks/useChat";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatInput } from "@/components/input/ChatInput";
import { Mode } from "@/types";

interface DbMessage {
  id: string;
  role: string;
  content: string;
  tool_calls: unknown;
  sources: unknown;
}

export default function ChatPage() {
  const params = useParams();
  const [modelId, setModelId] = useState("axion-4.7");
  const [thinkingEnabled, setThinkingEnabled] = useState(false);
  const [mode] = useState<Mode>("chat");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const chat = useChat();

  useEffect(() => {
    async function loadConversation() {
      if (!params?.id || params.id === "new") {
        setLoading(false);
        return;
      }

      const { data: dbMessages } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", params.id)
        .order("created_at", { ascending: true });

      if (dbMessages) {
        chat.loadMessages(
          (dbMessages as DbMessage[]).map((m: DbMessage) => ({
            id: m.id,
            role: (m.role === "user" || m.role === "assistant" ? m.role : "assistant") as "user" | "assistant",
            content: m.content || "",
          }))
        );
      }
      setLoading(false);
    }
    loadConversation();
  }, [params?.id, supabase, chat]);

  function handleSend(text: string, activeMode?: string) {
    chat.sendMessage(text, modelId, params?.id as string, activeMode || mode);
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-text-muted text-sm">Loading conversation...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatWindow
        messages={chat.messages}
        aiState={chat.aiState}
        streamingContent={chat.streamingContent}
        onEditMessage={chat.editMessage}
        onCopyMessage={chat.copyMessage}
        onRetryMessage={(id) => chat.retryMessage(id)}
        onFeedback={chat.feedback}
      />
      <div className="px-4 pb-4 pt-2 border-t border-[#3A3A39]">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSend={handleSend}
            modelId={modelId}
            onModelChange={setModelId}
            mode={mode}
            thinkingEnabled={thinkingEnabled}
            onThinkingToggle={() => setThinkingEnabled(!thinkingEnabled)}
          />
        </div>
      </div>
    </div>
  );
}
