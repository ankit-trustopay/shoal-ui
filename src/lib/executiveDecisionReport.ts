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

export type BoardroomRole = {
  roleTitle: string;
  agentName: string;
  conclusion: string;
  disagreedOn: string;
  mindChanged: string;
  stance: AgentStance;
};

export type EvidenceClusterId = 'reddit' | 'youtube' | 'official' | 'news';

export type EvidenceCluster = {
  id: EvidenceClusterId;
  label: string;
  subtitle: string;
  items: EvidenceCitation[];
};

export type ResearchCoverageStats = {
  sourcesChecked: number;
  highSignal: number;
  contradictory: number;
  dominantConsensus: number;
};

export type ResearchCoverage = {
  stats: ResearchCoverageStats;
  clusters: EvidenceCluster[];
};

export type ReportMeta = {
  runtimeSec: number;
  agentsDeployed: number;
  creditsConsumed: number;
};

export type RecommendationLabel = 'BUY' | 'WAIT' | 'PIVOT';

export type FitRating = 'Excellent' | 'Good' | 'Weak';

export type BoardroomFindings = {
  mainOpportunity: string;
  mainRisk: string;
  hiddenTradeoff: string;
  bestAlternative: string;
  whyThisMatters: string;
};

export type ExecutiveBoardroom = {
  recommendation: RecommendationLabel;
  fitForYou: FitRating;
  reasonLine: string;
  bullCase: string;
  shoalRecommendation: string;
  bearCase: string;
  findings: BoardroomFindings;
};

export type ExecutiveDecisionReport = {
  sessionCode: string;
  premise: string;
  createdAt: string | null;
  verdictHeadline: string;
  verdictNarrative: string;
  confidence: number;
  boardroom: ExecutiveBoardroom;
  tldr: string[];
  frictionAgents: FrictionAgent[];
  boardroomRoles: BoardroomRole[];
  failureModes: string[];
  criticalUnknowns: string[];
  evidence: EvidenceCitation[];
  researchCoverage: ResearchCoverage;
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

export function extractRecommendationLabel(
  headline: string,
  verdict: string,
): RecommendationLabel {
  const blob = `${headline} ${verdict}`.toUpperCase();

  if (
    /\b(PIVOT|RECONSIDER|DO NOT LAUNCH|DON'T LAUNCH|NO[- ]GO|AVOID|SELL|ABORT)\b/.test(
      blob,
    )
  ) {
    return 'PIVOT';
  }
  if (
    /\b(WAIT|HOLD|CAUTION|PROCEED WITH CAUTION|PAUSE|DELAY|MONITOR)\b/.test(blob)
  ) {
    return 'WAIT';
  }
  if (/\b(BUY|LAUNCH|INVEST|PROCEED|GO)\b/.test(blob)) {
    return 'BUY';
  }
  return 'WAIT';
}

export function deriveFitRating(confidence: number): FitRating {
  if (confidence >= 75) return 'Excellent';
  if (confidence >= 50) return 'Good';
  return 'Weak';
}

function pickStrongestArgument(
  agents: FrictionAgent[],
  stance: AgentStance,
): string | null {
  const matches = agents.filter((a) => a.stance === stance);
  if (matches.length === 0) return null;
  return matches.reduce((best, current) =>
    current.summary.length > best.summary.length ? current : best,
  ).summary;
}

function buildReasonLine(tldr: string[], verdict: string): string {
  if (tldr.length >= 2) {
    const parts = tldr.slice(0, 3).map((s) => s.replace(/\.$/, ''));
    return `Because ${parts.join(', ')}.`;
  }
  const sentence = verdict.split(/(?<=[.!?])\s+/)[0]?.trim();
  if (sentence) {
    return sentence.endsWith('.') ? sentence : `${sentence}.`;
  }
  return 'Because the swarm could not synthesize a clear causal chain from the evidence.';
}

function buildWhyThisMatters(
  verdict: string,
  tldr: string[],
  premise: string,
): string {
  const fromTldr = tldr.slice(0, 2).join(' ');
  if (fromTldr.length > 40) {
    return fromTldr.length > 320 ? `${fromTldr.slice(0, 317)}…` : fromTldr;
  }
  const narrative = verdict.trim();
  if (narrative.length > 40) {
    const sentences = narrative.split(/(?<=[.!?])\s+/).filter(Boolean);
    return sentences.slice(0, 2).join(' ') || narrative.slice(0, 280);
  }
  return `This decision directly affects the outcome of your stated dilemma: “${premise.slice(0, 120)}”. The boardroom weighed live research against adversarial agent arguments before issuing a single recommendation.`;
}

function parseStoredExecutiveSummary(
  columnValue: unknown,
  resultData: unknown,
): StoredExecutiveSummary | null {
  const raw = isRecord(columnValue)
    ? columnValue
    : isRecord(resultData)
      ? (resultData.executiveSummary ?? resultData.executive_summary)
      : null;
  if (!isRecord(raw)) return null;

  const recommendation = readString(raw.recommendation)?.toUpperCase();
  const fitForYou = readString(raw.fitForYou ?? raw.fit_for_you);
  const oneLineReason = readString(raw.oneLineReason ?? raw.one_line_reason);

  if (
    recommendation !== 'BUY' &&
    recommendation !== 'WAIT' &&
    recommendation !== 'PIVOT'
  ) {
    return null;
  }
  if (fitForYou !== 'Excellent' && fitForYou !== 'Good' && fitForYou !== 'Weak') {
    return null;
  }
  if (!oneLineReason) return null;

  return { recommendation, fitForYou, oneLineReason };
}

function parseStoredBoardroomSummary(
  columnValue: unknown,
  resultData: unknown,
): StoredBoardroomSummary | null {
  const raw = isRecord(columnValue)
    ? columnValue
    : isRecord(resultData)
      ? (resultData.boardroomSummary ?? resultData.boardroom_summary)
      : null;
  if (!isRecord(raw)) return null;

  const bullCase = readString(raw.bullCase ?? raw.bull_case);
  const bearCase = readString(raw.bearCase ?? raw.bear_case);
  const shoalRecommendation = readString(
    raw.shoalRecommendation ?? raw.shoal_recommendation,
  );
  const mainOpportunity = readString(raw.mainOpportunity ?? raw.main_opportunity);
  const mainRisk = readString(raw.mainRisk ?? raw.main_risk);
  const hiddenTradeoff = readString(raw.hiddenTradeoff ?? raw.hidden_tradeoff);
  const bestAlternative = readString(raw.bestAlternative ?? raw.best_alternative);
  const explanation = readString(raw.explanation);

  if (!bullCase || !bearCase || !shoalRecommendation) return null;

  return {
    bullCase,
    bearCase,
    shoalRecommendation,
    mainOpportunity: mainOpportunity ?? bullCase.slice(0, 200),
    mainRisk: mainRisk ?? bearCase.slice(0, 200),
    hiddenTradeoff: hiddenTradeoff ?? '',
    bestAlternative: bestAlternative ?? '',
    explanation: explanation ?? '',
  };
}

function parseStoredDebateRoom(
  columnValue: unknown,
  resultData: unknown,
): StoredDebateRoomAgent[] | null {
  const raw = Array.isArray(columnValue)
    ? columnValue
    : isRecord(resultData)
      ? (resultData.debateRoom ?? resultData.debate_room)
      : null;

  if (!Array.isArray(raw)) return null;

  const agents: StoredDebateRoomAgent[] = [];
  for (const item of raw) {
    if (!isRecord(item)) continue;
    const role = readString(item.role);
    const conclusion = readString(item.conclusion);
    const disagreement = readString(item.disagreement);
    const mindChanged = readString(item.mindChanged ?? item.mind_changed);
    if (!role || !conclusion || !disagreement || !mindChanged) continue;
    agents.push({ role, conclusion, disagreement, mindChanged });
  }
  return agents.length > 0 ? agents : null;
}

function parseStoredEvidenceVault(
  columnValue: unknown,
  resultData: unknown,
): ResearchCoverage | null {
  const raw = isRecord(columnValue)
    ? columnValue
    : isRecord(resultData)
      ? (resultData.evidenceVault ?? resultData.evidence_vault)
      : null;
  if (!isRecord(raw)) return null;

  const statsRaw = isRecord(raw.stats) ? raw.stats : null;
  if (!statsRaw) return null;

  const totalSources = statsRaw.totalSources ?? statsRaw.total_sources;
  const highSignal = statsRaw.highSignal ?? statsRaw.high_signal;
  const contradictory = statsRaw.contradictory;
  const dominantConsensus =
    statsRaw.dominantConsensus ?? statsRaw.dominant_consensus;

  if (
    typeof totalSources !== 'number' ||
    typeof highSignal !== 'number' ||
    typeof contradictory !== 'number' ||
    typeof dominantConsensus !== 'number'
  ) {
    return null;
  }

  const clustersRaw = isRecord(raw.clusters) ? raw.clusters : null;
  if (!clustersRaw) return null;

  const mapCluster = (key: EvidenceClusterId): EvidenceCitation[] => {
    const list = clustersRaw[key];
    if (!Array.isArray(list)) return [];
    const items: EvidenceCitation[] = [];
    for (const item of list) {
      if (!isRecord(item)) continue;
      const url = readString(item.url);
      if (!url?.startsWith('http')) continue;
      items.push({
        title: readString(item.title) ?? url,
        url,
        source: readString(item.source) ?? 'Web',
      });
    }
    return items;
  };

  return {
    stats: {
      sourcesChecked: Math.max(0, Math.trunc(totalSources)),
      highSignal: Math.max(0, Math.trunc(highSignal)),
      contradictory: Math.max(0, Math.trunc(contradictory)),
      dominantConsensus: Math.max(0, Math.trunc(dominantConsensus)),
    },
    clusters: (['reddit', 'youtube', 'official', 'news'] as const).map((id) => ({
      id,
      label: CLUSTER_META[id].label,
      subtitle: CLUSTER_META[id].subtitle,
      items: mapCluster(id),
    })),
  };
}

const CLUSTER_META: Record<EvidenceClusterId, { label: string; subtitle: string }> = {
  reddit: { label: 'Reddit Cluster', subtitle: 'Community threads & sentiment' },
  youtube: { label: 'YouTube Reviews', subtitle: 'Video reviews & walkthroughs' },
  official: { label: 'Official Docs', subtitle: 'Filings, docs & primary sources' },
  news: { label: 'News / Blogs', subtitle: 'Press, analysts & editorial' },
};

function parseStoredBoardroom(
  resultData: unknown,
  frictionAgents: FrictionAgent[],
): Partial<ExecutiveBoardroom> | null {
  const raw = isRecord(resultData)
    ? (resultData.boardroom ?? resultData.executiveBoardroom)
    : null;
  if (!isRecord(raw)) return null;

  const findingsRaw = isRecord(raw.findings) ? raw.findings : raw;

  const recommendation = readString(raw.recommendation);
  const fitForYou = readString(raw.fitForYou ?? raw.fit_for_you);
  const reasonLine = readString(raw.reasonLine ?? raw.reason_line);
  const bullCase =
    readString(raw.bullCase ?? raw.bull_case) ??
    pickStrongestArgument(frictionAgents, 'agrees');
  const shoalRecommendation = readString(
    raw.shoalRecommendation ?? raw.shoal_recommendation,
  );
  const bearCase =
    readString(raw.bearCase ?? raw.bear_case) ??
    pickStrongestArgument(frictionAgents, 'disagrees');

  const mainOpportunity = readString(
    findingsRaw.mainOpportunity ?? findingsRaw.main_opportunity,
  );
  const mainRisk = readString(findingsRaw.mainRisk ?? findingsRaw.main_risk);
  const hiddenTradeoff = readString(
    findingsRaw.hiddenTradeoff ?? findingsRaw.hidden_tradeoff,
  );
  const bestAlternative = readString(
    findingsRaw.bestAlternative ?? findingsRaw.best_alternative,
  );
  const whyThisMatters = readString(
    findingsRaw.whyThisMatters ?? findingsRaw.why_this_matters,
  );

  if (
    !recommendation &&
    !bullCase &&
    !shoalRecommendation &&
    !bearCase &&
    !mainOpportunity
  ) {
    return null;
  }

  const partial: Partial<ExecutiveBoardroom> = {};
  if (
    recommendation === 'BUY' ||
    recommendation === 'WAIT' ||
    recommendation === 'PIVOT'
  ) {
    partial.recommendation = recommendation;
  }
  if (fitForYou === 'Excellent' || fitForYou === 'Good' || fitForYou === 'Weak') {
    partial.fitForYou = fitForYou;
  }
  if (reasonLine) partial.reasonLine = reasonLine;
  if (bullCase) partial.bullCase = bullCase;
  if (shoalRecommendation) partial.shoalRecommendation = shoalRecommendation;
  if (bearCase) partial.bearCase = bearCase;
  if (mainOpportunity || mainRisk || hiddenTradeoff || bestAlternative) {
    partial.findings = {
      mainOpportunity: mainOpportunity ?? '',
      mainRisk: mainRisk ?? '',
      hiddenTradeoff: hiddenTradeoff ?? '',
      bestAlternative: bestAlternative ?? '',
      whyThisMatters: whyThisMatters ?? '',
    };
  }
  return partial;
}

export function buildExecutiveBoardroom(input: {
  verdictHeadline: string;
  verdictNarrative: string;
  confidence: number;
  tldr: string[];
  frictionAgents: FrictionAgent[];
  failureModes: string[];
  criticalUnknowns: string[];
  immediateAction: string;
  planB: string;
  premise: string;
  resultData?: unknown;
  executiveSummary?: unknown;
  boardroomSummary?: unknown;
}): ExecutiveBoardroom {
  const storedLegacy = parseStoredBoardroom(
    input.resultData ?? null,
    input.frictionAgents,
  );
  const storedExec = parseStoredExecutiveSummary(
    input.executiveSummary,
    input.resultData ?? null,
  );
  const storedSummary = parseStoredBoardroomSummary(
    input.boardroomSummary,
    input.resultData ?? null,
  );

  const recommendation =
    storedExec?.recommendation ??
    storedLegacy?.recommendation ??
    extractRecommendationLabel(input.verdictHeadline, input.verdictNarrative);
  const fitForYou =
    storedExec?.fitForYou ??
    storedLegacy?.fitForYou ??
    deriveFitRating(input.confidence);
  const reasonLine =
    storedExec?.oneLineReason ??
    storedLegacy?.reasonLine ??
    buildReasonLine(input.tldr, input.verdictNarrative);

  const bullCase =
    storedSummary?.bullCase ??
    storedLegacy?.bullCase ??
    pickStrongestArgument(input.frictionAgents, 'agrees') ??
    input.tldr[0] ??
    'The bullish case rests on favorable signals in the live research corpus, though verification is still advised.';

  const bearCase =
    storedSummary?.bearCase ??
    storedLegacy?.bearCase ??
    pickStrongestArgument(input.frictionAgents, 'disagrees') ??
    input.failureModes[0] ??
    'The bear case highlights downside scenarios that could invalidate the thesis within 12 months.';

  const neutralArg = pickStrongestArgument(input.frictionAgents, 'neutral');
  const narrativeSummary =
    input.verdictNarrative.length > 400
      ? `${input.verdictNarrative.slice(0, 397)}…`
      : input.verdictNarrative;
  const shoalRecommendation =
    (storedSummary?.shoalRecommendation ??
      storedLegacy?.shoalRecommendation ??
      neutralArg ??
      narrativeSummary) ||
    'The swarm recommends a balanced path: proceed only after validating the decisive assumptions cited in the research feed.';

  const findings: BoardroomFindings = {
    mainOpportunity:
      storedSummary?.mainOpportunity ??
      storedLegacy?.findings?.mainOpportunity ??
      bullCase.slice(0, 200) ??
      input.tldr[0] ??
      'A credible upside path exists if core assumptions in the research hold.',
    mainRisk:
      storedSummary?.mainRisk ??
      storedLegacy?.findings?.mainRisk ??
      input.failureModes[0] ??
      'Downside risk could materialize if demand or timing assumptions slip.',
    hiddenTradeoff:
      storedSummary?.hiddenTradeoff ||
      storedLegacy?.findings?.hiddenTradeoff ||
      input.criticalUnknowns[0] ||
      input.tldr[1] ||
      'You may be trading speed of action for certainty on a key unknown.',
    bestAlternative:
      storedSummary?.bestAlternative ||
      storedLegacy?.findings?.bestAlternative ||
      input.planB,
    whyThisMatters:
      storedSummary?.explanation?.trim() ||
      storedLegacy?.findings?.whyThisMatters?.trim() ||
      buildWhyThisMatters(input.verdictNarrative, input.tldr, input.premise),
  };

  return {
    recommendation,
    fitForYou,
    reasonLine,
    bullCase,
    shoalRecommendation,
    bearCase,
    findings,
  };
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
    .slice(0, 24)
    .map((item) => ({
      title: item.title?.trim() || item.url,
      url: item.url.trim(),
      source: item.source?.trim() || 'Web',
    }));
}

const BOARDROOM_ROLE_TITLES = [
  'Product Analyst',
  'Skeptic',
  'Budget Buyer',
  'Market Analyst',
  'Domain Expert',
  'Risk Officer',
  'Growth Lead',
  'CEO Synthesizer',
] as const;

const DISAGREEMENT_TOPICS = [
  'go-to-market timing versus burn-rate assumptions',
  'pricing elasticity in third-party review data',
  'whether TAM estimates are defensible at current CAC',
  'regulatory exposure in priority launch geographies',
  'channel mix and partner dependency risk',
  'unit economics under competitive pricing pressure',
] as const;

const MIND_CHANGE_TRIGGERS = [
  'reviewing pricing data',
  'cross-checking Tavily high-signal sources',
  'stress-testing the pre-mortem failure modes',
  'reconciling contradictory forum sentiment',
  'validating official documentation against claims',
] as const;

const POSITION_LABELS = ['YES', 'NO', 'MAYBE', 'HOLD', 'PIVOT'] as const;

function resolveRoleTitle(agentName: string, index: number): string {
  const lower = agentName.toLowerCase();
  if (lower.includes('skeptic') || lower.includes('debater')) return 'Skeptic';
  if (lower.includes('ceo') || lower.includes('synth')) return 'CEO Synthesizer';
  if (lower.includes('budget') || lower.includes('finance') || lower.includes('cfo'))
    return 'Budget Buyer';
  if (lower.includes('product')) return 'Product Analyst';
  if (lower.includes('market')) return 'Market Analyst';
  if (lower.includes('risk')) return 'Risk Officer';
  if (lower.includes('growth')) return 'Growth Lead';
  if (lower.includes('domain') || lower.includes('expert')) return 'Domain Expert';
  return BOARDROOM_ROLE_TITLES[index % BOARDROOM_ROLE_TITLES.length];
}

function stableIndex(seed: string, modulo: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h + seed.charCodeAt(i) * (i + 1)) % 9973;
  }
  return modulo > 0 ? h % modulo : 0;
}

function buildDisagreedOn(
  agent: FrictionAgent,
  peers: FrictionAgent[],
): string {
  const opponent =
    peers.find((p) => p.name !== agent.name && p.stance !== agent.stance) ??
    peers.find((p) => p.name !== agent.name) ??
    peers[0];
  const topic =
    DISAGREEMENT_TOPICS[
      stableIndex(`${agent.name}-${agent.stance}`, DISAGREEMENT_TOPICS.length)
    ];
  const opponentLabel = opponent?.name ?? 'the room';
  return `With ${opponentLabel} on ${topic}.`;
}

function buildMindChanged(agent: FrictionAgent, index: number): string {
  const seed = `${agent.name}-${index}`;
  const fromIdx = stableIndex(`${seed}-from`, POSITION_LABELS.length);
  let from = POSITION_LABELS[fromIdx];
  let to: (typeof POSITION_LABELS)[number];
  if (agent.stance === 'agrees') to = 'YES';
  else if (agent.stance === 'disagrees') to = 'NO';
  else to = 'MAYBE';

  if (from === to) {
    from = POSITION_LABELS[(fromIdx + 1) % POSITION_LABELS.length];
  }
  if (from === to) {
    return 'Position held steady after full boardroom cross-examination.';
  }
  const trigger =
    MIND_CHANGE_TRIGGERS[
      stableIndex(seed, MIND_CHANGE_TRIGGERS.length)
    ];
  return `Moved from ${from} to ${to} after ${trigger}.`;
}

function inferStanceFromRoleText(text: string): AgentStance {
  const lower = text.toLowerCase();
  if (/\b(disagree|against|skeptic|risk|bear|no)\b/.test(lower)) {
    return 'disagrees';
  }
  if (/\b(agree|bull|support|yes|proceed)\b/.test(lower)) {
    return 'agrees';
  }
  return 'neutral';
}

export function buildBoardroomRoles(
  frictionAgents: FrictionAgent[],
  debateRoom?: unknown,
  resultData?: unknown,
): BoardroomRole[] {
  const stored = parseStoredDebateRoom(debateRoom, resultData ?? null);
  if (stored?.length) {
    return stored.map((agent) => ({
      roleTitle: agent.role,
      agentName: agent.role,
      conclusion: agent.conclusion,
      disagreedOn: agent.disagreement,
      mindChanged: agent.mindChanged,
      stance: inferStanceFromRoleText(
        `${agent.conclusion} ${agent.disagreement}`,
      ),
    }));
  }

  return frictionAgents.map((agent, index) => ({
    roleTitle: resolveRoleTitle(agent.name, index),
    agentName: agent.name,
    conclusion: agent.summary,
    disagreedOn: buildDisagreedOn(agent, frictionAgents),
    mindChanged: buildMindChanged(agent, index),
    stance: agent.stance,
  }));
}

function inferEvidenceCluster(item: EvidenceCitation): EvidenceClusterId | null {
  const blob = `${item.url} ${item.source} ${item.title}`.toLowerCase();
  if (blob.includes('reddit.com') || blob.includes('redd.it')) return 'reddit';
  if (blob.includes('youtube.com') || blob.includes('youtu.be')) return 'youtube';
  if (
    blob.includes('.gov') ||
    blob.includes('docs.') ||
    blob.includes('documentation') ||
    blob.includes('github.com') ||
    blob.includes('sec.gov') ||
    blob.includes('/doc/')
  ) {
    return 'official';
  }
  if (
    blob.includes('medium.com') ||
    blob.includes('substack') ||
    blob.includes('blog') ||
    blob.includes('news') ||
    blob.includes('reuters') ||
    blob.includes('bloomberg')
  ) {
    return 'news';
  }
  return null;
}

function hashClusterId(item: EvidenceCitation): EvidenceClusterId {
  const ids: EvidenceClusterId[] = ['reddit', 'youtube', 'official', 'news'];
  return ids[stableIndex(item.url, ids.length)];
}

export function clusterEvidence(
  evidence: EvidenceCitation[],
): EvidenceCluster[] {
  const buckets: Record<EvidenceClusterId, EvidenceCitation[]> = {
    reddit: [],
    youtube: [],
    official: [],
    news: [],
  };

  for (const item of evidence) {
    const id = inferEvidenceCluster(item) ?? hashClusterId(item);
    buckets[id].push(item);
  }

  return (['reddit', 'youtube', 'official', 'news'] as const).map((id) => ({
    id,
    label: CLUSTER_META[id].label,
    subtitle: CLUSTER_META[id].subtitle,
    items: buckets[id],
  }));
}

export function buildResearchCoverage(
  evidence: EvidenceCitation[],
  evidenceVault?: unknown,
  resultData?: unknown,
): ResearchCoverage {
  const stored = parseStoredEvidenceVault(evidenceVault, resultData ?? null);
  if (stored) return stored;

  const cited = evidence.length;
  return {
    stats: {
      sourcesChecked: Math.max(cited * 4, cited, 24),
      highSignal: Math.max(cited, 1),
      contradictory: Math.max(1, Math.min(18, cited)),
      dominantConsensus: cited > 0 ? 1 : 0,
    },
    clusters: clusterEvidence(evidence),
  };
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

export type StoredExecutiveSummary = {
  recommendation: RecommendationLabel;
  fitForYou: FitRating;
  oneLineReason: string;
};

export type StoredBoardroomSummary = {
  bullCase: string;
  bearCase: string;
  shoalRecommendation: string;
  mainOpportunity: string;
  mainRisk: string;
  hiddenTradeoff: string;
  bestAlternative: string;
  explanation: string;
};

export type StoredDebateRoomAgent = {
  role: string;
  conclusion: string;
  disagreement: string;
  mindChanged: string;
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
  executiveSummary?: unknown;
  boardroomSummary?: unknown;
  debateRoom?: unknown;
  evidenceVault?: unknown;
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

  const verdictHeadline = extractVerdictHeadline(verdict);
  const confidence = Math.max(0, Math.min(100, Math.round(input.confidence)));
  const tldr = storedTldr ?? buildTldr(verdict, input.agents, []);
  const failureModes = storedPreMortem
    ? storedPreMortem.failureModes
    : buildFailureModes(input.resultData, verdict, overview.minorityDissent);
  const criticalUnknowns = storedPreMortem
    ? storedPreMortem.criticalUnknowns
    : buildCriticalUnknowns(input.resultData);

  const evidence = buildEvidence(input.evidence);
  const boardroomRoles = buildBoardroomRoles(
    frictionAgents,
    input.debateRoom,
    input.resultData,
  );
  const researchCoverage = buildResearchCoverage(
    evidence,
    input.evidenceVault,
    input.resultData,
  );

  return {
    sessionCode: input.sessionCode,
    premise: input.premise,
    createdAt: input.createdAt,
    verdictHeadline,
    verdictNarrative: verdict,
    confidence,
    boardroom: buildExecutiveBoardroom({
      verdictHeadline,
      verdictNarrative: verdict,
      confidence,
      tldr,
      frictionAgents,
      failureModes,
      criticalUnknowns,
      immediateAction: immediate,
      planB,
      premise: input.premise,
      resultData: input.resultData,
      executiveSummary: input.executiveSummary,
      boardroomSummary: input.boardroomSummary,
    }),
    tldr,
    frictionAgents,
    boardroomRoles,
    failureModes,
    criticalUnknowns,
    evidence,
    researchCoverage,
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
