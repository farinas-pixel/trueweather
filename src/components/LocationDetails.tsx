/**
 * TRUEWEATHER Location View & Coordinate Telemetry
 * Real-world map visualizer using OpenStreetMap standard embed + geographic metadata.
 */

import React, { useState } from 'react';
import { LocationData } from '../types/weather';
import { MapPin, Globe, Compass, ExternalLink, Check, Copy } from 'lucide-react';

interface LocationDetailsProps {
  location: LocationData;
}

export const LocationDetails: React.FC<LocationDetailsProps> = ({ location }) => {
  const [copied, setCopied] = useState(false);

  const lat = location.latitude;
  const lon = location.longitude;

  // OpenStreetMap embed URL with bounding box around the coordinates
  const delta = 0.06;
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  const osmExternalUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`;

  const copyCoordinates = () => {
    navigator.clipboard.writeText(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mt-8" aria-labelledby="location-view-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2
            id="location-view-heading"
            className="text-xl font-bold tracking-tight text-white flex items-center gap-2"
          >
            <Globe size={20} className="text-cyan-400" aria-hidden="true" />
            <span>Geographic Position & Cartographic View</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified geocoding coordinates resolved via Open-Meteo Geocoding REST API.
          </p>
        </div>

        <button
          type="button"
          onClick={copyCoordinates}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors self-start sm:self-auto"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-400" aria-hidden="true" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} className="text-slate-400" aria-hidden="true" />
              <span>{lat.toFixed(4)}°, {lon.toFixed(4)}°</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive Map Embed */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden relative min-h-[300px] shadow-xl">
          <iframe
            title={`Real interactive map of ${location.name}, ${location.country}`}
            src={mapEmbedUrl}
            className="w-full h-full min-h-[300px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-slate-400 flex items-center gap-1 border border-slate-800">
            <span>© OpenStreetMap contributors</span>
            <a
              href={osmExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-0.5 ml-1"
            >
              <span>View larger</span>
              <ExternalLink size={10} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Technical Geographic Specifications */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="space-y-4">
            <div>
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block">
                Primary Designation
              </span>
              <span className="text-base font-semibold text-white mt-0.5 block">
                {location.name}
              </span>
              <span className="text-xs text-slate-400">
                {[location.admin1, location.country].filter(Boolean).join(', ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 font-mono block">Latitude</span>
                <span className="text-sm font-mono font-medium text-white tabular-nums">
                  {lat.toFixed(4)}° N
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-mono block">Longitude</span>
                <span className="text-sm font-mono font-medium text-white tabular-nums">
                  {lon.toFixed(4)}° E
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 font-mono block">Timezone</span>
                <span className="text-xs font-mono font-medium text-slate-200 truncate block">
                  {location.timezone}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-mono block">Elevation</span>
                <span className="text-sm font-mono font-medium text-white tabular-nums">
                  {location.elevation !== undefined ? `${location.elevation} m` : 'Sea Level'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 leading-normal">
            Coordinates are queried against the Open-Meteo Geocoding database and passed directly to the forecast model without manual synthesis.
          </div>
        </div>
      </div>
    </section>
  );
};
