import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CopyIcon, DownloadIcon, CheckIcon } from 'lucide-react';

export function ReportActionBar() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <Link
        to="/app/history"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors"
      >
        <ArrowLeftIcon size={14} />
        All swarms
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 bg-white border border-gray-200/60 rounded-lg px-3.5 py-2 text-sm font-medium text-black hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <>
              <CheckIcon size={13} className="text-emerald-600" />
              Copied
            </>
          ) : (
            <>
              <CopyIcon size={13} />
              Copy summary
            </>
          )}
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          className="inline-flex items-center gap-1.5 bg-axiom text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-orange-600 shadow-sm transition-colors"
        >
          <DownloadIcon size={13} />
          Export Boardroom PDF
        </motion.button>
      </div>
    </div>
  );
}
