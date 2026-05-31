import React from 'react';
import { Link } from 'react-router-dom';

interface AuthPageLayoutProps {
  title: string;
  subtitle: string;
  alternatePrompt: string;
  alternateLabel: string;
  alternateTo: string;
  children: React.ReactNode;
}

export function AuthPageLayout({
  title,
  subtitle,
  alternatePrompt,
  alternateLabel,
  alternateTo,
  children,
}: AuthPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-60 -right-40 h-[700px] w-[700px] rounded-full bg-orange-500/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-60 -left-40 h-[700px] w-[700px] rounded-full bg-orange-500/5 blur-3xl"
        aria-hidden
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-axiom text-sm font-bold text-white">
            S
          </span>
          <span className="text-base font-bold tracking-tight text-black">Shoal AI</span>
        </Link>
        <Link
          to={alternateTo}
          className="text-sm text-gray-600 transition-colors hover:text-black"
        >
          {alternatePrompt}{' '}
          <span className="font-semibold text-black">{alternateLabel}</span>
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 text-center">
            <h1 className="mb-2.5 text-3xl font-bold leading-tight tracking-tighter text-black md:text-4xl">
              {title}
            </h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-1 shadow-bento">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
