import { MODELS, FALLBACK_CHAINS, MODE_MODEL_MAP } from '@/config/models.config';
import { AxionModel, TaskType } from '@/types/models';
import { Mode } from '@/types/chat';

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

export async function selectModel(message: string, mode: Mode, preferredModel?: string): Promise<{ model: AxionModel; chain: string[] }> {
  if (preferredModel && MODELS[preferredModel]) {
    return { model: MODELS[preferredModel], chain: [preferredModel] };
  }

  const taskType = classifyTask(message, mode);
  const chain = FALLBACK_CHAINS[taskType];
  const model = MODELS[chain.primary];
  return { model: model || MODELS['axion-4.6'], chain: [chain.primary, ...chain.fallbacks] };
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
