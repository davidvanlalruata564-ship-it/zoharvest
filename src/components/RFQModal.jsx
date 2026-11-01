import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Package, 
  ShieldCheck, 
  Calculator,
  ArrowRight,
  Info
} from 'lucide-react';

export default function RFQModal({ product, onClose, onSubmitRFQ, t, currentLang }) {
  if (!product) return null;

  const [quantity, setQuantity] = useState(product.minOrderQty);
  const [targetPrice, setTargetPrice] = useState(product.pricePerUnit);
  const [targetDeliveryDate, setTargetDeliveryDate] = useState('2026-11-25');
  const [shippingDestination, setShippingDestination] = useState('APMC Wholesale Yard, Vashi, Navi Mumbai, MH - 400703');
  const [specifications, setSpecifications] = useState('Standard Grade A lot. Moisture content < 10%, lab inspection certificate required.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalBidAmount = quantity * targetPrice;
  const escrowFee = Math.round(totalBidAmount * 0.025);
  const netSeller = totalBidAmount - escrowFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity < product.minOrderQty) {
      alert(`Minimum Order Quantity (MOQ) is ${product.minOrderQty} ${product.unit}`);
      return;
    }
    setIsSubmitting(true);
    await onSubmitRFQ({
      productId: product.id,
      quantity,
      unit: product.unit,
      targetPrice,
      targetDeliveryDate,
      shippingDestination,
      specifications
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-amber-500 text-slate-950 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              B2B RFQ Negotiation Engine
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {t.rfqTitle}
          </h2>
          <p className="text-xs text-emerald-200 mt-1">
            {t.rfqSubtitle}
          </p>
        </div>

        {/* Commodity Summary Strip */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-slate-400">Commodity: </span>
            <span className="font-bold text-slate-900">{product.name}</span>
          </div>
          <div>
            <span className="text-slate-400">Producer: </span>
            <span className="font-bold text-emerald-800">{product.fpoName} ({product.district})</span>
          </div>
          <div>
            <span className="text-slate-400">Base Listed: </span>
            <span className="font-bold text-amber-700">₹{product.pricePerUnit}/{product.unit}</span>
          </div>
        </div>

        {/* RFQ Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Required Quantity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.targetQuantity} ({product.unit}) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={product.minOrderQty}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold uppercase">
                  {product.unit}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                MOQ: {product.minOrderQty} {product.unit} | Stock: {product.availableStock} {product.unit}
              </span>
            </div>

            {/* Target Price */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.targetPricePerUnit} *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-7 pr-3 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Listed Rate: ₹{product.pricePerUnit}/{product.unit}
              </span>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Delivery Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.targetDeliveryDate} *
              </label>
              <input
                type="date"
                value={targetDeliveryDate}
                onChange={(e) => setTargetDeliveryDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Shipping Destination */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.shippingDestination} *
              </label>
              <input
                type="text"
                value={shippingDestination}
                onChange={(e) => setShippingDestination(e.target.value)}
                required
                placeholder="City, State, Pincode"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.specifications}
            </label>
            <textarea
              rows={2}
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              placeholder="e.g. Moisture level strictly below 9.5%, certified test report, fumigation certificate, specific sack markings..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Dynamic Escrow Financial Summary Box */}
          <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-950 pb-2 border-b border-emerald-200/60">
              <span className="flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-700" />
                <span>Financial Ledger Projection (B2B Bulk)</span>
              </span>
              <span className="text-emerald-800">2.5% Escrow Protection</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-white p-2 rounded-xl border border-emerald-100 shadow-xs">
                <span className="text-[10px] text-slate-400 block font-medium">Total Tender Value</span>
                <span className="text-sm sm:text-base font-extrabold text-slate-900 font-sans">
                  ₹{totalBidAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100 shadow-xs">
                <span className="text-[10px] text-slate-400 block font-medium">Escrow Fee (2.5%)</span>
                <span className="text-sm sm:text-base font-bold text-emerald-800 font-sans">
                  ₹{escrowFee.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100 shadow-xs">
                <span className="text-[10px] text-slate-400 block font-medium">Net Farmer Payout</span>
                <span className="text-sm sm:text-base font-extrabold text-amber-700 font-sans">
                  ₹{netSeller.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-emerald-800 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Funds are locked in Escrow. Seller is only paid after you inspect and verify delivery.</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition shadow-md disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Tendering Bid...' : t.submitRFQ}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
