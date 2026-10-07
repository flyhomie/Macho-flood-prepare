import React, { useState } from 'react';
import {
  Radio,
  Eye,
  Globe,
  AlertOctagon,
  Volume2,
  VolumeX,
  Sparkles,
  Accessibility,
  Check,
  ChevronDown,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';
import { CountryCode, LanguageCode, AccessibilitySettings } from '../types';
import { translations } from '../utils/translations';

interface NavbarProps {
  country: CountryCode;
  onSelectCountry: (country: CountryCode) => void;
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  accessibility: AccessibilitySettings;
  onUpdateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  onOpenSos: () => void;
  onOpenReport: () => void;
  isSirenActive: boolean;
  onToggleSiren: () => void;
  isMeshOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  country,
  onSelectCountry,
  language,
  onSelectLanguage,
  accessibility,
  onUpdateAccessibility,
  onOpenSos,
  onOpenReport,
  isSirenActive,
  onToggleSiren,
  isMeshOnline,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [showAccessMenu, setShowAccessMenu] = useState(false);

  const t = translations[language] || translations.EN;

  const countries: { code: CountryCode; name: string; flag: string }[] = [
    { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
    { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
    { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
    { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
  ];

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'EN', label: 'English', flag: '🇬🇧' },
    { code: 'SW', label: 'Kiswahili', flag: '🇰🇪' },
    { code: 'AM', label: 'አማርኛ (Amharic)', flag: '🇪🇹' },
    { code: 'LG', label: 'Luganda', flag: '🇺🇬' },
    { code: 'FR', label: 'Français', flag: '🇫🇷' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Network Status */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative">
                <Eye className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-white text-base tracking-tight leading-none flex items-center gap-1.5">
                  MACHO
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    EARLY WARNING
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-mono">
                  {isMeshOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
                  {isMeshOnline ? 'P2P MESH ACTIVE' : 'OFFLINE MODE'}
                </span>
                <span className="text-slate-600">•</span>
                <span className="hidden sm:inline text-slate-400 truncate max-w-[140px]">
                  {countries.find((c) => c.code === country)?.flag} {countries.find((c) => c.code === country)?.name}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Selectors */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Country Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCountryMenu(!showCountryMenu);
                  setShowLangMenu(false);
                  setShowAccessMenu(false);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1 transition-all"
                title="Select Country Protocol"
              >
                <span className="text-base leading-none">
                  {countries.find((c) => c.code === country)?.flag}
                </span>
                <span className="hidden md:inline font-mono">{country}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showCountryMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[10px] font-bold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                    Country Emergency Desk
                  </div>
                  {countries.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        onSelectCountry(c.code);
                        setShowCountryMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        country === c.code ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </span>
                      {country === c.code && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLangMenu(!showLangMenu);
                  setShowCountryMenu(false);
                  setShowAccessMenu(false);
                }}
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
                title="Change App Language"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline font-mono">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[10px] font-bold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                    Select Language
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onSelectLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        language === l.code ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {language === l.code && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Accessibility Quick Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowAccessMenu(!showAccessMenu);
                  setShowCountryMenu(false);
                  setShowLangMenu(false);
                }}
                className={`p-2 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  accessibility.blindMode || accessibility.deafMode
                    ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300 ring-2 ring-yellow-400/30'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
                title="Accessibility Modes (Blind / Deaf / High Contrast)"
              >
                <Accessibility className="w-4 h-4 text-yellow-400" />
                <span className="hidden md:inline">Access</span>
              </button>

              {showAccessMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Accessibility Modes
                  </div>

                  {/* Blind Mode */}
                  <label className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accessibility.blindMode}
                      onChange={(e) => onUpdateAccessibility({ blindMode: e.target.checked })}
                      className="mt-0.5 accent-yellow-400 rounded"
                    />
                    <div>
                      <div className="text-xs font-bold text-yellow-300">Blind / Low Vision Mode</div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                        High-contrast yellow/black, TTS spoken alerts, sonar navigation beacon.
                      </div>
                    </div>
                  </label>

                  {/* Deaf Mode */}
                  <label className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accessibility.deafMode}
                      onChange={(e) => onUpdateAccessibility({ deafMode: e.target.checked })}
                      className="mt-0.5 accent-rose-400 rounded"
                    />
                    <div>
                      <div className="text-xs font-bold text-rose-300">Deaf / Hard of Hearing</div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                        High-intensity flashing visual strobe, screen beacons, captions.
                      </div>
                    </div>
                  </label>

                  {/* Large Font */}
                  <label className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accessibility.largeFont}
                      onChange={(e) => onUpdateAccessibility({ largeFont: e.target.checked })}
                      className="mt-0.5 accent-cyan-400 rounded"
                    />
                    <div>
                      <div className="text-xs font-bold text-cyan-300">Large Emergency Font</div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                        Enlarged typography for urgent reading during heavy rain.
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Siren Toggle */}
            <button
              onClick={onToggleSiren}
              className={`p-2 rounded-lg border transition-all ${
                isSirenActive
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse ring-2 ring-rose-500'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
              title={isSirenActive ? 'Stop Emergency Siren' : 'Sound Emergency Siren'}
            >
              {isSirenActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Report Flood Trigger */}
            <button
              onClick={onOpenReport}
              className="hidden sm:flex px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold items-center gap-1.5 shadow-md shadow-cyan-600/20 active:scale-95 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Report Flood</span>
            </button>

            {/* Pulsing Emergency SOS Button */}
            <button
              onClick={onOpenSos}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-lg shadow-rose-600/40 animate-pulse active:scale-95 transition-all ring-2 ring-rose-500/50"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>SOS</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  language: LanguageCode;
  onOpenSos: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  language,
  onOpenSos,
}) => {
  const t = translations[language]?.tabs || translations.EN.tabs;

  // 10 Tabs as requested:
  // 1. Dashboard, 2. Map, 3. Navigate (Evac Route), 4. Protocols, 5. Streams, 6. Feed, 7. Mesh, 8. Local Net, 9. AI Assist, 10. Settings/Profile
  const primaryTabs = [
    { id: 'dashboard', label: t.dashboard, icon: '📊' },
    { id: 'map', label: t.map, icon: '🗺️' },
    { id: 'navigate', label: t.navigate, icon: '🧭' },
    { id: 'protocols', label: t.protocols, icon: '🛡️' },
    { id: 'streams', label: t.streams, icon: '📹' },
    { id: 'feed', label: t.feed, icon: '📢' },
    { id: 'mesh', label: t.mesh, icon: '📡' },
    { id: 'localNet', label: t.localNet, icon: '📶' },
    { id: 'aiAssist', label: t.aiAssist, icon: '🤖' },
    { id: 'settings', label: t.settings, icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-xl pb-safe">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-1 gap-1">
          {primaryTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex-1 min-w-[62px] py-1.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-cyan-300 font-bold border border-blue-500/40 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span className="text-lg leading-none mb-0.5">{tab.icon}</span>
                <span className="text-[10px] font-medium truncate max-w-[60px]">{tab.label}</span>
                {isActive && <span className="w-1.5 h-1 bg-cyan-400 rounded-full mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
