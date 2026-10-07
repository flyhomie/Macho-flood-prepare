import React from 'react';
import {
  Settings,
  Accessibility,
  Eye,
  Volume2,
  Globe,
  Shield,
  HeartPulse,
  Save,
  Trash2,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';
import {
  CountryCode,
  LanguageCode,
  AccessibilitySettings,
  EmergencyProfile,
} from '../../types';

interface SettingsViewProps {
  country: CountryCode;
  onSelectCountry: (c: CountryCode) => void;
  language: LanguageCode;
  onSelectLanguage: (l: LanguageCode) => void;
  accessibility: AccessibilitySettings;
  onUpdateAccessibility: (s: Partial<AccessibilitySettings>) => void;
  emergencyProfile: EmergencyProfile;
  onUpdateProfile: (p: EmergencyProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  country,
  onSelectCountry,
  language,
  onSelectLanguage,
  accessibility,
  onUpdateAccessibility,
  emergencyProfile,
  onUpdateProfile,
}) => {
  const [profile, setProfile] = React.useState<EmergencyProfile>(emergencyProfile);
  const [saved, setSaved] = React.useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Settings className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">
              Settings, Accessibility & ICE Emergency Profile
            </h2>
            <p className="text-xs text-slate-400">
              Customize language, accessibility assistance & medical rescue credentials
            </p>
          </div>
        </div>

        {/* Accessibility Grid */}
        <div className="mt-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Accessibility className="w-4 h-4 text-yellow-400" />
            <span>Inclusive Accessibility Modes</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Blind Mode Toggle */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-yellow-400 flex items-center gap-1.5">
                  <span>Blind / Low Vision Mode</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  High-contrast yellow-on-black UI, spoken Text-to-Speech alerts, and directional sonar navigation beeps.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={accessibility.blindMode}
                  onChange={(e) => onUpdateAccessibility({ blindMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500" />
              </label>
            </div>

            {/* Deaf Mode Toggle */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
                  <span>Deaf / Hard of Hearing Mode</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  High-intensity visual flashing strobes on critical alerts, visual vibration cues, and closed captions.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={accessibility.deafMode}
                  onChange={(e) => onUpdateAccessibility({ deafMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600" />
              </label>
            </div>

            {/* Large Typography */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-cyan-400">Large Typography & Touch Targets</div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Enlarges text and buttons for high-stress operation and wet screen conditions.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={accessibility.largeFont}
                  onChange={(e) => onUpdateAccessibility({ largeFont: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
              </label>
            </div>

            {/* Audio Siren Allowed */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-emerald-400">Automatic Audio Siren on Evac</div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Triggers loud oscillating siren tone when risk score exceeds 85% threshold.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={accessibility.audioSirenEnabled}
                  onChange={(e) => onUpdateAccessibility({ audioSirenEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency ICE Profile Card */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-base text-white">
              In Case of Emergency (ICE) Medical Profile
            </h3>
          </div>
          {saved && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Saved to Offline Storage!
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400">
          This data is stored encrypted on device and attached automatically when you broadcast a distress SOS to Red Cross responders.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Full Name / Alias</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Blood Group</label>
            <select
              value={profile.bloodType}
              onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Unknown'].map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Emergency ICE Contact Name</label>
            <input
              type="text"
              value={profile.iceContactName}
              onChange={(e) => setProfile({ ...profile, iceContactName: e.target.value })}
              placeholder="e.g. Next of kin, spouse, neighbor"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Emergency ICE Contact Phone</label>
            <input
              type="tel"
              value={profile.iceContactPhone}
              onChange={(e) => setProfile({ ...profile, iceContactPhone: e.target.value })}
              placeholder="e.g. +254 712 345678"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-slate-400 font-semibold block mb-1">
              Critical Medical Conditions / Allergies / Prescriptions
            </label>
            <input
              type="text"
              value={profile.medicalConditions}
              onChange={(e) => setProfile({ ...profile, medicalConditions: e.target.value })}
              placeholder="e.g. Asthmatic (inhaler needed), Diabetic, Penicillin allergy"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              id="mobility"
              checked={profile.mobilityImpaired}
              onChange={(e) => setProfile({ ...profile, mobilityImpaired: e.target.checked })}
              className="rounded accent-rose-500"
            />
            <label htmlFor="mobility" className="text-slate-300 font-medium">
              Mobility impaired (requires wheelchair / boat rescue)
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 active:scale-[0.98] transition-all"
        >
          <Save className="w-4 h-4" />
          <span>SAVE EMERGENCY PROFILE TO DEVICE</span>
        </button>
      </form>
    </div>
  );
};
