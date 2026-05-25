'use client';
import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const customStyle = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: '#0d1220',
    borderRadius: '0 0 12px 12px',
    margin: 0,
    padding: '20px',
    fontSize: '13px',
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
    fontSize: '13px',
    lineHeight: 1.6,
  },
};

interface CodeBlockProps {
  language: string;
  value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative my-4 rounded-xl overflow-hidden border border-border-subtle shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b0e14] border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-text-muted/60" />
          <span className="text-[11px] font-mono text-text-muted/70 uppercase tracking-wider">
            {language || 'code'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] text-text-muted/60 hover:text-text-primary hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100"
        >
          {copied ? (
            <><Check size={12} className="text-success" /> Copied</>
          ) : (
            <><Copy size={12} /> Copy</>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={customStyle}
        showLineNumbers={value.split('\n').length > 3}
        wrapLines
        customStyle={{ margin: 0, borderRadius: 0 }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}
