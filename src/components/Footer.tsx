/**
 * TRUEWEATHER Site Footer
 * Proper Open-Meteo attribution, data disclaimer, and internship research triggers.
 */

import React from 'react';
import { ExternalLink, Terminal, GitBranch, Heart } from 'lucide-react';

interface FooterProps {
  onOpenInspector: () => void;
  onOpenArchitecture: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenInspector,
  onOpenArchitecture,
}) => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
        {/* Brand & Attribution */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-200 tracking-wider">
              TRUEWEATHER
            </span>
            <span aria-hidden="true">·</span>
            <span>Real Weather. Real Data. Real-Time Intelligence.</span>
          </div>
          <p className="text-slate-400 text-center md:text-left">
            Weather data powered by{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline inline-flex items-center gap-0.5"
            >
              <span>Open-Meteo</span>
              <ExternalLink size={10} aria-hidden="true" />
            </a>{' '}
            under CC BY 4.0. No proprietary AI forecast models or synthetic figures.
          </p>
        </div>

        {/* Developer / Internship Tools Links */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onOpenInspector}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded-lg transition-colors text-slate-300"
          >
            <Terminal size={14} className="text-cyan-400" aria-hidden="true" />
            <span>JSON Inspector</span>
          </button>

          <button
            type="button"
            onClick={onOpenArchitecture}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded-lg transition-colors text-slate-300"
          >
            <GitBranch size={14} className="text-teal-400" aria-hidden="true" />
            <span>API Architecture</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
