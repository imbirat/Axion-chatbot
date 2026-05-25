import { Mode, Message } from './chat';

export interface ChatRequest {
  chatId?: string;
  message: string;
  mode: Mode;
  model?: string;
  history?: Message[];
}

export interface ChatResponse {
  chatId: string;
  message: string;
  model: string;
  reasoning?: string;
}

export interface StreamChunk {
  type: 'token' | 'reasoning' | 'done' | 'error' | 'model-switch';
  content?: string;
  model?: string;
  error?: string;
  chatId?: string;
}

export interface ResearchRequest {
  query: string;
  depth?: 'basic' | 'deep' | 'comprehensive';
}

export interface ApiError {
  error: string;
  code?: string;
  status?: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}
