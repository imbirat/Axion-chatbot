"use client";

import { useState, useEffect, useRef } from "react";

interface StreamingTextProps {
  content: string;
  isStreaming: boolean;
  speed?: number;
}

export function StreamingText({ content, isStreaming, speed = 15 }: StreamingTextProps) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedLength(content.length);
      return;
    }

    if (displayedLength < content.length) {
      const timer = setTimeout(() => {
        setDisplayedLength((prev) => Math.min(prev + 1, content.length));
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [content, isStreaming, displayedLength, speed]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedLength]);

  const displayed = content.slice(0, displayedLength);

  return (
    <div ref={containerRef} className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
      {displayed}
      {isStreaming && displayedLength < content.length && (
        <span className="streaming-cursor" />
      )}
    </div>
  );
}
