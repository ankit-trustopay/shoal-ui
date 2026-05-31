import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function SwarmDeliberatingBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-orange-200/80 bg-gradient-to-r from-orange-50 via-white to-orange-50/80 px-6 py-5 shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/25">
          <Loader2 size={22} className="animate-spin" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Swarm is deliberating…
          </p>
          <p className="mt-1 text-sm text-gray-600 leading-relaxed">
            This usually takes <span className="font-medium text-gray-800">30–40 seconds</span>.
            We&apos;re running live Tavily search, five agent personas, and Manager consensus.
          </p>
          <div className="mt-3 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-orange-100">
            <motion.div
              className="h-full rounded-full bg-orange-500"
              initial={{ width: '8%' }}
              animate={{ width: ['12%', '88%', '24%', '72%', '40%'] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
