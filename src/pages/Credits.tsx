import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CountUp } from '../components/motion/CountUp';
import {
  CoinsIcon,
  ExternalLinkIcon,
  PlusIcon,
  Share2Icon,
  SearchIcon,
  CpuIcon,
  SparklesIcon,
  FileTextIcon,
  CheckCircle2Icon,
  CheckIcon } from
'lucide-react';
const packages = [
{
  id: '100',
  credits: 100,
  price: 9,
  perCredit: 0.09,
  popular: false
},
{
  id: '500',
  credits: 500,
  price: 39,
  perCredit: 0.078,
  popular: true
},
{
  id: '2000',
  credits: 2000,
  price: 129,
  perCredit: 0.0645,
  popular: false
}];

const CUSTOM_RATE = 0.08; // $0.08 per credit
const usage = [
{
  icon: Share2Icon,
  title: 'Manager dispatch',
  description: 'Spinning up a swarm and assigning agent roles.',
  cost: '~1 credit',
  unit: 'PER SWARM'
},
{
  icon: SearchIcon,
  title: 'Web search & scraping',
  description: 'Each query the swarm runs against the live web.',
  cost: '1 credit',
  unit: 'PER QUERY'
},
{
  icon: CpuIcon,
  title: 'Agent debate',
  description: 'Each worker agent running two rounds of argument.',
  cost: '1 credit',
  unit: 'PER AGENT'
},
{
  icon: SparklesIcon,
  title: 'Consensus arbitration',
  description: 'Manager weighing arguments and ranking dissent.',
  cost: '~2 credits',
  unit: 'PER SWARM'
},
{
  icon: FileTextIcon,
  title: 'Report synthesis',
  description: 'Final brief, recommendation, and source citation map.',
  cost: 'varies',
  unit: 'PER SWARM'
}];

const initialRecentUsage = [
  {
    id: 'SH-992-02',
    title: 'Should we acquire Northwind Robotics at the $480M valuation?',
    agents: 1000,
    credits: 42,
    status: 'complete',
  },
  {
    id: 'SH-881-14',
    title:
      'Should we raise a Series A now or extend runway 9 months and chase $4M ARR first?',
    agents: 500,
    credits: 30,
    status: 'complete',
  },
];

export function Credits() {
  const [balance, setBalance] = useState(248);
  const [customDollars, setCustomDollars] = useState('');
  const [toast, setToast] = useState<{
    msg: string;
    key: number;
  } | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const dollarsNum = parseFloat(customDollars);
  const calculatedCredits =
  !isNaN(dollarsNum) && dollarsNum > 0 ?
  Math.floor(dollarsNum / CUSTOM_RATE) :
  0;
  const flashToast = (msg: string) => {
    setToast({
      msg,
      key: Date.now()
    });
    setTimeout(() => setToast(null), 2200);
  };
  const purchasePackage = (pkg: (typeof packages)[number]) => {
    setPendingId(pkg.id);
    setTimeout(() => {
      setBalance((b) => b + pkg.credits);
      setPendingId(null);
      flashToast(`+${pkg.credits.toLocaleString()} credits added to balance`);
    }, 500);
  };
  const purchaseCustom = () => {
    if (calculatedCredits <= 0) return;
    setPendingId('custom');
    setTimeout(() => {
      setBalance((b) => b + calculatedCredits);
      setPendingId(null);
      setCustomDollars('');
      flashToast(
        `+${calculatedCredits.toLocaleString()} credits added to balance`
      );
    }, 500);
  };
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 pb-16 max-w-6xl mx-auto relative">
      {/* Toast */}
      <AnimatePresence>
        {toast &&
        <motion.div
          key={toast.key}
          initial={{
            opacity: 0,
            y: -16
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: -16
          }}
          transition={{
            duration: 0.3
          }}
          className="fixed top-6 right-6 z-50 inline-flex items-center gap-2 bg-black text-white rounded-full pl-3 pr-4 py-2 shadow-lg">
          
            <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
              <CheckIcon size={12} strokeWidth={3} />
            </span>
            <span className="text-sm font-medium">{toast.msg}</span>
          </motion.div>
        }
      </AnimatePresence>

      {/* Breadcrumb */}
      <div className="font-mono text-xs font-semibold uppercase text-gray-500 tracking-widest mb-3">
        CONSOLE <span className="text-gray-300 mx-1">/</span> CREDITS
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tighter leading-tight mb-2">
            Credits
          </h1>
          <p className="text-gray-600 max-w-2xl leading-relaxed">
            Credits are the universal unit of compute. Daily swarm runs are free
            — bonus credits unlock deeper agent debate and longer swarms.
          </p>
        </div>
        <Link
          to="/pricing"
          className="inline-flex items-center gap-1.5 bg-white border border-gray-200/60 rounded-lg px-4 py-2 text-sm font-medium text-black hover:bg-gray-50 transition-colors self-start whitespace-nowrap shadow-bento">
          
          See plans <ExternalLinkIcon size={12} />
        </Link>
      </div>

      {/* Balance + usage cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
        <div className="lg:col-span-2 rounded-2xl p-7 bg-gradient-to-br from-orange-100 to-orange-50 border border-orange-200">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-axiom mb-5">
            <CoinsIcon size={12} />
            Current Balance
          </div>
          <div className="flex items-baseline gap-2 mb-5">
            <span className="text-6xl font-bold text-black tracking-tighter leading-none">
              <CountUp key={balance} value={balance} duration={0.8} />
            </span>
            <span className="text-lg text-gray-700">credits</span>
          </div>
          <p className="font-mono text-xs text-gray-700 tracking-wide">
            Active on <span className="font-bold">Starter</span> plan · 5 free
            swarms daily
          </p>
        </div>

        <div className="rounded-2xl p-6 bg-white border border-gray-200/60 shadow-bento">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3">
            Daily Free Runs
          </div>
          <div className="text-4xl font-bold text-black tracking-tighter leading-none mb-2">
            5
            <span className="text-lg text-gray-500 ml-1 font-normal">
              / day
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-6">resets every 24h</p>

          <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">
            On Plan
          </div>
          <p className="text-sm text-black font-semibold">
            Starter — <span className="font-mono">$20/mo</span>
          </p>
          <Link
            to="/app/settings"
            className="inline-flex items-center gap-1 mt-2 text-sm text-axiom hover:underline">
            
            Upgrade plan <ExternalLinkIcon size={11} />
          </Link>
        </div>
      </div>

      {/* Buy credits */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-black tracking-tight mb-1">
          Buy credits
        </h2>
        <p className="text-gray-600 mb-6">
          Top up instantly. Credits never expire.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {packages.map((pkg) => {
            const isPending = pendingId === pkg.id;
            return (
              <motion.div
                key={pkg.id}
                whileHover={{
                  y: -3
                }}
                transition={{
                  duration: 0.2
                }}
                className={`relative rounded-2xl p-5 bg-white transition-all shadow-bento hover:shadow-bento-hover ${pkg.popular ? 'border-2 border-axiom' : 'border border-gray-200/60'}`}>
                
                {pkg.popular &&
                <div className="absolute -top-3 left-5">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-white bg-axiom px-2 py-1 rounded">
                      Most Popular
                    </span>
                  </div>
                }
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-3xl font-bold text-black tracking-tighter">
                    {pkg.credits.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">credits</span>
                </div>
                <p className="text-sm text-gray-600 mb-5">
                  ${pkg.price} <span className="text-gray-400">·</span> $
                  {pkg.perCredit.toFixed(3)} per credit
                </p>
                <button
                  type="button"
                  onClick={() => purchasePackage(pkg)}
                  disabled={isPending}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-black text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60">
                  
                  {isPending ?
                  <>Adding…</> :

                  <>
                      <PlusIcon size={14} />
                      Add {pkg.credits.toLocaleString()}
                    </>
                  }
                </button>
              </motion.div>);

          })}
        </div>

        {/* Custom amount */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-bento">
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              Custom Amount
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
              Rate · ${CUSTOM_RATE.toFixed(2)}/credit
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                $
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={customDollars}
                onChange={(e) => setCustomDollars(e.target.value)}
                placeholder="Enter dollar amount — e.g. 60"
                className="w-full bg-white pl-7 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors" />
              
            </div>
            <button
              type="button"
              onClick={purchaseCustom}
              disabled={calculatedCredits <= 0 || pendingId === 'custom'}
              className="inline-flex items-center justify-center gap-1.5 bg-axiom text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap">
              
              {pendingId === 'custom' ?
              <>Adding…</> :

              <>
                  <PlusIcon size={14} />
                  Add to balance
                </>
              }
            </button>
          </div>

          <div
            className={`mt-4 rounded-lg px-4 py-3 transition-colors ${calculatedCredits > 0 ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50 border border-gray-100'}`}>
            
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                You get
              </span>
              <span className="flex items-baseline gap-1.5">
                <span
                  className={`text-2xl font-bold tracking-tighter ${calculatedCredits > 0 ? 'text-axiom' : 'text-gray-300'}`}>
                  
                  {calculatedCredits.toLocaleString()}
                </span>
                <span
                  className={`text-sm ${calculatedCredits > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                  
                  credits
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How credits are used */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-black tracking-tight mb-1">
          How credits are used
        </h2>
        <p className="text-gray-600 mb-6">
          Every swarm draws from your balance across these line items.
        </p>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {usage.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-center gap-4 px-5 py-4 ${idx !== usage.length - 1 ? 'border-b border-gray-100' : ''}`}>
                
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-axiom" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-black tracking-tight">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-semibold text-black">
                    {item.cost}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">
                    {item.unit}
                  </div>
                </div>
              </div>);

          })}
        </div>
      </section>

      {/* Recent usage */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-black tracking-tight mb-1">
          Recent usage
        </h2>
        <p className="text-gray-600 mb-6">
          Credit draws from your most recent swarms.
        </p>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {initialRecentUsage.map((item, idx) =>
          <Link
            key={item.id}
            to="/app/report"
            className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${idx !== initialRecentUsage.length - 1 ? 'border-b border-gray-100' : ''}`}>
            
              <CheckCircle2Icon
              size={18}
              className="text-axiom flex-shrink-0" />
            
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-black tracking-tight mb-1">
                  {item.title}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  {item.id} · {item.agents} agents · {item.status}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-semibold text-axiom">
                  −{item.credits}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">
                  credits
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>
    </div>);

}