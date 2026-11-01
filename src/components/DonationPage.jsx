import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  Award, 
  DollarSign, 
  ArrowRight, 
  Send, 
  X, 
  QrCode, 
  Check, 
  Leaf, 
  Sun, 
  Microscope, 
  Palette,
  Layers
} from 'lucide-react';

const DONATION_CAUSES = [
  {
    id: 'seed-kit',
    title: 'Organic Seedling & Soil Kit',
    amount: 500,
    icon: Leaf,
    color: 'emerald',
    description: 'Sponsors 1 smallholder farmer with certified heirloom organic seeds and professional pH/nutrient soil testing.'
  },
  {
    id: 'moisture-kit',
    title: 'FPO Quality & Moisture Testing Kit',
    amount: 2500,
    icon: Microscope,
    color: 'blue',
    description: 'Equips 1 local grower collective with handheld digital moisture meters to ensure export-grade chilli & ginger quality.'
  },
  {
    id: 'solar-drier',
    title: 'Community Solar Drier Fund',
    amount: 5000,
    icon: Sun,
    color: 'amber',
    description: 'Helps install clean community solar dehydrators to prevent post-harvest spoilage of fresh ginger and turmeric during monsoon.'
  },
  {
    id: 'artisan-grant',
    title: 'Mizoram Artisan & GI Heritage Grant',
    amount: 10000,
    icon: Palette,
    color: 'purple',
    description: 'Provides training, raw cane, and GI tagging for women weaver self-help groups crafting traditional bamboo baskets and shawls.'
  }
];

export default function DonationPage({ t, currentLang }) {
  const [donations, setDonations] = useState([]);
  const [metrics, setMetrics] = useState({
    totalAmount: 84000,
    totalDonors: 5,
    farmersBenefited: 240,
    isCompletelyFree: true
  });
  const [loading, setLoading] = useState(false);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCause, setSelectedCause] = useState(DONATION_CAUSES[0].title);
  const [customAmount, setCustomAmount] = useState(DONATION_CAUSES[0].amount);
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch live donations
  const fetchDonations = async () => {
    try {
      const res = await fetch('/api/donations');
      if (res.ok) {
        const data = await res.json();
        setDonations(data.donations || []);
        if (data.metrics) setMetrics(data.metrics);
      }
    } catch (err) {
      console.error('Failed to load donations:', err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleSelectCause = (cause) => {
    setSelectedCause(cause.title);
    setCustomAmount(cause.amount);
    setIsModalOpen(true);
    setFormSuccess(false);
    setFormError('');
  };

  const handleSubmitDonation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName,
          email,
          phone,
          amount: Number(customAmount),
          cause: selectedCause,
          isAnonymous,
          message,
          paymentMethod
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit donation.');
      }

      setFormSuccess(true);
      await fetchDonations();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 -mb-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <Heart className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>Community Patronage & Grants</span>
            </span>
            <span className="bg-emerald-800/70 text-emerald-200 text-xs font-medium px-3 py-1 rounded-full border border-emerald-700/60">
              100% Goes to Grassroots Farmers
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Support Mizoram’s Organic Farmers & Artisans
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Because ZOHARVEST is completely free for all farmers and buyers with 0% platform commissions, we rely on generous patrons, grants, and donors. Your contributions directly fund quality moisture meters, community solar driers, organic certifications, and digital tools for grower collectives.
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedCause('Mizoram Smallholder Farmer Empowerment Fund');
                setCustomAmount(1000);
                setIsModalOpen(true);
                setFormSuccess(false);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-slate-950" />
              <span>Make a Contribution</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Impact Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900">
            ₹{metrics.totalAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-stone-500 font-medium mt-1">Community Funds Pledged</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs">
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {metrics.totalDonors}
          </div>
          <div className="text-xs text-stone-500 font-medium mt-1">Contributing Patrons</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs">
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {metrics.farmersBenefited}+
          </div>
          <div className="text-xs text-stone-500 font-medium mt-1">Grower Families Impacted</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
            0%
          </div>
          <div className="text-xs text-stone-500 font-medium mt-1">Platform Cut (100% Free)</div>
        </div>
      </div>

      {/* Causes & Tiers Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">Choose a Cause to Support</h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Select one of our active community initiatives or enter a custom amount.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {DONATION_CAUSES.map((cause) => {
            const Icon = cause.icon;
            return (
              <div 
                key={cause.id}
                className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Sponsor
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-1">{cause.title}</h3>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {cause.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2.5">
                  <div className="text-xl font-extrabold text-stone-900">
                    ₹{cause.amount.toLocaleString('en-IN')}
                  </div>
                  <button
                    onClick={() => handleSelectCause(cause)}
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Heart className="w-3.5 h-3.5 text-amber-300" />
                    <span>Sponsor This Cause</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Donation Listings (Transparency Ledger) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900">Community Transparency Ledger</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Live record of voluntary patron contributions supporting Mizoram agriculture.
            </p>
          </div>
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
            Verified Public Record
          </span>
        </div>

        <div className="space-y-3">
          {donations.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-xs">
              No donations recorded yet. Be the first to contribute!
            </div>
          ) : (
            donations.map((item) => (
              <div 
                key={item.id}
                className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">
                      {item.donorName}
                    </span>
                    <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-medium">
                      {item.paymentMethod || 'UPI'}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-900 font-semibold">
                    Cause: {item.cause}
                  </div>
                  {item.message && (
                    <p className="text-xs text-stone-500 italic">
                      "{item.message}"
                    </p>
                  )}
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="text-base sm:text-lg font-extrabold text-emerald-900 bg-white px-3 py-1 rounded-xl border border-stone-200/80 shadow-2xs inline-block">
                    ₹{Number(item.amount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* DONATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Contribution Portal</span>
                <h3 className="text-base font-bold text-white">Sponsor Mizoram Farmers</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8 text-emerald-800" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-stone-900">Thank You for Your Generosity!</h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Your contribution of ₹{Number(customAmount).toLocaleString('en-IN')} towards "{selectedCause}" has been recorded in our public transparency ledger.
                  </p>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 font-mono">
                  Receipt ID: ZOH-DON-{Date.now().toString().slice(-6)}
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Close & Return
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitDonation} className="p-6 space-y-3.5">
                {formError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Sponsored Initiative</label>
                  <select
                    value={selectedCause}
                    onChange={(e) => setSelectedCause(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    {DONATION_CAUSES.map(c => (
                      <option key={c.id} value={c.title}>{c.title} (₹{c.amount})</option>
                    ))}
                    <option value="Mizoram Smallholder Farmer Empowerment Fund">General Empowerment Fund</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Contribution Amount (₹)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-stone-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      required
                      min={10}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 text-xs font-bold text-stone-900 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      disabled={isAnonymous}
                      value={isAnonymous ? 'Anonymous' : donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Lalhmingliana"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-3.5 h-3.5 accent-emerald-800 rounded"
                  />
                  <span className="text-xs text-stone-600 font-medium">Keep my name anonymous in public ledger</span>
                </label>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Optional Message for Farmers</label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Words of encouragement for our grower families..."
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['UPI', 'NetBanking', 'Card'].map((pm) => (
                      <button
                        type="button"
                        key={pm}
                        onClick={() => setPaymentMethod(pm)}
                        className={`py-1.5 px-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                          paymentMethod === pm ? 'bg-emerald-800 text-white border-emerald-950' : 'bg-stone-50 text-stone-700 border-stone-200'
                        }`}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  <Heart className="w-4 h-4 text-amber-300" />
                  <span>{loading ? 'Processing...' : `Pledge ₹${Number(customAmount).toLocaleString('en-IN')} Donation`}</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
