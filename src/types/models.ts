export type ModelProvider = 'groq';

export type ModelCategory = 'basic' | 'main';

export type TaskType = 'fast' | 'general' | 'general-premium' | 'coding' | 'reasoning';

export interface AxionModel {
  id: string;
  name: string;
  provider: ModelProvider;
  apiKeyEnv: string;
  underlying: string;
  category: ModelCategory;
  description: string;
  maxTokens?: number;
  supportsStreaming: boolean;
  supportsReasoning: boolean;
  supportsVision: boolean;
  rateLimited: boolean;
}

export interface FallbackChain {
  primary: string;
  fallbacks: string[];
}

export interface RouterResult {
  model: AxionModel;
  chain: string[];
}

export interface QuotaEntry {
  modelId: string;
  usageCount: number;
  dailyLimit: number;
  resetAt: Date;
}
