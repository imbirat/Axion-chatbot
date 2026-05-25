import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const value = String(children).replace(/\n$/, '');
          
          if (match) {
            return <CodeBlock language={match[1]} value={value} />;
          }
          
          return (
            <code
              className="px-1.5 py-0.5 rounded-md bg-bg-elevated text-accent-primary text-xs font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },
        pre({ children }) {
          return <>{children}</>;
        },
        h1: ({ children }) => (
          <h1 className="text-xl font-semibold text-text-primary mt-6 mb-3 tracking-tight">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-semibold text-text-primary mt-5 mb-2 tracking-tight">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-medium text-text-primary mt-4 mb-2">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-sm text-text-primary leading-relaxed mb-4 last:mb-0">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside text-sm text-text-primary space-y-1 mb-4">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside text-sm text-text-primary space-y-1 mb-4">{children}</ol>
        ),
        li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-accent-primary/40 pl-4 py-1 my-4 text-sm text-text-secondary italic">
            {children}
          </blockquote>
        ),
        a: ({ children, href }) => (
          <a href={href} className="text-accent-primary hover:underline underline-offset-2" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm border-collapse">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-border-subtle px-3 py-2 bg-bg-elevated text-left text-text-primary font-medium">{children}</th>
        ),
        td: ({ children }) => (
          <td className="border border-border-subtle px-3 py-2 text-text-secondary">{children}</td>
        ),
        hr: () => <hr className="my-6 border-border-subtle" />,
        strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
        em: ({ children }) => <em className="italic text-text-secondary">{children}</em>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
