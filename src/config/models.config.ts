import { AxionModel, FallbackChain, TaskType } from '@/types/models';

export const MODELS: Record<string, AxionModel> = {
  'axion-4.6': {
    id: 'axion-4.6',
    name: 'Axion 4.6',
    provider: 'groq',
    apiKeyEnv: 'GROQ_API_KEY',
    underlying: 'llama-3.3-70b-versatile',
    category: 'basic',
    description: 'Lightweight, fast chat',
    supportsStreaming: true,
    supportsReasoning: false,
    rateLimited: false,
  },
  'axion-4.6-coder': {
    id: 'axion-4.6-coder',
    name: 'Axion 4.6 Coder',
    provider: 'groq',
    apiKeyEnv: 'GROQ_API_KEY',
    underlying: 'qwen/qwen-3-32b',
    category: 'basic',
    description: 'Lightweight coding assistant',
    supportsStreaming: true,
    supportsReasoning: false,
    rateLimited: false,
  },
  'axion-4.7': {
    id: 'axion-4.7',
    name: 'Axion 4.7',
    provider: 'groq',
    apiKeyEnv: 'GROQ_API_KEY',
    underlying: 'deepseek-r1-distill-70b',
    category: 'main',
    description: 'Primary reasoning + intelligence',
    supportsStreaming: true,
    supportsReasoning: true,
    rateLimited: false,
  },
  'axion-4.7-coder': {
    id: 'axion-4.7-coder',
    name: 'Axion 4.7 Coder',
    provider: 'groq',
    apiKeyEnv: 'GROQ_API_KEY',
    underlying: 'openai/gpt-oss-120b',
    category: 'main',
    description: 'Advanced coding model',
    supportsStreaming: true,
    supportsReasoning: false,
    rateLimited: false,
  },
};

export const FALLBACK_CHAINS: Record<TaskType, FallbackChain> = {
  'fast': {
    primary: 'axion-4.6',
    fallbacks: [],
  },
  'general': {
    primary: 'axion-4.7',
    fallbacks: ['axion-4.6'],
  },
  'general-premium': {
    primary: 'axion-4.7',
    fallbacks: ['axion-4.6'],
  },
  'coding': {
    primary: 'axion-4.7-coder',
    fallbacks: ['axion-4.6-coder', 'axion-4.7', 'axion-4.6'],
  },
  'reasoning': {
    primary: 'axion-4.7',
    fallbacks: ['axion-4.6'],
  },
};

export const MODE_MODEL_MAP: Record<string, { models: string[]; defaultModel: string }> = {
  chat: {
    models: ['axion-4.7', 'axion-4.6'],
    defaultModel: 'axion-4.6',
  },
  code: {
    models: ['axion-4.7-coder', 'axion-4.6-coder'],
    defaultModel: 'axion-4.7-coder',
  },
  research: {
    models: ['axion-4.7', 'axion-4.6'],
    defaultModel: 'axion-4.7',
  },
};
