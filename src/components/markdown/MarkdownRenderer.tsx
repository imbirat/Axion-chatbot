import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { CodeBlock } from './CodeBlock';
import { useArtifact } from '@/context/ArtifactContext';

interface MarkdownRendererProps {
  content: string;
}

const ARTIFACT_LANGUAGES = ['html', 'jsx', 'svg', 'mermaid'];

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { setActiveArtifact } = useArtifact();

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const value = String(children).replace(/\n$/, '');

          if (match) {
            const lang = match[1];
            const lines = value.split('\n').length;

            if (lines > 10 && ARTIFACT_LANGUAGES.includes(lang)) {
              const title = value.split('\n')[0]?.replace(/^\/\/\s*|^#\s*|^<!--\s*|-->$/g, '').trim() || lang;
              return (
                <div className="relative group my-4">
                  <CodeBlock language={lang} value={value} />
                  <button
                    onClick={() => setActiveArtifact({ language: lang, code: value, title })}
                    className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-accent-primary/90 text-white opacity-0 group-hover:opacity-100 hover:bg-accent-primary transition-all duration-200 shadow-lg"
                  >
                    Open artifact →
                  </button>
                </div>
              );
            }

            return <CodeBlock language={lang} value={value} />;
          }

          return (
            <code
              className="px-1.5 py-0.5 rounded-md text-[12.5px] font-mono"
              style={{
                background: 'var(--color-bg-elevated)',
                color: 'var(--color-accent-primary)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              {children}
            </code>
          );
        },
        pre({ children }) {
          return <>{children}</>;
        },
        h1: ({ children }) => (
          <h1 className="text-xl font-semibold text-text-primary mt-8 mb-3 tracking-tight leading-tight">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-semibold text-text-primary mt-6 mb-2.5 tracking-tight leading-tight">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-semibold text-text-primary mt-5 mb-2 leading-tight">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-[15px] leading-[1.8] mb-4 last:mb-0 text-text-secondary">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-outside text-[14.5px] text-text-secondary space-y-1.5 mb-4 pl-5">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside text-[14.5px] text-text-secondary space-y-1.5 mb-4 pl-5">{children}</ol>
        ),
        li: ({ children }) => <li className="text-[14.5px] leading-[1.75]">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote
            className="pl-4 py-0.5 my-4 text-[14px] text-text-secondary italic"
            style={{ borderLeft: '3px solid var(--color-accent-primary)', opacity: 0.85 }}
          >
            {children}
          </blockquote>
        ),
        a: ({ children, href }) => (
          <a href={href} className="text-accent-primary hover:underline underline-offset-2 decoration-accent-primary/30" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4 rounded-xl border border-border-subtle">
            <table className="w-full text-sm border-collapse">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th
            className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            style={{ background: 'var(--color-bg-elevated)', borderBottom: '1px solid var(--color-border-subtle)' }}
          >
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-border-subtle px-4 py-2.5 text-text-secondary">{children}</td>
        ),
        hr: () => <hr className="my-8 border-border-subtle/50" />,
        strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
        em: ({ children }) => <em className="italic text-text-secondary">{children}</em>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
