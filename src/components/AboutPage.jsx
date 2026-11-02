import React from 'react';
import { 
  Heart, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';

export default function AboutPage({ onNavigateTab, t, currentLang }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Card - Exclusive Theme */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-14 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 -mb-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>100% Free Public Good Platform</span>
            </span>
            <span className="bg-emerald-800/70 text-emerald-200 text-xs font-medium px-3 py-1 rounded-full border border-emerald-700/60">
              0% Commissions • ₹0 Subscriptions
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Built for Farmers, Not for Profit.
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            ZOHARVEST is completely free for all farmers, grower collectives, and wholesale buyers across Mizoram. No platform cuts, no listing fees, and no monthly subscriptions. Every single rupee flows directly to our local agricultural producers and artisans.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('marketplace')}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('donate')}
              className="bg-white/10 hover:bg-white/15 text-white font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-amber-300" />
              <span>Support Our Free Mission</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
