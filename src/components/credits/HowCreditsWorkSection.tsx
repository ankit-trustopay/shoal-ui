import React from 'react';
import { CalculatorIcon, InfoIcon } from 'lucide-react';
import { MonoLabel } from '../ui/MonoLabel';

function InfoTooltip({ label }: { label: string }) {
  return (
    <span className="relative inline-flex items-center">
      <span className="group inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500">
        <InfoIcon size={12} aria-hidden />
        <span className="sr-only">Info</span>
        <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {label}
        </span>
      </span>
    </span>
  );
}

export function HowCreditsWorkSection() {
  return (
    <section
      aria-labelledby="how-credits-work-heading"
      className="mb-10 md:mb-14 rounded-2xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-50 via-white to-orange-50/40 p-6 md:p-8 shadow-bento"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <MonoLabel className="mb-2 flex items-center gap-2 text-orange-600">
            <CalculatorIcon size={12} aria-hidden />
            Transparency
          </MonoLabel>
          <h2
            id="how-credits-work-heading"
            className="text-2xl md:text-3xl font-bold text-black tracking-tight mb-3"
          >
            How credits work
          </h2>
          <div className="space-y-3 text-sm md:text-base text-gray-700 leading-relaxed">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-orange-500/70" />
              <p>
                <span className="font-semibold text-gray-900">
                  Lite Models (1 Credit/Agent):
                </span>{' '}
                Fast, efficient models for standard reasoning.{' '}
                <InfoTooltip label="Lite runs prioritize speed and cost efficiency for everyday decisions." />
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-gray-900/70" />
              <p>
                <span className="font-semibold text-gray-900">
                  Plus Models (5 Credits/Agent):
                </span>{' '}
                Advanced models for deep, complex reasoning.{' '}
                <InfoTooltip label="Plus runs use more capable models for harder prompts and nuanced tradeoffs." />
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-orange-500/50" />
              <p>
                <span className="font-semibold text-gray-900">What-If Tweaks:</span>{' '}
                Your first 3 tweaks on any debate are 100% FREE. After that, it's a
                flat 10 Credits per tweak.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-orange-500/50" />
              <p>
                <span className="font-semibold text-gray-900">Top-Ups:</span> $5
                gets you 1,000 Credits instantly.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block h-14 w-14 shrink-0" aria-hidden />
      </div>
    </section>
  );
}
