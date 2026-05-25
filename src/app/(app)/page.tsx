'use client';
import { ChatHeader } from '@/components/header/ChatHeader';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/input/ChatInput';
import { useChatStore } from '@/store/chatStore';
import { WelcomeScreen } from '@/components/chat/WelcomeScreen';

export default function HomePage() {
  const { messages } = useChatStore();

  return (
    <div className="flex flex-col h-full relative">
      <ChatHeader />
      {messages.length === 0 ? <WelcomeScreen /> : <MessageList />}
      <ChatInput />
    </div>
  );
}
