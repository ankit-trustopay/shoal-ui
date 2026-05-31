export const SWARM_MODELS = [
  { id: 'gpt-4o', label: 'GPT-4o (Default)' },
  { id: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
  { id: 'deepseek-v3', label: 'DeepSeek V3' },
] as const;

export type SwarmModelId = (typeof SWARM_MODELS)[number]['id'];

export const DEFAULT_SWARM_MODEL: SwarmModelId = 'gpt-4o';

export function isSwarmModelId(value: string): value is SwarmModelId {
  return SWARM_MODELS.some((model) => model.id === value);
}
