export type ConsoleTabId =
  | 'overview'
  | 'evidence'
  | 'agents'
  | 'debate'
  | 'cost';

export const CONSOLE_TABS: {
  id: ConsoleTabId;
  label: string;
  count?: number;
}[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'agents', label: 'Agents' },
  { id: 'debate', label: 'Debate' },
  { id: 'cost', label: 'Cost' },
];
