import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pressableHover, pressableTap } from '../../lib/motion';
import {
  ArrowRightIcon,
  UsersIcon,
  CoinsIcon,
  CheckCircleIcon,
  ClockIcon,
} from 'lucide-react';
import { BentoCard } from '../ui/BentoCard';
import { MonoLabel } from '../ui/MonoLabel';
import { cn } from '../../lib/cn';
import { headingCard } from '../../lib/typography';

export interface SwarmHistoryItem {
  id: string;
  title: string;
  verdict: string;
  confidence: number;
  agents: number;
  credits: number;
  sources: number;
  forVotes: number;
  against: number;
  neutral: number;
  age: string;
  status: 'COMPLETE';
}

interface SwarmCardProps {
  swarm: SwarmHistoryItem;
}

export function SwarmCard({ swarm }: SwarmCardProps) {
  return (
    <Link to="/app/report" className="block group">
      <motion.div whileHover={pressableHover} whileTap={pressableTap}>
      <BentoCard
        className="rounded-2xl p-6 md:p-8 transition-all duration-200 group-hover:border-axiom/30"
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <MonoLabel>{swarm.id}</MonoLabel>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-axiom bg-orange-50 border border-orange-200 px-2 py-1 rounded">
              {swarm.status}
            </span>
          </div>
          <ArrowRightIcon
            size={18}
            className="text-gray-300 group-hover:text-axiom group-hover:translate-x-1 transition-all shrink-0"
          />
        </div>

        <h3
          className={cn(
            headingCard,
            'text-lg md:text-xl mb-4 leading-snug',
          )}
        >
          {swarm.title}
        </h3>

        <div className="bg-orange-50/80 border border-orange-200/80 rounded-xl p-4 mb-4">
          <MonoLabel variant="accent" className="mb-2 block">
            Signal · {swarm.confidence}% consensus
          </MonoLabel>
          <p className="text-sm text-gray-800 leading-relaxed">{swarm.verdict}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
          <span className="inline-flex items-center gap-1.5 text-gray-600">
            <UsersIcon size={13} />
            <span className="font-mono">{swarm.agents}</span> agents
          </span>
          <span className="inline-flex items-center gap-1.5 text-gray-600">
            <CoinsIcon size={13} />
            <span className="font-mono">{swarm.credits}</span> credits
          </span>
          <span className="inline-flex items-center gap-1.5 text-gray-600">
            <CheckCircleIcon size={13} />
            <span className="font-mono">{swarm.sources}</span> sources
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-axiom bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
            For {swarm.forVotes}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            Against {swarm.against}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600 bg-gray-100 border border-gray-200/60 px-2 py-0.5 rounded">
            Neutral {swarm.neutral}
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-gray-500">
            <ClockIcon size={12} />
            {swarm.age}
          </span>
        </div>
      </BentoCard>
      </motion.div>
    </Link>
  );
}
