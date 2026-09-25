/**
 * TRUEWEATHER Saved Favorites Drawer
 * Allows users to view and switch between saved favorite locations.
 */

import React from 'react';
import { LocationData } from '../types/weather';
import { Bookmark, X, Trash2, MapPin, ExternalLink } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: LocationData[];
  onSelectLocation: (loc: LocationData) => void;
  onRemoveFavorite: (id: number) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectLocation,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="favorites-title"
    >
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Bookmark size={18} className="text-cyan-400" aria-hidden="true" />
            <h2 id="favorites-title">Saved Locations</h2>
            <span className="text-xs font-mono text-slate-400">({favorites.length})</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Close favorites drawer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Locations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {favorites.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Bookmark size={36} className="mx-auto text-slate-600 mb-3" aria-hidden="true" />
              <p className="text-sm font-medium text-slate-300">No favorite locations saved</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Search for any city and click the star icon on the weather card to bookmark it here.
              </p>
            </div>
          ) : (
            favorites.map((loc) => (
              <div
                key={loc.id}
                className="group flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                  className="flex-1 text-left flex items-start gap-2.5 mr-2"
                >
                  <MapPin size={16} className="text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-sm font-semibold text-white group-hover:text-cyan-300 block">
                      {loc.name}
                    </span>
                    <span className="text-xs text-slate-400 block">
                      {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                      {loc.timezone}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveFavorite(loc.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                  aria-label={`Remove ${loc.name} from favorites`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400 text-center">
          Favorites persist safely in your browser’s localStorage.
        </div>
      </div>
    </div>
  );
};
