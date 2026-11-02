import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  BarChart, 
  ArrowRight,
  Layers,
  Building,
  Target
} from 'lucide-react';

export default function RevenueModelExplainer({ t }) {
  const [projectedGMV, setProjectedGMV] = useState(2500000); // 25 Lakhs
  const [takeRate, setTakeRate] = useState(2.5); // 2.5%

  const commissionRevenue = Math.round(projectedGMV * (takeRate / 100));
  const subscriptionRevenue = 45000; // Estimated 15 FPOs & Buyers @ ₹3,000/mo
  const promotedListingRevenue = 20000;
  const totalMonthlyRunRate = commissionRevenue + subscriptionRevenue + promotedListingRevenue;
  const annualRunRate = totalMonthlyRunRate * 12;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-800/40">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>Sustainable Fair Trade</span>
          </span>
          <span className="bg-emerald-800/70 text-emerald-200 text-xs font-medium px-3 py-1 rounded-full border border-emerald-700/60">
            Mizoram Direct Agriculture & Craft Exchange
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Platform Model & Community Impact
        </h2>
        <p className="text-emerald-100/90 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          ZOHARVEST connects regional farmer cooperatives directly to verified wholesale buyers, maximizing producer incomes while keeping bulk procurement transparent and secure.
        </p>
      </div>

      {/* 3 Core Revenue Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Channel 1 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-extrabold text-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Primary Channel</span>
            <h3 className="text-lg font-extrabold text-slate-900">Transaction Commissions</h3>
            <div className="text-2xl font-black text-emerald-900 font-sans mt-1">2% to 5%</div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Automated take-rate deducted upon escrow settlement on every fulfilled wholesale consignment. Low enough to undercut 10-15% middleman commission agents while sustaining platform growth.
          </p>
          <div className="pt-2 text-[11px] font-bold text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
            Target: All fulfilled marketplace trades
          </div>
        </div>

        {/* Channel 2 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-extrabold text-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Recurring Channel</span>
            <h3 className="text-lg font-extrabold text-slate-900">B2B Subscriptions</h3>
            <div className="text-2xl font-black text-amber-600 font-sans mt-1">₹1,999 - ₹4,999/mo</div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tiered premium membership for institutional wholesale buyers, export houses, and large FPO federations offering priority RFQ alerts, advance harvest access, and cold-chain logistics discounts.
          </p>
          <div className="pt-2 text-[11px] font-bold text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
            Target: High-volume Buyers & FPOs
          </div>
        </div>

        {/* Channel 3 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold text-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Monetization Add-on</span>
            <h3 className="text-lg font-extrabold text-slate-900">Promoted Listings</h3>
            <div className="text-2xl font-black text-blue-800 font-sans mt-1">₹499 - ₹1,499/lot</div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sponsored catalog placement, top search visibility, and GI-certified spotlighting banners for producers seeking rapid liquidation of seasonal perishable yields (Hatkora, Anthurium, Fresh Ginger).
          </p>
          <div className="pt-2 text-[11px] font-bold text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
            Target: Sellers seeking volume visibility
          </div>
        </div>

      </div>

      {/* Interactive Revenue & Farm-Gate Impact Simulator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-emerald-700" />
            <span>Interactive Financial Projection & Farmer Impact Simulator</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Simulate monthly trade volume across Mizoram to forecast platform ARR and net grassroots wealth creation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Controls */}
          <div className="space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Monthly Marketplace GMV (Turnover):</span>
                <span className="text-emerald-900 text-sm font-sans font-extrabold">
                  ₹{(projectedGMV / 100000).toFixed(1)} Lakhs
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="20000000"
                step="500000"
                value={projectedGMV}
                onChange={(e) => setProjectedGMV(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹5 Lakhs (Pilot)</span>
                <span>₹1 Crore</span>
                <span>₹2 Crores (State-wide)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Take Rate (% Commission):</span>
                <span className="text-amber-700 text-sm font-sans font-extrabold">{takeRate}%</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="5.0"
                step="0.5"
                value={takeRate}
                onChange={(e) => setTakeRate(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>2.0%</span>
                <span>3.5%</span>
                <span>5.0%</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Commission Revenue:</span>
                <span className="font-bold text-slate-900 font-sans">₹{commissionRevenue.toLocaleString('en-IN')}/mo</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tier Subscriptions (Est):</span>
                <span className="font-bold text-slate-900 font-sans">₹{subscriptionRevenue.toLocaleString('en-IN')}/mo</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Promoted Search Fees:</span>
                <span className="font-bold text-slate-900 font-sans">₹{promotedListingRevenue.toLocaleString('en-IN')}/mo</span>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="space-y-4">
            <div className="bg-emerald-950 text-white p-6 rounded-2xl space-y-2 border border-emerald-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Projected Platform Run-Rate
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
                ₹{annualRunRate.toLocaleString('en-IN')} <span className="text-sm text-emerald-300 font-normal">/ year</span>
              </div>
              <p className="text-xs text-emerald-200">
                Monthly revenue of ₹{totalMonthlyRunRate.toLocaleString('en-IN')} with 78% gross software gross margins.
              </p>
            </div>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 space-y-2 text-amber-950">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Direct Grassroots Farmer Benefit
              </span>
              <div className="text-2xl font-extrabold text-amber-900 font-sans">
                +₹{Math.round(projectedGMV * 0.22).toLocaleString('en-IN')} / month
              </div>
              <p className="text-xs text-amber-800">
                By eliminating local trade middlemen, an estimated 22% additional income flows directly to Mizoram rural households.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Impact & Vision Card */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-stone-800 shadow-sm">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">
            Our Purpose & Vision for Mizoram
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
          By bridging the geographic barrier between Mizoram's hill farmers and nationwide commercial buyers, ZOHARVEST unlocks direct market access for local commodities, enables direct contact and direct payments, and builds lasting prosperity for grassroots farming families.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700">
            <span className="font-bold text-emerald-400 block mb-1">1. Direct Farm Access</span>
            <p className="text-[11px] text-stone-300">Empowering local farmer producer organizations with transparent price discovery and direct wholesale reach.</p>
          </div>
          <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700">
            <span className="font-bold text-amber-400 block mb-1">2. Local & Accessible</span>
            <p className="text-[11px] text-stone-300">Bilingual English & Mizo support designed for simplicity, mobile ease, and low-connectivity environments.</p>
          </div>
          <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700">
            <span className="font-bold text-emerald-300 block mb-1">3. Direct P2P Payments</span>
            <p className="text-[11px] text-stone-300">Direct settlement via GPay / UPI and Bank transfer directly between buyers and sellers with zero platform cuts.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
