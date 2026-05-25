'use client';
import { MessageBubble } from './MessageBubble';
import { SearchSources } from './SearchSources';
import { ThinkingIndicator } from './ThinkingIndicator';
import { WelcomeScreen } from './WelcomeScreen';
import { ScrollToBottom } from './ScrollToBottom';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { useChatStore } from '@/store/chatStore';
import { useChat } from '@/hooks/useChat';

export function MessageList() {
  const { messages, isStreaming, setMessages, activeChatId } = useChatStore();
  const { sendMessage, regenerateLast, sources } = useChat();
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

  if (messages.length === 0 && !isStreaming) {
    return <WelcomeScreen />;
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
      <div className="max-w-3xl mx-auto">
        {sources.length > 0 && <SearchSources sources={sources} />}

        {messages.map((msg, i) => (
          <MessageBubble
            key={msg._id || i}
            message={msg}
            isStreaming={isStreaming && i === messages.length - 1}
            isLast={i === messages.length - 1}
            onRegenerate={i === messages.length - 1 && msg.role === 'assistant' ? regenerateLast : undefined}
            onEdit={msg.role === 'user' ? (newContent) => handleEdit(i, newContent) : undefined}
            chatId={activeChatId}
            messageIndex={i}
          />
        ))}

        {isStreaming && messages[messages.length - 1]?.content === '' && (
          <div className="flex justify-start mb-6">
            <ThinkingIndicator />
          </div>
        )}
      </div>

      {showScrollButton && <ScrollToBottom onClick={() => scrollToBottom()} />}
    </div>
  );
}
