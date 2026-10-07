import React, { useState } from 'react';
import {
  Video,
  Radio,
  Eye,
  Activity,
  Waves,
  Camera,
  MessageSquare,
  Send,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { LiveStreamCam } from '../../types';
import { INITIAL_LIVE_STREAMS } from '../../data/mockData';

export const LiveStreamsView: React.FC = () => {
  const [streams] = useState<LiveStreamCam[]>(INITIAL_LIVE_STREAMS);
  const [activeCam, setActiveCam] = useState<LiveStreamCam>(INITIAL_LIVE_STREAMS[0]);
  const [isCitizenBroadcasting, setIsCitizenBroadcasting] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { user: string; text: string; time: string }[]
  >([
    { user: 'RedCross_Observer', text: 'Water level up +14cm in the last hour.', time: '14:20' },
    { user: 'Kiprono_Garissa', text: 'Road below bridge has 40cm of overflow now.', time: '14:22' },
    { user: 'Disaster_Drone_02', text: 'Downstream floodgates opened 25%.', time: '14:24' },
  ]);
  const [newChat, setNewChat] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChat.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        user: 'You (Citizen Scout)',
        text: newChat.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewChat('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Stream Player Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Video className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                Live River Basin & Drone Surveillance
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-mono animate-pulse">
                  ● LIVE FEED
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Hydrological cameras and drone monitoring for early crest detection
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCitizenBroadcasting(!isCitizenBroadcasting)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isCitizenBroadcasting
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{isCitizenBroadcasting ? 'STOP CITIZEN CAM' : 'START CITIZEN STREAM'}</span>
          </button>
        </div>

        {/* Video Screen & Telemetry HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Video Screen Container */}
          <div className="lg:col-span-8 space-y-3">
            <div className="relative w-full aspect-video bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
              {/* Dynamic Animated River Cam Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-end">
                {/* River Wave motion in video simulator */}
                <div className="relative w-full h-3/5 bg-slate-900/60 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/40 via-blue-900/30 to-transparent" />
                  {/* Water turbulence wave */}
                  <div className="absolute -top-6 left-0 w-[200%] h-12 flex animate-wave opacity-60">
                    <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-full fill-current text-cyan-700">
                      <path d="M0,25 C150,50 350,0 500,25 L500,50 L0,50 Z" />
                    </svg>
                  </div>
                  {/* Floating Debris / Bridge Marker in simulation */}
                  <div className="absolute top-1/2 left-1/3 text-2xl animate-bounce">🌊</div>
                </div>
              </div>

              {/* Citizen Stream Overlay if active */}
              {isCitizenBroadcasting && (
                <div className="absolute inset-0 bg-rose-950/40 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center animate-ping mb-2">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-white font-extrabold text-sm">
                    CITIZEN SURVEILLANCE LIVE RELAY
                  </div>
                  <p className="text-xs text-rose-200 mt-1">
                    Broadcasting water level telemetry to East African Disaster Network
                  </p>
                </div>
              )}

              {/* HUD Telemetry Overlay (Top) */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-cyan-300 bg-slate-950/80 p-2 rounded-xl border border-slate-800 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-bold text-white uppercase">{activeCam.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>FPS: 30.0</span>
                  <span>{new Date().toLocaleTimeString()} EAT</span>
                  <span className="text-slate-400">👁️ {activeCam.viewers} watching</span>
                </div>
              </div>

              {/* HUD Gauge Overlay (Bottom) */}
              <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2 bg-slate-950/85 p-2.5 rounded-xl border border-slate-800/90 text-xs font-mono backdrop-blur-md">
                <div>
                  <div className="text-[10px] text-slate-400">STAGE</div>
                  <div className="text-rose-400 font-bold truncate">{activeCam.crestStage}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">WATER LEVEL</div>
                  <div className="text-cyan-300 font-bold">{activeCam.waterLevelMeters} m</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">DISCHARGE</div>
                  <div className="text-amber-300 font-bold">{activeCam.waterFlowRate} m³/s</div>
                </div>
              </div>
            </div>

            {/* Selected Camera Details */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-white">{activeCam.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{activeCam.location} • Status: {activeCam.cameraStatus}</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold">
                {activeCam.videoType.toUpperCase()} FEED
              </span>
            </div>
          </div>

          {/* Right: Live Stream Chat & Observation Log */}
          <div className="lg:col-span-4 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col h-full min-h-[360px]">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 pb-2 border-b border-slate-800">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Live Observer Feed</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1 text-xs">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-xl">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                    <span className="font-bold text-cyan-400">{msg.user}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-slate-200">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={newChat}
                onChange={(e) => setNewChat(e.target.value)}
                placeholder="Post river observation..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Available River Cam Channel Switcher */}
        <div className="mt-6">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Available East Africa Basin Cams
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {streams.map((cam) => {
              const isSelected = activeCam.id === cam.id;
              return (
                <button
                  key={cam.id}
                  onClick={() => setActiveCam(cam)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-600/20 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span className="truncate max-w-[120px]">{cam.title}</span>
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>{cam.location}</span>
                    <span className="text-cyan-400 font-bold">{cam.waterLevelMeters}m</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
