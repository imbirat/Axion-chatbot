'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChatHeader } from '@/components/header/ChatHeader';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/input/ChatInput';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useChatStore } from '@/store/chatStore';

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;
  const { loadChat } = useChatHistory();
  const { setActiveChatId } = useChatStore();

  useEffect(() => {
    if (chatId) {
      loadChat(chatId);
    }
  }, [chatId, loadChat]);

  useEffect(() => {
    return () => {
      setActiveChatId(null);
    };
  }, [setActiveChatId]);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <MessageList />
      <ChatInput />
    </div>
  );
}
