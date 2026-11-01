import React, { useState } from 'react';
import { 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  TrendingUp,
  Clock,
  Send,
  Building,
  UserCheck
} from 'lucide-react';

export default function RFQNegotiationHub({
  rfqs,
  onCounterOffer,
  onAcceptRFQ,
  onGeneratePO,
  currentRole,
  t,
  currentLang
}) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeCounterId, setActiveCounterId] = useState(null);
  const [counterPrice, setCounterPrice] = useState('');
  const [counterMessage, setCounterMessage] = useState('');

  const filteredRFQs = rfqs.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleSendCounter = async (rfqId) => {
    if (!counterPrice) {
      alert('Please enter a counter price');
      return;
    }
    await onCounterOffer(rfqId, Number(counterPrice), counterMessage, currentRole === 'farmer' ? 'seller' : 'buyer');
    setActiveCounterId(null);
    setCounterPrice('');
    setCounterMessage('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Pending Review</span>;
      case 'Counter-Offered':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Counter-Offered</span>;
      case 'Accepted':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Quotation Accepted</span>;
      case 'PO_Generated':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><FileText className="w-3 h-3" /> Formal PO Generated</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
              <FileText className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Direct Negotiation Engine
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {t.navRFQ} (Request for Quotations)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time bulk volume bidding and transparent contract negotiation without intermediary brokers.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {['all', 'Pending', 'Counter-Offered', 'Accepted', 'PO_Generated'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                filterStatus === st
                  ? 'bg-emerald-800 text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {st === 'all' ? 'All RFQs' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* RFQ List */}
      {filteredRFQs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-2">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No RFQs in this view</h3>
          <p className="text-xs text-slate-400">
            Submit a new bid from the catalog or switch roles to view negotiation streams.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRFQs.map((rfq) => {
            const isCounterOpen = activeCounterId === rfq.id;
            const totalValue = rfq.quantity * (rfq.offeredPrice || rfq.targetPrice);

            return (
              <div
                key={rfq.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition overflow-hidden"
              >
                {/* Header Bar */}
                <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-emerald-950 font-mono text-sm">{rfq.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-slate-700">{rfq.productName}</span>
                  </div>
                  <div>{getStatusBadge(rfq.status)}</div>
                </div>

                {/* Details Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left Column: Buyer & Seller Info */}
                  <div className="md:col-span-4 space-y-3 border-r border-slate-100 pr-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Buyer Enterprise</span>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{rfq.buyerName}</span>
                      </div>
                      <span className="text-xs text-slate-500 block">{rfq.buyerLocation}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mizoram Producer FPO</span>
                      <div className="font-bold text-emerald-900 text-sm flex items-center gap-1.5 mt-0.5">
                        <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>{rfq.sellerName}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Target Arrival: <strong>{rfq.targetDeliveryDate}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate" title={rfq.shippingDestination}>Dest: <strong>{rfq.shippingDestination}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Volume, Unit Price & Specs */}
                  <div className="md:col-span-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Volume Tendered</span>
                        <span className="text-base font-extrabold text-slate-900 font-sans">
                          {rfq.quantity.toLocaleString('en-IN')} {rfq.unit}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Agreed / Offered Rate</span>
                        <span className="text-base font-extrabold text-emerald-900 font-sans">
                          ₹{rfq.offeredPrice.toLocaleString('en-IN')}/{rfq.unit}
                        </span>
                      </div>
                    </div>

                    <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900">Total Contract Value:</span>
                      <span className="text-lg font-extrabold text-emerald-950 font-sans">
                        ₹{totalValue.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {rfq.specifications && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="font-semibold text-slate-700">Specs: </span>
                        {rfq.specifications}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Negotiation History & Immediate Actions */}
                  <div className="md:col-span-4 flex flex-col justify-between space-y-3 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Negotiation Log
                      </span>
                      <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                        {rfq.history && rfq.history.map((h, i) => (
                          <div key={i} className="text-[11px] bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                            <div className="flex justify-between items-center font-bold text-slate-700">
                              <span className="capitalize text-emerald-800">{h.sender}</span>
                              <span className="text-amber-700 font-sans">₹{h.price}/{rfq.unit}</span>
                            </div>
                            <p className="text-slate-500 mt-0.5 line-clamp-2">{h.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="pt-2 border-t border-slate-200/80 space-y-2">
                      
                      {/* If status is Accepted, allow PO generation */}
                      {rfq.status === 'Accepted' && (
                        <button
                          onClick={() => onGeneratePO(rfq.id)}
                          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-300" />
                          <span>{t.generatePO}</span>
                        </button>
                      )}

                      {/* If status is Pending or Counter-Offered, allow counter-offer or accept */}
                      {(rfq.status === 'Pending' || rfq.status === 'Counter-Offered') && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => onAcceptRFQ(rfq.id)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-2 rounded-xl text-xs transition flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t.acceptQuote}</span>
                          </button>
                          <button
                            onClick={() => setActiveCounterId(isCounterOpen ? null : rfq.id)}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 px-2 rounded-xl text-xs transition flex items-center justify-center gap-1"
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Counter</span>
                          </button>
                        </div>
                      )}

                      {/* If PO is already generated */}
                      {rfq.status === 'PO_Generated' && (
                        <div className="text-center py-1">
                          <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>PO Active • Check Escrow Tab</span>
                          </span>
                        </div>
                      )}

                    </div>

                  </div>

                </div>

                {/* Counter-Offer Collapsible Input Tray */}
                {isCounterOpen && (
                  <div className="bg-amber-50/80 p-4 border-t border-amber-200/80 flex flex-wrap items-end gap-3">
                    <div className="w-40">
                      <label className="text-[10px] font-bold text-amber-900 block mb-1">
                        New Counter Rate (₹/{rfq.unit})
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 740"
                        value={counterPrice}
                        onChange={(e) => setCounterPrice(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-hidden"
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="text-[10px] font-bold text-amber-900 block mb-1">
                        Note to Counterparty (Packaging / Quality reasoning)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rate includes premium double stitching and phytosanitary clearance."
                        value={counterMessage}
                        onChange={(e) => setCounterMessage(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-hidden"
                      />
                    </div>
                    <button
                      onClick={() => handleSendCounter(rfq.id)}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-4 rounded-lg text-xs transition flex items-center gap-1 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Counter</span>
                    </button>
                    <button
                      onClick={() => setActiveCounterId(null)}
                      className="text-xs text-slate-500 hover:text-slate-800 py-1.5 px-2"
                    >
                      Cancel
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
