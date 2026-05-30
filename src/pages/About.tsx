import React from 'react';
import { Button } from '../components/Button';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { BentoCard } from '../components/ui/BentoCard';
import { MonoLabel } from '../components/ui/MonoLabel';
import { headingCard, bodyDefault } from '../lib/typography';
import { cn } from '../lib/cn';

const values = [
  {
    id: 'val-01',
    number: '01',
    title: 'Verifiable',
    text: "Every verdict ships with the transcript. No black box. No 'trust us'.",
  },
  {
    id: 'val-02',
    number: '02',
    title: 'Adversarial',
    text: 'The strongest disagreement is feature, not bug. We surface it.',
  },
  {
    id: 'val-03',
    number: '03',
    title: 'Economical',
    text: 'Frontier-model intelligence at open-weight prices. Truth, made affordable.',
  },
];

export function About() {
  return (
    <div>
      <PageHero
        kicker="Our Mission"
        title={
          <>
            The era of the
            <br />
            &quot;Yes-Man&quot; AI is over.
          </>
        }
        description="We built Shoal AI because the internet stopped giving us the truth."
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 md:pb-20">
        <div className={cn(bodyDefault, 'space-y-6 text-lg')}>
          <p>
            For two decades, search engines have ranked information based on ad
            dollars and SEO — not reality. Recently, generative AI promised to
            fix this, but introduced a new problem: a single-model AI is
            programmed to be polite. It guesses, it hallucinates, and it tells
            you what you want to hear.
          </p>
          <p>
            We are a team of engineers, behavioral psychologists and data
            scientists who realized that the only way to make a machine
            understand the real world is to make it argue like the real world.
            By combining multi-agent orchestration with human psychology, we are
            building the final layer between humans and the digital world.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-24">
        <SectionHeading
          align="center"
          title={
            <>
              Welcome to the post-search internet.
              <br />
              Welcome to Shoal AI.
            </>
          }
          className="mb-12"
        />

        <div className="space-y-4 md:space-y-5">
          {values.map((value) => (
            <BentoCard
              key={value.id}
              hover
              padding="lg"
              size="lg"
              className="rounded-2xl md:rounded-3xl"
            >
              <MonoLabel variant="accent" className="mb-4 block">
                / {value.number}
              </MonoLabel>
              <h3 className={cn(headingCard, 'text-2xl md:text-3xl mb-3')}>
                {value.title}
              </h3>
              <p className={cn(bodyDefault, 'text-lg')}>{value.text}</p>
            </BentoCard>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 md:py-32 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black tracking-tighter mb-6 leading-tight">
          Run your first debate.
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
          See what a synthetic society does to a question you actually care about.
        </p>
        <Button variant="primary" href="/signup">
          Get Started
        </Button>
      </section>
    </div>
  );
}
