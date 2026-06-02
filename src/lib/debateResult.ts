export const AI_MODEL_ERROR_VERDICT =
  'Error: The AI model failed to generate a response.';

export type DebateAgentResult = {
  name: string;
  position: string;
};

export type DebateResultPayload = {
  verdict: string;
  confidence: number;
  agents: DebateAgentResult[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseAgents(raw: unknown): DebateAgentResult[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item, index) => {
      if (!isRecord(item)) return null;
      const name =
        typeof item.name === 'string' && item.name.trim()
          ? item.name.trim()
          : `Agent ${index + 1}`;
      const position =
        typeof item.position === 'string' && item.position.trim()
          ? item.position.trim()
          : typeof item.stance === 'string' && item.stance.trim()
            ? item.stance.trim()
            : typeof item.role === 'string' && item.role.trim()
              ? item.role.trim()
              : '';
      if (!position) return null;
      return { name, position };
    })
    .filter((agent): agent is DebateAgentResult => agent !== null);
}

/**
 * Read canonical debate result from swarm.resultData or legacy message fields.
 */
export function parseDebateResult(
  resultData: unknown,
  fallbackVerdict?: string | null,
): DebateResultPayload | null {
  if (!isRecord(resultData)) {
    if (fallbackVerdict?.trim()) {
      return {
        verdict: fallbackVerdict.trim(),
        confidence: 0,
        agents: [],
      };
    }
    return null;
  }

  const verdict =
    (typeof resultData.verdict === 'string' && resultData.verdict.trim()) ||
    (typeof resultData.consensus === 'string' && resultData.consensus.trim()) ||
    (typeof resultData.response === 'string' && resultData.response.trim()) ||
    fallbackVerdict?.trim() ||
    '';

  const confidenceRaw = resultData.confidence;
  const confidence =
    typeof confidenceRaw === 'number' && Number.isFinite(confidenceRaw)
      ? Math.max(0, Math.min(100, Math.round(confidenceRaw)))
      : 0;

  const agents = parseAgents(resultData.agents);

  if (!verdict && agents.length === 0) {
    return null;
  }

  return {
    verdict,
    confidence,
    agents,
  };
}

export function isAiModelErrorVerdict(
  verdict: string | null | undefined,
): boolean {
  if (!verdict?.trim()) return false;
  const trimmed = verdict.trim();
  return (
    trimmed === AI_MODEL_ERROR_VERDICT ||
    trimmed.startsWith('Error: The AI model failed to generate a response')
  );
}

export function hasMeaningfulVerdict(verdict: string | null | undefined): boolean {
  if (!verdict?.trim()) return false;
  if (isAiModelErrorVerdict(verdict)) return false;

  const lower = verdict.toLowerCase();
  return !(
    lower.includes('could not produce a verdict') ||
    lower.includes('critical error during deliberation') ||
    lower.includes('no verdict produced')
  );
}
