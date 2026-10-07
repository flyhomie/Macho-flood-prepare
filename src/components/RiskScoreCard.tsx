import React from 'react';
import { ShieldAlert, Volume2, VolumeX, AlertOctagon, TrendingUp, Clock, MapPin } from 'lucide-react';
import { RiskLevel } from '../types';

interface RiskScoreCardProps {
  score: number; // 0 to 100
  riskLevel: RiskLevel;
  isSirenActive: boolean;
  onToggleSiren: () => void;
  locationName: string;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({
  score,
  riskLevel,
  isSirenActive,
  onToggleSiren,
  locationName,
}) => {
  // SVG Arc calculation for circular meter
  const radius = 70;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // We show a 240 degree arc gauge
  const strokeDashoffset = circumference - (score / 100) * (circumference * 0.75);

  let riskColor = '#10b981'; // Emerald
  let riskText = 'LOW HAZARD';
  let riskBg = 'from-emerald-950/40 via-slate-900 to-slate-950';
  let badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  if (score >= 85 || riskLevel === 'EVACUATE') {
    riskColor = '#ef4444';
    riskText = 'CRITICAL — EVACUATE NOW';
    riskBg = 'from-rose-950/60 via-slate-900 to-slate-950';
    badgeColor = 'bg-rose-500/30 text-rose-200 border-rose-500/60 animate-pulse';
  } else if (score >= 65 || riskLevel === 'SEVERE') {
    riskColor = '#f97316';
    riskText = 'SEVERE FLOOD RISK';
    riskBg = 'from-orange-950/40 via-slate-900 to-slate-950';
    badgeColor = 'bg-orange-500/20 text-orange-300 border-orange-500/40';
  } else if (score >= 40 || riskLevel === 'HIGH') {
    riskColor = '#eab308';
    riskText = 'HIGH FLOOD RISK';
    riskBg = 'from-yellow-950/30 via-slate-900 to-slate-950';
    badgeColor = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
  } else if (score >= 20 || riskLevel === 'MODERATE') {
    riskColor = '#06b6d4';
    riskText = 'MODERATE ALERT';
    riskBg = 'from-cyan-950/30 via-slate-900 to-slate-950';
    badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
  }

  return (
    <div className={`rounded-2xl border border-slate-800 p-5 shadow-2xl bg-gradient-to-b ${riskBg} relative overflow-hidden transition-all duration-500`}>
      {/* Background Warning Strobe if Severe */}
      {score >= 85 && (
        <div className="absolute inset-0 bg-rose-600/10 pointer-events-none animate-pulse" />
      )}

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>{locationName}</span>
        </div>

        {/* Siren Sound Generator Button */}
        <button
          onClick={onToggleSiren}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
            isSirenActive
              ? 'bg-rose-600 text-white animate-bounce shadow-rose-600/50'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
          title={isSirenActive ? 'Silence Emergency Siren' : 'Trigger Audio Siren Alarm'}
        >
          {isSirenActive ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>SIREN ACTIVE (MUTE)</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>SOUND SIREN</span>
            </>
          )}
        </button>
      </div>

      {/* Main Meter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Circular Arc SVG Meter */}
        <div className="relative flex items-center justify-center">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            {/* Background Track */}
            <circle
              stroke="rgba(51, 65, 85, 0.4)"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference * 0.75} ${circumference}`}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Value Track */}
            <circle
              stroke={riskColor}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference * 0.75} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Number Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black font-mono tracking-tight text-white">{score}</span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">RISK / 100</span>
          </div>
        </div>

        {/* Right: Threat Assessment & Directives */}
        <div className="flex-1 space-y-2.5 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wide border ${badgeColor}`}>
              {riskText}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14% in 2h</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {score >= 85
              ? 'Extreme flash flood threat detected in your local basin. Floodwaters crossing thresholds. Proceed to designated high ground or evacuation hubs immediately.'
              : score >= 60
              ? 'Soil fully saturated with rapid upstream influx. Low-lying roads and basement structures susceptible to flooding. Prepare Go-Bag.'
              : 'Basin levels are currently manageable. Monitor live stream telemetry and stay tuned for upstream dam releases.'}
          </p>

          {/* Crest Countdown & Quick Stat */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2 text-left">
              <div className="text-[10px] text-slate-400 flex items-center gap-1 mb-0.5">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Peak Crest ETA</span>
              </div>
              <div className="text-xs font-mono font-bold text-slate-200">
                ~ 16:45 EAT (4.3h)
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2 text-left">
              <div className="text-[10px] text-slate-400 flex items-center gap-1 mb-0.5">
                <ShieldAlert className="w-3 h-3 text-emerald-400" />
                <span>Nearest Haven</span>
              </div>
              <div className="text-xs font-mono font-bold text-emerald-300">
                1.4 km (Bearing 42° NE)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
