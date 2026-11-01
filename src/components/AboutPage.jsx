import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Heart, 
  Sparkles, 
  Leaf, 
  Users, 
  MapPin, 
  ArrowRight,
  Award,
  Zap,
  TrendingDown,
  Check
} from 'lucide-react';

export default function AboutPage({ onNavigateTab, t, currentLang }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 -mb-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl space-y-4">
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
            ZOHARVEST is completely free for all farmers, grower collectives, and wholesale buyers across Mizoram. No platform cuts, no listing fees, and no monthly subscriptions. Every single rupee agreed upon in negotiations flows directly to our local agricultural producers and artisans.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('marketplace')}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('donate')}
              className="bg-white/10 hover:bg-white/15 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-amber-300" />
              <span>Support Our Free Mission</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Our 100% Free Model */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <Leaf className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
            For Growers
          </span>
          <h3 className="text-base font-bold text-stone-900">0% Farmer Commission</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Producers keep 100% of their agreed sales price. No commission fees are ever deducted upon settlement or dispatch.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <TrendingDown className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
            For Wholesale Buyers
          </span>
          <h3 className="text-base font-bold text-stone-900">0% Buyer Platform Fees</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Direct farm-gate wholesale rates without artificial distributor markups or hidden brokerage expenses.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
            Security Guarantee
          </span>
          <h3 className="text-base font-bold text-stone-900">Free Escrow Protection</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Buyers deposit into a neutral, zero-risk escrow account. Payout is released to the seller only when the shipment arrives and passes verification.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md">
            Sustainability
          </span>
          <h3 className="text-base font-bold text-stone-900">Community & Grant Funded</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Operational costs are covered by civic agricultural innovation grants and voluntary community donations rather than farmer fees.
          </p>
        </div>

      </div>

      {/* Comparison: Why Direct Trade Matters */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
            Why Free Direct Trade Changes Everything
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            In remote hill districts like Mizoram, smallholders traditionally lost over a quarter of their crop value to multi-tier middleman cartels. See how ZOHARVEST completely eliminates that drag.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Traditional Middlemen</th>
                <th className="py-3 px-4">Corporate B2B Portals</th>
                <th className="py-3 px-4 bg-emerald-50 text-emerald-950 font-bold rounded-t-xl">ZOHARVEST Direct</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-stone-900">Farmer Commission</td>
                <td className="py-3 px-4 text-red-600 font-medium">15% – 30% Deducted</td>
                <td className="py-3 px-4 text-amber-700">3% – 8% Transaction Fee</td>
                <td className="py-3 px-4 bg-emerald-50 text-emerald-900 font-bold">0% (Completely Free)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-stone-900">Buyer Subscription</td>
                <td className="py-3 px-4 text-stone-500">Unregulated informal rates</td>
                <td className="py-3 px-4 text-amber-700">₹2,000 – ₹5,000 / month</td>
                <td className="py-3 px-4 bg-emerald-50 text-emerald-900 font-bold">₹0 Forever</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-stone-900">Price Transparency</td>
                <td className="py-3 px-4 text-red-600">Opaque cash price fixing</td>
                <td className="py-3 px-4 text-stone-600">Listing markup layer</td>
                <td className="py-3 px-4 bg-emerald-50 text-emerald-900 font-bold">100% Direct Negotiation</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-stone-900">Payment Security</td>
                <td className="py-3 px-4 text-red-600">High default & credit risk</td>
                <td className="py-3 px-4 text-stone-600">Third-party payment gateways</td>
                <td className="py-3 px-4 bg-emerald-50 text-emerald-900 font-bold rounded-b-xl">Guaranteed Escrow Protection</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Community Callout & Donation Link */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-10 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-amber-400" />
            <span>Support Our Community Fund</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Help Keep ZOHARVEST 100% Free
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Your generous contributions fund organic testing, moisture meters, community solar driers, and digital onboarding for rural farmer collectives across Mizoram.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('donate')}
          className="shrink-0 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Heart className="w-4 h-4" />
          <span>View Donation Listings & Support</span>
        </button>
      </div>

    </div>
  );
}
