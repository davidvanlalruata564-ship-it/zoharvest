import React from 'react';
import { 
  Search, 
  PlusCircle,
  Sprout
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
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl mx-3 sm:mx-6 lg:mx-8 my-4 sm:my-6 shadow-xl border border-emerald-800/40">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 right-1/4 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
        
        {/* Subtle Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-800/60 text-emerald-200 border border-emerald-700/50 backdrop-blur-xs mb-3">
          <Sprout className="w-3.5 h-3.5 text-amber-400" />
          <span>Mizoram Farm Exchange</span>
        </div>

        {/* Minimalist Headline */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          {t?.heroTitle || 'Direct Farm Produce & Groceries'}
        </h1>
        
        <p className="mt-2 text-emerald-100/80 text-xs sm:text-sm max-w-lg mx-auto font-normal">
          {t?.heroSubtitle || 'Fresh harvest lots and pantry goods straight from local growers.'}
        </p>

        {/* Search Bar */}
        <div className="mt-5 max-w-xl mx-auto">
          <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-1.5 border border-emerald-700/20 focus-within:ring-2 focus-within:ring-amber-400/80 transition">
            <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t?.searchPlaceholder || 'Search produce, spices, grains, honey...'}
              className="w-full pl-2.5 pr-3 py-2 text-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden"
            />
            <button
              onClick={handlePostClick}
              className="shrink-0 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm transition shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t?.newListing || 'Post'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
