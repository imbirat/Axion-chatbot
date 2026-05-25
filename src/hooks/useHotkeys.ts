'use client';
import { useEffect } from 'react';

type HotkeyHandler = () => void;

interface HotkeyMap {
  [key: string]: HotkeyHandler;
}

function normalizeKey(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.metaKey) parts.push('meta');
  if (e.ctrlKey) parts.push('ctrl');
  if (e.shiftKey) parts.push('shift');
  if (e.altKey) parts.push('alt');

  const key = e.key.toLowerCase();
  if (key === '?') {
    parts.push('?');
  } else if (key === 'escape') {
    parts.push('escape');
  } else if (key === '/') {
    parts.push('/');
  } else if (['control', 'shift', 'alt', 'meta'].includes(key)) {
    // modifier-only press, skip
    return '';
  } else {
    parts.push(key);
  }

  return parts.join('+');
}

const INPUT_SELECTOR = 'input, textarea, [contenteditable]';

export function useHotkeys(shortcuts: HotkeyMap) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = normalizeKey(e);
      if (!key) return;

      const isInput = (e.target as HTMLElement)?.closest?.(INPUT_SELECTOR);
      const alwaysFire = key === 'escape';

      if (isInput && !alwaysFire) return;

      const action = shortcuts[key];
      if (action) {
        e.preventDefault();
        e.stopPropagation();
        action();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [shortcuts]);
}
