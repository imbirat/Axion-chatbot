"use client";

interface CodePreviewProps {
  code: string;
  language: string;
}

export function CodePreview({ code, language }: CodePreviewProps) {
  if (language === "html") {
    return (
      <iframe
        srcDoc={code}
        className="w-full h-full bg-white"
        title="Preview"
        sandbox="allow-scripts"
      />
    );
  }

  return (
    <div className="flex items-center justify-center h-full text-text-muted text-sm">
      Preview not available for {language}
    </div>
  );
}
