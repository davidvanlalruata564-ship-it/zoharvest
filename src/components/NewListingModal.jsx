import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Award,
  Layers
} from 'lucide-react';

export default function NewListingModal({
  isOpen,
  onClose,
  onSubmitNewProduct,
  districts,
  categories,
  currentUser,
  t,
  currentLang
}) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [nameMizo, setNameMizo] = useState('');
  const [category, setCategory] = useState('spices');
  const [district, setDistrict] = useState(currentUser?.district || 'Champhai');
  const [grade, setGrade] = useState('Grade A (Export Quality)');
  const [unit, setUnit] = useState('kg');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [marketPriceComparison, setMarketPriceComparison] = useState('');
  const [minOrderQty, setMinOrderQty] = useState('');
  const [availableStock, setAvailableStock] = useState('');
  const [isOrganic, setIsOrganic] = useState(true);
  const [giTagged, setGiTagged] = useState(false);
  const [isAdvanceHarvest, setIsAdvanceHarvest] = useState(false);
  const [harvestDate, setHarvestDate] = useState('Ready in Stock');
  const [description, setDescription] = useState('');
  const [packaging, setPackaging] = useState('Standard 25kg multi-wall jute sacks');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !pricePerUnit || !minOrderQty) {
      alert('Please fill all mandatory fields');
      return;
    }
    setIsSubmitting(true);
    await onSubmitNewProduct({
      name,
      nameMizo: nameMizo || name,
      category,
      district,
      fpoName: currentUser?.organization || 'Mizoram Producer Co-op',
      sellerId: currentUser?.id || 'user-farmer-1',
      grade,
      unit,
      pricePerUnit: Number(pricePerUnit),
      marketPriceComparison: marketPriceComparison ? Number(marketPriceComparison) : Math.round(Number(pricePerUnit) * 1.25),
      minOrderQty: Number(minOrderQty),
      availableStock: availableStock ? Number(availableStock) : Number(minOrderQty) * 10,
      isOrganic,
      giTagged,
      isAdvanceHarvest,
      harvestDate: isAdvanceHarvest ? harvestDate : 'In Stock',
      description: description || 'High-grade harvest sourced directly from Mizoram organic hill slopes.',
      packaging
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <PlusCircle className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Grassroots Producer Portal
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {t.newListing}
          </h2>
          <p className="text-xs text-emerald-200 mt-1">
            Publish harvest lots, specify Minimum Order Quantities (MOQs), or open advance pre-orders before crop maturity.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Commodity Name (English) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mizo Bird's Eye Chilli"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Commodity Name (Mizo)
              </label>
              <input
                type="text"
                placeholder="e.g. Mizo Hmarchate Tak Tak"
                value={nameMizo}
                onChange={(e) => setNameMizo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
              >
                {categories.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mizoram District *</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
              >
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quality Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
              >
                <option value="Grade A (Export Quality)">Grade A (Export Quality)</option>
                <option value="Grade B (Commercial Standard)">Grade B (Commercial Standard)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit *</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
              >
                <option value="kg">kg</option>
                <option value="quintal">quintal (100kg)</option>
                <option value="crate (20kg)">crate (20kg)</option>
                <option value="piece">piece</option>
                <option value="box (50 stems)">box</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit Price (₹) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 780"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Min Order (MOQ) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 50"
                value={minOrderQty}
                onChange={(e) => setMinOrderQty(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Available Stock</label>
              <input
                type="number"
                placeholder="e.g. 3500"
                value={availableStock}
                onChange={(e) => setAvailableStock(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Advance Harvest Pre-Order Section */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-amber-950">
                <input
                  type="checkbox"
                  checked={isAdvanceHarvest}
                  onChange={(e) => setIsAdvanceHarvest(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
                <span>Enable Advance Harvest Pre-Order (Lock in buyers before crop maturity)</span>
              </label>
            </div>

            {isAdvanceHarvest && (
              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Expected Harvest Window / Dispatch Schedule
                </label>
                <input
                  type="text"
                  placeholder="e.g. Advance Harvest: Dec 15 - Dec 28, 2026"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                />
              </div>
            )}
          </div>

          {/* Organic & GI Tag Checkboxes */}
          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isOrganic}
                onChange={(e) => setIsOrganic(e.target.checked)}
                className="w-4 h-4 accent-emerald-700 rounded"
              />
              <span>Certified Organic / Chemical-free</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={giTagged}
                onChange={(e) => setGiTagged(e.target.checked)}
                className="w-4 h-4 accent-amber-600 rounded"
              />
              <span>Geographical Indication (GI Tagged)</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description & Harvest Story
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the organic soil conditions, sun-curing process, cultivar, or artisan weaving traditions..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish to Marketplace'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
