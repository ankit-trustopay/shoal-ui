import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import { Kicker } from '../components/Kicker';
import { Button } from '../components/Button';
import { useCaseFilters, useCases } from '../data/useCases';

export function UseCases() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(useCases[0].id);

  const visible = useMemo(
    () =>
      useCases.filter((uc) => {
        const matchesFilter =
          activeFilter === 'all' || uc.filter === activeFilter;
        const matchesQuery =
          query.trim() === '' ||
          uc.title.toLowerCase().includes(query.toLowerCase()) ||
          uc.description.toLowerCase().includes(query.toLowerCase());
        return matchesFilter && matchesQuery;
      }),
    [activeFilter, query],
  );

  const selected =
    visible.find((uc) => uc.id === selectedId) ?? visible[0] ?? null;

  useEffect(() => {
    if (visible.length === 0) return;
    if (!visible.some((uc) => uc.id === selectedId)) {
      setSelectedId(visible[0].id);
    }
  }, [visible, selectedId]);

  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-12 text-center">
        <Kicker className="mb-8">Use Cases · Shoal AI</Kicker>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black tracking-tighter mb-8 leading-[1.05]">
          Possibilities are endless.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Select a scenario on the left. Every run deploys a synthetic society
          that debates until Shoal AI produces a citable consensus — with
          minority friction preserved.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-24">
        <div className="mb-6 relative max-w-md">
          <SearchIcon
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Shoal AI use cases..."
            className="w-full bg-white pl-12 pr-4 py-3 border border-gray-200/60 rounded-xl text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors shadow-bento"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-[520px]">
          <aside className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2 lg:hidden">
              {useCaseFilters.map((filter) => {
                const isActive = activeFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white border-axiom text-axiom'
                        : 'bg-white border-gray-200/60 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {filter.label}
                    <span
                      className={`ml-1.5 font-mono ${isActive ? 'text-axiom' : 'text-gray-400'}`}
                    >
                      {filter.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="bg-white border border-gray-200/60 rounded-2xl shadow-bento overflow-hidden flex flex-col max-h-[70vh] lg:max-h-[640px]">
              <div className="hidden lg:block border-b border-gray-100 p-3 space-y-1">
                {useCaseFilters.map((filter) => {
                  const isActive = activeFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveFilter(filter.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                        isActive
                          ? 'bg-orange-50 text-axiom font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{filter.label}</span>
                      <span className="font-mono text-xs opacity-70">
                        {filter.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 lg:border-t-0 flex-1 overflow-y-auto p-2">
                {visible.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8 px-4">
                    No use cases match your search.
                  </p>
                ) : (
                  visible.map((uc) => {
                    const isSelected = selected?.id === uc.id;
                    return (
                      <button
                        key={uc.id}
                        type="button"
                        onClick={() => setSelectedId(uc.id)}
                        className={`w-full text-left rounded-xl px-4 py-3 mb-1 transition-all ${
                          isSelected
                            ? 'bg-black text-white shadow-md'
                            : 'text-black hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className={`font-mono text-[10px] tracking-widest mb-1 ${
                            isSelected ? 'text-orange-300' : 'text-gray-400'
                          }`}
                        >
                          {uc.id}
                        </div>
                        <div className="font-semibold text-sm leading-snug">
                          {uc.title}
                        </div>
                        <div
                          className={`text-xs mt-1 line-clamp-1 ${
                            isSelected ? 'text-gray-300' : 'text-gray-500'
                          }`}
                        >
                          {uc.category}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white border border-gray-200/60 rounded-2xl md:rounded-3xl p-6 md:p-10 h-full min-h-[400px] flex flex-col shadow-bento"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-gray-100">
                    <div className="font-mono text-xs font-semibold text-axiom tracking-widest">
                      {selected.category}
                    </div>
                    <div className="font-mono text-xs text-gray-400 tracking-wide">
                      {selected.id}
                    </div>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-4">
                    {selected.title}
                  </h2>

                  <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl">
                    {selected.description}
                  </p>

                  <div className="flex-1">
                    <p className="font-mono text-xs text-gray-400 tracking-widest uppercase mb-4">
                      Shoal AI deliverables
                    </p>
                    <ul className="space-y-3">
                      {selected.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-gray-700"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-axiom" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                    <Button variant="solid" href="/app/new">
                      Deploy a swarm
                    </Button>
                    <Button variant="secondary" href="/contact">
                      Talk to us
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-gray-200/60 rounded-2xl p-10 h-full min-h-[400px] flex items-center justify-center shadow-bento"
                >
                  <p className="text-gray-500 text-center">
                    Select a use case from the list to view details.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center border-t border-gray-100">
        <p className="text-sm text-gray-500 mb-8">
          Showing {visible.length} curated scenarios — Shoal AI handles thousands
          more across the 12 Vectors of Humanity.
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tighter mb-8 leading-tight">
          Don&apos;t see your decision?
        </h2>
        <Button variant="primary" href="/app/new">
          Deploy a swarm
        </Button>
      </section>
    </div>
  );
}
