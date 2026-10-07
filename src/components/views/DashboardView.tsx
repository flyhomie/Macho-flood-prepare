import React from 'react';
import {
  AlertTriangle,
  Waves,
  Shield,
  Navigation,
  Radio,
  Video,
  Activity,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Droplets,
  CloudRain,
  PhoneCall,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { RiskScoreCard } from '../RiskScoreCard';
import { WaterlineGauge } from '../WaterlineGauge';
import {
  SafeZone,
  FloodReport,
  RiskLevel,
  CountryCode,
  LanguageCode,
} from '../../types';
import { formatDistance, getHaversineDistanceMeters } from '../../utils/geo';
import { COUNTRY_PROTOCOLS } from '../../data/mockData';

interface DashboardViewProps {
  country: CountryCode;
  language: LanguageCode;
  riskScore: number;
  riskLevel: RiskLevel;
  waterLevelMeters: number;
  onWaterLevelChange: (level: number) => void;
  rainfallMmHr: number;
  damCapacityPct: number;
  soilSaturationPct: number;
  isSirenActive: boolean;
  onToggleSiren: () => void;
  safeZones: SafeZone[];
  floodReports: FloodReport[];
  userCoords: { lat: number; lng: number };
  onNavigateToTab: (tabId: string) => void;
  onSelectSafeZone: (zone: SafeZone) => void;
  onOpenSos: () => void;
  onOpenReport: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  country,
  language,
  riskScore,
  riskLevel,
  waterLevelMeters,
  onWaterLevelChange,
  rainfallMmHr,
  damCapacityPct,
  soilSaturationPct,
  isSirenActive,
  onToggleSiren,
  safeZones,
  floodReports,
  userCoords,
  onNavigateToTab,
  onSelectSafeZone,
  onOpenSos,
  onOpenReport,
}) => {
  const protocol = COUNTRY_PROTOCOLS[country] || COUNTRY_PROTOCOLS.KE;
  const leadHotline = protocol.hotlines[0] || { phone: '1199', name: 'Emergency Rescue' };

  // Nearest safe haven
  const nearestZone = safeZones
    .slice()
    .sort(
      (a, b) =>
        getHaversineDistanceMeters(userCoords.lat, userCoords.lng, a.lat, a.lng) -
        getHaversineDistanceMeters(userCoords.lat, userCoords.lng, b.lat, b.lng)
    )[0] || safeZones[0];

  const nearestDistance = nearestZone
    ? getHaversineDistanceMeters(userCoords.lat, userCoords.lng, nearestZone.lat, nearestZone.lng)
    : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Critical Flash Flood Warning Banner */}
      {riskScore >= 65 && (
        <div className="bg-gradient-to-r from-rose-950/90 via-red-950/80 to-slate-950 border-2 border-rose-600/80 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-rose-600/20 backdrop-blur-md animate-in slide-in-from-top-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-600 text-white animate-bounce shadow-lg shadow-rose-600/50 flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider">
                  URGENT DIRECTIVE
                </span>
                <h3 className="font-extrabold text-white text-base tracking-tight">
                  Rapid Upstream Influx in {protocol.countryName} Basin
                </h3>
              </div>
              <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">
                Dam spillways opened upstream. Water levels expected to rise +35cm in the next 2 hours. Prepare Go-Bags and proceed to high ground.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                if (nearestZone) {
                  onSelectSafeZone(nearestZone);
                  onNavigateToTab('navigate');
                }
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/40 active:scale-95 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>EVACUATE ({formatDistance(nearestDistance)})</span>
            </button>

            <a
              href={`tel:${leadHotline.phone}`}
              className="p-2.5 rounded-xl bg-slate-900 border border-rose-500/40 text-rose-400 hover:text-white flex items-center justify-center"
              title="Call Lead Agency"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Top Main Grid: Risk Gauge & Hydrology Waterline Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Hazard Risk Score Gauge */}
        <div className="lg:col-span-5">
          <RiskScoreCard
            score={riskScore}
            riskLevel={riskLevel}
            isSirenActive={isSirenActive}
            onToggleSiren={onToggleSiren}
            locationName={`${protocol.countryName} Central Basin`}
          />
        </div>

        {/* Right: Live River Basin Waterline Column Gauge */}
        <div className="lg:col-span-7">
          <WaterlineGauge
            waterLevelMeters={waterLevelMeters}
            onWaterLevelChange={onWaterLevelChange}
            rainfallMmHr={rainfallMmHr}
            damCapacityPct={damCapacityPct}
            soilSaturationPct={soilSaturationPct}
          />
        </div>
      </div>

      {/* Quick Emergency Actions Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Quick Emergency Dispatch & Tools
          </h3>
          <span className="text-[11px] text-cyan-400 font-mono">100% Offline Ready</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {/* Action 1: SOS */}
          <button
            onClick={onOpenSos}
            className="p-3.5 rounded-2xl bg-gradient-to-b from-rose-600/30 to-red-950/60 border border-rose-500/50 hover:border-rose-400 text-left transition-all active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-2 shadow-md shadow-rose-600/30 group-hover:scale-110 transition-transform">
              🚨
            </div>
            <div className="font-extrabold text-xs text-white">Broadcast SOS</div>
            <div className="text-[10px] text-rose-300">Distress GPS Beacon</div>
          </button>

          {/* Action 2: Report Flood */}
          <button
            onClick={onOpenReport}
            className="p-3.5 rounded-2xl bg-gradient-to-b from-cyan-600/20 to-blue-950/60 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform">
              🌊
            </div>
            <div className="font-extrabold text-xs text-white">Report Flood</div>
            <div className="text-[10px] text-cyan-300">Pin Depth & Hazard</div>
          </button>

          {/* Action 3: Evacuation Compass */}
          <button
            onClick={() => onNavigateToTab('navigate')}
            className="p-3.5 rounded-2xl bg-gradient-to-b from-emerald-600/20 to-slate-950 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform">
              🧭
            </div>
            <div className="font-extrabold text-xs text-white">Evac Compass</div>
            <div className="text-[10px] text-emerald-300">Safe Ridge Azimuth</div>
          </button>

          {/* Action 4: Live Map */}
          <button
            onClick={() => onNavigateToTab('map')}
            className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-left transition-all active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform">
              🗺️
            </div>
            <div className="font-extrabold text-xs text-white">Live Map</div>
            <div className="text-[10px] text-slate-400">Heatmaps & Havens</div>
          </button>

          {/* Action 5: River Cameras */}
          <button
            onClick={() => onNavigateToTab('streams')}
            className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-left transition-all active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform">
              📹
            </div>
            <div className="font-extrabold text-xs text-white">Basin Cams</div>
            <div className="text-[10px] text-slate-400">Drone & Culvert Feeds</div>
          </button>

          {/* Action 6: AI Safety */}
          <button
            onClick={() => onNavigateToTab('aiAssist')}
            className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-left transition-all active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform">
              🤖
            </div>
            <div className="font-extrabold text-xs text-white">AI Safety</div>
            <div className="text-[10px] text-slate-400">Gemini Survival Advice</div>
          </button>
        </div>
      </div>

      {/* Nearest Safe Havens & Recent Situational Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Nearest Safe Havens List */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Nearest Safe Ground & Relief Shelters</h3>
            </div>
            <button
              onClick={() => onNavigateToTab('map')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View Map</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {safeZones.slice(0, 3).map((zone) => {
              const dist = getHaversineDistanceMeters(userCoords.lat, userCoords.lng, zone.lat, zone.lng);
              return (
                <div
                  key={zone.id}
                  className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between transition-all hover:border-emerald-500/40"
                >
                  <div>
                    <div className="font-bold text-xs text-white flex items-center gap-2">
                      <span>{zone.name}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Elev: {zone.elevationMeters}m
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {zone.city} • Capacity: {zone.currentOccupancy} / {zone.capacity}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectSafeZone(zone);
                      onNavigateToTab('navigate');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-600/30"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{formatDistance(dist)}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: 24h Rainfall & River Crest Prediction */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">24-Hour Precipitation & Crest Forecast</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Met Dept Telemetry</span>
          </div>

          {/* Forecast timeline bars */}
          <div className="space-y-3">
            {[
              { time: '12:00 (Now)', mm: 48, status: 'Torrential Rainfall', danger: 'high' },
              { time: '15:00 (+3h)', mm: 62, status: 'Peak Inflow & Crest', danger: 'critical' },
              { time: '18:00 (+6h)', mm: 35, status: 'Gradual Easing', danger: 'moderate' },
              { time: '21:00 (+9h)', mm: 18, status: 'Scattered Showers', danger: 'low' },
            ].map((f, idx) => (
              <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-200">{f.time}</span>
                  <span
                    className={`font-mono font-bold ${
                      f.danger === 'critical'
                        ? 'text-rose-400'
                        : f.danger === 'high'
                        ? 'text-amber-400'
                        : 'text-cyan-400'
                    }`}
                  >
                    {f.mm} mm/hr
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      f.danger === 'critical'
                        ? 'bg-rose-500'
                        : f.danger === 'high'
                        ? 'bg-amber-400'
                        : 'bg-cyan-400'
                    }`}
                    style={{ width: `${(f.mm / 70) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span>{f.status}</span>
                  <span className="uppercase text-[9px] font-bold text-slate-500">{f.danger}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
