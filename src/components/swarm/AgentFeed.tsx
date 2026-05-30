import React from 'react';
import { motion } from 'framer-motion';
import type { DebateMessage } from '../../data/liveSwarm';
import { ActionTag } from './ActionTag';
import { BentoCard } from '../ui/BentoCard';
import { MonoLabel } from '../ui/MonoLabel';
import { bentoStagger, bentoItem } from '../../lib/motion';

interface AgentFeedProps {
  messages: DebateMessage[];
  thinkingLabel?: string;
}

export function AgentFeed({
  messages,
  thinkingLabel = 'SH-091 Verifier is cross-checking Northwind citations...',
}: AgentFeedProps) {
  return (
    <section className="min-w-0">
      <div className="flex items-center justify-between mb-4">
        <MonoLabel>Live Transcript</MonoLabel>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-axiom opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-axiom animate-pulse" />
          </span>
          <MonoLabel className="text-axiom">Streaming</MonoLabel>
        </div>
      </div>

      <div className="h-[min(600px,70vh)] overflow-y-auto bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-200/60 flex flex-col gap-4">
        <motion.div
          variants={bentoStagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4"
        >
          {messages.map((message) => (
            <motion.div key={`${message.id}-${message.timestamp}`} variants={bentoItem}>
              <BentoCard className="rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-gray-500 shrink-0">
                      {message.id}
                    </span>
                    <span className="font-bold text-sm text-black truncate">
                      {message.persona}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-gray-400 shrink-0">
                    {message.timestamp}
                  </span>
                </div>
                <div className="mb-3">
                  <ActionTag tag={message.tag} />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{message.body}</p>
              </BentoCard>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex items-center gap-2 px-4 py-3 font-mono text-xs text-gray-500">
          <span className="flex gap-1" aria-hidden>
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="w-1.5 h-1.5 rounded-full bg-axiom animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </span>
          <span className="tracking-wide animate-pulse">{thinkingLabel}</span>
        </div>
      </div>
    </section>
  );
}
