import React, { useState } from 'react';
import {
  Wifi,
  Radio,
  Download,
  CheckCircle2,
  Share2,
  Smartphone,
  Server,
  Zap,
  Battery,
  Signal,
  Compass,
} from 'lucide-react';
import { LocalDevice } from '../../types';
import { INITIAL_LOCAL_DEVICES } from '../../data/mockData';

export const LocalNetView: React.FC = () => {
  const [devices, setDevices] = useState<LocalDevice[]>(INITIAL_LOCAL_DEVICES);
  const [isScanning, setIsScanning] = useState(true);
  const [downloadedPacks, setDownloadedPacks] = useState<Record<string, boolean>>({
    'pack-maps': true,
  });

  const offlinePacks = [
    {
      id: 'pack-maps',
      title: 'East Africa Offline Safe Zone Map Pack',
      size: '24.5 MB',
      description: 'Pre-cached high ground contours, shelter GPS nodes, and river valley shapes for KE, TZ, UG, ET.',
    },
    {
      id: 'pack-firstaid',
      title: 'Red Cross First Aid & Water Purification Manual',
      size: '4.2 MB',
      description: 'Offline medical protocol for hypothermia, cholera rehydration, snakebites, and chlorine dosing.',
    },
    {
      id: 'pack-contacts',
      title: 'Regional Emergency Hotlines & Radio Frequencies',
      size: '1.1 MB',
      description: 'VHF marine channels, county disaster desks, and amateur radio frequencies.',
    },
  ];

  const handleToggleDownload = (id: string) => {
    setDownloadedPacks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Wifi className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                Local Device Radar & P2P Relays
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono">
                  {devices.length} NODES DISCOVERED
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Discover nearby phones, disaster repeaters, and share emergency bundles
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsScanning(!isScanning)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isScanning
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Radio className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'RADAR SCANNING...' : 'PAUSE SCAN'}</span>
          </button>
        </div>

        {/* Radar & Devices Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Animated Radar Graphic */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4">
            <div className="relative w-56 h-56 rounded-full border-2 border-cyan-500/30 bg-slate-950 flex items-center justify-center overflow-hidden shadow-2xl">
              {/* Concentric distance rings */}
              <div className="absolute w-44 h-44 rounded-full border border-slate-800" />
              <div className="absolute w-32 h-32 rounded-full border border-slate-800" />
              <div className="absolute w-20 h-20 rounded-full border border-cyan-500/20" />

              {/* Crosshairs */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1px] bg-slate-800" />
                <div className="h-full w-[1px] bg-slate-800 absolute" />
              </div>

              {/* Radar Rotating Sweep Line */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center animate-radar origin-center pointer-events-none">
                  <div className="w-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-cyan-300 origin-left self-center" />
                </div>
              )}

              {/* Blip for user device */}
              <div className="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-lg shadow-cyan-400/50 z-10" />

              {/* Blips for nearby discovered nodes */}
              <div className="absolute top-12 left-16 w-3 h-3 rounded-full bg-emerald-400 animate-ping" title="Red Cross Gateway" />
              <div className="absolute bottom-14 right-14 w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" title="Volunteer Phone" />
              <div className="absolute top-20 right-10 w-2.5 h-2.5 rounded-full bg-amber-400" title="Drone Relay" />
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-2">
              Scanning 2.4GHz / BLE Mesh Radius ~1.5km
            </div>
          </div>

          {/* Right: Discovered Node Cards */}
          <div className="md:col-span-7 space-y-2.5">
            {devices.map((device) => (
              <div
                key={device.id}
                className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-3 flex items-center justify-between transition-all hover:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-cyan-400">
                    {device.type === 'phone' ? (
                      <Smartphone className="w-4 h-4" />
                    ) : (
                      <Server className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">{device.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                      <span>Distance: ~{device.distanceMeters}m</span>
                      <span>•</span>
                      <span className="text-emerald-400">{device.rssi} dBm</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Battery className="w-3 h-3 text-emerald-400" />
                    {device.batteryLevel}%
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold uppercase">
                    {device.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Offline Emergency Bundles & Storage Pack */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white">Offline Emergency Resource Bundles</h3>
            <p className="text-xs text-slate-400">Download for guaranteed 100% offline access during blackout</p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            Storage Used: 24.5 MB
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {offlinePacks.map((pack) => {
            const isSaved = downloadedPacks[pack.id];
            return (
              <div
                key={pack.id}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span>{pack.title}</span>
                    <span className="text-[10px] text-cyan-400 font-mono">{pack.size}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{pack.description}</p>
                </div>

                <button
                  onClick={() => handleToggleDownload(pack.id)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isSaved
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                  }`}
                >
                  {isSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'SAVED OFFLINE ✓' : 'DOWNLOAD PACK'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
