import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Layers,
  Compass,
  Navigation,
  Shield,
  AlertTriangle,
  Waves,
  Search,
  Crosshair,
  Maximize2,
} from 'lucide-react';
import { SafeZone, FloodReport, CountryCode } from '../../types';
import { REGIONAL_CENTROIDS } from '../../utils/geo';

interface MapViewProps {
  country: CountryCode;
  safeZones: SafeZone[];
  floodReports: FloodReport[];
  userCoords: { lat: number; lng: number };
  onSelectDestination: (zone: SafeZone) => void;
  onOpenReportModal: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  country,
  safeZones,
  floodReports,
  userCoords,
  onSelectDestination,
  onOpenReportModal,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null);

  const [showShelters, setShowShelters] = useState(true);
  const [showFloods, setShowFloods] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<SafeZone | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const centroid = REGIONAL_CENTROIDS[country] || REGIONAL_CENTROIDS.KE;

    const map = L.map(mapContainerRef.current, {
      center: [centroid.lat, centroid.lng],
      zoom: centroid.zoom,
      zoomControl: false,
    });

    // Dark styled tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);

    // Add custom zoom control top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    const heatmapGroup = L.layerGroup().addTo(map);

    markersGroupRef.current = markersGroup;
    heatmapLayerRef.current = heatmapGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map center when country changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const centroid = REGIONAL_CENTROIDS[country] || REGIONAL_CENTROIDS.KE;
    mapInstanceRef.current.flyTo([centroid.lat, centroid.lng], centroid.zoom, {
      duration: 1.2,
    });
  }, [country]);

  // Render Markers and Heatmap Overlays
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current || !heatmapLayerRef.current) return;

    markersGroupRef.current.clearLayers();
    heatmapLayerRef.current.clearLayers();

    // 1. User Position Marker
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-cyan-500/30 animate-ping"></div>
          <div class="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-slate-900 font-bold">
            YOU
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
      .bindPopup(
        `<div class="p-1 font-sans">
          <strong class="text-cyan-400 text-sm">Your Location (GPS)</strong>
          <p class="text-xs text-slate-300 mt-0.5">${userCoords.lat.toFixed(5)}, ${userCoords.lng.toFixed(5)}</p>
        </div>`
      )
      .addTo(markersGroupRef.current);

    // 2. Safe Zone Markers
    if (showShelters) {
      safeZones.forEach((zone) => {
        const shelterIcon = L.divIcon({
          className: 'custom-shelter-marker',
          html: `
            <div class="flex items-center justify-center group cursor-pointer">
              <div class="w-8 h-8 rounded-xl bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-black transform transition hover:scale-110">
                🛡️
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([zone.lat, zone.lng], { icon: shelterIcon });

        marker.on('click', () => {
          setSelectedZone(zone);
        });

        marker.bindPopup(`
          <div class="p-2 font-sans max-w-[220px]">
            <div class="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase mb-1">
              <span>🛡️ Safe High Ground</span>
            </div>
            <h4 class="font-extrabold text-sm text-slate-100">${zone.name}</h4>
            <p class="text-[11px] text-slate-300 mt-1">${zone.description}</p>
            <div class="mt-2 text-[10px] text-slate-400 font-mono space-y-0.5 border-t border-slate-700/60 pt-1.5">
              <div>Elevation: <strong>${zone.elevationMeters}m</strong></div>
              <div>Capacity: <strong>${zone.currentOccupancy}/${zone.capacity}</strong></div>
              <div>Contact: <strong>${zone.contactNumber}</strong></div>
            </div>
          </div>
        `);

        marker.addTo(markersGroupRef.current!);
      });
    }

    // 3. Flood Reports & Hazard Markers
    if (showFloods) {
      floodReports.forEach((report) => {
        const floodIcon = L.divIcon({
          className: 'custom-flood-marker',
          html: `
            <div class="flex items-center justify-center animate-pulse cursor-pointer">
              <div class="w-8 h-8 rounded-full bg-rose-600/90 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold">
                ⚠️
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([report.lat, report.lng], { icon: floodIcon });

        marker.bindPopup(`
          <div class="p-2 font-sans max-w-[220px]">
            <div class="flex items-center gap-1 text-rose-400 font-bold text-xs uppercase mb-1">
              <span>⚠️ Active Flood Hazard</span>
            </div>
            <h4 class="font-extrabold text-sm text-slate-100">${report.locationName}</h4>
            <div class="text-[11px] text-slate-300 mt-1">
              Depth: <span class="text-rose-300 font-bold uppercase">${report.depthCategory}</span> • Speed: <span class="text-amber-300 font-bold">${report.waterSpeed}</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-1">${report.description}</p>
            ${
              report.trappedPeople
                ? `<div class="mt-1.5 bg-rose-500/20 text-rose-300 text-[10px] font-bold p-1 rounded">🚨 ${report.trappedPeople} people trapped!</div>`
                : ''
            }
          </div>
        `);

        marker.addTo(markersGroupRef.current!);

        // Add Heatmap Circle representation
        if (showHeatmap) {
          const radius = report.waterSpeed === 'torrent' ? 3500 : 2000;
          L.circle([report.lat, report.lng], {
            radius,
            color: '#ef4444',
            weight: 1,
            opacity: 0.8,
            fillColor: '#f43f5e',
            fillOpacity: 0.25,
          }).addTo(heatmapLayerRef.current!);
        }
      });
    }
  }, [safeZones, floodReports, userCoords, showShelters, showFloods, showHeatmap]);

  const handleCenterOnUser = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([userCoords.lat, userCoords.lng], 14, {
      duration: 1.0,
    });
  };

  const handleSearchCity = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return;

    // Search safe zones or cities
    const matchedZone = safeZones.find(
      (z) => z.city.toLowerCase().includes(query) || z.name.toLowerCase().includes(query)
    );

    if (matchedZone && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([matchedZone.lat, matchedZone.lng], 14);
      setSelectedZone(matchedZone);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-130px)] min-h-[500px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 flex flex-col">
      {/* Top Search and Layer Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Search Input */}
        <form
          onSubmit={handleSearchCity}
          className="pointer-events-auto flex items-center bg-slate-950/90 border border-slate-700/80 rounded-2xl px-3 py-2 shadow-2xl backdrop-blur-md w-full sm:w-72"
        >
          <Search className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search safe shelter / town..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
          />
        </form>

        {/* Map Layer Filter Pills */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-950/90 border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              showShelters
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Safe Havens</span>
          </button>

          <button
            onClick={() => setShowFloods(!showFloods)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              showFloods
                ? 'bg-rose-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Floods</span>
          </button>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              showHeatmap
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Surge Heatmap</span>
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0 flex-1" />

      {/* Floating GPS Centering & Action Controls */}
      <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleCenterOnUser}
          className="w-11 h-11 rounded-2xl bg-slate-900/95 border border-slate-700 text-cyan-400 hover:text-cyan-300 shadow-2xl flex items-center justify-center active:scale-95 transition-all"
          title="Center on My Location"
        >
          <Crosshair className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenReportModal}
          className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 text-white text-xs font-bold shadow-2xl flex items-center gap-1.5 active:scale-95 transition-all"
          title="Report Flood Hazard at this spot"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Pin Flood</span>
        </button>
      </div>

      {/* Selected Safe Zone Bottom Sheet */}
      {selectedZone && (
        <div className="absolute bottom-4 left-4 right-16 sm:right-auto sm:w-96 z-[1000] bg-slate-950/95 border border-slate-700 rounded-3xl p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm leading-tight">
                  {selectedZone.name}
                </h4>
                <div className="text-[11px] text-slate-400 font-mono">
                  {selectedZone.city} • Elevation: {selectedZone.elevationMeters}m
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedZone(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-300 mb-3">{selectedZone.description}</p>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-3 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <span>Capacity: {selectedZone.currentOccupancy} / {selectedZone.capacity}</span>
            <span className="text-emerald-400 font-bold">Clean Water & Power ✓</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onSelectDestination(selectedZone);
              }}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30"
            >
              <Navigation className="w-4 h-4" />
              <span>Route & Bearing HUD</span>
            </button>

            <a
              href={`tel:${selectedZone.contactNumber}`}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center"
            >
              Call
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
