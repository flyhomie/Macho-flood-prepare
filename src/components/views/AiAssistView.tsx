import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  ShieldCheck,
  Flame,
  Droplets,
  HeartPulse,
  Compass,
  AlertTriangle,
} from 'lucide-react';
import { querySafetyAssistant } from '../../utils/ai';
import { audioService } from '../../utils/audio';

export const AiAssistView: React.FC = () => {
  const [messages, setMessages] = useState<
    { sender: 'user' | 'ai'; text: string; time: string }[]
  >([
    {
      sender: 'ai',
      text: `👋 Hello! I am the Macho AI Disaster Safety Assistant. I can help you with immediate flood survival procedures, water purification dosing, snakebite treatment, rooftop signaling, and evacuation tactics. What emergency assistance do you need?`,
      time: '12:00',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const quickChips = [
    'Water rising into house, what to do?',
    'How to purify flood water to drink?',
    'Flood snakebite emergency first aid',
    'How to signal rescue helicopter',
    'How to prevent cholera & diarrhea',
    'Can I drive or walk through floodwater?',
  ];

  const handleSend = async (queryText?: string) => {
    const prompt = queryText || inputText;
    if (!prompt.trim() || isLoading) return;

    const userMsg = {
      sender: 'user' as const,
      text: prompt.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await querySafetyAssistant(prompt);
      const aiMsg = {
        sender: 'ai' as const,
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Emergency Safety Notice: Move to high ground immediately, shut off electricity, and do not wade through fast water.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakText = (text: string) => {
    setIsSpeaking(true);
    audioService.speak(text.replace(/[*_#•]/g, ''));
    setTimeout(() => setIsSpeaking(false), 8000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              AI Emergency Safety Specialist
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono">
                GEMINI + OFFLINE PROTOCOL
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Immediate triage, survival methods & water purification advisor
            </p>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Urgent Questions:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs transition-all active:scale-95 text-left"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-xs">
          {messages.map((msg, idx) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  isAi
                    ? 'bg-slate-950/90 border-slate-800 mr-4'
                    : 'bg-blue-950/40 border-blue-500/40 ml-8'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2">
                  <span className={`font-bold ${isAi ? 'text-cyan-400' : 'text-slate-200'}`}>
                    {isAi ? '🤖 Macho Safety AI' : '👤 You'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{msg.time}</span>
                    {isAi && (
                      <button
                        onClick={() => handleSpeakText(msg.text)}
                        className="p-1 rounded bg-slate-800 text-slate-300 hover:text-cyan-400"
                        title="Read aloud via Text-to-Speech"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-slate-100 text-xs leading-relaxed whitespace-pre-line">
                  {msg.text}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 mr-4 text-cyan-400 text-xs flex items-center gap-2 font-mono animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>Analyzing safety protocol & calculating triage steps...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2 pt-3 border-t border-slate-800 mt-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything (e.g. 'How to purify flood water?')"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>ASK AI</span>
          </button>
        </form>
      </div>
    </div>
  );
};
