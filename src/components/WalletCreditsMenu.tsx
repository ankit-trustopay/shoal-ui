import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ZapIcon } from 'lucide-react';
import { useUserAccount } from '../hooks/useUserAccount';
import { GlobalOverlayPanel } from './GlobalOverlayPanel';
import { useConsoleToast } from './ui/ConsoleToast';

/**
 * Credits chip + wallet dropdown (portaled, z-50, solid surface).
 */
export function WalletCreditsMenu() {
  const { loading, error: accountError, user, totalCredits } = useUserAccount();
  const { showToast } = useConsoleToast();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        rootRef.current?.contains(target) ||
        (e.target as Element).closest?.('[data-global-overlay]')
      ) {
        return;
      }
      close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  return (
    <div ref={rootRef} className="relative z-50 shrink-0">
      <Link
        ref={triggerRef}
        to="/app/credits"
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          setOpen((v) => !v);
        }}
        className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 sm:px-3.5 py-1.5 text-sm font-semibold text-gray-900 shadow-md transition-colors hover:border-gray-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={panelId}
        aria-label="Wallet and credits"
      >
        <ZapIcon size={14} className="text-orange-500 shrink-0" aria-hidden />
        {loading ? (
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500"
            aria-label="Loading credits"
          />
        ) : (
          <span className="tabular-nums whitespace-nowrap">
            {accountError ? '—' : `${totalCredits.toLocaleString()} Credits`}
          </span>
        )}
      </Link>

      <GlobalOverlayPanel
        anchorRef={triggerRef}
        open={open}
        align="right"
        placement="below"
        className="w-64 z-50 bg-white shadow-xl border border-gray-200"
      >
        <div
          id={panelId}
          role="dialog"
          aria-label="Wallet"
          className="bg-white p-3 shadow-xl"
        >
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Wallet
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500"
                aria-hidden
              />
            </div>
          ) : (
            <>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900">
                    Daily Free
                  </div>
                  <div className="text-xs text-gray-500">
                    Resets 12:30 AM IST
                  </div>
                </div>
                <div className="shrink-0 text-sm font-semibold tabular-nums text-gray-900">
                  {`${user?.dailyCredits ?? 0} / 150`}
                </div>
              </div>

              <div className="my-3 h-px bg-gray-200" />

              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-gray-900">Vault</div>
                <div className="text-sm font-semibold tabular-nums text-gray-900">
                  {`${user?.vaultCredits ?? 0}`}
                </div>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              showToast('Credit purchases are coming soon.');
            }}
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
          >
            Buy Credits
          </button>

          <Link
            to="/app/credits"
            onClick={close}
            className="mt-2 block text-center text-xs font-medium text-orange-600 hover:text-orange-700"
          >
            View billing details
          </Link>
        </div>
      </GlobalOverlayPanel>
    </div>
  );
}
