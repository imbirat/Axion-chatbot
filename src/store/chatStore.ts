import { create } from 'zustand';
import { Chat, Message, Mode } from '@/types/chat';
import { MODELS } from '@/config/models.config';

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  messages: Message[];
  mode: Mode;
  selectedModel: string;
  isStreaming: boolean;
  searchQuery: string;
  
  setChats: (chats: Chat[]) => void;
  setActiveChatId: (id: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  setMode: (mode: Mode) => void;
  setSelectedModel: (model: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  setSearchQuery: (query: string) => void;
  addChat: (chat: Chat) => void;
  removeChat: (id: string) => void;
  updateChat: (id: string, updates: Partial<Chat>) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChatId: null,
  messages: [],
  mode: 'chat',
  selectedModel: 'axion-4.6',
  isStreaming: false,
  searchQuery: '',

  setChats: (chats) => set({ chats }),
  setActiveChatId: (id) => set({ activeChatId: id }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (content) =>
    set((state) => {
      const msgs = [...state.messages];
      const last = msgs[msgs.length - 1];
      if (last) {
        msgs[msgs.length - 1] = { ...last, content: last.content + content };
      }
      return { messages: msgs };
    }),
  setMode: (mode) => set({ mode }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  addChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
  removeChat: (id) => set((state) => ({ chats: state.chats.filter((c) => c._id !== id) })),
  updateChat: (id, updates) =>
    set((state) => ({
      chats: state.chats.map((c) => (c._id === id ? { ...c, ...updates } : c)),
    })),
  reset: () => set({ messages: [], activeChatId: null, isStreaming: false }),
}));
