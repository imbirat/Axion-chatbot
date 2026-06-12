"use client";

import { useEffect } from "react";

interface ShortcutMap {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      const shift = e.shiftKey;

      if (meta && e.key === "k") shortcuts["search"]?.();
      if (meta && e.key === "n") shortcuts["newChat"]?.();
      if (meta && e.key === "/") shortcuts["shortcuts"]?.();
      if (meta && e.key === ",") shortcuts["settings"]?.();
      if (meta && e.key === "b") shortcuts["toggleSidebar"]?.();
      if (e.key === "Escape") shortcuts["escape"]?.();
      if (meta && e.key === "Enter") shortcuts["send"]?.();
      if (meta && shift && e.key === "C") shortcuts["codeMode"]?.();
      if (meta && shift && e.key === "V") shortcuts["voiceMode"]?.();
      if (meta && shift && e.key === "R") shortcuts["deepResearch"]?.();
      if (meta && shift && e.key === "E") shortcuts["toggleEditor"]?.();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
