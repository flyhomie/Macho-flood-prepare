import React from 'react';
import { Waves, Droplets, AlertTriangle, Activity, CloudRain, Gauge } from 'lucide-react';

interface WaterlineGaugeProps {
  waterLevelMeters: number;
  onWaterLevelChange?: (level: number) => void;
  rainfallMmHr: number;
  damCapacityPct: number;
  soilSaturationPct: number;
  isSimulated?: boolean;
}

export const WaterlineGauge: React.FC<WaterlineGaugeProps> = ({
  waterLevelMeters,
  onWaterLevelChange,
  rainfallMmHr,
  damCapacityPct,
  soilSaturationPct,
  isSimulated = false,
}) => {
  // Max scale is 8.0 meters
  const maxScale = 8.0;
  const percentage = Math.min(100, Math.max(5, (waterLevelMeters / maxScale) * 100));

  // Determine danger color & stage
  let levelColor = '#10b981'; // Green
  let stageLabel = 'SAFE / NORMAL BASIN FLOW';
  let badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  if (waterLevelMeters >= 5.5) {
    levelColor = '#ef4444'; // Red
    stageLabel = 'CRITICAL FLOOD STAGE — CREST IMMINENT';
    badgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
  } else if (waterLevelMeters >= 4.0) {
    levelColor = '#f97316'; // Orange
    stageLabel = 'SEVERE WARNING — OVERFLOWING BANKS';
    badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  } else if (waterLevelMeters >= 2.8) {
    levelColor = '#eab308'; // Yellow
    stageLabel = 'MODERATE SURGE — LOWLAND FLOOD RISK';
    badgeBg = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative Glow */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: levelColor }}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Waves className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base tracking-tight flex items-center gap-2">
              Live River Basin Waterline Gauge
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="text-xs text-slate-400">Real-time ultrasonic hydrological telemetry</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
          {stageLabel}
        </div>
      </div>

      {/* Main Gauge Graphic and Readout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Waterline Column */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[240px] h-64 bg-slate-950 border-2 border-slate-700/80 rounded-2xl relative overflow-hidden flex flex-col justify-end shadow-inner">
            {/* Water Fill with Wave Effect */}
            <div
              className="w-full relative transition-all duration-700 ease-out"
              style={{
                height: `${percentage}%`,
                background: `linear-gradient(180deg, ${levelColor}dd 0%, #0369a1 100%)`,
              }}
            >
              {/* Wave SVG Animation */}
              <div className="absolute -top-3 left-0 w-[200%] h-6 flex animate-wave opacity-80 pointer-events-none">
                <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-full fill-current" style={{ color: levelColor }}>
                  <path d="M0,25 C150,50 350,0 500,25 L500,50 L0,50 Z" />
                </svg>
                <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-full fill-current" style={{ color: levelColor }}>
                  <path d="M0,25 C150,50 350,0 500,25 L500,50 L0,50 Z" />
                </svg>
              </div>

              {/* Water Reflection bubbles */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/30 pointer-events-none" />
            </div>

            {/* Depth Markers Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 text-[10px] font-mono text-slate-400">
              <div className="flex justify-between items-center border-b border-rose-500/40 text-rose-400">
                <span>8.0m — EXTREME</span>
                <span className="bg-rose-950/80 px-1 rounded">EVACUATE</span>
              </div>
              <div className="flex justify-between items-center border-b border-amber-500/30 text-amber-400">
                <span>5.5m — MAJOR FLOOD</span>
                <span>WARN</span>
              </div>
              <div className="flex justify-between items-center border-b border-yellow-500/30 text-yellow-400">
                <span>3.5m — OVERFLOW</span>
                <span>MONITOR</span>
              </div>
              <div className="flex justify-between items-center border-b border-emerald-500/20 text-emerald-400">
                <span>1.5m — NORMAL BASE</span>
                <span>SAFE</span>
              </div>
              <div className="text-right text-slate-500 text-[9px]">0.0m RIVER BED</div>
            </div>

            {/* Float Marker with Current Value */}
            <div
              className="absolute left-2 right-2 flex items-center justify-between px-2 py-0.5 rounded bg-slate-900/90 border border-white/20 text-xs font-bold text-white shadow-lg pointer-events-none transition-all duration-700"
              style={{ bottom: `calc(${Math.min(88, Math.max(10, percentage))}% - 12px)` }}
            >
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                {waterLevelMeters.toFixed(2)} m
              </span>
              <span className="text-[10px] text-slate-300 font-mono">
                {((waterLevelMeters / maxScale) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Manual / Simulation Slider */}
          {onWaterLevelChange && (
            <div className="w-full max-w-[240px] mt-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Hydrology Simulation</span>
                <span className="font-mono text-cyan-400">{waterLevelMeters.toFixed(2)}m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.05"
                value={waterLevelMeters}
                onChange={(e) => onWaterLevelChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                aria-label="Adjust water level simulation"
              />
            </div>
          )}
        </div>

        {/* Right: Key Telemetry Grid */}
        <div className="md:col-span-7 grid grid-cols-2 gap-3">
          {/* Current Depth */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Basin Depth</span>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-slate-100 font-mono tracking-tight">
              {waterLevelMeters.toFixed(2)} <span className="text-sm font-normal text-slate-400">meters</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-amber-400 font-bold">+18 cm</span> past 3 hours
            </div>
          </div>

          {/* Rainfall Intensity */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Rainfall Rate</span>
              <CloudRain className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-300 font-mono tracking-tight">
              {rainfallMmHr} <span className="text-sm font-normal text-slate-400">mm/hr</span>
            </div>
            <div className="text-[11px] text-rose-400 font-medium mt-1">
              Torrential Downpour
            </div>
          </div>

          {/* Dam Surge Capacity */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Dam Level</span>
              <Gauge className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono tracking-tight">
              {damCapacityPct}%
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full rounded-full ${damCapacityPct > 90 ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'}`}
                style={{ width: `${damCapacityPct}%` }}
              />
            </div>
          </div>

          {/* Soil Saturation */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Soil Saturation</span>
              <Droplets className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300 font-mono tracking-tight">
              {soilSaturationPct}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Runoff multiplier: <span className="text-slate-200 font-bold">2.4x</span>
            </div>
          </div>

          {/* Critical Threshold Banner */}
          <div className="col-span-2 bg-slate-950/90 border border-slate-800/90 rounded-xl p-3 flex items-center gap-3">
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${waterLevelMeters >= 4.0 ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Hydrological Alert:</strong> High upstream discharge from Eastern Aberdare / Ruwenzori catchment. Expected crest peak in <span className="text-cyan-300 font-bold font-mono">4 hours 20 mins</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
