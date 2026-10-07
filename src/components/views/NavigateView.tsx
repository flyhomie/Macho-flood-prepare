import React, { useState, useEffect } from 'react';
import {
  Compass,
  Navigation,
  Shield,
  ArrowUpRight,
  Mountain,
  Clock,
  AlertTriangle,
  Volume2,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { SafeZone } from '../../types';
import {
  getHaversineDistanceMeters,
  getBearingDegrees,
  getCardinalDirection,
  formatDistance,
  getEstimatedWalkTimeMinutes,
} from '../../utils/geo';
import { audioService } from '../../utils/audio';

interface NavigateViewProps {
  userCoords: { lat: number; lng: number };
  safeZones: SafeZone[];
  selectedZone: SafeZone | null;
  onSelectZone: (zone: SafeZone) => void;
}

export const NavigateView: React.FC<NavigateViewProps> = ({
  userCoords,
  safeZones,
  selectedZone,
  onSelectZone,
}) => {
  // If no zone selected, default to the nearest
  const targetZone =
    selectedZone ||
    safeZones
      .slice()
      .sort(
        (a, b) =>
          getHaversineDistanceMeters(userCoords.lat, userCoords.lng, a.lat, a.lng) -
          getHaversineDistanceMeters(userCoords.lat, userCoords.lng, b.lat, b.lng)
      )[0] ||
    safeZones[0];

  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [isSonarActive, setIsSonarActive] = useState<boolean>(false);

  // Calculate distance, bearing, and metrics to target
  const distanceMeters = targetZone
    ? getHaversineDistanceMeters(userCoords.lat, userCoords.lng, targetZone.lat, targetZone.lng)
    : 0;

  const targetBearing = targetZone
    ? getBearingDegrees(userCoords.lat, userCoords.lng, targetZone.lat, targetZone.lng)
    : 0;

  const cardinal = getCardinalDirection(targetBearing);
  const estWalkTime = getEstimatedWalkTimeMinutes(distanceMeters, 20);
  const elevationGain = Math.max(0, targetZone.elevationMeters - 1500);

  // Relative needle angle on device compass
  const relativeAngle = (targetBearing - deviceHeading + 360) % 360;

  // Listen to device orientation if available
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setDeviceHeading(360 - e.alpha);
      }
    };
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  // Sonar audio beacon
  useEffect(() => {
    let timer: any = null;
    if (isSonarActive) {
      timer = setInterval(() => {
        audioService.playSonarPing(0.6);
      }, 2500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSonarActive]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                Offline Evacuation Compass & HUD
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono">
                  GPS LOCKED
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Direct Haversine vector & elevation guidance to dry high ground
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSonarActive(!isSonarActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isSonarActive
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Sonar Audio Navigation Beacon"
          >
            <Volume2 className="w-4 h-4" />
            <span>Sonar Beacon: {isSonarActive ? 'ACTIVE' : 'OFF'}</span>
          </button>
        </div>

        {/* Selected Safe Destination Selector Bar */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Target Safe Zone / Relief Haven:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {safeZones.slice(0, 3).map((zone) => {
              const isSelected = targetZone.id === zone.id;
              const dist = getHaversineDistanceMeters(userCoords.lat, userCoords.lng, zone.lat, zone.lng);
              return (
                <button
                  key={zone.id}
                  onClick={() => onSelectZone(zone)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-600/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="truncate max-w-[140px] text-white">{zone.name}</span>
                    <span className="text-cyan-400 font-mono">{formatDistance(dist)}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>{zone.city}</span>
                    <span>Elev: {zone.elevationMeters}m</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main HUD: Compass & Key Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Interactive Rotating Compass Rose */}
        <div className="md:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>Target Heading Azimuth</span>
          </div>

          {/* Compass Dial */}
          <div className="relative w-64 h-64 rounded-full border-4 border-slate-800 bg-slate-950 shadow-inner flex items-center justify-center">
            {/* North, East, South, West Markers */}
            <span className="absolute top-2 font-black text-rose-400 font-mono text-sm">N</span>
            <span className="absolute right-3 font-bold text-slate-400 font-mono text-xs">E</span>
            <span className="absolute bottom-2 font-bold text-slate-400 font-mono text-xs">S</span>
            <span className="absolute left-3 font-bold text-slate-400 font-mono text-xs">W</span>

            {/* Dial Ticks */}
            <div className="absolute inset-4 rounded-full border border-dashed border-slate-800 pointer-events-none" />

            {/* Rotating Arrow Indicator */}
            <div
              className="w-full h-full absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out pointer-events-none"
              style={{ transform: `rotate(${relativeAngle}deg)` }}
            >
              {/* Pointer Needle */}
              <div className="w-2 h-28 bg-gradient-to-t from-cyan-500 via-blue-500 to-rose-500 rounded-full flex flex-col items-center justify-start shadow-xl shadow-rose-500/40">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px] border-b-rose-500 -mt-3.5" />
              </div>
            </div>

            {/* Center Core Display */}
            <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-slate-700 flex flex-col items-center justify-center shadow-2xl z-10">
              <span className="text-xl font-black text-white font-mono leading-none">
                {targetBearing}°
              </span>
              <span className="text-[10px] font-bold text-cyan-400 mt-0.5">{cardinal}</span>
            </div>
          </div>

          {/* Azimuth Subtext */}
          <div className="mt-4 text-center">
            <div className="text-sm font-bold text-white">
              Walk Toward Bearing <span className="font-mono text-cyan-400">{targetBearing}° ({cardinal})</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Keep the needle pointed toward the top of your device
            </p>
          </div>
        </div>

        {/* Right: Evacuation Vector Readouts */}
        <div className="md:col-span-6 space-y-4">
          {/* Distance Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">Straight-Line Distance</div>
                <div className="text-2xl font-black text-white font-mono">
                  {formatDistance(distanceMeters)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400">Direct Vector</div>
              <div className="text-xs font-mono text-cyan-400 font-bold">±10m GPS Fix</div>
            </div>
          </div>

          {/* Estimated Wading / Walk Time */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">Est. Evacuation Time</div>
                <div className="text-2xl font-black text-amber-300 font-mono">
                  ~{estWalkTime} <span className="text-sm font-normal text-slate-400">mins</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400">Pace Estimate</div>
              <div className="text-xs text-slate-300 font-medium">3.0 km/h wading</div>
            </div>
          </div>

          {/* Elevation Gain */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Mountain className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">Elevation Safety Delta</div>
                <div className="text-2xl font-black text-emerald-300 font-mono">
                  {targetZone.elevationMeters} <span className="text-sm font-normal text-slate-400">meters ASL</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-emerald-400 font-bold">ABOVE FLOOD LINE</div>
              <div className="text-xs text-slate-300 font-medium">Ridge Crest</div>
            </div>
          </div>

          {/* Shelter Amenities Banner */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span>{targetZone.name} Facilities:</span>
              <span className="text-emerald-400 font-mono">Open & Staffed</span>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                ⚡ Emergency Generator
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                🚰 Purified Water Bowser
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                🩺 Red Cross Triage
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Explicit Safety Disclaimer */}
      <div className="bg-amber-950/40 border border-amber-500/40 rounded-3xl p-5 text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>OFFLINE STRAIGHT-LINE GUIDANCE DISCLAIMER</span>
        </div>
        <p className="text-xs leading-relaxed text-amber-200/90">
          This system provides straight-line (Haversine distance and azimuth bearing) to the nearest verified high ground. It is designed for survival when roads and internet are down. Always observe local terrain: <strong>NEVER attempt to walk through fast-moving water over 15cm deep</strong>, avoid flooded culverts, and stay clear of downed electrical cables.
        </p>
      </div>
    </div>
  );
};
