import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CreditCardIcon, DownloadIcon } from 'lucide-react';
import { settingsInvoices } from '../../data/settings';
import type { SettingsTabId } from '../../data/settings';
import { BentoCard } from '../ui/BentoCard';
import { MonoLabel } from '../ui/MonoLabel';

interface SettingsBillingPanelProps {
  onChangePlan: (tab: SettingsTabId) => void;
}

export function SettingsBillingPanel({ onChangePlan }: SettingsBillingPanelProps) {
  return (
    <div className="max-w-3xl">
      <BentoCard className="p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <MonoLabel className="mb-1 block">Current Plan</MonoLabel>
          <div className="text-2xl font-bold text-black tracking-tight">Starter</div>
          <div className="text-sm text-gray-600 mt-1">
            $20/month · Renews Jun 1, 2026
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChangePlan('plans')}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-black border border-gray-200/60 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          Change plan
        </button>
      </BentoCard>

      <BentoCard className="p-6 mb-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h2 className="font-bold text-black tracking-tight">
            Monthly compute credits
          </h2>
          <span className="font-mono text-sm text-gray-600">
            <span className="text-black font-semibold">52</span> / 100 used
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-axiom rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '52%' }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-3">
          48 of your 100 monthly bonus credits remain. Daily free runs reset every
          24h.
        </p>
        <Link
          to="/app/credits"
          className="inline-block mt-5 bg-axiom text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors"
        >
          Buy more credits
        </Link>
      </BentoCard>

      <BentoCard className="p-6 mb-6">
        <h2 className="font-bold text-black tracking-tight mb-1">Payment method</h2>
        <p className="text-sm text-gray-600 mb-4">
          Used for plan renewals and credit top-ups.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-gray-200/60 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <CreditCardIcon size={18} className="text-gray-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-black">
                Visa ending in 4242
              </div>
              <div className="font-mono text-[11px] text-gray-500 tracking-wide">
                Expires 04/28
              </div>
            </div>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-axiom hover:underline self-start sm:self-auto"
          >
            Update
          </button>
        </div>
      </BentoCard>

      <BentoCard className="p-6">
        <h2 className="font-bold text-black tracking-tight mb-4">Invoice history</h2>
        <div className="hidden sm:grid grid-cols-12 gap-4 px-2 pb-3 border-b border-gray-200/60">
          <div className="col-span-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            Date
          </div>
          <div className="col-span-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            Plan
          </div>
          <div className="col-span-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            Amount
          </div>
          <div className="col-span-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            Status
          </div>
          <div className="col-span-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 text-right">
            Invoice
          </div>
        </div>
        {settingsInvoices.map((invoice) => (
          <div
            key={invoice.id}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 px-2 py-4 border-b border-gray-100 items-center last:border-b-0"
          >
            <div className="sm:col-span-3 text-sm text-black">{invoice.date}</div>
            <div className="sm:col-span-3 text-sm text-gray-700">{invoice.plan}</div>
            <div className="sm:col-span-2 text-sm font-mono text-black">
              {invoice.amount}
            </div>
            <div className="sm:col-span-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {invoice.status}
              </span>
            </div>
            <div className="sm:col-span-2 sm:text-right">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-black transition-colors"
              >
                <DownloadIcon size={14} />
                <span className="underline underline-offset-2">PDF</span>
              </button>
            </div>
          </div>
        ))}
      </BentoCard>
    </div>
  );
}
