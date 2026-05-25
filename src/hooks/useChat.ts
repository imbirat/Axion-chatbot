'use client';
import { useCallback, useRef, useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Message, ContentPart } from '@/types/chat';
import { SearchSource } from '@/types/api';
import toast from 'react-hot-toast';

export function useChat() {
  const { messages, addMessage, updateLastMessage, setMessages, setIsStreaming, selectedModel, mode } = useChatStore();
  const { customInstructions, customInstructionsEnabled } = useSettingsStore();
  const [reasoning, setReasoning] = useState('');
  const [sources, setSources] = useState<SearchSource[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string, attachments?: ContentPart[]) => {
    const textContent = typeof content === 'string' ? content.trim() : '';
    if (!textContent && (!attachments || attachments.length === 0)) return;

    let userContent: string | ContentPart[];
    if (attachments && attachments.length > 0) {
      const parts: ContentPart[] = [];
      if (textContent) parts.push({ type: 'text', text: textContent });
      parts.push(...attachments);
      userContent = parts;
    } else {
      userContent = textContent;
    }

    const userMessage: Message = { role: 'user', content: userContent, createdAt: new Date() };
    addMessage(userMessage);
    setReasoning('');
    setSources([]);
    setIsSearching(false);

    const aiMessage: Message = { role: 'assistant', content: '', createdAt: new Date(), model: selectedModel };
    addMessage(aiMessage);
    setIsStreaming(true);

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textContent,
          mode,
          model: selectedModel,
          history: messages.slice(-10),
          attachments,
          customInstructions,
          customInstructionsEnabled,
        }),
        signal: abortController.signal,
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        throw new Error(errBody || `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const json = JSON.parse(trimmed.slice(6));
            if (json.type === 'token') {
              updateLastMessage(json.content);
            } else if (json.type === 'reasoning') {
              setReasoning((prev) => prev + json.content);
            } else if (json.type === 'model-switch') {
              useChatStore.setState({ selectedModel: json.model });
            } else if (json.type === 'search-start') {
              setSources([]);
              setIsSearching(true);
            } else if (json.type === 'search-result') {
              setSources((prev) => [...prev, { title: json.title || '', url: json.url || '' }]);
              setIsSearching(false);
            } else if (json.type === 'done') {
              setIsStreaming(false);
            } else if (json.type === 'error') {
              updateLastMessage(`\n\n⚠️ ${json.error}`);
              toast.error(json.error);
              setIsStreaming(false);
            }
          } catch {}
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        updateLastMessage(`\n\n⚠️ Connection error: ${err.message}`);
        toast.error(err.message);
        setIsStreaming(false);
      }
    }

    setIsStreaming(false);
    abortRef.current = null;
  }, [messages, addMessage, updateLastMessage, setIsStreaming, selectedModel, mode, customInstructions, customInstructionsEnabled]);

  const stopGeneration = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsStreaming(false);
  }, [setIsStreaming]);

  const regenerateLast = useCallback(async () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      setMessages(messages.slice(0, -1));
      const content = typeof lastUserMsg.content === 'string' ? lastUserMsg.content : '';
      await sendMessage(content, undefined);
    }
  }, [messages, sendMessage, setMessages]);

  return { messages, sendMessage, stopGeneration, regenerateLast, reasoning, sources, isSearching, isStreaming: useChatStore((s) => s.isStreaming) };
}
