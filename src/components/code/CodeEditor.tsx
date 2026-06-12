"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface CodeEditorProps {
  code: string;
  language: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({ code, language, onChange, readOnly = false }: CodeEditorProps) {
  return (
    <div className="h-full w-full">
      <MonacoEditor
        height="100%"
        language={language}
        value={code}
        onChange={(value) => onChange?.(value || "")}
        options={{
          minimap: { enabled: false },
          readOnly,
          theme: "vs-dark",
          fontSize: 13,
          fontFamily: "JetBrains Mono, Fira Code, monospace",
          scrollBeyondLastLine: false,
          padding: { top: 12 },
          lineNumbers: "on",
          renderLineHighlight: "line",
        }}
        loading={
          <div className="flex items-center justify-center h-full text-text-muted text-sm">
            Loading editor...
          </div>
        }
      />
    </div>
  );
}
