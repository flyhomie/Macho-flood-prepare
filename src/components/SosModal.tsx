import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  PhoneCall,
  Radio,
  MapPin,
  X,
  Volume2,
  Copy,
  Check,
  Zap,
  Users,
  HeartPulse,
  Share2,
} from 'lucide-react';
import { CountryCode, EmergencyProfile } from '../types';
import { COUNTRY_PROTOCOLS } from '../data/mockData';
import { audioService } from '../utils/audio';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: CountryCode;
  userCoords: { lat: number; lng: number; accuracy?: number };
  emergencyProfile: EmergencyProfile;
  onBroadcastSosMesh: (payload: {
    lat: number;
    lng: number;
    trapped: number;
    medical: string;
  }) => void;
}

export const SosModal: React.FC<SosModalProps> = ({
  isOpen,
  onClose,
  country,
  userCoords,
  emergencyProfile,
  onBroadcastSosMesh,
}) => {
  const [isStrobeActive, setIsStrobeActive] = useState(true);
  const [copied, setCopied] = useState(false);
  const [trappedCount, setTrappedCount] = useState(emergencyProfile.householdMembers || 1);
  const [medicalUrgency, setMedicalUrgency] = useState(
    emergencyProfile.medicalConditions || 'No critical medication required'
  );
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastDone, setBroadcastDone] = useState(false);

  const protocol = COUNTRY_PROTOCOLS[country] || COUNTRY_PROTOCOLS.KE;
  const leadHotline = protocol.hotlines[0] || { phone: '1199', name: 'Emergency Rescue' };

  useEffect(() => {
    if (isOpen) {
      // Trigger Morse SOS tone on open
      audioService.playMorseSos();
      audioService.vibrate([300, 100, 300, 100, 600, 200, 600]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLocation = () => {
    const text = `EMERGENCY SOS: My GPS is Lat: ${userCoords.lat.toFixed(6)}, Lng: ${userCoords.lng.toFixed(6)} (Accuracy ~${userCoords.accuracy || 15}m). Trapped: ${trappedCount} person(s). Needs: ${medicalUrgency}. Please send rescue!`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSendMeshSos = () => {
    setIsBroadcasting(true);
    audioService.playMorseSos();
    setTimeout(() => {
      onBroadcastSosMesh({
        lat: userCoords.lat,
        lng: userCoords.lng,
        trapped: trappedCount,
        medical: medicalUrgency,
      });
      setIsBroadcasting(false);
      setBroadcastDone(true);
      setTimeout(() => setBroadcastDone(false), 5000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Visual Strobe Overlay */}
      {isStrobeActive && (
        <div className="fixed inset-0 bg-rose-600/20 pointer-events-none animate-sos z-[-1]" />
      )}

      <div className="bg-slate-950 border-2 border-rose-600 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl shadow-rose-600/40 relative animate-in fade-in zoom-in-95 my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/50 animate-bounce">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight uppercase">
                EMERGENCY DISTRESS (SOS)
              </h2>
              <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 border border-rose-500/50 text-[10px] font-black uppercase">
                CRITICAL
              </span>
            </div>
            <p className="text-xs text-rose-300/90 mt-0.5">
              Live coordinates locked. Direct emergency link to {protocol.countryName} responders.
            </p>
          </div>
        </div>

        {/* GPS Location Box */}
        <div className="bg-slate-900/90 border border-rose-500/40 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Locked GPS Fix
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Accuracy: ±{userCoords.accuracy || 12}m
            </span>
          </div>

          <div className="text-base font-mono font-bold text-white tracking-wide bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span>
              {userCoords.lat.toFixed(6)}, {userCoords.lng.toFixed(6)}
            </span>
            <button
              onClick={handleCopyLocation}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
              title="Copy GPS"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Rescue Details Form */}
        <div className="space-y-3 mb-5">
          <div className="grid grid-cols-2 gap-3">
            {/* Trapped Count */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Persons Trapped
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTrappedCount(Math.max(1, trappedCount - 1))}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold"
                >
                  -
                </button>
                <span className="font-mono font-bold text-lg text-white flex-1 text-center">
                  {trappedCount}
                </span>
                <button
                  type="button"
                  onClick={() => setTrappedCount(trappedCount + 1)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Blood Type / Special Needs */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                Blood & Mobility
              </label>
              <div className="text-xs font-mono text-slate-200 mt-1">
                {emergencyProfile.bloodType || 'Type O+'} • {emergencyProfile.mobilityImpaired ? 'Mobility Impaired' : 'Mobile'}
              </div>
            </div>
          </div>

          {/* Urgent Note */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Urgent Medical / Situation Details:
            </label>
            <input
              type="text"
              value={medicalUrgency}
              onChange={(e) => setMedicalUrgency(e.target.value)}
              placeholder="e.g. Elderly on roof, diabetic insulin needed, water at window"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2.5">
          {/* Direct Emergency Call Button */}
          <a
            href={`tel:${leadHotline.phone}`}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-600/40 active:scale-[0.98] transition-all ring-2 ring-rose-400/50"
          >
            <PhoneCall className="w-5 h-5 animate-pulse" />
            <span>CALL {leadHotline.agency} ({leadHotline.phone})</span>
          </a>

          {/* Broadcast to Local Offline Mesh */}
          <button
            onClick={handleSendMeshSos}
            disabled={isBroadcasting}
            className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all"
          >
            <Radio className={`w-4 h-4 ${isBroadcasting ? 'animate-spin' : 'animate-ping'}`} />
            <span>
              {isBroadcasting
                ? 'BROADCASTING DISTRESS OVER MESH...'
                : broadcastDone
                ? '✓ DISTRESS BEACON BROADCASTED'
                : 'BROADCAST SOS OVER OFFLINE MESH RADAR'}
            </span>
          </button>

          {/* Sound Strobe / Morse Re-trigger */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => audioService.playMorseSos()}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-amber-300 flex items-center justify-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>Play Morse SOS Audio</span>
            </button>

            <button
              onClick={() => setIsStrobeActive(!isStrobeActive)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Strobe: {isStrobeActive ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
