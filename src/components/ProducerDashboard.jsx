import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  Building, 
  MapPin, 
  FileText, 
  Truck, 
  Award,
  AlertCircle,
  Settings,
  Edit2,
  Trash2,
  Save,
  X,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';

export default function ProducerDashboard({
  currentUser,
  products = [],
  orders = [],
  rfqs = [],
  onOpenNewListing,
  onOpenProfile,
  onUpdateProduct,
  onDeleteProduct,
  onNavigateTab,
  t,
  currentLang
}) {
  const sellerOrders = orders.filter(o => 
    (currentUser?.id && o.sellerId === currentUser.id) ||
    (!currentUser?.id && o.sellerName?.includes('Champhai'))
  );
  const sellerRFQs = rfqs.filter(r => 
    (currentUser?.id && r.sellerId === currentUser.id) ||
    (!currentUser?.id && r.sellerName?.includes('Champhai'))
  );

  const myProducts = products.filter(p => 
    (currentUser?.id && p.sellerId === currentUser.id) ||
    (!currentUser?.id && (p.sellerId === 'user-farmer-1' || p.fpoName?.includes('Champhai')))
  );

  const grossEarnings = currentUser?.grossEarnings || 0;
  const activeEscrow = currentUser?.activeEscrow || 0;
  const pendingRFQs = sellerRFQs.filter(r => r.status === 'Pending' || r.status === 'Counter-Offered').length;

  // Inline product editing states
  const [editingProdId, setEditingProdId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  const startEditProduct = (prod) => {
    setEditingProdId(prod.id);
    setEditPrice(prod.pricePerUnit);
    setEditStock(prod.availableStock);
  };

  const saveProductEdit = async (prodId) => {
    if (!editPrice || !editStock) return;
    await onUpdateProduct(prodId, {
      pricePerUnit: Number(editPrice),
      availableStock: Number(editStock)
    });
    setEditingProdId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Producer Profile Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center font-extrabold text-2xl shadow-md">
            👨‍🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {currentUser?.organization || 'Mizoram Producer Co-op'}
              </h2>
              {currentUser?.isVerified ? (
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>KYC Verified FPO</span>
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>KYC Pending Review</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
              <span>Contact: <strong>{currentUser?.name || 'Lead Producer'}</strong> ({currentUser?.phone || '+91 98000 00000'})</span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-emerald-700 font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{currentUser?.district || 'Champhai'} District, Mizoram</span>
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
            <span>Customize Profile & Payouts</span>
          </button>

          <button
            onClick={onOpenNewListing}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.newListing}</span>
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

      {/* Real-time Gross Earnings & Payout Tracker Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Settled Earnings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>{t.grossEarnings}</span>
            <div className="w-8 h-8 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
            ₹{grossEarnings.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
            <span>Directly settled to {currentUser?.bankAccount?.bankName || 'Mizoram Rural Bank'}</span>
          </p>
        </div>

        {/* Active Escrow Guarantee */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>{t.activeEscrowBalance}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-sans">
            ₹{activeEscrow.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-amber-800 font-medium">
            Locked in neutral escrow. Dispatched consignments awaiting delivery.
          </p>
        </div>

        {/* Pending Inbound RFQs */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Inbound RFQ Pipeline</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-sans">
            {pendingRFQs} Active
          </div>
          <button
            onClick={() => onNavigateTab('rfqs')}
            className="text-[11px] text-emerald-700 font-bold hover:underline block"
          >
            Review bids & submit counter-offers ➜
          </button>
        </div>

      </div>

      {/* MY COMMODITIES & INVENTORY MANAGEMENT SECTION */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-700" />
              <span>My Listed Commodities & Inventory ({myProducts.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your live farm-gate prices, stock volumes, advance harvest pre-orders, and packaging specifications.
            </p>
          </div>

          <button
            onClick={onOpenNewListing}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>Add New Commodity</span>
          </button>
        </div>

        {myProducts.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Commodities Listed Yet</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">Start selling your harvest directly to wholesale buyers across India with 0% intermediary commission.</p>
            <button
              onClick={onOpenNewListing}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs"
            >
              + List Your First Commodity
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">Commodity</th>
                  <th className="pb-3">Quality & District</th>
                  <th className="pb-3">Farm-Gate Rate (₹)</th>
                  <th className="pb-3">Stock Available</th>
                  <th className="pb-3">MOQ</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myProducts.map(prod => {
                  const isEditing = editingProdId === prod.id;
                  return (
                    <tr key={prod.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=150&q=80'} 
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-extrabold text-slate-900 line-clamp-1 max-w-[220px]" title={prod.name}>
                              {prod.name}
                            </div>
                            <div className="text-[11px] text-slate-400 capitalize">{prod.category}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5">
                        <div className="font-semibold text-slate-800">{prod.grade}</div>
                        <div className="text-slate-500 flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{prod.district}</span>
                        </div>
                      </td>

                      <td className="py-3.5">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-400">₹</span>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-20 px-2 py-1 text-xs font-bold border border-emerald-500 rounded-lg bg-white"
                            />
                            <span className="text-slate-400">/{prod.unit}</span>
                          </div>
                        ) : (
                          <div className="font-mono font-extrabold text-emerald-900 text-sm">
                            ₹{prod.pricePerUnit?.toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-normal">/{prod.unit}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(e.target.value)}
                              className="w-20 px-2 py-1 text-xs font-bold border border-emerald-500 rounded-lg bg-white"
                            />
                            <span className="text-slate-400">{prod.unit}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-slate-800">
                            {prod.availableStock} {prod.unit}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 font-medium text-slate-600">
                        {prod.minOrderQty} {prod.unit}
                      </td>

                      <td className="py-3.5">
                        {prod.moderationStatus === 'quarantined' ? (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 block w-fit">
                              ⚠️ QUARANTINED
                            </span>
                            <span className="text-[10px] text-red-600 block max-w-[140px] truncate" title={prod.quarantineReason}>
                              {prod.quarantineReason || 'Hidden from buyers'}
                            </span>
                          </div>
                        ) : prod.isAdvanceHarvest ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            Pre-Order Harvest
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Ready In Stock
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => saveProductEdit(prod.id)}
                              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
                              title="Save Changes"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingProdId(null)}
                              className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => startEditProduct(prod)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-emerald-800 transition"
                              title="Quick Edit Price & Stock"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete listing "${prod.name}"?`)) {
                                  onDeleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Active Escrow Shipments Monitor */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-700" />
            <span>Active Escrow Shipments & Dispatch Pipeline</span>
          </h3>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-emerald-800 hover:underline"
          >
            View All Orders
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th className="pb-3">PO Reference</th>
                <th className="pb-3">Commodity & Volume</th>
                <th className="pb-3">Wholesale Buyer</th>
                <th className="pb-3">Escrow Deposit</th>
                <th className="pb-3">Current Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sellerOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 font-mono font-bold text-slate-900">{order.id}</td>
                  <td className="py-3">
                    <span className="font-bold text-slate-800">{order.productName}</span>
                    <span className="text-slate-400 block">{order.quantity} {order.unit}</span>
                  </td>
                  <td className="py-3 font-medium text-slate-700">{order.buyerName}</td>
                  <td className="py-3 font-mono font-bold text-emerald-900 font-sans">
                    ₹{(Number(order.netPayableToSeller) || 0).toLocaleString('en-IN')}
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
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      Manage ➜
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Account & Payout Setup Card */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Automated Escrow Bank Settlement
          </span>
          <h4 className="text-lg font-bold text-white">
            {currentUser?.bankAccount?.bankName || 'Mizoram Rural Bank'}
          </h4>
          <p className="text-xs text-emerald-200">
            Account: <strong>{currentUser?.bankAccount?.accountNumber || '**** **** 8942'}</strong> • IFSC: <strong>{currentUser?.bankAccount?.ifsc || 'SBIN0RRMIGB'}</strong> • Beneficiary: <strong>{currentUser?.bankAccount?.beneficiary || currentUser?.organization || currentUser?.name}</strong>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProfile}
            className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition border border-emerald-600"
          >
            Update Bank Details
          </button>
          <div className="flex items-center gap-1.5 bg-emerald-950/80 px-3 py-2 rounded-xl border border-emerald-700 text-xs text-emerald-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Escrow Autopay Ready</span>
          </div>
        </div>
      </div>

    </div>
  );
}
