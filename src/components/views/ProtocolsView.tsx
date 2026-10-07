import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Droplets,
  HeartPulse,
  CheckSquare,
  Sparkles,
  AlertTriangle,
  Flame,
  Sun,
  FileDown,
} from 'lucide-react';
import { CountryCode } from '../../types';
import { COUNTRY_PROTOCOLS } from '../../data/mockData';

interface ProtocolsViewProps {
  country: CountryCode;
  onSelectCountry: (code: CountryCode) => void;
}

export const ProtocolsView: React.FC<ProtocolsViewProps> = ({
  country,
  onSelectCountry,
}) => {
  const [activeStage, setActiveStage] = useState<'during' | 'before' | 'after' | 'purification'>('during');

  const protocol = COUNTRY_PROTOCOLS[country] || COUNTRY_PROTOCOLS.KE;

  const countries: { code: CountryCode; label: string; flag: string }[] = [
    { code: 'KE', label: 'Kenya (NDOC / KRCS)', flag: '🇰🇪' },
    { code: 'TZ', label: 'Tanzania (DMD / TRCS)', flag: '🇹🇿' },
    { code: 'UG', label: 'Uganda (OPM / URCS)', flag: '🇺🇬' },
    { code: 'ET', label: 'Ethiopia (EDRMC / ERCS)', flag: '🇪🇹' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Country Selector Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{protocol.flag}</span>
              <h2 className="text-xl font-black text-white tracking-tight">
                {protocol.countryName} National Disaster Protocols
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Official coordination: <span className="text-cyan-300 font-semibold">{protocol.emergencyLeadAgency}</span>
            </p>
          </div>

          {/* Country Quick Switcher */}
          <div className="flex flex-wrap gap-1.5">
            {countries.map((c) => (
              <button
                key={c.code}
                onClick={() => onSelectCountry(c.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  country === c.code
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.code}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Dispatch Hotlines */}
        <div className="mt-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
            Direct Emergency Response Hotlines
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {protocol.hotlines.map((hotline, idx) => (
              <a
                key={idx}
                href={`tel:${hotline.phone}`}
                className="bg-slate-950/80 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-3.5 flex items-center justify-between group transition-all"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-rose-300 transition-colors">
                    {hotline.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{hotline.description}</div>
                  <div className="text-sm font-black font-mono text-cyan-400 mt-1 flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                    {hotline.phone}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-600/20 text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-all">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Protocol Stage Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveStage('during')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeStage === 'during'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>DURING FLOODING</span>
        </button>

        <button
          onClick={() => setActiveStage('before')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeStage === 'before'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>BEFORE / WARNING</span>
        </button>

        <button
          onClick={() => setActiveStage('after')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeStage === 'after'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>AFTER / RECOVERY</span>
        </button>

        <button
          onClick={() => setActiveStage('purification')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeStage === 'purification'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Droplets className="w-4 h-4" />
          <span>WATER PURIFICATION</span>
        </button>
      </div>

      {/* Protocol Content Body */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        {activeStage === 'during' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-white">
                Active Flood Survival Directives ({protocol.countryName})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {protocol.duringFloodSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3.5"
                >
                  <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-rose-500/30">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStage === 'before' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-cyan-400">
              <CheckSquare className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-white">
                Early Warning & Preparedness Checklist
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {protocol.beforeFloodSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3.5"
                >
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-cyan-500/30">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStage === 'after' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-emerald-400">
              <HeartPulse className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-white">
                Post-Flood Sanitation & Disease Prevention
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {protocol.afterFloodSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3.5"
                >
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            {/* Disease Prevention Callout */}
            <div className="mt-4 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                Epidemic Prevention (Cholera, Typhoid, Malaria):
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {protocol.diseasePreventionTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeStage === 'purification' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-blue-400">
              <Droplets className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-white">
                Emergency Water Purification Guide
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Boiling */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                  <Flame className="w-4 h-4" />
                  <span>1. Rolling Boil Method</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bring clear water to a vigorous rolling boil for a minimum of <strong>3 full minutes</strong>. In high altitudes (e.g. Addis Ababa 2300m), boil for 5 minutes.
                </p>
              </div>

              {/* Aquatabs / Chlorine */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase">
                  <Droplets className="w-4 h-4" />
                  <span>2. Chlorine / Aquatabs</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Add <strong>1 Aquatabs tablet</strong> per 20 Liters of water. Or <strong>4 drops of plain 5% bleach</strong> per 1 Liter. Stir and wait <strong>30 minutes</strong>.
                </p>
              </div>

              {/* Solar SODIS */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase">
                  <Sun className="w-4 h-4" />
                  <span>3. Solar SODIS Disinfection</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fill clear transparent plastic PET bottles. Shake vigorously for oxygenation. Lay horizontally on corrugated tin roof in full direct sun for <strong>6 hours</strong>.
                </p>
              </div>

              {/* Sediment Filtration */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>4. Makeshift Cloth/Sand Filter</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Filter murky flood water through 4 layers of clean cotton fabric or a clean sand container before chlorinating or boiling. Never drink raw muddy runoff.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
