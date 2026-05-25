'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { CodeBlock } from '@/components/markdown/CodeBlock';
import { useArtifact } from '@/context/ArtifactContext';
import { cn } from '@/lib/utils';

export function ArtifactPanel() {
  const { activeArtifact, setActiveArtifact } = useArtifact();
  const [copied, setCopied] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeArtifact?.language === 'mermaid' && activeArtifact.code && mermaidRef.current) {
      const loadMermaid = async () => {
        try {
          const mermaid = await import('mermaid');
          mermaid.default.initialize({ startOnLoad: false, theme: 'default' });
          mermaidRef.current!.innerHTML = '';
          const { svg } = await mermaid.default.render('mermaid-artifact', activeArtifact.code);
          mermaidRef.current!.innerHTML = svg;
        } catch {
          mermaidRef.current!.innerHTML = '<p class="text-error text-sm">Failed to render mermaid diagram</p>';
        }
      };
      loadMermaid();
    }
  }, [activeArtifact]);

  const handleCopy = async () => {
    if (!activeArtifact) return;
    await navigator.clipboard.writeText(activeArtifact.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AnimatePresence>
      {activeArtifact && (
        <motion.aside
          initial={{ x: 420 }}
          animate={{ x: 0 }}
          exit={{ x: 420 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-0 top-0 h-full w-[420px] z-50 flex flex-col"
          style={{
            background: 'var(--color-bg-base)',
            borderLeft: '1px solid var(--color-border-subtle)',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <span className="inline-flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  background: 'rgba(207,116,85,0.12)',
                  color: 'var(--color-accent-primary)',
                }}
              >
                {activeArtifact.language}
              </span>
              <span className="text-sm font-medium text-text-primary truncate max-w-[240px]">
                {activeArtifact.title}
              </span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded hover:bg-[var(--hover-bg)] text-text-muted hover:text-text-primary transition-colors"
                title="Copy code"
              >
                {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              </button>
              <button
                onClick={() => setActiveArtifact(null)}
                className="p-1.5 rounded hover:bg-[var(--hover-bg)] text-text-muted hover:text-text-primary transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeArtifact.language === 'html' && (
              <iframe
                srcDoc={activeArtifact.code}
                sandbox="allow-scripts"
                className="w-full h-full border-none rounded-lg bg-white"
                title={activeArtifact.title}
              />
            )}
            {activeArtifact.language === 'svg' && (
              <div
                className="w-full h-full flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: activeArtifact.code }}
              />
            )}
            {activeArtifact.language === 'mermaid' && (
              <div ref={mermaidRef} className="w-full flex items-center justify-center p-4" />
            )}
            {!['html', 'svg', 'mermaid'].includes(activeArtifact.language) && (
              <CodeBlock language={activeArtifact.language} value={activeArtifact.code} />
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
