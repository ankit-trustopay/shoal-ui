import type { SwarmConsoleStats } from '../components/swarm/live-console/swarmStats';

export interface RecommendedActionExport {
  step: number;
  title: string;
  body: string;
}

export interface SwarmReportInput {
  swarmId: string;
  premise: string;
  stats: SwarmConsoleStats;
  managerConsensus: string;
  sessionCode?: string;
  recommendedActions?: RecommendedActionExport[];
  minorityDissent?: string | null;
}

function votePercent(count: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((count / total) * 100);
}

function formatCostCredits(cost: number): string {
  if (cost === 0) return '0';
  if (Number.isInteger(cost)) return String(cost);
  return cost.toFixed(2);
}

function formatGeneratedAt(): string {
  return new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildSwarmReportMarkdown({
  swarmId,
  premise,
  stats,
  managerConsensus,
  sessionCode,
  recommendedActions = [],
  minorityDissent,
}: SwarmReportInput): string {
  const total = stats.totalVotingAgents;
  const forPct = votePercent(stats.votesFor, total);
  const againstPct = votePercent(stats.votesAgainst, total);
  const neutralPct = votePercent(stats.votesNeutral, total);
  const generatedAt = formatGeneratedAt();

  const lines: string[] = [
    '# Shoal AI — Institutional Swarm Report',
    '',
    '| Field | Value |',
    '| --- | --- |',
    `| **Session** | ${sessionCode ?? swarmId} |`,
    `| **Swarm ID** | \`${swarmId}\` |`,
    `| **Generated** | ${generatedAt} |`,
    `| **Confidence** | **${stats.confidence}%** |`,
    '',
    '## Swarm Premise',
    '',
    premise.trim(),
    '',
    '## Confidence Score',
    '',
    `**${stats.confidence}%** institutional confidence in the final consensus.`,
    '',
    `Swarm alignment with consensus: **${stats.agreementPercent}%**`,
    '',
    '## Vote Distribution',
    '',
    `Total agents voting: **${total.toLocaleString()}**`,
    '',
    '| Sentiment | Agents | Share |',
    '| --- | ---: | ---: |',
    `| For | ${stats.votesFor.toLocaleString()} | ${forPct}% |`,
    `| Against | ${stats.votesAgainst.toLocaleString()} | ${againstPct}% |`,
    `| Neutral | ${stats.votesNeutral.toLocaleString()} | ${neutralPct}% |`,
    '',
  ];

  if (recommendedActions.length > 0) {
    lines.push('## Recommended Actions', '');
    recommendedActions.forEach((action) => {
      lines.push(`### ${action.step}. ${action.title}`, '', action.body, '');
    });
  } else {
    lines.push(
      '## Recommended Actions',
      '',
      '_No strategic actions were generated for this query._',
      '',
    );
  }

  if (minorityDissent) {
    lines.push('## Minority Dissent', '', minorityDissent.trim(), '');
  }

  lines.push(
    '## Manager Consensus',
    '',
    managerConsensus.trim(),
    '',
    '---',
    '',
    '*Prepared by Shoal AI · Adversarial swarm deliberation with live research*',
  );

  return lines.join('\n');
}

export function buildSwarmReportHtml(input: SwarmReportInput): string {
  const markdown = buildSwarmReportMarkdown(input);
  const premise = escapeHtml(input.premise.trim());
  const consensus = escapeHtml(input.managerConsensus.trim());
  const total = input.stats.totalVotingAgents;
  const forPct = votePercent(input.stats.votesFor, total);
  const againstPct = votePercent(input.stats.votesAgainst, total);
  const neutralPct = votePercent(input.stats.votesNeutral, total);

  const actionsHtml =
    (input.recommendedActions ?? []).length > 0
      ? (input.recommendedActions ?? [])
          .map(
            (action) => `
        <article class="action">
          <h3>${action.step}. ${escapeHtml(action.title)}</h3>
          <p>${escapeHtml(action.body)}</p>
        </article>`,
          )
          .join('')
      : '<p class="muted">No strategic actions were generated for this query.</p>';

  const dissentHtml = input.minorityDissent
    ? `<section class="dissent"><h2>Minority Dissent</h2><p>${escapeHtml(input.minorityDissent.trim())}</p></section>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Shoal AI Report — ${escapeHtml(input.sessionCode ?? input.swarmId)}</title>
  <style>
    :root { color-scheme: light; }
    body { font-family: Georgia, "Times New Roman", serif; background: #fafafa; color: #111; margin: 0; padding: 40px 24px; }
    .page { max-width: 820px; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; box-shadow: 0 20px 60px rgba(0,0,0,.06); }
    header { padding: 40px 48px 28px; border-bottom: 3px solid #f97316; }
    .eyebrow { font-family: ui-monospace, monospace; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: #f97316; margin: 0 0 12px; }
    h1 { font-size: 28px; line-height: 1.15; margin: 0; font-weight: 700; }
    .meta { margin-top: 18px; font-family: ui-monospace, monospace; font-size: 12px; color: #6b7280; }
    main { padding: 36px 48px 48px; }
    section { margin-bottom: 32px; }
    h2 { font-size: 13px; font-family: ui-monospace, monospace; letter-spacing: .14em; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #eee; padding-bottom: 8px; margin: 0 0 16px; }
    .premise, .consensus { font-size: 18px; line-height: 1.65; }
    .score { font-size: 42px; font-weight: 700; color: #f97316; margin: 0; }
    table { width: 100%; border-collapse: collapse; font-size: 15px; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #eee; }
    th { font-family: ui-monospace, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #6b7280; }
    .action { border: 1px solid #eee; border-radius: 12px; padding: 16px 18px; margin-bottom: 12px; }
    .action h3 { margin: 0 0 8px; font-size: 16px; }
    .action p { margin: 0; color: #374151; line-height: 1.6; }
    .dissent { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 18px 20px; }
    .muted { color: #6b7280; font-style: italic; }
    footer { padding: 0 48px 36px; font-size: 12px; color: #9ca3af; font-family: ui-monospace, monospace; }
    pre.raw-md { display: none; }
  </style>
</head>
<body>
  <div class="page">
    <header>
      <p class="eyebrow">Shoal AI · Institutional Report</p>
      <h1>Swarm Consensus Dossier</h1>
      <p class="meta">Session ${escapeHtml(input.sessionCode ?? input.swarmId)} · ${escapeHtml(formatGeneratedAt())}</p>
    </header>
    <main>
      <section>
        <h2>Swarm Premise</h2>
        <p class="premise">${premise}</p>
      </section>
      <section>
        <h2>Confidence Score</h2>
        <p class="score">${input.stats.confidence}%</p>
        <p>Swarm alignment with consensus: <strong>${input.stats.agreementPercent}%</strong></p>
      </section>
      <section>
        <h2>Vote Distribution</h2>
        <table>
          <thead><tr><th>Sentiment</th><th>Agents</th><th>Share</th></tr></thead>
          <tbody>
            <tr><td>For</td><td>${input.stats.votesFor.toLocaleString()}</td><td>${forPct}%</td></tr>
            <tr><td>Against</td><td>${input.stats.votesAgainst.toLocaleString()}</td><td>${againstPct}%</td></tr>
            <tr><td>Neutral</td><td>${input.stats.votesNeutral.toLocaleString()}</td><td>${neutralPct}%</td></tr>
          </tbody>
        </table>
      </section>
      <section>
        <h2>Recommended Actions</h2>
        ${actionsHtml}
      </section>
      ${dissentHtml}
      <section>
        <h2>Manager Consensus</h2>
        <p class="consensus">${consensus}</p>
      </section>
    </main>
    <footer>Prepared by Shoal AI · Swarm ID ${escapeHtml(input.swarmId)}</footer>
    <pre class="raw-md">${escapeHtml(markdown)}</pre>
  </div>
</body>
</html>`;
}

/** @deprecated Use buildSwarmReportMarkdown for exports */
export function buildSwarmReportText(input: SwarmReportInput): string {
  return buildSwarmReportMarkdown(input);
}

export function downloadBlobFile(
  filename: string,
  content: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function downloadMarkdownFile(filename: string, content: string): void {
  downloadBlobFile(filename, content, 'text/markdown;charset=utf-8');
}

export function downloadHtmlFile(filename: string, content: string): void {
  downloadBlobFile(filename, content, 'text/html;charset=utf-8');
}

/** @deprecated Use downloadMarkdownFile */
export function downloadTextFile(filename: string, content: string): void {
  downloadMarkdownFile(filename, content);
}
