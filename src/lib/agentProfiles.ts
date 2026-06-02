/** Cognitive stat scale for IQ / EQ progress bars (0–160). */
export const COGNITIVE_STAT_MAX = 160;

export type RiskTolerance = 'Low' | 'Medium' | 'High';

export interface AgentProfile {
  id: number;
  name: string;
  role: string;
  age: number;
  location: string;
  income: string;
  maritalStatus?: string;
  culturalBackground?: string;
  iq: number;
  eq: number;
  riskTolerance: RiskTolerance;
  biases: string;
  backstory: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

function readNumber(record: Record<string, unknown>, ...keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
}

function clampStat(value: number | undefined, fallback: number): number {
  const n = value ?? fallback;
  return Math.max(0, Math.min(COGNITIVE_STAT_MAX, Math.round(n)));
}

export function parseRiskTolerance(value: unknown): RiskTolerance {
  if (typeof value !== 'string') return 'Medium';
  const normalized = value.trim().toLowerCase();
  if (normalized === 'low') return 'Low';
  if (normalized === 'high') return 'High';
  if (normalized === 'medium') return 'Medium';
  return 'Medium';
}

export function riskTolerancePercent(level: RiskTolerance): number {
  switch (level) {
    case 'Low':
      return 28;
    case 'Medium':
      return 58;
    case 'High':
      return 88;
    default:
      return 50;
  }
}

export function statBarPercent(value: number, max: number = COGNITIVE_STAT_MAX): number {
  if (max <= 0) return 0;
  return Math.min(100, Math.round((value / max) * 100));
}

function normalizeProfile(raw: unknown, index: number): AgentProfile | null {
  if (!isRecord(raw)) return null;

  const name = readString(raw, 'name', 'Name');
  const role =
    readString(raw, 'role', 'Role') ||
    readString(raw, 'position', 'Position') ||
    name;
  if (!name) return null;

  const id = readNumber(raw, 'id', 'Id') ?? index + 1;
  const age = readNumber(raw, 'age', 'Age') ?? 30;

    const maritalStatus =
      readString(raw, 'maritalStatus', 'marital_status', 'MaritalStatus') ||
      undefined;
    const culturalBackground =
      readString(
        raw,
        'culturalBackground',
        'cultural_background',
        'CulturalBackground',
      ) || undefined;

    return {
      id: Math.trunc(id),
      name,
      role,
      age: Math.max(18, Math.min(80, Math.trunc(age))),
      location: readString(raw, 'location', 'Location') || 'Unknown',
      income: readString(raw, 'income', 'Income') || '—',
      maritalStatus,
      culturalBackground,
      iq: clampStat(readNumber(raw, 'iq', 'IQ'), 110),
    eq: clampStat(readNumber(raw, 'eq', 'EQ'), 115),
    riskTolerance: parseRiskTolerance(raw.riskTolerance ?? raw.RiskTolerance),
    biases: readString(raw, 'biases', 'Biases') || 'No bias data recorded.',
    backstory:
      readString(raw, 'backstory', 'Backstory') ||
      readString(raw, 'position', 'Position') ||
      'No backstory available for this agent.',
  };
}

/**
 * Safely parse `swarm.agentProfiles` from the API (JSON array or null).
 */
export function parseAgentProfiles(raw: unknown): AgentProfile[] {
  if (raw == null) return [];
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item, index) => normalizeProfile(item, index))
    .filter((profile): profile is AgentProfile => profile !== null);
}
