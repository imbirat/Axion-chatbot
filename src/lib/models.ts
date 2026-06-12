import { ModelConfig } from "@/types";

export const MODELS: ModelConfig[] = [
  {
    id: "axion-4.5",
    name: "Axion 4.5",
    provider: "groq",
    modelString: "openai/gpt-oss-20b",
    modes: ["chat", "voice"],
    description: "Fast and capable general model",
    showInQuickPicker: true,
  },
  {
    id: "axion-4.6",
    name: "Axion 4.6",
    provider: "groq",
    modelString: "llama-3.3-70b-versatile",
    modes: ["chat", "voice", "agent"],
    description: "Versatile high-performance model",
    subAgentModel: true,
  },
  {
    id: "axion-4.6-coder",
    name: "Axion 4.6 Coder",
    provider: "groq",
    modelString: "qwen/qwen3-32b",
    modes: ["chat", "code", "voice", "agent"],
    description: "Optimized for code generation",
    coderModel: true,
    subAgentModel: true,
  },
  {
    id: "axion-4.7",
    name: "Axion 4.7",
    provider: "gemini",
    modelString: "gemini-2.5-flash",
    modes: ["chat", "voice", "agent"],
    description: "Latest multimodal flagship model",
    showInQuickPicker: true,
    agentPrimary: true,
    supportsThinking: true,
  },
];

export const CODER_MODELS = MODELS.filter((m) => m.coderModel);
export const SUB_AGENT_MODELS = MODELS.filter((m) => m.subAgentModel);
export const QUICK_MODELS = MODELS.filter((m) => m.showInQuickPicker);

export function getModelById(id: string): ModelConfig | undefined {
  return MODELS.find((m) => m.id === id);
}

export function getModelForMode(mode: string, currentModelId?: string): ModelConfig {
  if (mode === "agent") return MODELS.find((m) => m.agentPrimary) || MODELS[3];
  if (mode === "code") return CODER_MODELS[0] || MODELS[2];
  if (currentModelId) {
    const model = getModelById(currentModelId);
    if (model && model.modes.includes(mode as "chat" | "code" | "voice" | "agent")) return model;
  }
  return MODELS[0];
}

export function mapLanguageToMonaco(language: string): string {
  const map: Record<string, string> = {
    tsx: "typescript",
    ts: "typescript",
    js: "javascript",
    jsx: "javascript",
    py: "python",
    rb: "ruby",
    rs: "rust",
    go: "go",
    java: "java",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    php: "php",
    swift: "swift",
    kt: "kotlin",
    scala: "scala",
    html: "html",
    css: "css",
    scss: "scss",
    sql: "sql",
    sh: "shell",
    bash: "shell",
    yaml: "yaml",
    yml: "yaml",
    json: "json",
    xml: "xml",
    md: "markdown",
    markdown: "markdown",
  };
  return map[language] || language;
}
