/**
 * TRUEWEATHER Developer & Research Data Inspector
 * Formatted JSON inspector demonstrating data transformation for internship evaluation.
 */

import React, { useState } from 'react';
import { NormalizedWeatherData } from '../types/weather';
import { Code2, X, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface DataInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: NormalizedWeatherData;
}

export const DataInspectorModal: React.FC<DataInspectorModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="data-inspector-title"
    >
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Terminal size={18} aria-hidden="true" />
            </div>
            <div>
              <h2 id="data-inspector-title" className="text-base font-bold text-white">
                Meteorological State & JSON Inspector
              </h2>
              <p className="text-xs text-slate-400">
                Normalized data object derived from Open-Meteo REST API (Latency: {data.apiResponseTimeMs}ms)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" aria-hidden="true" />
                  <span>Copied JSON</span>
                </>
              ) : (
                <>
                  <Copy size={14} aria-hidden="true" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Close inspector"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* JSON Content Area */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-slate-950 font-mono text-xs text-cyan-300/90 leading-relaxed selection:bg-cyan-900 selection:text-white">
          <pre className="whitespace-pre">{jsonString}</pre>
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <span>Schema: TypeScript NormalizedWeatherData interface</span>
          <a
            href="https://open-meteo.com/en/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Open-Meteo API Docs</span>
            <ExternalLink size={12} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
};
