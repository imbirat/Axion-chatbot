import { AxionModel, FallbackChain, TaskType } from '@/types/models';

export const MODELS: Record<string, AxionModel> = {
  'axion-4.6': {
    id: 'axion-4.6',
    name: 'Axion 4.6',
    provider: 'groq',
    apiKeyEnv: 'GROQ_API_KEY',
    underlying: 'gemma2-9b-it',
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
    underlying: 'llama-3.3-70b-versatile',
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
    underlying: 'qwen3-32b',
    category: 'main',
    description: 'Advanced coding model',
    supportsStreaming: true,
    supportsReasoning: false,
    rateLimited: false,
  },
  'axion-4.7-thinker': {
    id: 'axion-4.7-thinker',
    name: 'Axion 4.7 Thinker',
    provider: 'nvidia',
    apiKeyEnv: 'NVIDIA_API_KEY',
    underlying: 'nvidia/glm-5-1',
    category: 'thinking',
    description: 'Deep reasoning + architecture',
    supportsStreaming: true,
    supportsReasoning: true,
    rateLimited: true,
  },
  'axion-4.8-coder': {
    id: 'axion-4.8-coder',
    name: 'Axion 4.8 Coder',
    provider: 'nvidia',
    apiKeyEnv: 'NVIDIA_API_KEY',
    underlying: 'nvidia/kimi-k2-6',
    category: 'premium',
    description: 'Best-in-class coding + long context',
    supportsStreaming: true,
    supportsReasoning: false,
    rateLimited: true,
  },
  'axion-4.8': {
    id: 'axion-4.8',
    name: 'Axion 4.8',
    provider: 'nvidia',
    apiKeyEnv: 'NVIDIA_API_KEY',
    underlying: 'nvidia/deepseek-v4-fast',
    category: 'premium',
    description: 'Ultra-fast flagship reasoning',
    supportsStreaming: true,
    supportsReasoning: true,
    rateLimited: true,
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
    primary: 'axion-4.8',
    fallbacks: ['axion-4.7', 'axion-4.6'],
  },
  'coding': {
    primary: 'axion-4.8-coder',
    fallbacks: ['axion-4.7-coder', 'axion-4.6-coder', 'axion-4.7'],
  },
  'reasoning': {
    primary: 'axion-4.7-thinker',
    fallbacks: ['axion-4.8', 'axion-4.7', 'axion-4.6'],
  },
};

export const MODE_MODEL_MAP: Record<string, { models: string[]; defaultModel: string }> = {
  chat: {
    models: ['axion-4.6', 'axion-4.7', 'axion-4.8'],
    defaultModel: 'axion-4.6',
  },
  code: {
    models: ['axion-4.8-coder', 'axion-4.7-coder', 'axion-4.6-coder', 'axion-4.7-thinker'],
    defaultModel: 'axion-4.8-coder',
  },
  research: {
    models: ['axion-4.8', 'axion-4.7-thinker', 'axion-4.7', 'axion-4.6'],
    defaultModel: 'axion-4.8',
  },
};
