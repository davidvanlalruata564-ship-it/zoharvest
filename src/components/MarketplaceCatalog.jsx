import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Package, 
  Award, 
  ArrowUpRight, 
  SlidersHorizontal,
  Flame,
  Wheat,
  Apple,
  Trees,
  Palette,
  Layers,
  Check
} from 'lucide-react';

const CATEGORY_ICONS = {
  all: Layers,
  spices: Flame,
  grains: Wheat,
  fruits: Apple,
  cashcrops: Trees,
  handicrafts: Palette,
  organic: ShieldCheck
};

export default function MarketplaceCatalog({
  products,
  categories,
  districts,
  selectedCategory,
  setSelectedCategory,
  selectedDistrict,
  setSelectedDistrict,
  selectedGrade,
  setSelectedGrade,
  onlyOrganic,
  setOnlyOrganic,
  onlyAdvanceHarvest,
  setOnlyAdvanceHarvest,
  onOpenRFQModal,
  onOpenProductDetail,
  onDirectOrder,
  t,
  currentLang
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-6">
      
      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const IconComponent = CATEGORY_ICONS[cat.id] || Layers;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-50 hover:text-emerald-950 border border-stone-200/80 shadow-2xs'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-stone-400'}`} />
              <span>{currentLang === 'mz' && cat.nameMizo ? cat.nameMizo : cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Refinement Bar */}
      <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-800" />
            <span>Filter</span>
          </div>

          {/* District Dropdown */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium py-1.5 px-3 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
          >
            <option value="all">📍 {t.allDistricts}</option>
            {districts.map(d => (
              <option key={d} value={d}>{d} District</option>
            ))}
          </select>

          {/* Grade Dropdown */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium py-1.5 px-3 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
          >
            <option value="all">🏆 {t.allGrades}</option>
            <option value="Grade A">Grade A (Export Quality)</option>
            <option value="Grade B">Grade B (Standard Bulk)</option>
          </select>

          {/* Certified Organic Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-stone-50 border border-stone-200 hover:bg-emerald-50/50 px-3 py-1.5 rounded-xl transition">
            <input
              type="checkbox"
              checked={onlyOrganic}
              onChange={(e) => setOnlyOrganic(e.target.checked)}
              className="w-3.5 h-3.5 accent-emerald-800 rounded cursor-pointer"
            />
            <span className="text-xs font-medium text-stone-700">🌱 {t.filterOrganicOnly}</span>
          </label>

          {/* Advance Harvest Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-stone-50 border border-stone-200 hover:bg-amber-50/50 px-3 py-1.5 rounded-xl transition">
            <input
              type="checkbox"
              checked={onlyAdvanceHarvest}
              onChange={(e) => setOnlyAdvanceHarvest(e.target.checked)}
              className="w-3.5 h-3.5 accent-amber-600 rounded cursor-pointer"
            />
            <span className="text-xs font-medium text-stone-700">⏳ {t.filterAdvanceHarvest}</span>
          </label>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          <span className="font-bold text-stone-900">{products.length}</span> items available
        </div>
      </div>

      {/* Catalog Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-2xs space-y-3">
          <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-stone-800">No commodities match your current filters</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try resetting your district or grade filters to see all available agricultural and craft products.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => {
            const savingsPercent = Math.round(
              ((product.marketPriceComparison - product.pricePerUnit) / product.marketPriceComparison) * 100
            );

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Product Image */}
                <div 
                  className="relative h-48 w-full overflow-hidden bg-stone-100 cursor-pointer" 
                  onClick={() => onOpenProductDetail(product)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    {product.giTagged && (
                      <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>GI Tagged</span>
                      </span>
                    )}
                    {product.isOrganic && (
                      <span className="bg-emerald-800 text-white font-semibold text-[10px] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-300" />
                        <span>Organic</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    {product.isAdvanceHarvest ? (
                      <span className="bg-amber-700/90 text-white backdrop-blur-xs font-semibold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Pre-Order</span>
                      </span>
                    ) : (
                      <span className="bg-stone-900/75 text-emerald-300 backdrop-blur-xs font-semibold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Ready to Ship</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 left-2.5 right-2.5 flex justify-between items-center text-[11px] font-semibold text-white bg-stone-950/70 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                    <span className="text-amber-300">{product.grade}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{product.district}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Producer Collective */}
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                      <span className="font-semibold text-emerald-900 truncate max-w-[180px]">{product.fpoName}</span>
                      <span className="text-emerald-700 font-medium flex items-center gap-0.5 text-[10px] shrink-0">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </div>

                    {/* Product Title */}
                    <h3 
                      onClick={() => onOpenProductDetail(product)}
                      className="font-bold text-stone-900 text-sm leading-snug hover:text-emerald-800 transition cursor-pointer line-clamp-2"
                      title={product.name}
                    >
                      {currentLang === 'mz' && product.nameMizo ? product.nameMizo : product.name}
                    </h3>

                    {/* Stock & MOQ Pill */}
                    <div className="mt-2 text-[11px] text-stone-600 flex items-center justify-between bg-stone-50 px-2.5 py-1.5 rounded-xl border border-stone-200/60">
                      <div>
                        <span className="text-stone-400">Available: </span>
                        <span className="font-semibold text-stone-800">{product.availableStock} {product.unit}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-stone-400">Min Order: </span>
                        <span className="font-semibold text-emerald-900">{product.minOrderQty} {product.unit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Details */}
                  <div className="pt-2 border-t border-stone-100">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] text-stone-400 font-medium">Direct Price:</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-extrabold text-stone-900">
                            ₹{product.pricePerUnit.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-stone-500 font-normal">/{product.unit}</span>
                        </div>
                      </div>

                      {savingsPercent > 0 && (
                        <div className="text-right">
                          <span className="text-[10px] text-stone-400 line-through">
                            ₹{product.marketPriceComparison.toLocaleString('en-IN')}
                          </span>
                          <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80">
                            Save {savingsPercent}%
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Primary & Secondary Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onOpenRFQModal(product)}
                      className="w-full flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 px-2 rounded-xl text-xs transition shadow-2xs cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{product.isAdvanceHarvest ? 'Pre-Order' : t.tenderRFQ}</span>
                    </button>

                    <button
                      onClick={() => onOpenProductDetail(product)}
                      className="w-full flex items-center justify-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-2 px-2 rounded-xl text-xs transition cursor-pointer"
                    >
                      <span>{t.viewDetails}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
