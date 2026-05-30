import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, SparklesIcon } from 'lucide-react';
import { PageContainer } from '../components/ui/PageContainer';
import { ConsoleHeader } from '../components/ui/ConsoleHeader';
import { BentoCard } from '../components/ui/BentoCard';
import { MonoLabel } from '../components/ui/MonoLabel';
import { SwarmCard } from '../components/swarm/SwarmCard';
import { MetricCountUp } from '../components/motion/CountUp';
import { historyStats, swarmHistory } from '../data/history';

export function History() {
  const [query, setQuery] = useState('');
  const filtered = swarmHistory.filter(
    (s) =>
      query.trim() === '' ||
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.verdict.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <PageContainer width="default" className="pb-16 pt-6 md:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <ConsoleHeader
          breadcrumb="CONSOLE / HISTORY"
          title="Swarm history"
          description="Every dilemma you've put to the swarm. Click any run to open the full report."
          className="mb-0"
        />
        <Link
          to="/app/new"
          className="inline-flex items-center gap-2 bg-axiom text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors self-start whitespace-nowrap shadow-sm"
        >
          <SparklesIcon size={14} />
          New swarm
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        {historyStats.map((stat) => (
          <BentoCard key={stat.id} className="rounded-2xl p-5">
            <MonoLabel className="mb-2 block">{stat.label}</MonoLabel>
            <div className="text-2xl sm:text-3xl font-bold text-black tracking-tighter leading-none">
              <MetricCountUp value={stat.value} delay={0.15} />
            </div>
          </BentoCard>
        ))}
      </div>

      <div className="relative mb-6">
        <SearchIcon
          size={18}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search dilemmas..."
          className="w-full bg-white pl-12 pr-5 py-3.5 border border-gray-200/60 rounded-2xl text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors shadow-bento"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((swarm) => (
          <SwarmCard key={swarm.id} swarm={swarm} />
        ))}
        {filtered.length === 0 && (
          <BentoCard className="text-center py-16 rounded-2xl">
            <p className="text-gray-500">No swarms match your search.</p>
          </BentoCard>
        )}
      </div>
    </PageContainer>
  );
}
