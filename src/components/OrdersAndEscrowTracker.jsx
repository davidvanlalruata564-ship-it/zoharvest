import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  FileText, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  Lock, 
  ArrowRight,
  Printer,
  Star,
  MapPin,
  Calendar,
  Building,
  TrendingUp
} from 'lucide-react';

export default function OrdersAndEscrowTracker({
  orders,
  onOpenEscrowModal,
  onDispatchOrder,
  onVerifyAndRelease,
  onViewPO,
  currentRole,
  t,
  currentLang
}) {
  const [dispatchModalOrder, setDispatchModalOrder] = useState(null);
  const [carrier, setCarrier] = useState('NorthEast Express Cargo / BlueDart');
  const [trackingNumber, setTrackingNumber] = useState('NEC-MZ-994821');

  const [verifyModalOrder, setVerifyModalOrder] = useState(null);
  const [qualityScore, setQualityScore] = useState(5);
  const [inspectionNotes, setInspectionNotes] = useState('Consignment arrived in sound condition. Moisture verified at 8.9%, Grade A compliant.');

  const handleDispatchSubmit = async (e) => {
    e.preventDefault();
    if (!dispatchModalOrder) return;
    await onDispatchOrder(dispatchModalOrder.id, carrier, trackingNumber);
    setDispatchModalOrder(null);
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!verifyModalOrder) return;
    await onVerifyAndRelease(verifyModalOrder.id, qualityScore, inspectionNotes);
    setVerifyModalOrder(null);
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'PO_Created': return 1;
      case 'Escrow_Paid': return 2;
      case 'Dispatched': return 3;
      case 'Settled': return 4;
      default: return 1;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-amber-500 text-slate-950 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Guaranteed Escrow & Shipment Pipeline
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.navEscrow} & Purchase Orders
          </h2>
          <p className="text-xs text-emerald-200 mt-1 max-w-xl">
            Razorpay-backed Escrow contract holds committed buyer funds in neutral custody until physical arrival and quality inspection in the regional markets.
          </p>
        </div>

        {/* 4-Stage Lifecycle Mini Flow */}
        <div className="bg-emerald-950/70 p-3.5 rounded-2xl border border-emerald-700/60 text-xs flex flex-wrap gap-2 items-center text-emerald-100">
          <span className="font-bold text-amber-300">PO Created</span>
          <span>➜</span>
          <span className="font-bold text-emerald-300">Escrow Paid</span>
          <span>➜</span>
          <span className="font-bold text-blue-300">Dispatched</span>
          <span>➜</span>
          <span className="font-bold text-green-400">Settled to Producer</span>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-2">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No active orders yet</h3>
          <p className="text-xs text-slate-400">
            Accept an RFQ or place a direct purchase from the commodity catalog to initiate an Escrow transaction.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const step = getStepIndex(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all hover:border-emerald-300"
              >
                {/* Top Status & ID Bar */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-slate-900 text-sm">{order.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-emerald-900">{order.productName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.escrowTransactionId && (
                      <span className="font-mono text-[10px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded">
                        Ledger: {order.escrowTransactionId}
                      </span>
                    )}

                    <button
                      onClick={() => onViewPO(order)}
                      className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Formal PO</span>
                    </button>
                  </div>
                </div>

                {/* Progress Stepper (4 Stages) */}
                <div className="px-6 py-5 bg-emerald-50/30 border-b border-slate-100">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    
                    {/* Step 1 */}
                    <div className="space-y-1">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                        step >= 1 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        1
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 block">PO Generated</span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">Contract Locked</span>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-1">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                        step >= 2 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        2
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 block">Escrow Paid</span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">Funds Held in Custody</span>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-1">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                        step >= 3 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        3
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 block">Dispatched</span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">In Freight Transit</span>
                    </div>

                    {/* Step 4 */}
                    <div className="space-y-1">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                        step === 4 ? 'bg-green-600 text-white animate-pulse' : 'bg-slate-200 text-slate-500'
                      }`}>
                        4
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 block">Settled</span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">Paid to Producer Bank</span>
                    </div>

                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Parties & Quantity */}
                  <div className="md:col-span-5 space-y-2">
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Consignment Volume</span>
                      <span className="text-lg font-extrabold text-slate-900 font-sans">
                        {order.quantity} {order.unit} @ ₹{order.unitPrice.toLocaleString('en-IN')}/{order.unit}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 pt-1">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Building className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Buyer: <strong>{order.buyerName}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Seller: <strong>{order.sellerName}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate" title={order.shippingDestination}>Dest: <strong>{order.shippingDestination}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Settlement Breakdown */}
                  <div className="md:col-span-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Total Commodity Value:</span>
                      <span className="font-bold text-slate-900 font-sans">₹{order.totalCommodityAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>ZOHARVEST Platform Fee (2.5%):</span>
                      <span className="font-semibold text-emerald-800 font-sans">- ₹{order.platformFeeAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-200 flex justify-between font-extrabold text-slate-900">
                      <span>Net Farm Payout:</span>
                      <span className="text-amber-700 font-sans text-sm">₹{order.netPayableToSeller.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Right Actions depending on Stage */}
                  <div className="md:col-span-3 flex flex-col justify-center space-y-2">
                    
                    {/* Stage 1: PO Generated -> Buyer must deposit to Escrow */}
                    {order.status === 'PO_Created' && (
                      <button
                        onClick={() => onOpenEscrowModal(order)}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-300" />
                        <span>{t.depositEscrow}</span>
                      </button>
                    )}

                    {/* Stage 2: Escrow Paid -> Seller marks dispatched */}
                    {order.status === 'Escrow_Paid' && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-center border border-emerald-200 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Escrow Funded</span>
                        </div>
                        <button
                          onClick={() => setDispatchModalOrder(order)}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 px-3 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>{t.dispatchGoods}</span>
                        </button>
                      </div>
                    )}

                    {/* Stage 3: Dispatched -> Buyer verifies & releases payout */}
                    {order.status === 'Dispatched' && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-semibold text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                          <div className="font-bold text-blue-800">{order.dispatchInfo.carrier}</div>
                          <div className="font-mono text-[10px] text-slate-500">Track: {order.dispatchInfo.trackingNumber}</div>
                        </div>
                        <button
                          onClick={() => setVerifyModalOrder(order)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                          <span>Verify & Release Escrow</span>
                        </button>
                      </div>
                    )}

                    {/* Stage 4: Settled */}
                    {order.status === 'Settled' && (
                      <div className="text-center p-2 rounded-xl bg-green-50 border border-green-200 text-green-900 text-xs font-bold space-y-0.5">
                        <div className="flex items-center justify-center gap-1 text-green-700">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Escrow Settled</span>
                        </div>
                        <p className="text-[10px] font-normal text-slate-500">Paid to Producer Bank</p>
                      </div>
                    )}

                  </div>

                </div>

                {/* Audit & Notes footer */}
                <div className="bg-slate-50/60 px-6 py-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                  <span className="italic">{order.verificationNotes}</span>
                  <span className="font-mono text-[10px]">Contract Hash: SHA256-MZ-{order.id.slice(-4)}</span>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* DISPATCH LOGISTICS MODAL */}
      {dispatchModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-600" />
              <span>Dispatch Consignment: {dispatchModalOrder.id}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Enter logistics partner details to transmit live tracking notifications to the wholesale buyer.
            </p>

            <form onSubmit={handleDispatchSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Freight Carrier</label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  required
                  placeholder="e.g. NorthEast Cargo, BlueDart, India Post Bulk"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Waybill / Tracking Consignment #</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  required
                  placeholder="e.g. TRK-771920-IN"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDispatchModalOrder(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VERIFY DELIVERY & RELEASE ESCROW MODAL */}
      {verifyModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Verify Delivery & Settle Escrow</span>
            </h3>
            <p className="text-xs text-slate-500">
              This triggers the automated release of <strong>₹{verifyModalOrder.netPayableToSeller.toLocaleString('en-IN')}</strong> from escrow directly to {verifyModalOrder.sellerName}'s registered bank account.
            </p>

            <form onSubmit={handleVerifySubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Quality Inspection Score</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setQualityScore(score)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 ${
                        qualityScore >= score
                          ? 'bg-amber-400 border-amber-500 text-slate-950 font-extrabold'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{score}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Inspection Certificate Notes</label>
                <textarea
                  rows={2}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="bg-green-50 p-3 rounded-xl border border-green-200 text-xs text-green-900">
                Direct NEFT Settlement: <strong>Mizoram Rural Bank (SBIN0RRMIGB)</strong>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVerifyModalOrder(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                >
                  Release Funds Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
