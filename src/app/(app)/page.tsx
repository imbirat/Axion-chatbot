'use client';
import { ChatHeader } from '@/components/header/ChatHeader';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/input/ChatInput';
import { useChatStore } from '@/store/chatStore';
import { WelcomeScreen } from '@/components/chat/WelcomeScreen';

export default function HomePage() {
  const { messages } = useChatStore();

  const handlePromptSelect = (prompt: string) => {
    const event = new CustomEvent('axion-prompt', { detail: prompt });
    window.dispatchEvent(event);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      {messages.length === 0 ? (
        <WelcomeScreen onSelectPrompt={handlePromptSelect} />
      ) : (
        <MessageList />
      )}
      <ChatInput />
    </div>
  );
}
