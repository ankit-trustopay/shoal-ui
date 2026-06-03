import type { SwarmEvidenceRecord } from './api';
import type { DebateAgentResult } from './debateResult';
import { parseSwarmOverview } from './swarmOverview';

export type AgentStance = 'agrees' | 'disagrees' | 'neutral';

export type FrictionAgent = {
  name: string;
  stance: AgentStance;
  summary: string;
};

export type EvidenceCitation = {
  title: string;
  url: string;
  source: string;
};

export type ReportMeta = {
  runtimeSec: number;
  agentsDeployed: number;
  creditsConsumed: number;
};

export type ExecutiveDecisionReport = {
  sessionCode: string;
  premise: string;
  createdAt: string | null;
  verdictHeadline: string;
  verdictNarrative: string;
  confidence: number;
  tldr: string[];
  frictionAgents: FrictionAgent[];
  failureModes: string[];
  criticalUnknowns: string[];
  evidence: EvidenceCitation[];
  immediateAction: string;
  planB: string;
  meta: ReportMeta;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const t = value.trim();
  return t.length > 0 ? t : null;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
}

const HEADLINE_PATTERNS: RegExp[] = [
  /\b(DO NOT LAUNCH)\b/i,
  /\b(DON'T LAUNCH)\b/i,
  /\b(PROCEED WITH CAUTION)\b/i,
  /\b(NO[- ]GO)\b/i,
  /\b(GO\/NO-GO)\b/i,
  /\b(BUY)\b/i,
  /\b(HOLD)\b/i,
  /\b(SELL)\b/i,
  /\b(LAUNCH)\b/i,
  /\b(INVEST)\b/i,
  /\b(AVOID)\b/i,
  /\b(PROCEED)\b/i,
];

export function extractVerdictHeadline(verdict: string): string {
  const trimmed = verdict.trim();
  if (!trimmed) return 'PENDING VERDICT';

  for (const pattern of HEADLINE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return match[1].replace(/DON'T/i, 'DO NOT').toUpperCase();
    }
  }

  const firstLine = trimmed.split(/\n/)[0]?.trim() ?? '';
  const firstSentence = firstLine.split(/(?<=[.!?])\s+/)[0]?.trim() ?? firstLine;
  if (firstSentence.length > 0 && firstSentence.length <= 48) {
    return firstSentence.replace(/\.$/, '').toUpperCase();
  }

  return 'EXECUTIVE VERDICT';
}

function inferStance(text: string, index: number, agentName: string): AgentStance {
  const lower = `${text} ${agentName}`.toLowerCase();

  if (
    /\b(against|oppose|skeptic|risk|concern|unlikely|fail|reject|do not|warning|caution|weak)\b/.test(
      lower,
    )
  ) {
    return 'disagrees';
  }
  if (
    /\b(support|favor|agree|recommend|should|proceed|positive|strong|bullish|viable)\b/.test(
      lower,
    )
  ) {
    return 'agrees';
  }

  const role = agentName.toLowerCase();
  if (role.includes('skeptic') || role.includes('debater')) return 'disagrees';
  if (role.includes('research') || role.includes('analyst')) return 'agrees';
  if (index === 1) return 'disagrees';
  if (index === 0) return 'agrees';
  return 'neutral';
}

function buildTldr(
  verdict: string,
  agents: DebateAgentResult[],
  explicit?: string[],
): string[] {
  if (explicit && explicit.length >= 3) {
    return explicit.slice(0, 3);
  }

  const fromVerdict = verdict
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  if (fromVerdict.length >= 3) {
    return fromVerdict.slice(0, 3);
  }

  const agentBullets = agents
    .map((a) => `${a.name}: ${a.position}`)
    .filter((s) => s.length > 15);

  const merged = [...fromVerdict, ...agentBullets];
  while (merged.length < 3) {
    merged.push(
      'Swarm synthesis weighted market evidence against downside scenarios.',
    );
  }
  return merged.slice(0, 3);
}

function buildFrictionAgents(agents: DebateAgentResult[]): FrictionAgent[] {
  const defaults: FrictionAgent[] = [
    {
      name: 'Market Analyst',
      stance: 'agrees',
      summary:
        'Market tailwinds and demand signals support moving forward with disciplined execution.',
    },
    {
      name: 'Skeptical Debater',
      stance: 'disagrees',
      summary:
        'Unit economics and competitive intensity may erode returns within 12 months.',
    },
    {
      name: 'CEO Synthesizer',
      stance: 'neutral',
      summary:
        'Proceed only if near-term KPIs are gated and downside triggers are pre-defined.',
    },
  ];

  if (agents.length === 0) return defaults;

  return agents.slice(0, 5).map((agent, index) => ({
    name: agent.name,
    stance: inferStance(agent.position, index, agent.name),
    summary:
      agent.position.length > 180
        ? `${agent.position.slice(0, 177)}…`
        : agent.position,
  }));
}

function buildFailureModes(
  resultData: unknown,
  verdict: string,
  minorityDissent: string | null,
): string[] {
  const fromData = isRecord(resultData)
    ? readStringArray(
        resultData.failureModes ??
          resultData.topFailureModes ??
          resultData.preMortem?.failureModes,
      )
    : [];

  if (fromData.length > 0) return fromData.slice(0, 5);

  if (minorityDissent) {
    const parts = minorityDissent
      .split(/(?<=[.!?])\s+|\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 12);
    if (parts.length > 0) return parts.slice(0, 4);
  }

  if (verdict.length > 40) {
    return [
      'Demand assumptions prove optimistic within two quarters of launch.',
      'Customer acquisition costs exceed modeled payback under competitive pressure.',
      'Regulatory or supply-chain friction delays go-to-market timeline.',
      'Key partnership or channel dependency fails to materialize on schedule.',
    ].slice(0, 4);
  }

  return [
    'Market adoption stalls below the minimum viable threshold.',
    'Cost structure expands faster than revenue in the first year.',
    'A well-funded competitor undercuts pricing before scale is reached.',
  ];
}

function buildCriticalUnknowns(resultData: unknown): string[] {
  const fromData = isRecord(resultData)
    ? readStringArray(
        resultData.criticalUnknowns ??
          resultData.unknowns ??
          resultData.preMortem?.criticalUnknowns,
      )
    : [];

  if (fromData.length > 0) return fromData.slice(0, 5);

  return [
    'Verified willingness-to-pay across the target segment at scale.',
    'True customer acquisition cost under current channel mix.',
    'Regulatory or compliance exposure in priority geographies.',
    'Speed and cost of the critical path hire or vendor dependency.',
  ];
}

function buildEvidence(evidence: SwarmEvidenceRecord[] | undefined): EvidenceCitation[] {
  if (!evidence?.length) return [];

  return evidence
    .filter((item) => item.url?.trim() && item.url.startsWith('http'))
    .slice(0, 12)
    .map((item) => ({
      title: item.title?.trim() || item.url,
      url: item.url.trim(),
      source: item.source?.trim() || 'Web',
    }));
}

function buildExecution(
  resultData: unknown,
  overviewActions: { title: string; body: string }[],
): { immediate: string; planB: string } {
  const immediate =
    readString(
      isRecord(resultData)
        ? resultData.immediateAction ?? resultData.immediate_action
        : null,
    ) ??
    overviewActions[0]?.body ??
    'Cross-check the strongest claims in this verdict against the cited sources above.';

  const planB =
    readString(
      isRecord(resultData) ? resultData.planB ?? resultData.plan_b : null,
    ) ??
    overviewActions[1]?.body ??
    'If the primary recommendation fails a sanity check, restate the question with tighter constraints and re-run.';

  return { immediate, planB };
}

export type StoredFrictionEntry = {
  name: string;
  stance: 'AGREES' | 'DISAGREES' | 'NEUTRAL';
  argument: string;
};

export type StoredPreMortem = {
  failureModes: string[];
  criticalUnknowns: string[];
};

export type StoredExecutionRoadmap = {
  immediateAction: string;
  planB: string;
};

export type BuildExecutiveReportInput = {
  sessionCode: string;
  premise: string;
  createdAt: string | null;
  verdict: string;
  confidence: number;
  agents: DebateAgentResult[];
  resultData: unknown;
  tldr?: unknown;
  frictionMatrix?: unknown;
  preMortem?: unknown;
  executionRoadmap?: unknown;
  evidence?: SwarmEvidenceRecord[];
  runtimeSec?: number | null;
  agentCount?: number | null;
  cost?: number | null;
};

export function resolveCreditsConsumed(
  cost: number | null | undefined,
  resultData: unknown,
): number {
  if (typeof cost === 'number' && Number.isFinite(cost) && cost >= 0) {
    return Math.floor(cost);
  }

  const rd = isRecord(resultData) ? resultData : null;
  if (!rd) return 0;

  const planned =
    typeof rd.plannedCost === 'number' && Number.isFinite(rd.plannedCost)
      ? Math.floor(rd.plannedCost)
      : null;
  if (planned !== null && planned >= 0) return planned;

  const charged =
    typeof rd.creditsCharged === 'number' && Number.isFinite(rd.creditsCharged)
      ? Math.floor(rd.creditsCharged)
      : null;
  if (charged !== null && charged >= 0) return charged;

  return 0;
}

function normalizeDbStance(value: unknown): AgentStance {
  if (typeof value !== 'string') return 'neutral';
  const upper = value.trim().toUpperCase();
  if (upper === 'AGREES') return 'agrees';
  if (upper === 'DISAGREES') return 'disagrees';
  return 'neutral';
}

function parseStoredTldr(
  columnValue: unknown,
  resultData: unknown,
): string[] | null {
  const fromColumn = readStringArray(columnValue);
  if (fromColumn.length >= 3) return fromColumn.slice(0, 5);

  const rd = isRecord(resultData) ? resultData : null;
  if (!rd) return null;
  const nested = readStringArray(rd.tldr ?? rd.tldrBullets ?? rd.executiveSummary);
  return nested.length >= 3 ? nested.slice(0, 5) : null;
}

function parseStoredFriction(
  columnValue: unknown,
  resultData: unknown,
): FrictionAgent[] | null {
  const raw = Array.isArray(columnValue)
    ? columnValue
    : isRecord(resultData)
      ? (resultData.frictionMatrix ?? resultData.friction_matrix)
      : null;

  if (!Array.isArray(raw) || raw.length === 0) return null;

  const agents: FrictionAgent[] = [];
  for (const item of raw) {
    if (!isRecord(item)) continue;
    const name = readString(item.name);
    const summary =
      readString(item.argument) ??
      readString(item.summary) ??
      readString(item.position);
    if (!name || !summary) continue;
    agents.push({
      name,
      stance: normalizeDbStance(item.stance),
      summary: summary.length > 500 ? `${summary.slice(0, 497)}…` : summary,
    });
  }
  return agents.length > 0 ? agents : null;
}

function parseStoredPreMortem(
  columnValue: unknown,
  resultData: unknown,
): StoredPreMortem | null {
  const raw = isRecord(columnValue)
    ? columnValue
    : isRecord(resultData)
      ? (resultData.preMortem ?? resultData.pre_mortem)
      : null;

  if (!isRecord(raw)) return null;

  const failureModes = readStringArray(
    raw.failureModes ?? raw.failure_modes ?? raw.topFailureModes,
  );
  const criticalUnknowns = readStringArray(
    raw.criticalUnknowns ?? raw.critical_unknowns ?? raw.unknowns,
  );

  if (failureModes.length === 0 || criticalUnknowns.length === 0) return null;
  return { failureModes, criticalUnknowns };
}

function parseStoredRoadmap(
  columnValue: unknown,
  resultData: unknown,
): StoredExecutionRoadmap | null {
  const raw = isRecord(columnValue)
    ? columnValue
    : isRecord(resultData)
      ? (resultData.executionRoadmap ?? resultData.execution_roadmap)
      : null;

  if (!isRecord(raw)) return null;

  const immediateAction =
    readString(raw.immediateAction) ?? readString(raw.immediate_action);
  const planB = readString(raw.planB) ?? readString(raw.plan_b);

  if (!immediateAction || !planB) return null;
  return { immediateAction, planB };
}

export function buildExecutiveDecisionReport(
  input: BuildExecutiveReportInput,
): ExecutiveDecisionReport {
  const verdict = input.verdict.trim();
  const overview = parseSwarmOverview(input.resultData);

  const storedTldr = parseStoredTldr(input.tldr, input.resultData);
  const storedFriction = parseStoredFriction(
    input.frictionMatrix,
    input.resultData,
  );
  const storedPreMortem = parseStoredPreMortem(input.preMortem, input.resultData);
  const storedRoadmap = parseStoredRoadmap(
    input.executionRoadmap,
    input.resultData,
  );

  const frictionAgents =
    storedFriction ?? buildFrictionAgents(input.agents);

  const { immediate, planB } = storedRoadmap
    ? {
        immediate: storedRoadmap.immediateAction,
        planB: storedRoadmap.planB,
      }
    : buildExecution(input.resultData, overview.recommendedActions);

  return {
    sessionCode: input.sessionCode,
    premise: input.premise,
    createdAt: input.createdAt,
    verdictHeadline: extractVerdictHeadline(verdict),
    verdictNarrative: verdict,
    confidence: Math.max(0, Math.min(100, Math.round(input.confidence))),
    tldr: storedTldr ?? buildTldr(verdict, input.agents, []),
    frictionAgents,
    failureModes: storedPreMortem
      ? storedPreMortem.failureModes
      : buildFailureModes(input.resultData, verdict, overview.minorityDissent),
    criticalUnknowns: storedPreMortem
      ? storedPreMortem.criticalUnknowns
      : buildCriticalUnknowns(input.resultData),
    evidence: buildEvidence(input.evidence),
    immediateAction: immediate,
    planB: planB,
    meta: {
      runtimeSec: Math.max(0, Math.round(input.runtimeSec ?? 0)),
      agentsDeployed: Math.max(
        input.agentCount ?? 0,
        input.agents.length || 3,
      ),
      creditsConsumed: resolveCreditsConsumed(input.cost, input.resultData),
    },
  };
}

export const STANCE_LABEL: Record<AgentStance, string> = {
  agrees: 'AGREES',
  disagrees: 'DISAGREES',
  neutral: 'NEUTRAL',
};
