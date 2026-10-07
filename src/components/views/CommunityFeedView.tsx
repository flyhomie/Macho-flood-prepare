import React, { useState } from 'react';
import {
  MessageSquare,
  AlertOctagon,
  ShieldCheck,
  CheckCircle,
  ThumbsUp,
  MapPin,
  Filter,
  Plus,
  Clock,
  Share2,
} from 'lucide-react';
import { FeedPost, CountryCode } from '../../types';
import { INITIAL_FEED_POSTS } from '../../data/mockData';

interface CommunityFeedViewProps {
  country: CountryCode;
  onOpenReportModal: () => void;
}

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({
  country,
  onOpenReportModal,
}) => {
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_FEED_POSTS);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});

  const handleUpvote = (id: string) => {
    if (upvotedIds[id]) return;
    setPosts(
      posts.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
    setUpvotedIds({ ...upvotedIds, [id]: true });
  };

  const filteredPosts = posts.filter((p) => {
    if (filterType === 'ALL') return true;
    return p.type === filterType;
  });

  const getSeverityBadge = (severity: FeedPost['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
      case 'urgent':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <MessageSquare className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                Live Community Situation Feed
              </h2>
              <p className="text-xs text-slate-400">
                Verified eyewitness alerts, road impassability, and rescue dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onOpenReportModal}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-600/30 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post Situation Update</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 pt-1">
          {['ALL', 'ALERT', 'ROAD_CLOSED', 'RESCUE_REQ', 'SHELTER_UPDATE', 'WEATHER'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterType === t
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md space-y-3 transition-all hover:border-slate-700"
          >
            {/* Header / Author */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {post.isOfficial ? '🛡️' : '👤'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-white">{post.author}</span>
                    {post.isOfficial && (
                      <span className="p-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[9px] font-bold">
                        VERIFIED AGENCY
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {post.locationName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.round((Date.now() - post.timestamp) / (1000 * 60))}m ago
                    </span>
                  </div>
                </div>
              </div>

              {/* Severity Pill */}
              <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase border ${getSeverityBadge(post.severity)}`}>
                {post.type.replace('_', ' ')}
              </span>
            </div>

            {/* Post Content */}
            <div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">{post.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{post.content}</p>
            </div>

            {/* Footer / Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <button
                onClick={() => handleUpvote(post.id)}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                  upvotedIds[post.id]
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{post.upvotes} Verified / Helpful</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`${post.title} - ${post.content}`);
                }}
                className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                title="Share Alert"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
