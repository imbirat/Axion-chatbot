'use client';
import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { ThinkingIndicator } from './ThinkingIndicator';
import { ScrollToBottom } from './ScrollToBottom';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { useChatStore } from '@/store/chatStore';
import { useChat } from '@/hooks/useChat';

export function MessageList() {
  const { messages, isStreaming, setMessages } = useChatStore();
  const { sendMessage, regenerateLast } = useChat();
  const { containerRef, scrollToBottom, showScrollButton } = useAutoScroll([messages, isStreaming]);

  const handleEdit = (index: number, newContent: string) => {
    const currentMessages = useChatStore.getState().messages;
    const updated = [...currentMessages];
    updated[index] = { ...updated[index], content: newContent };
    const nextMsg = updated[index + 1];

    if (nextMsg?.role === 'assistant') {
      setMessages(updated.slice(0, index + 1));
      sendMessage(newContent);
    } else {
      setMessages(updated);
    }
  };

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
      <div className="max-w-3xl mx-auto">
        {messages.map((msg, i) => (
          <MessageBubble
            key={msg._id || i}
            message={msg}
            isStreaming={isStreaming && i === messages.length - 1}
            isLast={i === messages.length - 1}
            onRegenerate={i === messages.length - 1 && msg.role === 'assistant' ? regenerateLast : undefined}
            onEdit={msg.role === 'user' ? (newContent) => handleEdit(i, newContent) : undefined}
          />
        ))}

        {isStreaming && messages[messages.length - 1]?.content === '' && (
          <div className="flex justify-start mb-6">
            <ThinkingIndicator />
          </div>
        )}

        {messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-lg shadow-accent-primary/20">
              A
            </div>
            <h1 className="text-2xl font-semibold text-text-primary mb-2 tracking-tight">What can I help you with?</h1>
            <p className="text-sm text-text-muted max-w-md">
              Ask me anything — I can research, code, analyze, and more.
            </p>
          </div>
        )}
      </div>

      {showScrollButton && <ScrollToBottom onClick={() => scrollToBottom()} />}
    </div>
  );
}
