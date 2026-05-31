import React from 'react';
import { motion } from 'framer-motion';
import {
  SlackIcon,
  GithubIcon,
  FileTextIcon,
  DatabaseIcon,
  ShieldCheckIcon,
  LockIcon,
  EyeOffIcon,
  ArrowRightIcon } from
'lucide-react';
import { Kicker } from '../components/Kicker';
import { Button } from '../components/Button';
import { FadeIn, Stagger, StaggerItem } from '../components/FadeIn';
const features = [
{
  number: '01',
  title: 'Multi-Model Friction',
  text: 'Deploy GPT-class, Claude-class and open-weight agents in the same swarm. No single point of failure. No echo chamber.'
},
{
  number: '02',
  title: 'Weighted Consensus',
  text: 'Not every vote is equal. Domain experts carry weight. Skeptics provide friction. The math decides — not popularity.'
},
{
  number: '03',
  title: 'Minority Dissent',
  text: "Consensus isn't unanimity. Every report preserves the strongest counter-arguments so you see the full risk surface."
}];

const architecture = [
{
  number: '01',
  title: 'Persona Injection',
  text: 'Define who debates your decision. Each persona carries its own constraints, expertise and biases — just like a real boardroom.',
  tags: [
  'Budget',
  'Risk',
  'Expertise',
  'Demographic',
  'Bias',
  'Time horizon']

},
{
  number: '02',
  title: 'The Adversarial Sandbox',
  text: 'Agents debate in rounds. They cite sources, challenge premises, and stress-test each other. Weak arguments collapse. Strong ones reinforce.',
  tags: [
  'Live web research',
  'Cross-citation',
  'Skeptic vs Expert',
  'Evidence-or-discard']

},
{
  number: '03',
  title: 'Manager Synthesis',
  text: 'A specialized Manager weighs every argument, calculates consensus strength, preserves dissent, and ships a defensible verdict.',
  tags: [
  'Recommended action',
  'Confidence %',
  'Live citations',
  'Minority dissent']

}];

const integrations = [
{
  name: 'Slack',
  icon: SlackIcon,
  accent: 'text-[#4A154B]',
  bg: 'bg-[#4A154B]/5',
  border: 'border-[#4A154B]/15',
  description: 'Trigger swarms with @shoal and receive verdicts in-channel.'
},
{
  name: 'Notion',
  icon: FileTextIcon,
  accent: 'text-black',
  bg: 'bg-zinc-50',
  border: 'border-zinc-200',
  description: 'Auto-export synthesis reports straight into your docs.'
},
{
  name: 'GitHub',
  icon: GithubIcon,
  accent: 'text-black',
  bg: 'bg-zinc-50',
  border: 'border-zinc-200',
  description: 'Analyze PRs, repos, and codebase architecture.'
},
{
  name: 'Salesforce',
  icon: DatabaseIcon,
  accent: 'text-[#00A1E0]',
  bg: 'bg-[#00A1E0]/5',
  border: 'border-[#00A1E0]/20',
  description: 'Cross-reference CRM data inside every swarm.'
}];

const security = [
{
  icon: EyeOffIcon,
  title: 'Zero Training',
  body: 'We never train our foundational models on your proprietary prompts, data rooms, or debate transcripts.'
},
{
  icon: ShieldCheckIcon,
  title: 'SOC 2 Type II',
  body: 'Fully compliant infrastructure with end-to-end AES-256 encryption at rest and in transit.'
},
{
  icon: LockIcon,
  title: 'Ephemeral Compute',
  body: 'Swarm instances are destroyed the moment consensus is reached and the report is generated.'
}];

export function Product() {
  return (
    <div>
      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-12 md:pb-16 text-center overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-orange-500/8 blur-3xl -z-0" />
        <div className="relative z-10">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1]
            }}>
            
            <Kicker className="mb-8">The Product</Kicker>
          </motion.div>
          <motion.h1
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-black tracking-tighter mb-8 leading-[1.05]">
            
            One engine.
            <br />
            Every decision.
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            
            Shoal AI is a Consensus Engine. Deploy swarms of AI agents that
            debate, cite sources, and converge on the mathematically strongest
            answer — from product strategy to investment theses.
          </motion.p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) =>
          <StaggerItem key={feature.number}>
              <motion.div
              whileHover={{
                y: -4
              }}
              transition={{
                duration: 0.2
              }}
              className="h-full bg-white border border-gray-200/60 rounded-2xl p-6 md:p-8 shadow-bento hover:shadow-bento-hover transition-shadow duration-200">
              
                <div className="flex items-start justify-between mb-6">
                  <div className="font-mono text-xs font-semibold text-axiom tracking-widest">
                    / {feature.number}
                  </div>
                  <div className="w-9 h-9 bg-black rounded-md flex items-center justify-center">
                    <span className="font-mono text-[10px] font-bold text-white tracking-wider">
                      SH
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-black tracking-tight mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.text}</p>
              </motion.div>
            </StaggerItem>
          )}
        </Stagger>
      </section>

      {/* Architecture */}
      <section className="bg-white/80 backdrop-blur-sm border-y border-gray-200/60 py-16 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn className="text-center mb-16 max-w-3xl mx-auto">
            <Kicker className="mb-6">Architecture</Kicker>
            <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tighter mb-6 leading-tight">
              How a swarm reaches truth.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Three stages turn an open question into a defensible decision.
            </p>
          </FadeIn>

          <Stagger className="space-y-6">
            {architecture.map((step) =>
            <StaggerItem key={step.number}>
                <div className="bg-white border border-gray-200/60 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 shadow-bento">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
                    <div className="md:col-span-2">
                      <div className="text-6xl md:text-7xl font-bold text-gray-200 tracking-tighter leading-none">
                        {step.number}
                      </div>
                    </div>
                    <div className="md:col-span-10">
                      <h3 className="text-2xl md:text-3xl font-bold text-black tracking-tight mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {step.text}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {step.tags.map((tag) =>
                      <span
                        key={tag}
                        className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-700">
                        
                            {tag}
                          </span>
                      )}
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            )}
          </Stagger>
        </div>
      </section>

      {/* Integrations — NEW */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <FadeIn className="text-center max-w-3xl mx-auto mb-14">
          <Kicker className="mb-6">Ecosystem</Kicker>
          <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tighter mb-6 leading-tight">
            Works where you work.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Shoal AI doesn't require a new workflow. It plugs directly into the
            tools your enterprise already relies on.
          </p>
        </FadeIn>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {integrations.map((i) => {
            const Icon = i.icon;
            return (
              <StaggerItem key={i.name}>
                <motion.div
                  whileHover={{
                    y: -4
                  }}
                  transition={{
                    duration: 0.2
                  }}
                  className={`group h-full ${i.bg} border ${i.border} rounded-2xl p-6 shadow-bento hover:shadow-bento-hover transition-shadow duration-200 flex flex-col`}>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-11 h-11 bg-white border border-gray-200/60 rounded-xl flex items-center justify-center shadow-sm">
                      <Icon size={20} className={i.accent} />
                    </div>
                    <ArrowRightIcon
                      size={14}
                      className="text-gray-400 group-hover:text-axiom transition-colors" />
                    
                  </div>
                  <h3 className="text-lg font-bold text-black tracking-tight mb-2">
                    {i.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {i.description}
                  </p>
                </motion.div>
              </StaggerItem>);

          })}
        </Stagger>

        <FadeIn className="text-center mt-10">
          <p className="font-mono text-[11px] uppercase tracking-widest text-gray-500">
            + Zapier, Linear, Google Drive, Snowflake, and 30 more
          </p>
        </FadeIn>
      </section>

      {/* Bank-Grade Security — NEW */}
      <section className="bg-white/80 backdrop-blur-sm border-y border-gray-200/60 py-16 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center max-w-3xl mx-auto mb-14">
            <Kicker className="mb-6">Enterprise Security</Kicker>
            <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tighter mb-6 leading-tight">
              Your data is your data. Period.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Built from day one for legal, financial, and healthcare teams who
              cannot risk a single byte of leakage.
            </p>
          </FadeIn>

          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {security.map((s) => {
              const Icon = s.icon;
              return (
                <StaggerItem key={s.title}>
                  <motion.div
                    whileHover={{
                      y: -4
                    }}
                    transition={{
                      duration: 0.2
                    }}
                    className="h-full bg-[#FAFAFA] border border-gray-200/60 rounded-2xl p-6 md:p-7 shadow-bento">
                    
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-axiom inline-flex items-center justify-center mb-5">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-xl font-bold text-black tracking-tight mb-2">
                      {s.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{s.body}</p>
                  </motion.div>
                </StaggerItem>);

            })}
          </Stagger>

          <FadeIn className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
            'SOC 2 Type II',
            'GDPR',
            'HIPAA-ready',
            'AES-256',
            'SSO / SAML'].
            map((t) =>
            <span
              key={t}
              className="font-mono text-[11px] uppercase tracking-widest text-gray-500">
              
                {t}
              </span>
            )}
          </FadeIn>
        </div>
      </section>

      {/* Bottom CTA */}
      <FadeIn
        as="section"
        className="max-w-3xl mx-auto px-6 py-24 md:py-32 text-center">
        
        <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tighter mb-6 leading-tight">
          See the engine in motion.
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          Deploy your first swarm in under sixty seconds. Free tier, no card
          required.
        </p>
        <Button variant="primary" href="/sign-up">
          Get Started
        </Button>
      </FadeIn>
    </div>);

}