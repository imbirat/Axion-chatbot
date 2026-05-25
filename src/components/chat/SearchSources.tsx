'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, ChevronDown, ExternalLink } from 'lucide-react';
import { SearchSource } from '@/types/api';
import { cn } from '@/lib/utils';

interface SearchSourcesProps {
  sources: SearchSource[];
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function getFaviconUrl(url: string): string {
  try {
    const origin = new URL(url).origin;
    return `${origin}/favicon.ico`;
  } catch {
    return '';
  }
}

export function SearchSources({ sources }: SearchSourcesProps) {
  const [expanded, setExpanded] = useState(false);

  if (sources.length === 0) return null;

  const visible = expanded ? sources : sources.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-3 px-2"
    >
      <div className="flex items-center gap-2 mb-2">
        <Globe size={12} className="text-accent-primary" />
        <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">Sources</span>
        <span className="text-[10px] text-text-muted">({sources.length})</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {visible.map((source, i) => (
          <a
            key={i}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-elevated border border-border-subtle text-[11px] text-text-secondary hover:text-text-primary hover:border-accent-primary/30 transition-colors group"
          >
            {getFaviconUrl(source.url) && (
              <img
                src={getFaviconUrl(source.url)}
                alt=""
                className="w-3.5 h-3.5 rounded"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <span className="truncate max-w-[120px]">{source.title}</span>
            <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </a>
        ))}
        {sources.length > 4 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-bg-elevated border border-border-subtle text-[11px] text-text-muted hover:text-text-primary transition-colors"
          >
            {expanded ? 'Less' : `+${sources.length - 4} more`}
            <ChevronDown size={10} className={cn('transition-transform', expanded && 'rotate-180')} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
