'use client';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const customStyle = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: '#1a1512',
    borderRadius: '0 0 10px 10px',
    margin: 0,
    padding: '16px 20px',
    fontSize: '13px',
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
    fontSize: '13px',
    lineHeight: 1.65,
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
    <div className="group my-4 rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border-subtle)' }}>
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: '#231e1a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-[11px] font-mono text-text-muted/60 lowercase tracking-wide">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] transition-all opacity-0 group-hover:opacity-100"
          style={{ color: copied ? 'var(--color-success)' : 'rgba(255,255,255,0.4)' }}
        >
          {copied ? (
            <><Check size={11} /> Copied</>
          ) : (
            <><Copy size={11} /> Copy</>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language || 'text'}
        style={customStyle}
        showLineNumbers={value.split('\n').length > 5}
        wrapLines
        customStyle={{ margin: 0, borderRadius: 0 }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}
