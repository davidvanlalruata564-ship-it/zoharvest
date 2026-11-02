import React from 'react';
import { 
  Building, 
  ShieldCheck, 
  TrendingUp, 
  FileText, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Store,
  Settings
} from 'lucide-react';

export default function BuyerDashboard({
  currentUser,
  orders = [],
  rfqs = [],
  onNavigateTab,
  onOpenProfile,
  t,
  currentLang
}) {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeRfqs = Array.isArray(rfqs) ? rfqs : [];

  const buyerOrders = safeOrders.filter(o => 
    (currentUser?.id && o.buyerId === currentUser.id) ||
    (!currentUser?.id && (o.buyerName?.includes('Spices India') || o.buyerName?.includes('AyurVeda')))
  );
  const buyerRFQs = safeRfqs.filter(r => 
    (currentUser?.id && r.buyerId === currentUser.id) ||
    (!currentUser?.id && (r.buyerName?.includes('Spices India') || r.buyerName?.includes('AyurVeda')))
  );

  const totalSpend = buyerOrders.reduce((sum, o) => sum + (Number(o.totalCommodityAmount) || 0), 0);
  const activeShipments = buyerOrders.filter(o => o.status === 'Dispatched' || o.status === 'Escrow_Paid').length;
  const estimatedSavings = Math.round(totalSpend * 0.22); // ~22% savings vs open market APMC markups

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Buyer Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-md">
            🏢
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {currentUser?.organization || 'Enterprise Wholesale Buyer'}
              </h2>
              {currentUser?.isVerified ? (
                <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  <span>Verified Wholesale Buyer</span>
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  <span>Verification in Progress</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>Representative: {currentUser?.name || 'Wholesale Buyer'} ({currentUser?.phone || '+91 98000 00000'})</span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser?.address || currentUser?.district || 'India'}</span>
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-3 rounded-xl text-xs sm:text-sm transition border border-slate-200"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span>Profile & Delivery Settings</span>
          </button>

          <button
            onClick={() => onNavigateTab('marketplace')}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition shadow-md"
          >
            <Store className="w-4 h-4 text-amber-300" />
            <span>Browse New Harvests</span>
          </button>
        </div>
      </div>

      {/* Google User Password Setup Notice */}
      {currentUser?.authProvider === 'google' && !currentUser?.hasPassword && (
        <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-emerald-500/15 border border-amber-300 rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-xs">
              🔑
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                Setup Direct Password for {currentUser?.email}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                You logged in with Google. Set an account password to also sign in directly using your email and password without Google.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenProfile('security')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>Set Password Now</span>
            <span>➜</span>
          </button>
        </div>
      )}

      {/* Buyer Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Procurement</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
            ₹{totalSpend.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500">Committed across {buyerOrders.length} contracts</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Savings vs APMC</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-sans">
            ~₹{estimatedSavings.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-800 font-semibold">22% farm-gate procurement savings</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Freight Lots</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-sans">
            {activeShipments} Consignments
          </div>
          <span className="text-[11px] text-slate-500">Active Direct Dispatches</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active RFQ Bids</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-sans">
            {buyerRFQs.length} Quotes
          </div>
          <button
            onClick={() => onNavigateTab('rfqs')}
            className="text-[11px] text-amber-700 font-bold hover:underline block"
          >
            Manage quotations ➜
          </button>
        </div>

      </div>

      {/* Sourcing Orders Overview */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-700" />
          <span>My Sourcing Orders & Milestones</span>
        </h3>

        {buyerOrders.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Truck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Orders Placed Yet</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">Browse our verified Mizoram farmer harvests and submit RFQs or direct orders with zero middleman fee.</p>
            <button
              onClick={() => onNavigateTab('marketplace')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
            >
              Browse Marketplace ➜
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Commodity</th>
                  <th className="pb-3">Mizoram FPO Partner</th>
                  <th className="pb-3">Deposit (Escrow)</th>
                  <th className="pb-3">Milestone</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {buyerOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-mono font-bold text-slate-900">{order.id}</td>
                    <td className="py-3 font-bold text-slate-800">{order.productName} ({order.quantity} {order.unit})</td>
                    <td className="py-3 font-medium text-emerald-800">{order.sellerName || 'Verified Mizoram Collective'}</td>
                    <td className="py-3 font-mono font-bold text-slate-900 font-sans">
                      ₹{(Number(order.totalCommodityAmount) || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Settled' ? 'bg-green-100 text-green-800' :
                        order.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Escrow_Paid' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status ? String(order.status).replace(/_/g, ' ') : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onNavigateTab('orders')}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                      >
                        Track / Inspect ➜
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
