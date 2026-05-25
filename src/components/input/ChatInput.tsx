'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { MicButton } from './MicButton';
import { SendButton } from './SendButton';
import { ModelSelector } from '@/components/header/ModelSelector';
import { useChatStore } from '@/store/chatStore';
import { useChat } from '@/hooks/useChat';
import { MODELS } from '@/config/models.config';
import { Paperclip, X, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const DRAFT_KEY = 'axion-draft';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface FilePreview {
  name: string;
  type: string;
  data: string; // base64
  blob: Blob;
}

export function ChatInput() {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<FilePreview[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isStreaming, mode } = useChatStore();
  const { sendMessage, stopGeneration } = useChat();

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) setInput(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, input);
  }, [input]);

  const autoResize = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 150) + 'px';
    }
  }, []);

  useEffect(() => {
    autoResize();
  }, [input, autoResize]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isStreaming) return;

    const contentParts: any[] = [];
    for (const att of attachments) {
      if (att.type.startsWith('image/')) {
        contentParts.push({ type: 'image_url', image_url: { url: att.data } });
      } else {
        try {
          const text = await att.blob.text();
          if (text.trim()) {
            const prefix = input.trim() ? `\n\n--- Content from ${att.name} ---\n${text}\n--- End ---` : '';
            setInput((prev) => prev + prefix);
          }
        } catch {
          toast.error(`Could not read ${att.name}`);
        }
      }
    }

    const imageParts = contentParts.filter(p => p.type === 'image_url');
    const msg = input.trim();

    setInput('');
    setAttachments([]);
    localStorage.removeItem(DRAFT_KEY);

    if (imageParts.length > 0) {
      await sendMessage(msg, imageParts);
    } else {
      await sendMessage(msg);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTranscript = (text: string) => {
    setInput((prev) => prev + text);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File must be under 10MB');
      e.target.value = '';
      return;
    }

    const selectedModel = useChatStore.getState().selectedModel;
    const model = MODELS[selectedModel];

    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      if (file.type.startsWith('image/')) {
        if (!model?.supportsVision) {
          toast.error(`Cannot read "${file.name}" (${model?.name || 'this model'} does not support image input)`);
          e.target.value = '';
          return;
        }
        setAttachments((prev) => [...prev, { name: file.name, type: file.type, data, blob: file }]);
      } else if (file.type === 'text/plain' || file.type === 'application/pdf' || file.type === '' || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.csv')) {
        file.text().then((text) => {
          if (input.trim()) {
            setInput((prev) => prev + `\n\n--- ${file.name} ---\n${text}\n---`);
          } else {
            setInput(text);
          }
        });
      } else {
        toast.error(`File type "${file.type || 'unknown'}" not supported yet.`);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-bg-base via-bg-base/90 to-transparent pt-10 pb-6 px-4 flex justify-center z-40">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl">
        <div className="bg-bg-base border border-border-subtle rounded-xl p-2 flex items-end gap-2 focus-within:border-accent-primary/50 transition-colors">
          <div className="flex-1 flex flex-col">
            {attachments.length > 0 && (
              <div className="flex gap-2 px-2 pt-2 pb-1 overflow-x-auto">
                {attachments.map((att, i) => (
                  <div key={i} className="relative group flex-shrink-0">
                    {att.type.startsWith('image/') ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border-subtle">
                        <img src={att.data} alt={att.name} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeAttachment(i)}
                          className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bg-elevated border border-border-subtle text-xs text-text-secondary">
                        <FileText size={12} />
                        <span className="truncate max-w-[80px]">{att.name}</span>
                        <button type="button" onClick={() => removeAttachment(i)} className="ml-1 hover:text-text-primary">
                          <X size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isStreaming ? 'Waiting for response...' : `Message Axion${mode === 'code' ? ' (Code Mode)' : mode === 'research' ? ' (Deep Research)' : ''}...`}
              rows={1}
              disabled={isStreaming}
              className="w-full bg-transparent border-none outline-none resize-none px-2 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:ring-0 disabled:opacity-50"
              style={{ maxHeight: '150px' }}
            />
            <div className="flex items-center justify-between px-2 pb-1">
              <ModelSelector />
              <div className="flex items-center gap-1 text-text-muted">
                <button type="button" className="p-1.5 rounded hover:bg-[var(--hover-bg)] transition-colors" title="Attach file" onClick={handleAttachClick}>
                  <Paperclip size={20} />
                </button>
                <MicButton onTranscript={handleTranscript} />
              </div>
            </div>
          </div>
          <SendButton disabled={!input.trim() && attachments.length === 0 || isStreaming} isStreaming={isStreaming} onStop={stopGeneration} />
        </div>
        <p className="text-[10px] text-text-muted text-center mt-2">
          Axion can make mistakes. Verify important information.
        </p>
      </form>
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*,.txt,.md,.csv,.pdf" />
    </div>
  );
}
