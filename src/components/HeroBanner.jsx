import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Search, 
  MapPin, 
  Check, 
  PlusCircle,
  Truck,
  Leaf,
  Scale
} from 'lucide-react';

export default function HeroBanner({ t, searchTerm, setSearchTerm, onNewListingClick, currentRole }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 shadow-xl border border-emerald-800/40">
      {/* Gentle ambient background glows */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 -mb-20 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-10 sm:py-12 sm:px-10">
        
        {/* Subtle Pill Tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800/70 text-emerald-200 border border-emerald-700/60 backdrop-blur-sm">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mizoram Farm-to-Business Direct</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-emerald-300/80">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>All 11 Districts</span>
          </span>
        </div>

        {/* Main Content & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              {t.heroTitle}
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              {t.heroSubtitle}
            </p>

            {/* Clean, Simple Search Bar */}
            <div className="pt-2 max-w-xl">
              <div className="relative flex items-center bg-white rounded-2xl shadow-lg p-1.5 border border-emerald-700/20 focus-within:ring-2 focus-within:ring-amber-400/80 transition">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-3 pr-3 py-2 text-slate-800 text-xs sm:text-sm font-medium focus:outline-hidden"
                />
                {currentRole === 'farmer' && (
                  <button
                    onClick={onNewListingClick}
                    className="shrink-0 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{t.newListing}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Trust Highlights */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs text-emerald-200/90">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Zero Middlemen Markups</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Escrow Protected Payments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Direct Farmer Settlement</span>
              </div>
            </div>
          </div>

          {/* Right Highlights Card */}
          <div className="lg:col-span-4 bg-emerald-950/50 backdrop-blur-md rounded-2xl p-6 border border-emerald-800/60 shadow-sm space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Why Buy Direct?</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-900/80 rounded-xl text-emerald-300 shrink-0">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Authentic & Certified</h4>
                  <p className="text-[11px] text-emerald-200/80 leading-normal">GI tagged Mizo chilli, organic turmeric, and wild mountain ginger directly from grower collectives.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-900/80 rounded-xl text-emerald-300 shrink-0">
                  <Scale className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Open Price Negotiation</h4>
                  <p className="text-[11px] text-emerald-200/80 leading-normal">Agree on volume pricing, packaging, and custom delivery timelines directly with producers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-900/80 rounded-xl text-emerald-300 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Safe Escrow Payouts</h4>
                  <p className="text-[11px] text-emerald-200/80 leading-normal">Payment is secured in escrow and only released once your consignment arrives and passes inspection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
