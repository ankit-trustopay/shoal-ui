import React from 'react';
import type { SwarmMessageRecord } from '../../../lib/api';
import {
  type DebateTranscriptEntry,
  getAgentAvatarClasses,
  getAgentInitials,
} from '../../../lib/debateTranscript';

interface DebateTabProps {
  messages: SwarmMessageRecord[];
  transcript: DebateTranscriptEntry[];
}

function DebateEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 py-16 text-center">
      <p className="text-sm font-medium text-gray-600">
        No agent arguments yet. The swarm is still deliberating.
      </p>
      <p className="mt-2 text-xs text-gray-500">
        Live debate turns will appear here as agents respond.
      </p>
    </div>
  );
}

function DebateChatTimeline({ transcript }: { transcript: DebateTranscriptEntry[] }) {
  return (
    <div
      className="relative pt-2"
      role="log"
      aria-label="Swarm debate transcript"
    >
      <div className="pointer-events-none absolute left-5 top-4 bottom-4 w-px bg-gradient-to-b from-gray-200 via-gray-200/80 to-transparent sm:left-6" />

      <ul className="flex flex-col gap-6">
        {transcript.map((entry, index) => {
          const initials = getAgentInitials(entry.agentName);
          const avatarClasses = getAgentAvatarClasses(entry.agentName);
          const sequence = String(index + 1).padStart(2, '0');

          return (
            <li key={`${entry.timestamp}-${entry.agentName}-${index}`}>
              <article className="flex gap-4 sm:gap-5">
                <div
                  className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold tracking-tight shadow-sm ring-2 ${avatarClasses}`}
                  aria-hidden
                >
                  {initials}
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <header className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                      {entry.agentName}
                    </h3>
                    <span
                      className="inline-flex max-w-full items-center rounded-md border border-gray-200/80 bg-gray-100/80 px-2 py-0.5 text-[11px] font-medium text-gray-600"
                      title={entry.role}
                    >
                      {entry.role}
                    </span>
                  </header>

                  <div className="rounded-2xl border border-gray-200/70 bg-white px-4 py-3.5 shadow-sm sm:px-5 sm:py-4">
                    <p className="text-[15px] leading-relaxed text-gray-800 sm:text-base">
                      {entry.text}
                    </p>
                    <footer className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-gray-100 pt-2.5">
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                        {entry.timestamp}
                      </span>
                      <span className="text-gray-300" aria-hidden>
                        ·
                      </span>
                      <span className="font-mono text-[10px] font-medium text-gray-400">
                        Turn {sequence}
                      </span>
                    </footer>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DebateLegacyCards({ messages }: { messages: SwarmMessageRecord[] }) {
  return (
    <ul className="flex flex-col gap-4 pt-2">
      {messages.map((message, index) => (
        <li
          key={message.id}
          className="rounded-xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-sm font-bold text-orange-600">{message.role}</span>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Agent {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
            {message.text}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function DebateTab({ messages, transcript }: DebateTabProps) {
  const hasTranscript = transcript.length > 0;

  if (!hasTranscript && messages.length === 0) {
    return <DebateEmptyState />;
  }

  if (hasTranscript) {
    return <DebateChatTimeline transcript={transcript} />;
  }

  return <DebateLegacyCards messages={messages} />;
}
