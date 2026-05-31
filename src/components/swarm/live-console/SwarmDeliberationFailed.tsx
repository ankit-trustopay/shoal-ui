import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';

interface SwarmDeliberationFailedProps {
  premise?: string | null;
}

export function SwarmDeliberationFailed({ premise }: SwarmDeliberationFailedProps) {
  const navigate = useNavigate();

  const tryAgainHref = premise?.trim()
    ? `/app/new?${new URLSearchParams({ query: premise.trim() }).toString()}`
    : '/app/new';

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/app/history"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        All swarms
      </Link>

      <div
        className="rounded-2xl border-2 border-red-500 bg-gradient-to-br from-red-50 to-white p-8 sm:p-10 shadow-lg shadow-red-500/10"
        role="alert"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shadow-red-600/30">
            <AlertCircle size={24} aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-red-600 mb-2">
              Deliberation failed
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-red-950 tracking-tight leading-tight">
              Swarm Deliberation Failed
            </h1>
            <p className="mt-3 text-base text-red-900/90 leading-relaxed">
              Your credits have been refunded.
            </p>
            {premise?.trim() && (
              <p className="mt-4 text-sm text-red-800/80 leading-relaxed border-l-2 border-red-300 pl-4">
                {premise.trim()}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate(tryAgainHref)}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors shadow-sm"
          >
            <RotateCcw size={16} />
            Try Again
          </button>
          <Link
            to="/app/new"
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-800 hover:bg-red-50 transition-colors"
          >
            Start New Swarm
          </Link>
        </div>
      </div>
    </div>
  );
}
