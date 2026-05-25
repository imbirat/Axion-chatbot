import { MODELS, FALLBACK_CHAINS, MODE_MODEL_MAP } from '@/config/models.config';
import { AxionModel, TaskType } from '@/types/models';
import { Mode } from '@/types/chat';

const quotaCache = new Map<string, { usage: number; limit: number; resetAt: Date }>();

function classifyTask(message: string, mode: Mode): TaskType {
  if (mode === 'code') return 'coding';
  if (mode === 'research') return 'reasoning';

  const lower = message.toLowerCase();
  const isComplex = lower.length > 200;
  const isCodeRelated = /code|function|class|api|endpoint|debug|error|syntax|typescript|javascript|python|react|next\.?js/i.test(lower);

  if (isCodeRelated) return 'coding';
  if (isComplex) return 'general';
  return 'fast';
}

async function checkQuota(modelId: string): Promise<boolean> {
  const model = MODELS[modelId];
  if (!model?.rateLimited) return true;

  const entry = quotaCache.get(modelId);
  if (!entry) return true;

  if (new Date() > entry.resetAt) {
    quotaCache.delete(modelId);
    return true;
  }

  return entry.usage < entry.limit;
}

function getQuotaLimit(modelId: string): number {
  const premium = ['axion-4.8', 'axion-4.8-coder', 'axion-4.7-thinker'];
  if (premium.includes(modelId)) return 500;
  return 1000;
}

function incrementQuota(modelId: string) {
  const entry = quotaCache.get(modelId);
  if (entry) {
    entry.usage++;
  } else {
    const limit = getQuotaLimit(modelId);
    const resetAt = new Date(Date.now() + 5 * 60 * 60 * 1000);
    quotaCache.set(modelId, { usage: 1, limit, resetAt });
  }
}

export async function selectModel(message: string, mode: Mode, preferredModel?: string): Promise<{ model: AxionModel; chain: string[] }> {
  if (preferredModel && MODELS[preferredModel]) {
    const hasQuota = await checkQuota(preferredModel);
    if (hasQuota) {
      incrementQuota(preferredModel);
      return { model: MODELS[preferredModel], chain: [preferredModel] };
    }
  }

  const taskType = classifyTask(message, mode);
  const chain = FALLBACK_CHAINS[taskType];

  for (const modelId of [chain.primary, ...chain.fallbacks]) {
    const model = MODELS[modelId];
    if (!model) continue;
    const hasQuota = await checkQuota(modelId);
    if (hasQuota) {
      incrementQuota(modelId);
      return { model, chain: [chain.primary, ...chain.fallbacks] };
    }
  }

  return { model: MODELS['axion-4.6'], chain: ['axion-4.6'] };
}

export function getModelsForMode(mode: Mode): AxionModel[] {
  const config = MODE_MODEL_MAP[mode];
  if (!config) return Object.values(MODELS);
  return config.models.map(id => MODELS[id]).filter(Boolean);
}

export function getDefaultModel(mode: Mode): AxionModel {
  const config = MODE_MODEL_MAP[mode];
  if (!config) return MODELS['axion-4.6'];
  return MODELS[config.defaultModel] || MODELS['axion-4.6'];
}

export function getQuotaStatus(modelId: string): { usage: number; limit: number; remaining: number } | null {
  const entry = quotaCache.get(modelId);
  if (!entry) return null;
  return {
    usage: entry.usage,
    limit: entry.limit,
    remaining: entry.limit - entry.usage,
  };
}
