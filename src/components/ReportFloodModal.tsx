import React, { useState } from 'react';
import {
  X,
  Droplets,
  AlertTriangle,
  Camera,
  Mic,
  MicOff,
  Send,
  MapPin,
  CheckCircle,
  Users,
} from 'lucide-react';
import { CountryCode, FloodReport } from '../types';

interface ReportFloodModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: CountryCode;
  userCoords: { lat: number; lng: number };
  onSubmitReport: (report: Omit<FloodReport, 'id' | 'timestamp' | 'verifiedCount' | 'isVerified'>) => void;
}

export const ReportFloodModal: React.FC<ReportFloodModalProps> = ({
  isOpen,
  onClose,
  country,
  userCoords,
  onSubmitReport,
}) => {
  const [locationName, setLocationName] = useState('Nairobi River Basin - Outering Road');
  const [author, setAuthor] = useState('Community Scout');
  const [depthCategory, setDepthCategory] = useState<FloodReport['depthCategory']>('waist');
  const [waterSpeed, setWaterSpeed] = useState<FloodReport['waterSpeed']>('fast');
  const [selectedHazards, setSelectedHazards] = useState<string[]>(['submerged_vehicles']);
  const [description, setDescription] = useState('');
  const [trappedPeople, setTrappedPeople] = useState(0);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [hasPhoto, setHasPhoto] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const depths: { id: FloodReport['depthCategory']; label: string; height: string; icon: string }[] = [
    { id: 'ankle', label: 'Ankle Deep', height: '~10 - 20 cm', icon: '🦶' },
    { id: 'knee', label: 'Knee Deep', height: '~45 cm', icon: '🦵' },
    { id: 'waist', label: 'Waist Deep', height: '~90 cm', icon: '🚶' },
    { id: 'chest', label: 'Chest Deep', height: '~130 cm', icon: '🏊' },
    { id: 'roof', label: 'Roof / Submerged', height: '> 2.0 m', icon: '🏠' },
  ];

  const speeds: { id: FloodReport['waterSpeed']; label: string; desc: string }[] = [
    { id: 'standing', label: 'Standing / Ponding', desc: 'No active current' },
    { id: 'slow', label: 'Slow Creeping', desc: 'Slowly advancing' },
    { id: 'fast', label: 'Fast Current', desc: 'Can knock people down' },
    { id: 'torrent', label: 'Flash Torrent', desc: 'Sweeping cars/debris' },
  ];

  const availableHazards = [
    { id: 'submerged_vehicles', label: 'Submerged Vehicles' },
    { id: 'downed_powerline', label: 'Downed Powerline' },
    { id: 'bridge_damage', label: 'Bridge / Dyke Breached' },
    { id: 'mudslide', label: 'Mudslide / Debris Flow' },
    { id: 'open_manhole', label: 'Open Storm Drains' },
  ];

  const toggleHazard = (id: string) => {
    if (selectedHazards.includes(id)) {
      setSelectedHazards(selectedHazards.filter((h) => h !== id));
    } else {
      setSelectedHazards([...selectedHazards, id]);
    }
  };

  const handleVoiceToggle = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setVoiceDuration(0);
      const interval = setInterval(() => {
        setVoiceDuration((prev) => {
          if (prev >= 15) {
            clearInterval(interval);
            setIsRecordingVoice(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecordingVoice(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmitReport({
        author: author || 'Anonymous Resident',
        lat: userCoords.lat,
        lng: userCoords.lng,
        locationName: locationName || 'Local River Crossing',
        depthCategory,
        waterSpeed,
        hazards: selectedHazards,
        description: description || `Reported ${depthCategory} flood with ${waterSpeed} current.`,
        country,
        trappedPeople: trappedPeople > 0 ? trappedPeople : undefined,
      });

      setIsSubmitting(false);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-white">Report Successfully Broadcasted!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your report has been pinned to the live emergency map, shared with Red Cross dispatch, and queued for offline mesh propagation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight">
                  Report Flood Incident
                </h2>
                <p className="text-xs text-slate-400">
                  Help map water depths, road closures & trapped persons
                </p>
              </div>
            </div>

            {/* Location & GPS Fix */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Incident Location / Landmark
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Haile Selassie roundabout, Ahero bridge"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                Auto-GPS: {userCoords.lat.toFixed(5)}, {userCoords.lng.toFixed(5)}
              </div>
            </div>

            {/* Depth Selector */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Observed Water Depth:
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {depths.map((d) => (
                  <button
                    type="button"
                    key={d.id}
                    onClick={() => setDepthCategory(d.id)}
                    className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                      depthCategory === d.id
                        ? 'bg-cyan-600/20 border-cyan-400 text-cyan-300 font-bold shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl mb-0.5">{d.icon}</span>
                    <span className="text-[10px] leading-tight font-medium">{d.label}</span>
                    <span className="text-[8px] font-mono text-slate-500 mt-0.5">{d.height}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Water Velocity */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Water Flow Velocity:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {speeds.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setWaterSpeed(s.id)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      waterSpeed === s.id
                        ? 'bg-blue-600/20 border-blue-400 text-blue-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs">{s.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hazards Detected */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Active Hazards (Select all that apply):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableHazards.map((h) => {
                  const isSelected = selectedHazards.includes(h.id);
                  return (
                    <button
                      type="button"
                      key={h.id}
                      onClick={() => toggleHazard(h.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${
                        isSelected
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {h.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trapped People Counter */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-300 font-medium">Are people trapped / stranded?</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTrappedPeople(Math.max(0, trappedPeople - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold"
                >
                  -
                </button>
                <span className="font-mono text-sm font-bold text-amber-300 w-5 text-center">
                  {trappedPeople}
                </span>
                <button
                  type="button"
                  onClick={() => setTrappedPeople(trappedPeople + 1)}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Voice Note & Media Attachments */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  isRecordingVoice
                    ? 'bg-rose-600/30 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {isRecordingVoice ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-cyan-400" />}
                <span>
                  {isRecordingVoice ? `Recording... (${voiceDuration}s)` : 'Attach Voice Note (Optional)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setHasPhoto(!hasPhoto)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                  hasPhoto
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{hasPhoto ? 'Photo Attached' : 'Add Photo'}</span>
              </button>
            </div>

            {/* Additional Notes */}
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional notes for rescue team (e.g. power cut, fast rising near culvert, boats needed)"
                rows={2}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 disabled:bg-slate-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 active:scale-[0.98] transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'SUBMITTING TO NETWORK...' : 'SUBMIT FLOOD REPORT'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
