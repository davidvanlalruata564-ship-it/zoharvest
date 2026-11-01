import React from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  Building, 
  CheckCircle2, 
  FileText,
  MapPin
} from 'lucide-react';

export default function POPrintModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              Formal Purchase Order • {order.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable PO Body */}
        <div className="p-8 space-y-6 text-slate-800 bg-white" id="printable-po">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="text-2xl font-extrabold text-emerald-950 font-sans">
                ZO<span className="text-amber-600">HARVEST</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Mizoram B2B Agri & Craft Wholesale Exchange</p>
              <p className="text-[11px] text-slate-400 mt-1">Babutlang, Aizawl, Mizoram - 796001</p>
              <p className="text-[11px] text-slate-400">Escrow Contract: ESC-RZP-LEDGER-V2</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200">
                Purchase Order
              </span>
              <div className="text-base font-extrabold font-mono text-slate-900 mt-2">{order.id}</div>
              <div className="text-xs text-slate-500">Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              <div className="text-xs font-bold text-emerald-800 mt-1">Status: {order.status.replace('_', ' ')}</div>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Wholesale Buyer</span>
              <div className="font-bold text-slate-900 text-sm">{order.buyerName}</div>
              <div className="text-slate-600">Consignment Destination:</div>
              <div className="font-medium text-slate-800">{order.shippingDestination}</div>
              <div className="text-slate-500 text-[10px]">Payment Guarantee: ZOHARVEST Escrow Locked</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Grassroots Producer (FPO)</span>
              <div className="font-bold text-emerald-950 text-sm">{order.sellerName}</div>
              <div className="text-slate-600">Bank Remittance Node:</div>
              <div className="font-medium text-slate-800">Mizoram Rural Bank (Direct NEFT)</div>
              <div className="text-slate-500 text-[10px]">KYC Approved & Quality Audited</div>
            </div>
          </div>

          {/* Line Item Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Commodity Specification</th>
                  <th className="p-3 text-center">Volume</th>
                  <th className="p-3 text-right">Agreed Rate</th>
                  <th className="p-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{order.productName}</div>
                    <div className="text-[11px] text-slate-500">Mizoram Organic Origin • Grade A Inspection Certified</div>
                  </td>
                  <td className="p-3 text-center font-bold text-slate-800">
                    {order.quantity} {order.unit}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-800 font-sans">
                    ₹{order.unitPrice.toLocaleString('en-IN')}/{order.unit}
                  </td>
                  <td className="p-3 text-right font-mono font-extrabold text-slate-900 font-sans">
                    ₹{order.totalCommodityAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Calculation */}
          <div className="flex justify-end text-xs">
            <div className="w-64 space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Commodity Subtotal:</span>
                <span className="font-mono font-bold font-sans">₹{order.totalCommodityAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Escrow Inspection Fee (2.5%):</span>
                <span className="font-mono font-bold font-sans">₹{order.platformFeeAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-emerald-950">
                <span>Net Producer Settlement:</span>
                <span className="font-mono text-amber-700 font-sans">₹{order.netPayableToSeller.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Legal Escrow Seal & Signatures */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-800 block">ZOHARVEST Escrow Verified Contract</span>
                <span>Funds released upon buyer delivery verification. 0% Middlemen Cut.</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] text-slate-400 block">Auth Signature Token:</span>
              <span className="font-mono text-[10px] text-emerald-800 font-bold">DIGI-SIGN-MZ-{order.id.slice(-4)}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
