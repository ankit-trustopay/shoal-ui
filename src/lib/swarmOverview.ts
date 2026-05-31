export interface RecommendedAction {
  step: number;
  title: string;
  body: string;
}

export interface SwarmOverviewData {
  recommendedActions: RecommendedAction[];
  minorityDissent: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseRecommendedActions(value: unknown): RecommendedAction[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      if (!isRecord(item)) return null;

      const title = readString(item.title);
      const body =
        readString(item.body) ??
        readString(item.description) ??
        readString(item.text);

      if (!title || !body) return null;

      const step =
        typeof item.step === 'number' && Number.isFinite(item.step)
          ? Math.trunc(item.step)
          : index + 1;

      return { step, title, body };
    })
    .filter((item): item is RecommendedAction => item !== null);
}

function parseMinorityDissent(value: unknown): string | null {
  const direct = readString(value);
  if (direct) return direct;

  if (!Array.isArray(value)) return null;

  const parts = value
    .map((item) => {
      if (typeof item === 'string') return readString(item);
      if (!isRecord(item)) return null;
      return (
        readString(item.text) ??
        readString(item.body) ??
        readString(item.summary)
      );
    })
    .filter((part): part is string => part !== null);

  return parts.length > 0 ? parts.join('\n\n') : null;
}

/** Read overview fields from swarm.resultData when the engine provides them. */
export function parseSwarmOverview(resultData: unknown): SwarmOverviewData {
  if (!isRecord(resultData)) {
    return { recommendedActions: [], minorityDissent: null };
  }

  const nested = isRecord(resultData.reportData)
    ? resultData.reportData
    : null;

  const actionsSource =
    resultData.recommendedActions ??
    resultData.recommended_actions ??
    nested?.recommendedActions ??
    nested?.recommended_actions;

  const dissentSource =
    resultData.minorityDissent ??
    resultData.minority_dissent ??
    nested?.minorityDissent ??
    nested?.minority_dissent;

  return {
    recommendedActions: parseRecommendedActions(actionsSource),
    minorityDissent: parseMinorityDissent(dissentSource),
  };
}
