import React from 'react';
import { 
  Search, 
  MapPin, 
  PlusCircle,
  MessageCircle,
  CreditCard,
  Sprout,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function HeroBanner({ t, searchTerm, setSearchTerm, onNewListingClick, currentUser, onOpenAuth }) {
  const handlePostClick = () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      else if (onNewListingClick) onNewListingClick();
    } else {
      if (onNewListingClick) onNewListingClick();
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 shadow-xl border border-emerald-800/40">
      {/* Gentle ambient background glows */}
      <div className="absolute top-0 right-1/4 -mt-20 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-6 py-10 sm:py-14 text-center">
        
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-800/70 text-emerald-200 border border-emerald-700/60 backdrop-blur-sm mb-4">
          <Sprout className="w-3.5 h-3.5 text-amber-400" />
          <span>Mizoram Farm-to-Buyer Direct Marketplace</span>
          <span className="text-emerald-400">•</span>
          <span className="text-emerald-300">Fresh Harvest & Local Groceries</span>
        </div>

        {/* Minimalist Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {t?.heroTitle || 'Direct Farm Produce & Groceries from Mizoram'}
        </h1>
        
        <p className="mt-3 text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
          {t?.heroSubtitle || 'Browse harvest lots and local pantry goods straight from grassroots growers. View Instagram-style seller profiles, chat directly on WhatsApp, and pay via GPay or Bank Transfer with 0% platform fee.'}
        </p>

        {/* Clean, Simple Search Bar */}
        <div className="mt-7 max-w-2xl mx-auto">
          <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-1.5 border border-emerald-700/20 focus-within:ring-2 focus-within:ring-amber-400/80 transition">
            <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t?.searchPlaceholder || 'Search ginger, bird’s eye chilli, turmeric, rice, wild honey...'}
              className="w-full pl-3 pr-3 py-2.5 text-slate-800 text-sm font-medium focus:outline-hidden"
            />
            <button
              onClick={handlePostClick}
              className="shrink-0 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t?.newListing || 'Post Produce'}</span>
            </button>
          </div>
        </div>

        {/* Direct P2P Feature Highlights */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-emerald-200/90">
          <div className="flex items-center gap-1.5 bg-emerald-900/50 px-3 py-1 rounded-full border border-emerald-800/60">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp & Phone Contact</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-900/50 px-3 py-1 rounded-full border border-emerald-800/60">
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>GPay & Direct Bank Transfer</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-900/50 px-3 py-1 rounded-full border border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>0% Platform Commission</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-900/50 px-3 py-1 rounded-full border border-emerald-800/60">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct P2P Connections</span>
          </div>
        </div>

      </div>
    </div>
  );
}
