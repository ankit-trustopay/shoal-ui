import React, { useCallback, useEffect, useState, useRef, type ComponentType } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowUpIcon,
  ChevronDownIcon,
  CheckIcon,
  LockIcon,
  PaperclipIcon,
  LinkIcon,
  XIcon,
} from 'lucide-react';
import { SwarmIgnitionProgress } from '../components/swarm/live-console/SwarmIgnitionProgress';
import { createSwarm } from '../lib/api';
import { useUserAccount } from '../hooks/useUserAccount';
import {
  saasPlans,
  type SaasPlanId,
} from '../data/creditsBilling';

type CreditModelTier = 'lite' | 'plus';

const CREDIT_MODEL_OPTIONS: Array<{
  id: CreditModelTier;
  label: string;
  creditsPerAgent: number;
}> = [
  { id: 'lite', label: '🧠 Lite Model (1 cr/agent)', creditsPerAgent: 1 },
  { id: 'plus', label: '🧠 Plus Model (5 cr/agent)', creditsPerAgent: 5 },
];

const examplePrompts = [
  'Should we raise a Series A now or extend runway 9 months and chase $4M ARR first?',
  'Will the EU AI Act force us to relocate model training out of the EU?',
  'Is launching a free tier the right move against our 3 paid competitors?',
  'Which of these 4 candidates should we hire as our first Head of Eng?',
];

interface Plan {
  id: SaasPlanId;
  name: string;
  category: string;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
  description: string;
  meta: string;
  requiredPlan: SaasPlanId;
}

const plans: Plan[] = saasPlans.map((tier) => ({
  id: tier.id,
  name: tier.name,
  category:
    tier.id === 'free'
      ? 'FREE SWARM'
      : tier.id === 'max'
        ? 'MAX SWARM'
        : `${tier.name.toUpperCase()} SWARM`,
  icon: tier.icon,
  description: `Up to ${tier.maxAgentsPerTask.toLocaleString()} agents · ${tier.creditAllowance}`,
  meta:
    tier.id === 'free'
      ? 'Included on Free Plan'
      : `Requires ${tier.name} plan or higher`,
  requiredPlan: tier.id,
}));

const planRank: Record<SaasPlanId, number> = {
  free: 0,
  pro: 1,
  max: 2,
};

const PLAN_AGENT_MAX = Object.fromEntries(
  saasPlans.map((tier) => [tier.id, tier.maxAgentsPerTask]),
) as Record<SaasPlanId, number>;

const PLAN_AGENT_DEFAULT: Record<SaasPlanId, number> = {
  free: 25,
  pro: 200,
  max: 1000,
};

function isAccessible(p: Plan, userPlanId: SaasPlanId) {
  return planRank[p.requiredPlan] <= planRank[userPlanId];
}
function truncate(text: string, max = 70) {
  return text.length > max ? text.slice(0, max).trimEnd() + '...' : text;
}
export function NewSwarm() {
  const navigate = useNavigate();
  const { credits, planId: userPlanId, refresh } = useUserAccount();
  const [searchParams] = useSearchParams();
  const [prompt, setPrompt] = useState('');
  const [planId, setPlanId] = useState<Plan['id']>('free');
  const [agentCount, setAgentCount] = useState(PLAN_AGENT_DEFAULT.free);
  const [modelTier, setModelTier] = useState<CreditModelTier>('lite');
  const [modelOpen, setModelOpen] = useState(false);
  const modelRef = useRef<HTMLDivElement>(null);
  const [isIgniting, setIsIgniting] = useState(false);
  const [igniteError, setIgniteError] = useState<string | null>(null);
  const [planOpen, setPlanOpen] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [attachedLinks, setAttachedLinks] = useState<string[]>([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [targetAudience, setTargetAudience] = useState('');
  const [pricePoint, setPricePoint] = useState('');
  const [marketingBudget, setMarketingBudget] = useState('');
  const activePlan = plans.find((p) => p.id === planId) ?? plans[0];
  const ActiveIcon = activePlan.icon;
  const activeModel =
    CREDIT_MODEL_OPTIONS.find((model) => model.id === modelTier) ??
    CREDIT_MODEL_OPTIONS[0];
  const maxAgents = PLAN_AGENT_MAX[userPlanId] ?? PLAN_AGENT_MAX.free;
  const estimatedCost = agentCount * activeModel.creditsPerAgent;
  const insufficientCredits = estimatedCost > credits;
  const canIgnite =
    prompt.trim().length > 0 && !isIgniting && !insufficientCredits;

  useEffect(() => {
    const query = searchParams.get('query');
    if (query) {
      setPrompt(query);
    }
  }, [searchParams]);

  useEffect(() => {
    setAgentCount((current) => {
      const capped = Math.min(current, maxAgents);
      const fallback = PLAN_AGENT_DEFAULT[userPlanId] ?? PLAN_AGENT_DEFAULT.free;
      return capped > 0 ? capped : fallback;
    });
  }, [maxAgents, userPlanId]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (planRef.current && !planRef.current.contains(e.target as Node)) {
        setPlanOpen(false);
      }
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
        setModelOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleIgniteSwarm = useCallback(async () => {
    const premise = prompt.trim();
    if (!premise || isIgniting || estimatedCost > credits) return;

    setIsIgniting(true);
    setIgniteError(null);

    try {
      const { swarmId } = await createSwarm({
        premise,
        agentCount,
        model: modelTier,
      });
      await refresh();
      navigate(`/app/live?swarmId=${encodeURIComponent(swarmId)}`);
    } catch (err) {
      setIgniteError(
        err instanceof Error ? err.message : 'Failed to ignite swarm'
      );
    } finally {
      setIsIgniting(false);
    }
  }, [prompt, agentCount, modelTier, credits, estimatedCost, isIgniting, navigate, refresh]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        void handleIgniteSwarm();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleIgniteSwarm]);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
    e.target.value = '';
  };
  const removeFile = (idx: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };
  const addLink = () => {
    const trimmed = linkValue.trim();
    if (!trimmed) return;
    setAttachedLinks((prev) => [...prev, trimmed]);
    setLinkValue('');
    setLinkInputOpen(false);
  };
  const removeLink = (idx: number) => {
    setAttachedLinks((prev) => prev.filter((_, i) => i !== idx));
  };
  const hasAttachments = attachedFiles.length > 0 || attachedLinks.length > 0;
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 pb-12 relative">
      {isIgniting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] px-4"
          role="presentation"
        >
          <SwarmIgnitionProgress
            variant="overlay"
            sessionCode="SWM_IGNITING"
            premise={prompt.trim() || null}
          />
        </div>
      )}

      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-3xl -z-0" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center pt-8 md:pt-16 mb-10">
          <div className="font-mono text-xs font-semibold uppercase tracking-widest text-axiom mb-6">
            Consensus Engine
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold text-black tracking-tighter leading-[1.05] mb-5">
            What should the swarm decide?
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            State your dilemma. Shoal AI will dispatch adversarial agents and
            return a defended answer.
          </p>
        </div>

        {/* Prompt composer */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label
            htmlFor="ai-model"
            className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500"
          >
            Credit model
          </label>
          <div className="relative w-full sm:w-auto" ref={modelRef}>
            <button
              id="ai-model"
              type="button"
              onClick={() => setModelOpen((open) => !open)}
              disabled={isIgniting}
              className="inline-flex w-full sm:w-auto items-center justify-between gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {activeModel.label}
              <ChevronDownIcon size={14} className="text-gray-400 shrink-0" />
            </button>
            {modelOpen && (
              <div className="global-overlay absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 w-full sm:w-72 overflow-hidden rounded-xl isolate">
                {CREDIT_MODEL_OPTIONS.map((model) => {
                  const isSelected = model.id === modelTier;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        setModelTier(model.id);
                        setModelOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                        isSelected
                          ? 'bg-orange-50 text-axiom font-semibold'
                          : 'text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate pr-3">{model.label}</span>
                      {isSelected && <CheckIcon size={14} className="text-axiom" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-bento hover:shadow-bento-hover transition-shadow duration-200">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="e.g. Should we expand into the EU market this quarter, or wait until we hit $4M ARR and have clearer regulatory footing?"
            className="w-full bg-transparent px-6 pt-5 pb-3 text-base text-black placeholder:text-gray-400 focus:outline-none resize-none leading-relaxed" />

          {/* Advanced variables */}
          <div className="px-6 pb-4 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setAdvancedOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
            >
              Advanced Variables
              <ChevronDownIcon
                size={16}
                className={`text-gray-400 transition-transform ${advancedOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {advancedOpen && (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                    Target Audience
                  </span>
                  <input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. SMB founders"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                    Price Point
                  </span>
                  <input
                    value={pricePoint}
                    onChange={(e) => setPricePoint(e.target.value)}
                    placeholder="e.g. $49/mo"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                    Marketing Budget
                  </span>
                  <input
                    value={marketingBudget}
                    onChange={(e) => setMarketingBudget(e.target.value)}
                    placeholder="e.g. $5k/mo"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Agent count */}
          <div className="px-6 pb-4 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between gap-4 mb-2">
              <label
                htmlFor="agent-count"
                className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-700">
                Agent count
              </label>
              <span className="font-mono text-sm font-semibold text-black tabular-nums">
                {agentCount.toLocaleString()}
              </span>
            </div>
            <input
              id="agent-count"
              type="range"
              min={1}
              max={maxAgents}
              step={planId === 'free' ? 1 : 10}
              value={agentCount}
              onChange={(e) => setAgentCount(Number(e.target.value))}
              disabled={isIgniting}
              className="w-full h-1.5 cursor-pointer disabled:opacity-50 accent-axiom"
            />
            <p className="mt-2 text-xs text-gray-500">
              Up to {maxAgents.toLocaleString()} agents on {activePlan.name} ·{' '}
              {credits.toLocaleString()} credits available
            </p>
            <p className="mt-2 text-xs text-gray-700">
              Running <span className="font-semibold tabular-nums">{agentCount.toLocaleString()}</span>{' '}
              agents will cost exactly{' '}
              <span className="font-semibold tabular-nums">
                {estimatedCost.toLocaleString()}
              </span>{' '}
              Credits.
            </p>
            {insufficientCredits && (
              <p className="mt-2 text-xs font-medium text-red-600">
                This swarm costs {estimatedCost.toLocaleString()} credits — you have{' '}
                {credits.toLocaleString()}.
              </p>
            )}
          </div>

          {igniteError &&
          <p className="px-6 pb-2 text-sm text-red-600" role="alert">
              {igniteError}
            </p>
          }

          {/* Attachments chips */}
          {hasAttachments &&
          <div className="px-5 pb-3 flex flex-wrap gap-2">
              {attachedFiles.map((f, idx) =>
            <span
              key={`f-${idx}`}
              className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-axiom rounded-full pl-3 pr-1.5 py-1 text-xs">
              
                  <PaperclipIcon size={11} />
                  <span className="font-medium max-w-[180px] truncate">
                    {f.name}
                  </span>
                  <button
                type="button"
                onClick={() => removeFile(idx)}
                className="ml-1 w-4 h-4 rounded-full hover:bg-orange-100 inline-flex items-center justify-center"
                aria-label="Remove file">
                
                    <XIcon size={10} />
                  </button>
                </span>
            )}
              {attachedLinks.map((l, idx) =>
            <span
              key={`l-${idx}`}
              className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-axiom rounded-full pl-3 pr-1.5 py-1 text-xs">
              
                  <LinkIcon size={11} />
                  <span className="font-medium max-w-[200px] truncate">
                    {l}
                  </span>
                  <button
                type="button"
                onClick={() => removeLink(idx)}
                className="ml-1 w-4 h-4 rounded-full hover:bg-orange-100 inline-flex items-center justify-center"
                aria-label="Remove link">
                
                    <XIcon size={10} />
                  </button>
                </span>
            )}
            </div>
          }

          {/* Inline link input */}
          {linkInputOpen &&
          <div className="px-5 pb-3">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                <LinkIcon size={13} className="text-gray-400 flex-shrink-0" />
                <input
                type="url"
                autoFocus
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addLink();
                  } else if (e.key === 'Escape') {
                    setLinkInputOpen(false);
                    setLinkValue('');
                  }
                }}
                placeholder="Paste a URL and press Enter"
                className="flex-1 bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none" />
              
                <button
                type="button"
                onClick={addLink}
                className="text-xs font-semibold text-axiom hover:underline">
                
                  Add
                </button>
                <button
                type="button"
                onClick={() => {
                  setLinkInputOpen(false);
                  setLinkValue('');
                }}
                className="w-5 h-5 rounded hover:bg-gray-200 inline-flex items-center justify-center"
                aria-label="Close">
                
                  <XIcon size={11} className="text-gray-500" />
                </button>
              </div>
            </div>
          }

          {/* Toolbar */}
          <div className="flex flex-col gap-3 px-4 pb-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.md,.csv,.xlsx,.png,.jpg,.jpeg" />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:text-black hover:bg-gray-100 transition-colors">
                
                <PaperclipIcon size={14} />
                Attach file
              </button>
              <button
                type="button"
                onClick={() => setLinkInputOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:text-black hover:bg-gray-100 transition-colors">
                
                <LinkIcon size={14} />
                Attach link
              </button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto" ref={planRef}>
                <button
                  type="button"
                  onClick={() => setPlanOpen((v) => !v)}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                  
                  <ActiveIcon size={13} className="text-axiom" />
                  {activePlan.name}
                  <ChevronDownIcon size={13} className="text-gray-400" />
                </button>

                {planOpen &&
                <div className="global-overlay absolute bottom-full right-0 mb-2 w-80 overflow-hidden rounded-xl isolate">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                        Swarm Tier
                      </span>
                    </div>

                    <div className="py-1 max-h-[420px] overflow-y-auto">
                      {plans.map((plan) => {
                      const Icon = plan.icon;
                      const isSelected = plan.id === planId;
                      const accessible = isAccessible(plan, userPlanId);
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          disabled={!accessible}
                          onClick={() => {
                            if (!accessible) return;
                            setPlanId(plan.id);
                            setAgentCount(PLAN_AGENT_DEFAULT[plan.id]);
                            setPlanOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${isSelected ? 'bg-orange-50' : accessible ? 'hover:bg-gray-50' : 'opacity-60 cursor-not-allowed'}`}>
                          
                            <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-axiom text-white' : accessible ? 'bg-gray-100 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                            
                              <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-sm font-bold text-black">
                                  {plan.name}
                                </span>
                                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                                  {plan.category}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 leading-snug">
                                {plan.description}
                              </p>
                              <p className="font-mono text-[10px] text-gray-500 tracking-wide mt-1">
                                {plan.meta}
                              </p>
                            </div>
                            {isSelected ?
                          <CheckIcon
                            size={14}
                            className="text-axiom flex-shrink-0 mt-1" /> :

                          !accessible ?
                          <LockIcon
                            size={13}
                            className="text-gray-400 flex-shrink-0 mt-1" /> :

                          null}
                          </button>);

                    })}
                    </div>

                    <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
                      <a
                      href="/pricing"
                      className="text-sm text-axiom font-medium hover:underline inline-flex items-center gap-1">
                      
                        Compare plans →
                      </a>
                      <a
                      href="/app/settings"
                      className="text-xs text-gray-500 hover:text-black">
                      
                        Upgrade
                      </a>
                    </div>
                  </div>
                }
              </div>

              <button
                type="button"
                onClick={() => void handleIgniteSwarm()}
                disabled={!canIgnite}
                className={`inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${
                  insufficientCredits
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-axiom text-white hover:bg-orange-600'
                } ${!canIgnite ? 'opacity-60' : ''}`}
              >
                {isIgniting
                  ? 'Igniting...'
                  : insufficientCredits
                    ? 'Insufficient Credits - Top Up'
                    : 'Ignite Swarm'}
                {!isIgniting && !insufficientCredits && <ArrowUpIcon size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="mt-12 text-center">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500 mb-5">
            Or try one of these
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {examplePrompts.map((p) =>
            <button
              key={p}
              type="button"
              onClick={() => setPrompt(p)}
              className="text-left text-sm text-black bg-white border border-gray-200 rounded-full px-5 py-2.5 hover:border-gray-400 hover:bg-gray-50 transition-colors truncate"
              title={p}>
              
                {truncate(p)}
              </button>
            )}
          </div>
        </div>

        <p className="text-center mt-10 text-xs text-gray-500 font-mono tracking-wide">
          ⌘ + Enter to ignite. Swarm size and cost auto-scale with task
          complexity.
        </p>
      </div>
    </div>);

}