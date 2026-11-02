import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  PlusCircle, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Award,
  Layers,
  Image as ImageIcon,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function NewListingModal({
  isOpen,
  onClose,
  onSubmitNewProduct,
  onUpdateProduct,
  editingProduct = null,
  products = [],
  districts = [],
  categories = [],
  currentUser,
  t,
  currentLang
}) {
  if (!isOpen) return null;

  const fileInputRef = useRef(null);

  // Form Fields
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
  const [descriptionMizo, setDescriptionMizo] = useState('');
  const [packaging, setPackaging] = useState('Standard 25kg multi-wall jute sacks');

  // Image State
  const [imagePreview, setImagePreview] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [imageError, setImageError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or pre-fill values when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setNameMizo(editingProduct.nameMizo || '');
      setCategory(editingProduct.category || 'spices');
      setDistrict(editingProduct.district || currentUser?.district || 'Champhai');
      setGrade(editingProduct.grade || 'Grade A (Export Quality)');
      setUnit(editingProduct.unit || 'kg');
      setPricePerUnit(editingProduct.pricePerUnit ? String(editingProduct.pricePerUnit) : '');
      setMarketPriceComparison(editingProduct.marketPriceComparison ? String(editingProduct.marketPriceComparison) : '');
      setMinOrderQty(editingProduct.minOrderQty ? String(editingProduct.minOrderQty) : '');
      setAvailableStock(editingProduct.availableStock ? String(editingProduct.availableStock) : '');
      setIsOrganic(Boolean(editingProduct.isOrganic));
      setGiTagged(Boolean(editingProduct.giTagged));
      setIsAdvanceHarvest(Boolean(editingProduct.isAdvanceHarvest));
      setHarvestDate(editingProduct.harvestDate || 'Ready in Stock');
      setDescription(editingProduct.description || '');
      setDescriptionMizo(editingProduct.descriptionMizo || '');
      setPackaging(editingProduct.packaging || 'Standard 25kg multi-wall jute sacks');
      setImagePreview(editingProduct.images?.[0] || '');
      setImageFileName(editingProduct.images?.[0] ? 'Current Product Photo' : '');
    } else {
      setName('');
      setNameMizo('');
      setCategory('spices');
      setDistrict(currentUser?.district || 'Champhai');
      setGrade('Grade A (Export Quality)');
      setUnit('kg');
      setPricePerUnit('');
      setMarketPriceComparison('');
      setMinOrderQty('');
      setAvailableStock('');
      setIsOrganic(true);
      setGiTagged(false);
      setIsAdvanceHarvest(false);
      setHarvestDate('Ready in Stock');
      setDescription('');
      setDescriptionMizo('');
      setPackaging('Standard 25kg multi-wall jute sacks');
      setImagePreview('');
      setImageFileName('');
    }
    setServerError('');
    setImageError('');
  }, [editingProduct, currentUser]);

  // Compute User Listing Quota from existing products list
  const userProducts = (products || []).filter(p => currentUser?.id && p.sellerId === currentUser.id);
  // If editing an existing product, exclude it from active count so quota doesn't double-count
  const countedProducts = editingProduct 
    ? userProducts.filter(p => p.id !== editingProduct.id) 
    : userProducts;

  const photoCount = countedProducts.filter(p => 
    Array.isArray(p.images) && p.images.length > 0 && p.images.some(img => img && img.trim() !== '')
  ).length;
  const textOnlyCount = countedProducts.length - photoCount;

  const maxPhotos = 10;
  const maxTextOnly = 30;

  const isPhotoQuotaFull = photoCount >= maxPhotos;
  const isTextQuotaFull = textOnlyCount >= maxTextOnly;

  const hasSelectedPhoto = Boolean(imagePreview && imagePreview.trim() !== '');

  // Check if current configuration exceeds quota
  const cannotSubmitBecausePhotoLimit = hasSelectedPhoto && isPhotoQuotaFull;
  const cannotSubmitBecauseTextLimit = !hasSelectedPhoto && isTextQuotaFull;

  // Handle local image file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    // Limit client file read to 10MB to avoid browser lag
    if (file.size > 10 * 1024 * 1024) {
      setImageError('Selected image is larger than 10MB. Please choose a smaller image.');
      return;
    }

    setImageError('');
    setServerError('');
    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      setImagePreview(loadEvt.target.result);
    };
    reader.onerror = () => {
      setImageError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setImagePreview('');
    setImageFileName('');
    setImageError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!name || !pricePerUnit || !minOrderQty) {
      setServerError('Please fill in all mandatory fields: Commodity name, price, and MOQ.');
      return;
    }

    if (cannotSubmitBecausePhotoLimit) {
      setServerError(`Posting limit reached: You have already posted ${photoCount}/${maxPhotos} allowed listings with photos. Please remove the photo below to post as text-only (up to ${maxTextOnly} allowed), or delete an existing photo post.`);
      return;
    }

    if (cannotSubmitBecauseTextLimit) {
      setServerError(`Posting limit reached: You have already posted ${textOnlyCount}/${maxTextOnly} allowed listings without photos. Please delete an older listing to create a new one.`);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      nameMizo: nameMizo.trim() || name.trim(),
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
      description: description.trim() || 'High-grade harvest sourced directly from Mizoram organic hill slopes.',
      descriptionMizo: descriptionMizo.trim() || 'Mizoram tlangram aṭanga thar chhuah tha tak.',
      packaging,
      images: imagePreview ? [imagePreview] : []
    };

    let result;
    if (editingProduct && onUpdateProduct) {
      result = await onUpdateProduct(editingProduct.id, payload);
    } else {
      result = await onSubmitNewProduct(payload);
    }

    setIsSubmitting(false);

    if (result && result.success === false) {
      setServerError(result.error || 'Failed to save product listing. Please check the fields and quota limits.');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 transition cursor-pointer"
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
            {editingProduct ? 'Edit Harvest Listing' : (t?.newListing || 'List New Harvest')}
          </h2>
          <p className="text-xs text-emerald-200 mt-1">
            {editingProduct 
              ? 'Update your commodity pricing, stock volume, specifications, or replace photos.'
              : 'Publish harvest lots with photos or text. Photos are automatically compressed by the server.'}
          </p>

          {/* Real-time Quota Badges */}
          <div className="mt-3 pt-3 border-t border-emerald-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-emerald-300 font-semibold">Your Posting Quota:</span>
            <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
              isPhotoQuotaFull ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40' : 'bg-emerald-800/70 text-emerald-100 border border-emerald-700'
            }`}>
              <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
              <span>Photos: {photoCount}/{maxPhotos} used</span>
              {isPhotoQuotaFull && <span className="text-[10px] bg-amber-500 text-slate-950 px-1 rounded font-black">FULL</span>}
            </span>

            <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
              isTextQuotaFull ? 'bg-red-500/20 text-red-200 border border-red-400/40' : 'bg-emerald-800/70 text-emerald-100 border border-emerald-700'
            }`}>
              <Layers className="w-3.5 h-3.5 text-emerald-300" />
              <span>Text-only: {textOnlyCount}/{maxTextOnly} used</span>
              {isTextQuotaFull && <span className="text-[10px] bg-red-500 text-white px-1 rounded font-black">FULL</span>}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Server Error Alert */}
          {serverError && (
            <div className="p-3.5 bg-red-50 border border-red-300 text-red-900 rounded-2xl text-xs font-semibold flex items-start gap-2.5 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-extrabold text-red-950 mb-0.5">Unable to Submit Listing</div>
                <div>{serverError}</div>
              </div>
            </div>
          )}

          {/* Quota Limit Reached Alert Banner */}
          {cannotSubmitBecausePhotoLimit && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl text-xs font-semibold flex items-start gap-2.5 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-extrabold text-amber-950 mb-0.5">Photo Listing Limit Reached (10/10)</div>
                <div>
                  You have already used all 10 listings with photos. You can click <strong>"Remove Photo"</strong> below to publish this listing as text-only (up to 30 allowed), or delete an existing photo post from your dashboard.
                </div>
              </div>
            </div>
          )}

          {cannotSubmitBecauseTextLimit && (
            <div className="p-3.5 bg-red-50 border border-red-300 text-red-900 rounded-2xl text-xs font-semibold flex items-start gap-2.5 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-extrabold text-red-950 mb-0.5">Text-Only Listing Limit Reached (30/30)</div>
                <div>
                  You have already used all 30 text listings. Please delete an older listing to create a new one, or attach a photo if photo slots are free.
                </div>
              </div>
            </div>
          )}

          {/* IMAGE UPLOAD & OPTIMIZATION SECTION */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-700" />
                <span>Produce Image / Photo</span>
                <span className="text-[11px] font-normal text-slate-500">
                  (Optional - Max 10 with photos, 30 without)
                </span>
              </label>
              {hasSelectedPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Photo (Make Text-Only)</span>
                </button>
              )}
            </div>

            {hasSelectedPhoto ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                <div className="relative w-28 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img
                    src={imagePreview}
                    alt="Produce Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded font-mono">
                    Ready
                  </div>
                </div>
                <div className="flex-1 text-xs space-y-1">
                  <div className="font-bold text-slate-900 truncate max-w-[280px]">
                    {imageFileName || 'Selected Produce Photo'}
                  </div>
                  <div className="text-emerald-700 flex items-center gap-1 text-[11px] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Server will automatically convert & compress to small WebP</span>
                  </div>
                  <div className="pt-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => {
                  if (isPhotoQuotaFull) {
                    setImageError('Cannot upload photo: You have reached the maximum 10 listings with photos.');
                    return;
                  }
                  fileInputRef.current?.click();
                }}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition ${
                  isPhotoQuotaFull 
                    ? 'border-slate-200 bg-slate-100/60 opacity-60 cursor-not-allowed' 
                    : 'border-slate-300 hover:border-emerald-600 hover:bg-emerald-50/30'
                }`}
              >
                <Upload className="w-7 h-7 text-emerald-700 mx-auto mb-1.5" />
                <div className="text-xs font-bold text-slate-800">
                  {isPhotoQuotaFull 
                    ? 'Photo Upload Disabled (Limit 10/10 Reached)' 
                    : 'Click or Drag & Drop to Upload Produce Photo'}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supports JPG, PNG, WebP. High-res images are automatically resized to web-friendly sizes.
                </p>
                <div className="mt-2 text-[10px] text-slate-400">
                  No photo attached? This post will publish as <strong>text-only</strong> (Quota: {textOnlyCount}/{maxTextOnly}).
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {imageError && (
              <p className="text-xs text-red-600 font-semibold">{imageError}</p>
            )}
          </div>

          {/* Commodity Names */}
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Category, District, Quality */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600"
              >
                <option value="Grade A (Export Quality)">Grade A (Export Quality)</option>
                <option value="Grade B (Commercial Standard)">Grade B (Commercial Standard)</option>
                <option value="Artisan Master Grade">Artisan Master Grade</option>
              </select>
            </div>
          </div>

          {/* Unit, Pricing & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit *</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-emerald-600"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Available Stock</label>
              <input
                type="number"
                placeholder="e.g. 3500"
                value={availableStock}
                onChange={(e) => setAvailableStock(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600"
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
                className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
              />
              <span>Certified Organic / Chemical-free</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={giTagged}
                onChange={(e) => setGiTagged(e.target.checked)}
                className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
              />
              <span>Geographical Indication (GI Tagged)</span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description & Harvest Story
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the organic soil conditions, sun-curing process, cultivar, or artisan traditions..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium">
              {hasSelectedPhoto ? (
                <span className="text-emerald-700 font-bold">📸 Counts against Photo Quota ({photoCount}/{maxPhotos})</span>
              ) : (
                <span className="text-slate-600 font-bold">📝 Counts against Text Quota ({textOnlyCount}/{maxTextOnly})</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || cannotSubmitBecausePhotoLimit || cannotSubmitBecauseTextLimit}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
              >
                {isSubmitting ? 'Saving...' : (editingProduct ? 'Save Changes' : 'Publish to Marketplace')}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
