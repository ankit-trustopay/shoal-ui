export interface DebateTranscriptEntry {
  agentName: string;
  role: string;
  text: string;
  timestamp: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeEntry(item: unknown): DebateTranscriptEntry | null {
  if (!isRecord(item)) return null;
  const agentName = readString(item.agentName);
  const role = readString(item.role);
  const text = readString(item.text);
  const timestamp = readString(item.timestamp);
  if (!agentName || !role || !text || !timestamp) return null;
  return { agentName, role, text, timestamp };
}

export function parseDebateTranscript(resultData: unknown): DebateTranscriptEntry[] {
  if (!isRecord(resultData)) return [];

  const raw = resultData.debateTranscript;
  if (!Array.isArray(raw)) return [];

  return raw
    .map(normalizeEntry)
    .filter((entry): entry is DebateTranscriptEntry => entry !== null);
}

/** Resolve transcript from resultData or a top-level swarm.debateTranscript field. */
export function resolveDebateTranscript(
  resultData: unknown,
  swarmDebateTranscript?: unknown,
): DebateTranscriptEntry[] {
  const fromResult = parseDebateTranscript(resultData);
  if (fromResult.length > 0) return fromResult;

  if (!Array.isArray(swarmDebateTranscript)) return [];
  return swarmDebateTranscript
    .map(normalizeEntry)
    .filter((entry): entry is DebateTranscriptEntry => entry !== null);
}

export function getAgentInitials(agentName: string): string {
  const parts = agentName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return agentName.slice(0, 2).toUpperCase();
}

const AVATAR_PALETTE = [
  'bg-slate-800 text-white ring-slate-200',
  'bg-orange-600 text-white ring-orange-200',
  'bg-sky-700 text-white ring-sky-200',
  'bg-violet-700 text-white ring-violet-200',
  'bg-teal-700 text-white ring-teal-200',
  'bg-rose-700 text-white ring-rose-200',
  'bg-amber-800 text-white ring-amber-200',
  'bg-indigo-700 text-white ring-indigo-200',
] as const;

export function getAgentAvatarClasses(agentName: string): string {
  let hash = 0;
  for (let i = 0; i < agentName.length; i += 1) {
    hash = (hash + agentName.charCodeAt(i) * (i + 1)) % 2147483647;
  }
  const index = hash % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}
