export interface Profile {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  mode: "chat" | "code" | "voice" | "agent";
  model_id: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  model_id: string | null;
  thinking: string | null;
  sources: Source[] | null;
  tool_calls: ToolCall[] | null;
  feedback: "good" | "bad" | null;
  created_at: string;
}

export interface Source {
  title: string;
  url: string;
  snippet: string;
}

export interface ToolCall {
  tool: string;
  input: string;
  output: string;
  status: "running" | "completed" | "error";
}

export interface Settings {
  user_id: string;
  appearance: "system" | "dark" | "light";
  contrast: "system" | "medium" | "increased";
  language: string;
}

export type Mode = "chat" | "code" | "voice" | "agent";
export type ModelProvider = "groq" | "gemini";
export type AIState = "thinking" | "searching" | "writing" | "done";
export type AgentStatus = "running" | "done" | "error";

export interface ModelConfig {
  id: string;
  name: string;
  provider: ModelProvider;
  modelString: string;
  modes: Mode[];
  description: string;
  showInQuickPicker?: boolean;
  subAgentModel?: boolean;
  coderModel?: boolean;
  agentPrimary?: boolean;
  supportsThinking?: boolean;
}

export interface SubAgentStep {
  type: "text" | "write" | "edit" | "summary";
  content?: string;
  filename?: string;
  language?: string;
  fileStatus?: "streaming" | "done";
  additions?: number;
  deletions?: number;
}

export type AgentEventType =
  | "text"
  | "write_start"
  | "write_chunk"
  | "write_done"
  | "edit"
  | "subagent_start"
  | "subagent_text"
  | "subagent_write_start"
  | "subagent_write_chunk"
  | "subagent_write_done"
  | "subagent_edit"
  | "subagent_done"
  | "done";

export interface AgentEvent {
  type: AgentEventType;
  delta?: string;
  filename?: string;
  language?: string;
  model?: string;
  task?: string;
  summary?: string;
  additions?: number;
  deletions?: number;
}
