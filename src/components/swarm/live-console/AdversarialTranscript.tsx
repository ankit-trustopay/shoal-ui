import React from 'react';
import { motion } from 'framer-motion';
import type { FeedMessage } from '../../../types/swarm';
import { ActionTag } from '../ActionTag';
import { MonoLabel } from '../../ui/MonoLabel';
import { bentoItem, bentoStagger } from '../../../lib/motion';

const PERSONA_STYLES: Record<
  string,
  { border: string; bg: string; accent: string; agentId: string }
> = {
  'Financial Skeptic': {
    border: 'border-red-200',
    bg: 'bg-red-50/80',
    accent: 'text-red-700',
    agentId: 'AX-014',
  },
  Skeptic: {
    border: 'border-red-200',
    bg: 'bg-red-50/80',
    accent: 'text-red-700',
    agentId: 'AX-014',
  },
  'Domain Expert': {
    border: 'border-blue-200',
    bg: 'bg-blue-50/80',
    accent: 'text-blue-700',
    agentId: 'AX-022',
  },
  Expert: {
    border: 'border-blue-200',
    bg: 'bg-blue-50/80',
    accent: 'text-blue-700',
    agentId: 'AX-022',
  },
  'Risk Analyst': {
    border: 'border-amber-200',
    bg: 'bg-amber-50/80',
    accent: 'text-amber-800',
    agentId: 'AX-031',
  },
  'Consumer Voice': {
    border: 'border-violet-200',
    bg: 'bg-violet-50/80',
    accent: 'text-violet-700',
    agentId: 'AX-007',
  },
  Optimist: {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50/80',
    accent: 'text-emerald-700',
    agentId: 'AX-041',
  },
};

const DEFAULT_STYLE = {
  border: 'border-gray-200',
  bg: 'bg-white',
  accent: 'text-gray-800',
  agentId: 'AX-000',
};

interface AdversarialTranscriptProps {
  messages: FeedMessage[];
}

export function AdversarialTranscript({ messages }: AdversarialTranscriptProps) {
  if (messages.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-10 text-center">
        <p className="text-sm text-gray-500">
          No adversarial transcript yet. Agents are still deliberating.
        </p>
      </section>
    );
  }

  return (
    <section className="min-w-0">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <MonoLabel className="mb-2 block">Deliberation record</MonoLabel>
          <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
            Adversarial Transcript
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {messages.length} agent perspectives in open debate
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hidden sm:block">
          Chronological · Unedited
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8">
        <div
          className="absolute left-2 sm:left-3 top-2 bottom-2 w-px bg-gradient-to-b from-axiom/60 via-gray-300 to-transparent"
          aria-hidden
        />

        <motion.div
          variants={bentoStagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-5"
        >
          {messages.map((message, index) => {
            const style = PERSONA_STYLES[message.persona] ?? DEFAULT_STYLE;
            const isReply = index > 0;

            return (
              <motion.article
                key={message.id}
                variants={bentoItem}
                className={`relative rounded-xl border ${style.border} ${style.bg} p-5 sm:p-6 shadow-sm`}
              >
                {isReply && (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-3">
                    ↳ In reply to prior agent analysis
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`font-mono text-xs font-semibold ${style.accent}`}
                    >
                      {style.agentId}
                    </span>
                    <span className="font-bold text-sm text-black">
                      {message.persona}
                    </span>
                  </div>
                  <time className="font-mono text-[10px] text-gray-500 shrink-0">
                    {message.timestamp}
                  </time>
                </div>

                <div className="mb-3">
                  <ActionTag tag={message.tag} />
                </div>

                <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                  {message.body}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
