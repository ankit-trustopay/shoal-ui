import React from 'react';
import { Kicker } from '../components/Kicker';
import { Button } from '../components/Button';
import { FadeIn } from '../components/FadeIn';
import { HeroSection } from '../components/home/HeroSection';
import { ConsoleMockup } from '../components/home/ConsoleMockup';
import { ArchetypeGrid } from '../components/home/ArchetypeGrid';
import { EnterpriseImpactSection } from '../components/home/EnterpriseImpactSection';
import { ComparisonGrid } from '../components/home/ComparisonGrid';
import { partners } from '../data/home';

export function Home() {
  return (
    <div>
      <HeroSection />
      <ConsoleMockup />
      <ArchetypeGrid />
      <EnterpriseImpactSection />

      <FadeIn as="section" className="border-y border-gray-200 bg-white py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <Kicker variant="gray">Trusted by operators at</Kicker>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4">
            {partners.map((partner) => (
              <div
                key={partner}
                className="text-xs sm:text-sm font-bold text-gray-400 tracking-[0.2em]"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <ComparisonGrid />

      <FadeIn
        as="section"
        className="max-w-4xl mx-auto px-4 sm:px-6 py-20 md:py-32 text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-black tracking-tighter mb-6 leading-[1.1]">
          Make your next decision
          <br />
          your best decision.
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Deploy your first swarm in under sixty seconds. Free tier, no card
          required.
        </p>
        <Button variant="primary" href="/sign-up">
          Get Started
        </Button>
      </FadeIn>
    </div>
  );
}
