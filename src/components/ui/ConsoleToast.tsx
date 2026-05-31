import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ConsoleToastProps {
  message: string | null;
}

export function ConsoleToast({ message }: ConsoleToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 rounded-full border border-gray-200/80 bg-white/95 px-4 py-2.5 text-sm font-medium text-gray-800 shadow-lg shadow-gray-900/10 backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white">
            <Check size={14} strokeWidth={2.5} aria-hidden />
          </span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useConsoleToast(durationMs = 2400) {
  const [message, setMessage] = React.useState<string | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  const showToast = React.useCallback(
    (text: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setMessage(text);
      timeoutRef.current = setTimeout(() => setMessage(null), durationMs);
    },
    [durationMs],
  );

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { toastMessage: message, showToast };
}
