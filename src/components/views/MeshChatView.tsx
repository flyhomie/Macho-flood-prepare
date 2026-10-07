import React, { useState } from 'react';
import {
  Radio,
  Send,
  Wifi,
  Zap,
  Battery,
  Users,
  ShieldAlert,
  Signal,
  MessageSquare,
  AlertOctagon,
} from 'lucide-react';
import { MeshMessage } from '../../types';
import { INITIAL_MESH_MESSAGES } from '../../data/mockData';
import { audioService } from '../../utils/audio';

interface MeshChatViewProps {
  onSendDistress: (text: string) => void;
}

export const MeshChatView: React.FC<MeshChatViewProps> = ({ onSendDistress }) => {
  const [messages, setMessages] = useState<MeshMessage[]>(INITIAL_MESH_MESSAGES);
  const [activeChannel, setActiveChannel] = useState<string>('emergency-broadcast');
  const [inputText, setInputText] = useState('');
  const [isBatterySaver, setIsBatterySaver] = useState(false);

  const channels = [
    { id: 'emergency-broadcast', name: '🚨 emergency-broadcast', desc: 'Critical SOS & official orders' },
    { id: 'local-safe-zone', name: '🛡️ local-safe-zone', desc: 'Shelter capacity & food supplies' },
    { id: 'medical-aid', name: '🩺 medical-aid', desc: 'First aid, insulin & wound triage' },
    { id: 'boat-rescuers', name: '🛶 boat-rescuers', desc: 'Volunteer boat & dinghy dispatch' },
    { id: 'general', name: '💬 general', desc: 'Community check-ins & queries' },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: MeshMessage = {
      id: `mm-${Date.now()}`,
      sender: 'Your_Device_Node_01',
      channel: activeChannel,
      content: inputText.trim(),
      timestamp: Date.now(),
      hops: 0, // Direct local broadcast
      rssi: -52,
      isDistress: activeChannel === 'emergency-broadcast' && inputText.toLowerCase().includes('help'),
    };

    setMessages([...messages, newMessage]);
    audioService.playSonarPing(0.4);
    setInputText('');
  };

  const filteredMessages = messages.filter((m) => m.channel === activeChannel);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Mesh Status Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                Offline P2P Mesh Network
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono">
                  BLE / WI-FI DIRECT ONLINE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Peer-to-peer ad-hoc communication when cell towers fail
              </p>
            </div>
          </div>

          {/* Battery Saver Toggle */}
          <button
            onClick={() => setIsBatterySaver(!isBatterySaver)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isBatterySaver
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Battery className="w-4 h-4 text-emerald-400" />
            <span>Battery Saver: {isBatterySaver ? 'ON (10m hops)' : 'OFF (Max Power)'}</span>
          </button>
        </div>

        {/* Channel Selection Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 pt-1">
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeChannel === ch.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{ch.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col h-[520px]">
        {/* Channel Info Bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase tracking-wide">#{activeChannel}</span>
            <span className="text-slate-400">— {channels.find((c) => c.id === activeChannel)?.desc}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
            <Signal className="w-3.5 h-3.5" />
            <span>4 Peers in Range (~180m)</span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
          {filteredMessages.map((msg) => {
            const isMe = msg.sender.includes('Your_Device');
            return (
              <div
                key={msg.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  msg.isDistress
                    ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-500/10 animate-pulse'
                    : isMe
                    ? 'bg-blue-950/40 border-blue-500/40 ml-8'
                    : 'bg-slate-950/80 border-slate-800 mr-8'
                }`}
              >
                {/* Header Meta */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold ${isMe ? 'text-cyan-400' : 'text-slate-200'}`}>
                      {msg.sender}
                    </span>
                    {msg.isDistress && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold uppercase text-[8px]">
                        DISTRESS
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>
                      {msg.hops === 0 ? 'Direct 0-hop' : `Relayed via ${msg.hops} hop(s)`}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">{msg.rssi} dBm</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-slate-100 text-xs leading-relaxed">{msg.content}</p>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-slate-800 mt-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Broadcast message across #${activeChannel}...`}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>BROADCAST</span>
          </button>
        </form>
      </div>
    </div>
  );
};
