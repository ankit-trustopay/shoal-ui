import React, { useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Zap } from 'lucide-react';
import {
  buildSwarmReportHtml,
  buildSwarmReportMarkdown,
  downloadHtmlFile,
  downloadMarkdownFile,
} from '../../../lib/buildSwarmReport';
import { parseSwarmOverview } from '../../../lib/swarmOverview';
import type { SwarmConsoleStats } from './swarmStats';

const outlineBtnClass =
  'inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:pointer-events-none';

interface LiveConsoleActionBarProps {
  swarmId: string;
  premise: string;
  managerText: string | null;
  stats: SwarmConsoleStats;
  sessionCode: string;
  resultData: unknown;
  actionsDisabled?: boolean;
  onToast: (message: string) => void;
}

export function LiveConsoleActionBar({
  swarmId,
  premise,
  managerText,
  stats,
  sessionCode,
  resultData,
  actionsDisabled = false,
  onToast,
}: LiveConsoleActionBarProps) {
  const navigate = useNavigate();

  const { recommendedActions, minorityDissent } = useMemo(
    () => parseSwarmOverview(resultData),
    [resultData],
  );

  const consensus = managerText?.trim() ?? '';
  const canUseConsensus = consensus.length > 0 && !actionsDisabled;

  const handleCopySummary = useCallback(async () => {
    if (!canUseConsensus) {
      onToast('Consensus is not ready yet');
      return;
    }

    try {
      await navigator.clipboard.writeText(consensus);
      onToast('Consensus copied to clipboard');
    } catch {
      onToast('Could not copy to clipboard');
    }
  }, [canUseConsensus, consensus, onToast]);

  const handleExport = useCallback(() => {
    if (!canUseConsensus) {
      onToast('Report is not ready yet');
      return;
    }

    const reportInput = {
      swarmId,
      premise,
      stats,
      managerConsensus: consensus,
      sessionCode,
      recommendedActions,
      minorityDissent,
    };

    const markdown = buildSwarmReportMarkdown(reportInput);
    const html = buildSwarmReportHtml(reportInput);

    const safeId = swarmId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 24) || 'swarm';
    downloadMarkdownFile(`shoal-report-${safeId}.md`, markdown);
    downloadHtmlFile(`shoal-report-${safeId}.html`, html);
    onToast('Institutional report downloaded (.md + .html)');
  }, [
    canUseConsensus,
    consensus,
    minorityDissent,
    onToast,
    premise,
    recommendedActions,
    sessionCode,
    stats,
    swarmId,
  ]);

  const handleRedeploy = useCallback(() => {
    const params = new URLSearchParams();
    if (premise.trim()) {
      params.set('query', premise.trim());
    }
    const suffix = params.toString() ? `?${params.toString()}` : '';
    navigate(`/app/new${suffix}`);
  }, [navigate, premise]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Link
        to="/app/history"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={16} />
        All swarms
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={outlineBtnClass}
          disabled={!canUseConsensus}
          onClick={() => void handleCopySummary()}
        >
          Copy summary
        </button>
        <button
          type="button"
          className={outlineBtnClass}
          disabled={!canUseConsensus}
          onClick={handleExport}
        >
          <Download size={16} />
          Export
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50 disabled:pointer-events-none"
          disabled={actionsDisabled}
          onClick={handleRedeploy}
        >
          <Zap size={16} />
          Re-deploy
        </button>
      </div>
    </div>
  );
}
