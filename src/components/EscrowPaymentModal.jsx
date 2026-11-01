import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function EscrowPaymentModal({ order, onClose, onDepositSuccess, t }) {
  if (!order) return null;

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('buyer@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successStep, setSuccessStep] = useState(false);

  const totalAmount = order.totalCommodityAmount;
  const escrowFee = order.platformFeeAmount || Math.round(totalAmount * 0.025);
  const finalDeposit = totalAmount;

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessStep(true);
      setTimeout(() => {
        onDepositSuccess(order.id, paymentMethod);
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header with Razorpay & Escrow Branding */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">ZOHARVEST ESCROW</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded font-mono">
                  Razorpay B2B
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Guaranteed Vault Ledger #ZH-ESC-{order.id.slice(-4)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Splash */}
        {successStep ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Escrow Deposit Secured!
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              ₹{finalDeposit.toLocaleString('en-IN')} has been locked in the ZOHARVEST Escrow Contract. The producer has been notified via WhatsApp to dispatch your consignment.
            </p>
            <div className="text-xs font-mono text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200">
              Txn ID: ESC-RZP-{Math.floor(10000000 + Math.random() * 90000000)}
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            
            {/* Amount Banner */}
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-800">Total Escrow Commitment</span>
                <div className="text-2xl font-extrabold text-emerald-950 font-sans">
                  ₹{finalDeposit.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-emerald-700 font-medium">
                  Includes 2.5% platform inspection guarantee
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-700 block">{order.id}</span>
                <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">{order.productName}</span>
                <span className="text-[10px] text-emerald-800 font-bold block">{order.quantity} {order.unit}</span>
              </div>
            </div>

            {/* Escrow Guarantee Statement */}
            <div className="flex items-start gap-3 bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Buyer Protection Guarantee:</strong> Your funds are held securely in escrow. Funds will NOT be disbursed to {order.sellerName} until you confirm arrival and verify quality.
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select Payment Channel</label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'upi'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600 text-emerald-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-700" />
                  <span className="text-[11px]">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'netbanking'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600 text-emerald-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-emerald-700" />
                  <span className="text-[11px]">NetBanking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('rtgs')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'rtgs'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600 text-emerald-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-emerald-700" />
                  <span className="text-[11px]">NEFT / RTGS</span>
                </button>
              </div>

              {/* Conditional Input */}
              {paymentMethod === 'upi' && (
                <div className="pt-2">
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. buyer@upi"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden"
                  />
                  <div className="flex gap-2 mt-2">
                    {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map(app => (
                      <span key={app} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-medium">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="pt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  Select Corporate Bank: <strong>State Bank of India (Corporate Internet Banking)</strong> or <strong>Mizoram Rural Bank</strong>
                </div>
              )}

              {paymentMethod === 'rtgs' && (
                <div className="pt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                  <div>Beneficiary: <strong>ZOHARVEST ESCROW TRUST ACCT</strong></div>
                  <div>Account: <strong>9900 1283 4901</strong> | IFSC: <strong>SBIN0007412</strong></div>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handlePayNow}
                disabled={isProcessing}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Connecting Razorpay Escrow Gateway...</span>
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-300" />
                    <span>Authorize Escrow Deposit (₹{finalDeposit.toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
