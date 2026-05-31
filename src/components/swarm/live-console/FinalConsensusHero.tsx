import React from 'react';
import { motion } from 'framer-motion';
import { ScaleIcon } from 'lucide-react';
import { MonoLabel } from '../../ui/MonoLabel';

interface FinalConsensusHeroProps {
  verdict: string;
  sessionId: string;
}

export function FinalConsensusHero({
  verdict,
  sessionId,
}: FinalConsensusHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#111113] via-[#0a0a0b] to-[#1a1a1e] text-white shadow-2xl"
    >
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 0%, rgba(255,90,0,0.25), transparent 45%), radial-gradient(circle at 80% 100%, rgba(255,255,255,0.06), transparent 40%)',
        }}
      />

      <div className="relative z-10 p-8 sm:p-10 md:p-12">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-axiom/20 border border-axiom/40">
              <ScaleIcon className="text-axiom" size={22} />
            </div>
            <div>
              <MonoLabel className="text-axiom block mb-1">
                Board resolution
              </MonoLabel>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                FINAL CONSENSUS
              </h2>
            </div>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 border border-white/10 rounded-full px-3 py-1">
            {sessionId}
          </span>
        </div>

        <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-100 font-medium max-w-4xl">
          {verdict}
        </p>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-6 font-mono text-[10px] uppercase tracking-widest text-gray-500">
          <span>Status · Ratified</span>
          <span>Engine · Shoal AI</span>
          <span>Mode · Adversarial synthesis</span>
        </div>
      </div>
    </motion.section>
  );
}
