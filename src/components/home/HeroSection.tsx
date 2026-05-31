import React from 'react';
import { motion } from 'framer-motion';
import { Kicker } from '../Kicker';
import { Button } from '../Button';

export function HeroSection() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-12 md:pt-32 md:pb-20 text-center overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-orange-500/8 blur-3xl -z-0" />
      <div className="pointer-events-none absolute top-20 -left-40 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-3xl -z-0" />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block mb-8"
        >
          <Kicker className="inline-flex items-center px-4 py-2 rounded-full bg-orange-50 border border-orange-100">
            The Consensus Engine
          </Kicker>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black tracking-tighter mb-8 leading-[1.05]"
        >
          Stop searching.
          <br />
          Start deciding.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          Google gives you links. Standard AI gives you polite summaries. Shoal AI
          gives you the mathematically proven truth by deploying swarms of
          autonomous agents that debate, cite, and stress-test until consensus
          crystallizes.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-3 justify-center mt-10"
        >
          <Button variant="primary" href="/sign-up">
            Get Started
          </Button>
          <Button variant="secondary" href="/product">
            Explore the product
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
