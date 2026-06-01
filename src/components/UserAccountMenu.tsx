import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { LogOutIcon, SettingsIcon } from 'lucide-react';
import { GlobalOverlayPanel } from './GlobalOverlayPanel';

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  const fromName = name?.trim();
  if (fromName) {
    const parts = fromName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return fromName.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return '?';
}

export function UserAccountMenu() {
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const displayName =
    user?.fullName?.trim() ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
    'Account';
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    '';
  const imageUrl = user?.imageUrl;
  const initials = getInitials(displayName, email);

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

  const handleManageAccount = () => {
    close();
    clerk.openUserProfile();
  };

  const handleLogOut = async () => {
    close();
    await clerk.signOut({ redirectUrl: '/' });
  };

  if (!isLoaded) {
    return (
      <div
        className="h-9 w-9 shrink-0 rounded-full bg-gray-200 animate-pulse ring-2 ring-white shadow-sm"
        aria-hidden
      />
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-white shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label="Account menu"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 text-xs font-bold text-white">
            {initials}
          </span>
        )}
      </button>

      <GlobalOverlayPanel
        anchorRef={triggerRef}
        open={open}
        align="right"
        placement="below"
        className="w-[min(100vw-2rem,17.5rem)]"
      >
        <div id={menuId} role="menu" aria-orientation="vertical">
          <div className="px-4 py-3.5">
            <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
              {displayName}
            </p>
            {email ? (
              <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                {email}
              </p>
            ) : null}
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-800" role="separator" />

          <div className="p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={handleManageAccount}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <SettingsIcon size={16} className="shrink-0 text-gray-500" aria-hidden />
              Manage Account
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => void handleLogOut()}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <LogOutIcon size={16} className="shrink-0 text-gray-500" aria-hidden />
              Log out
            </button>
          </div>
        </div>
      </GlobalOverlayPanel>
    </div>
  );
}
