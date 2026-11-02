import React from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Calendar, 
  Package, 
  Sparkles, 
  CheckCircle2, 
  TrendingDown,
  Building,
  Check
} from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onOpenRFQ, t, currentLang }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/40 hover:bg-slate-900/70 text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image & Producer Identity */}
          <div className="relative bg-slate-100 h-64 md:h-full min-h-[300px]">
            {product.images && product.images.length > 0 && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-3xl bg-emerald-800/80 border border-emerald-500/30 text-amber-300 flex items-center justify-center text-3xl mb-3 font-bold shadow-lg">
                  🌾
                </div>
                <h3 className="text-base font-extrabold text-white">{product.name}</h3>
                <p className="text-xs text-emerald-300 mt-1 max-w-xs">Text-only verified producer harvest listing.</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
              <div className="flex items-center gap-2 mb-1">
                {product.giTagged && (
                  <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded shadow-sm">
                    GI Tag Certified
                  </span>
                )}
                {product.isOrganic && (
                  <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                    Organic NPOP
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                <span>{product.fpoName}</span>
              </h4>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{product.district} District, Mizoram</span>
              </p>
            </div>
          </div>

          {/* Commodity Details & RFQ Action */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <span>{product.grade}</span>
                <span>•</span>
                <span>{product.unit}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {currentLang === 'mz' && product.nameMizo ? product.nameMizo : product.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {currentLang === 'mz' && product.descriptionMizo ? product.descriptionMizo : product.description}
              </p>

              {/* Price & Savings Display */}
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-800 font-semibold block">Listed Farm-Gate Base Rate</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-emerald-950 font-sans">
                      ₹{product.pricePerUnit.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-emerald-700">/{product.unit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 line-through block">
                    Retail/Middleman: ₹{product.marketPriceComparison.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    Save ~₹{(product.marketPriceComparison - product.pricePerUnit).toLocaleString('en-IN')}/{product.unit}
                  </span>
                </div>
              </div>

              {/* Bulk Tier Rates */}
              {product.bulkPricing && product.bulkPricing.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Bulk Quantity Slabs:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.bulkPricing.map((tier, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-center text-xs">
                        <div className="font-semibold text-slate-500 text-[10px]">
                          {tier.minQty} - {tier.maxQty} {product.unit}
                        </div>
                        <div className="font-extrabold text-emerald-900 mt-0.5">
                          ₹{tier.price.toLocaleString('en-IN')}/{product.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Specs Matrix */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Minimum Order (MOQ)</span>
                  <span className="font-bold text-slate-800">{product.minOrderQty} {product.unit}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Packaging Spec</span>
                  <span className="font-bold text-slate-800 truncate block">{product.packaging}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Harvest & Dispatch</span>
                  <span className="font-bold text-slate-800 truncate block">{product.harvestDate}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Shelf Life</span>
                  <span className="font-bold text-slate-800">{product.shelfLife}</span>
                </div>
              </div>

              {/* Certifications Badges */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {product.certifications.map((c, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium flex items-center gap-1 border border-slate-200">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{c}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => { onClose(); onOpenRFQ(product); }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{product.isAdvanceHarvest ? 'Pre-Order Advance Harvest' : t.tenderRFQ}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
