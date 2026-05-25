'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

const SHORTCUTS = [
  { description: 'New chat', keys: 'Cmd/Ctrl + K' },
  { description: 'Toggle sidebar', keys: 'Cmd/Ctrl + /' },
  { description: 'Stop generating', keys: 'Esc' },
  { description: 'Copy last response', keys: 'Cmd/Ctrl + Shift + C' },
  { description: 'Keyboard shortcuts', keys: 'Cmd/Ctrl + ?' },
];

interface ShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ open, onClose }: ShortcutsModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-bg-surface border border-border-subtle rounded-xl shadow-2xl z-50 p-6">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-base font-semibold text-text-primary">
              Keyboard Shortcuts
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 rounded hover:bg-[var(--hover-bg)] text-text-muted hover:text-text-primary transition-colors">
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-3">
            {SHORTCUTS.map((shortcut, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">{shortcut.description}</span>
                <kbd className="px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle text-[11px] font-mono text-text-muted">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
