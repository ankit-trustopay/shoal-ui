import { ArrowRightLeft, MessageSquareQuote, Users } from 'lucide-react';
import type { BoardroomRole } from '../../lib/executiveDecisionReport';
import { STANCE_LABEL } from '../../lib/executiveDecisionReport';
import type { AgentStance } from '../../lib/executiveDecisionReport';

const STANCE_STYLES: Record<
  AgentStance,
  { badge: string; border: string; accent: string }
> = {
  agrees: {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    border: 'border-emerald-100',
    accent: 'bg-emerald-500',
  },
  disagrees: {
    badge: 'bg-red-50 text-red-800 border-red-200',
    border: 'border-red-100',
    accent: 'bg-red-500',
  },
  neutral: {
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    border: 'border-slate-200',
    accent: 'bg-slate-500',
  },
};

function RoleCard({ role }: { role: BoardroomRole }) {
  const styles = STANCE_STYLES[role.stance];

  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-lg border bg-white ${styles.border} shadow-sm`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-1 ${styles.accent}`}
        aria-hidden
      />
      <div className="flex flex-1 flex-col p-5 pl-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Boardroom role
            </p>
            <h3 className="mt-1 text-lg font-bold tracking-tight text-gray-900">
              {role.roleTitle}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">{role.agentName}</p>
          </div>
          <span
            className={`rounded border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}
          >
            {STANCE_LABEL[role.stance]}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-slate-700">
              <MessageSquareQuote size={14} aria-hidden />
              <p className="text-[10px] font-bold uppercase tracking-wider">
                Their conclusion
              </p>
            </div>
            <p className="text-sm leading-relaxed text-gray-800">
              {role.conclusion}
            </p>
          </div>

          <div className="rounded-md border border-slate-100 bg-slate-50/60 px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              What they disagreed on
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              {role.disagreedOn}
            </p>
          </div>

          <div className="flex gap-2 rounded-md border border-blue-100/80 bg-blue-50/40 px-3 py-2.5">
            <ArrowRightLeft
              size={14}
              className="mt-0.5 shrink-0 text-blue-700"
              aria-hidden
            />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                Mind changed
              </p>
              <p className="mt-1 text-sm leading-relaxed text-blue-950/90">
                {role.mindChanged}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function BoardroomDebateRoom({ roles }: { roles: BoardroomRole[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 sm:px-8">
        <span className="h-5 w-1 rounded-full bg-slate-800" aria-hidden />
        <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-gray-900">
              The Debate Room
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Boardroom roles — conclusions, friction, and stance shifts
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            <Users size={12} aria-hidden />
            {roles.length} seats
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:px-8 sm:py-7 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <RoleCard key={`${role.agentName}-${role.roleTitle}`} role={role} />
        ))}
      </div>
    </section>
  );
}
