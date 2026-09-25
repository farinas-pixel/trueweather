/**
 * TRUEWEATHER 3D Atmosphere & Application Settings Modal
 * Configuration for 3D engine, performance modes, and meteorological units.
 */

import React from 'react';
import { UserSettings } from '../types/weather';
import { SlidersHorizontal, X, Cpu, Eye, Wind, Thermometer, Sparkles } from 'lucide-react';

interface AtmosphereSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetPreferences: () => void;
}

export const AtmosphereSettingsModal: React.FC<AtmosphereSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetPreferences,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <SlidersHorizontal size={18} aria-hidden="true" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="text-base font-bold text-white">
                Atmosphere & Display Controls
              </h2>
              <p className="text-xs text-slate-400">
                Configure 3D simulation fidelity, animation rates, and telemetry units.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Close settings"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Content Options */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* 1. 3D Atmospheric Projection */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-sm font-semibold text-white block">
                3D Atmospheric Projection
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">
                Renders volumetric clouds, rain velocity vectors, and celestial bodies.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ threeDEnabled: !settings.threeDEnabled })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                settings.threeDEnabled ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
              role="switch"
              aria-checked={settings.threeDEnabled}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.threeDEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 2. Motion & Dynamic Animation */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-sm font-semibold text-white block">
                Atmospheric Animation
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">
                Continuous particle drift and celestial orbit updates.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ animationsEnabled: !settings.animationsEnabled })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                settings.animationsEnabled ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
              role="switch"
              aria-checked={settings.animationsEnabled}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.animationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 3. Performance Mode */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Performance Mode</span>
              <span className="text-xs font-mono text-cyan-400 capitalize">{settings.performanceMode}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['auto', 'high', 'low'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onUpdateSettings({ performanceMode: mode })}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                    settings.performanceMode === mode
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {mode === 'auto' ? 'Auto Detect' : mode === 'high' ? 'High Fidelity' : 'Power Saver'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              Power Saver mode reduces 3D particle count to 40% and caps resolution scale.
            </p>
          </div>

          {/* 4. Units Preferences */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Measurement Systems
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Temperature Scale</span>
              <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ tempUnit: 'celsius' })}
                  className={`px-3 py-1 text-xs font-semibold rounded-md ${
                    settings.tempUnit === 'celsius' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Celsius (°C)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ tempUnit: 'fahrenheit' })}
                  className={`px-3 py-1 text-xs font-semibold rounded-md ${
                    settings.tempUnit === 'fahrenheit' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Wind Velocity Unit</span>
              <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ windUnit: 'kmh' })}
                  className={`px-3 py-1 text-xs font-semibold rounded-md ${
                    settings.windUnit === 'kmh' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  km/h
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ windUnit: 'mph' })}
                  className={`px-3 py-1 text-xs font-semibold rounded-md ${
                    settings.windUnit === 'mph' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  mph
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <button
            type="button"
            onClick={onResetPreferences}
            className="text-xs text-slate-400 hover:text-rose-400 underline transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
