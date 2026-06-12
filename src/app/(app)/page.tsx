"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ChatInput } from "@/components/input/ChatInput";
import { ModeBar } from "@/components/input/ModeBar";
import { useChat } from "@/hooks/useChat";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Mode } from "@/types";

const greetings = [
  "Hello {name}, How can I assist you today?",
  "Good morning, {name}",
  "Good evening, {name}",
  "How can I assist you today?",
  "Hey {name}, How can I help you today?",
  "Hey there, {name}",
];

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [modelId, setModelId] = useState("axion-4.7");
  const [thinkingEnabled, setThinkingEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("chat");
  const supabase = createClient();
  const chat = useChat();
  const hasMessages = chat.messages.length > 0;

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const name = user.email.split("@")[0];
        setUsername(name);
      }
    }
    load();
  }, [supabase]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const timeGreetings = greetings.filter((g) => {
      if (hour < 12 && g.includes("morning")) return true;
      if (hour >= 17 && g.includes("evening")) return true;
      return !g.includes("morning") && !g.includes("evening");
    });
    const pick = timeGreetings[Math.floor(Math.random() * timeGreetings.length)];
    return pick.replace("{name}", username || "there");
  }, [username]);

  function handleSend(text: string, activeMode?: string) {
    chat.sendMessage(text, modelId, undefined, activeMode || mode);
  }

  function handleModeSelect(modeId: string) {
    setMode(modeId as Mode);
  }

  function handleSuggestionClick(text: string) {
    chat.sendMessage(text, modelId);
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {hasMessages ? (
        <>
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
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <Image
            src="/logo.png"
            alt="Axion AI"
            width={120}
            height={32}
            priority
            className="mb-6 opacity-80"
          />
          <h2 className="text-lg text-text-secondary mb-8 text-center">{greeting}</h2>
          <div className="w-full max-w-xl mb-6">
            <ChatInput
              onSend={handleSend}
              modelId={modelId}
              onModelChange={setModelId}
              mode={mode}
              thinkingEnabled={thinkingEnabled}
              onThinkingToggle={() => setThinkingEnabled(!thinkingEnabled)}
              placeholder="Write a message..."
            />
          </div>
          <ModeBar onModeSelect={handleModeSelect} onSuggestionClick={handleSuggestionClick} />
        </div>
      )}
    </div>
  );
}
