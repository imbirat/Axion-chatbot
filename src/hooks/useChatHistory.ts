'use client';
import { useCallback, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Chat, Message } from '@/types/chat';

export function useChatHistory() {
  const { chats, setChats, setActiveChatId, setMessages, activeChatId, addChat, removeChat, updateChat } = useChatStore();

  const fetchChats = useCallback(async () => {
    try {
      const res = await fetch('/api/chats');
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
      }
    } catch (err) {
      console.error('Failed to fetch chats', err);
    }
  }, [setChats]);

  const loadChat = useCallback(async (chatId: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        setActiveChatId(chatId);
        return data;
      }
    } catch (err) {
      console.error('Failed to load chat', err);
    }
  }, [setMessages, setActiveChatId]);

  const createChat = useCallback(async (params?: { title?: string; mode?: string; model?: string }) => {
    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params || {}),
      });
      if (res.ok) {
        const data = await res.json();
        addChat(data.chat);
        setActiveChatId(data.chat._id);
        setMessages([]);
        return data.chat;
      }
    } catch (err) {
      console.error('Failed to create chat', err);
    }
  }, [addChat, setActiveChatId, setMessages]);

  const deleteChat = useCallback(async (chatId: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, { method: 'DELETE' });
      if (res.ok) {
        removeChat(chatId);
        if (activeChatId === chatId) {
          setActiveChatId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error('Failed to delete chat', err);
    }
  }, [removeChat, activeChatId, setActiveChatId, setMessages]);

  const updateChatTitle = useCallback(async (chatId: string, title: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (res.ok) {
        updateChat(chatId, { title });
      }
    } catch (err) {
      console.error('Failed to update chat', err);
    }
  }, [updateChat]);

  const togglePin = useCallback(async (chatId: string, pinned: boolean) => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned }),
      });
      if (res.ok) {
        updateChat(chatId, { pinned });
      }
    } catch (err) {
      console.error('Failed to pin chat', err);
    }
  }, [updateChat]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return { chats, fetchChats, loadChat, createChat, deleteChat, updateChatTitle, togglePin };
}
