export type DebateTag =
  | 'CHALLENGING PREMISE'
  | 'CITING SOURCE'
  | 'AGREEMENT'
  | 'COUNTER-ARGUMENT'
  | 'SYNTHESIS';

export interface FeedMessage {
  id: string;
  persona: string;
  timestamp: string;
  tag: DebateTag;
  body: string;
}

export interface SwarmMessageRecord {
  id: string;
  swarmId: string;
  text: string;
  role: string;
  createdAt: string;
}

export interface SwarmWithMessages {
  id: string;
  userId: string;
  premise: string;
  status: string;
  agentCount: number;
  resultData: unknown;
  createdAt: string;
  messages: SwarmMessageRecord[];
}
