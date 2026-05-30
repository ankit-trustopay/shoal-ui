import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2Icon } from 'lucide-react';
import { PageContainer } from '../components/ui/PageContainer';
import { MonoLabel } from '../components/ui/MonoLabel';
import { ReportActionBar } from '../components/report/ReportActionBar';
import { VerdictRing } from '../components/report/VerdictRing';
import { VectorRadarChart } from '../components/report/VectorRadarChart';
import { FrictionAnalysis } from '../components/report/FrictionAnalysis';
import { MarketImpactGrid } from '../components/report/MarketImpactGrid';
import { SourceEvidenceList } from '../components/report/SourceEvidenceList';
import { ReportStatsFooter } from '../components/report/ReportStatsFooter';
import { MetricCountUp } from '../components/motion/CountUp';
import { bentoStagger, bentoItem } from '../lib/motion';
import {
  REPORT_META,
  reportTelemetry,
  radarData,
  winningThesis,
  minorityDissent,
  marketImpact,
  reportSources,
  reportFooterStats,
} from '../data/report';

export function Report() {
  return (
    <PageContainer width="wide" className="pb-16 pt-6 md:pt-8">
      <ReportActionBar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <div className="inline-flex flex-wrap items-center gap-2 mb-4">
          <CheckCircle2Icon size={12} className="text-axiom" />
          <MonoLabel variant="accent">Shoal AI · Report {REPORT_META.id}</MonoLabel>
          <span className="text-gray-300">·</span>
          <MonoLabel>Synthesis dossier</MonoLabel>
          <span className="text-gray-300">·</span>
          <MonoLabel>May 29, 2026</MonoLabel>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black tracking-tighter leading-[1.1] max-w-5xl">
          {REPORT_META.question}
        </h1>
      </motion.div>

      <motion.div
        variants={bentoStagger}
        initial="hidden"
        animate="show"
        className="space-y-5"
      >
        <motion.section
          variants={bentoItem}
          className="relative bg-white border border-gray-200/60 rounded-3xl p-6 sm:p-8 md:p-10 overflow-hidden shadow-bento"
        >
          <div className="pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-orange-500/10 blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-8">
            <div className="lg:col-span-8">
              <MonoLabel variant="accent" className="mb-5 block tracking-[0.3em]">
                Shoal AI · The verdict
              </MonoLabel>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-black tracking-tighter leading-[1.1] mb-6">
                {REPORT_META.verdict}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl">
                {REPORT_META.summary}
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <VerdictRing percent={REPORT_META.confidence} />
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-gray-100 pt-6">
            {reportTelemetry.map((t) => (
              <div key={t.label}>
                <MonoLabel className="mb-1.5 block">{t.label}</MonoLabel>
                <div className="text-xl md:text-2xl font-bold text-black tracking-tighter">
                  <MetricCountUp value={t.value} delay={0.3} />
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div variants={bentoItem}>
            <VectorRadarChart data={radarData} />
          </motion.div>
          <motion.div variants={bentoItem}>
            <FrictionAnalysis
              winningThesis={winningThesis}
              minorityDissent={minorityDissent}
            />
          </motion.div>
        </div>

        <motion.div variants={bentoItem}>
          <MarketImpactGrid items={marketImpact} />
        </motion.div>

        <motion.div variants={bentoItem}>
          <SourceEvidenceList sources={reportSources} />
        </motion.div>

        <motion.div variants={bentoItem}>
          <ReportStatsFooter stats={reportFooterStats} />
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
