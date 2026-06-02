import React, { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';

export interface GlobalOverlayPanelProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  children: React.ReactNode;
  className?: string;
  /** Align panel edge to anchor's right (default) or left */
  align?: 'right' | 'left';
  placement?: 'below' | 'above';
  offset?: number;
}

/**
 * Renders floating UI in a document portal with the global-overlay surface standard.
 * Use for dropdowns/menus that must sit above page content and avoid parent backdrop-blur bleed-through.
 */
export function GlobalOverlayPanel({
  anchorRef,
  open,
  children,
  className,
  align = 'right',
  placement = 'below',
  offset = 8,
}: GlobalOverlayPanelProps) {
  const [position, setPosition] = useState<React.CSSProperties | null>(null);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) {
      setPosition(null);
      return;
    }

    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const style: React.CSSProperties = {
        position: 'fixed',
        zIndex: 9999,
        minWidth: rect.width,
      };

      if (placement === 'below') {
        style.top = rect.bottom + offset;
      } else {
        style.bottom = window.innerHeight - rect.top + offset;
      }

      if (align === 'right') {
        style.right = window.innerWidth - rect.right;
        style.left = 'auto';
      } else {
        style.left = rect.left;
        style.right = 'auto';
      }

      setPosition(style);
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchorRef, align, placement, offset]);

  if (!open || !position) {
    return null;
  }

  return createPortal(
    <div
      data-global-overlay
      style={position}
      className={cn('global-overlay rounded-xl overflow-hidden isolate', className)}
    >
      {children}
    </div>,
    document.body,
  );
}
