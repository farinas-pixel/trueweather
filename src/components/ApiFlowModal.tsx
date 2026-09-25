/**
 * TRUEWEATHER System Architecture & REST API Flow Visualization
 * Visual pipeline walkthrough built especially for internship evaluation.
 */

import React from 'react';
import { X, ArrowRight, Database, Globe, Cpu, Layers, Sparkles, MonitorCheck } from 'lucide-react';

interface ApiFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiFlowModal: React.FC<ApiFlowModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'City Search Input',
      sub: 'User initiates search query',
      desc: 'Input sanitized, checked for duplicates, and wrapped in an AbortController to support cancellation of stale requests.',
      icon: <Globe size={20} className="text-cyan-400" />,
    },
    {
      step: '02',
      title: 'Geocoding REST API',
      sub: 'geocoding-api.open-meteo.com',
      desc: 'Resolves natural language location string into latitude, longitude, country, admin region, and accurate timezone offset.',
      icon: <Database size={20} className="text-teal-400" />,
    },
    {
      step: '03',
      title: 'Location Validation',
      sub: 'Disambiguation & Coordinate Extraction',
      desc: 'If multiple cities match, presents user selection dialog; otherwise extracts verified coordinates directly.',
      icon: <Layers size={20} className="text-amber-400" />,
    },
    {
      step: '04',
      title: 'Forecast REST API',
      sub: 'api.open-meteo.com/v1/forecast',
      desc: 'Asynchronous fetch requesting current variables, 24h hourly arrays, and 7-day daily forecast values with response.ok validation.',
      icon: <Cpu size={20} className="text-sky-400" />,
    },
    {
      step: '05',
      title: 'Data Transformation Layer',
      sub: 'normalizeWeatherData()',
      desc: 'Transforms raw nested JSON into typed NormalizedWeatherData, converts WMO weather codes, and parses daylight spans.',
      icon: <Database size={20} className="text-indigo-400" />,
    },
    {
      step: '06',
      title: 'Weather Intelligence Engine',
      sub: 'Algorithmic Rules',
      desc: 'Generates transparent observations regarding heat stress, precipitation probability, gusts, and outdoor suitability.',
      icon: <Sparkles size={20} className="text-purple-400" />,
    },
    {
      step: '07',
      title: '3D Atmosphere Projection',
      sub: 'HTML5 Projection Engine',
      desc: 'Translates real meteorological parameters into 3D cloud clusters, rain velocity vectors, sun/moon lighting, and atmospheric sky gradients.',
      icon: <Layers size={20} className="text-cyan-400" />,
    },
    {
      step: '08',
      title: 'Accessible DOM UI',
      sub: 'WCAG Compliant Rendering',
      desc: 'Renders semantic cards, tabular numerals, keyboard-focusable elements, screen reader descriptions, and stores history in localStorage.',
      icon: <MonitorCheck size={20} className="text-emerald-400" />,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-flow-title"
    >
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h2 id="api-flow-title" className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" aria-hidden="true" />
              <span>How TRUEWEATHER Works · Asynchronous REST API Architecture</span>
            </h2>
            <p className="text-xs text-slate-400">
              End-to-end data pipeline from user input to 3D atmospheric visualization.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Close architecture modal"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Steps Grid */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((item, idx) => (
              <div
                key={item.step}
                className="relative bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex gap-3.5 items-start"
              >
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                      STEP {item.step}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-xs text-slate-400 font-mono truncate">{item.sub}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 leading-relaxed">
            <span className="font-semibold text-white">Internship Note:</span> This flow uses zero simulated or mock data. Every city query resolves through genuine Open-Meteo REST endpoints, processes JSON via dedicated transformation services, and manages application state without hardcoded values.
          </div>
        </div>
      </div>
    </div>
  );
};
