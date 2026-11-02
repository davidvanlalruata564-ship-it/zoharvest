import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Grid, 
  FolderHeart, 
  CreditCard, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
  ArrowLeft,
  Building,
  Calendar,
  Share2,
  User,
  Settings,
  Edit3,
  Trash2,
  PlusCircle,
  Eye,
  EyeOff,
  AlertTriangle,
  AlertCircle,
  BarChart3,
  ArrowUpRight
} from 'lucide-react';

export default function PublicProfileModal({
  isOpen,
  onClose,
  sellerId,
  products = [],
  onSelectProduct,
  currentUser,
  onOpenEditProfile,
  onEditProduct,
  onDeleteProduct,
  onOpenNewListing,
  initialTab = 'posts'
}) {
  if (!isOpen) return null;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab || 'posts'); // 'posts' | 'collections' | 'payment'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedKey, setCopiedKey] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [previewAsBuyer, setPreviewAsBuyer] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [actionNotice, setActionNotice] = useState('');

  // Synchronize initial tab
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Determine if viewing own profile
  const isOwnProfile = Boolean(
    currentUser && (
      (sellerId && currentUser.id && String(currentUser.id) === String(sellerId)) ||
      (sellerId && currentUser.organization && currentUser.organization.toLowerCase() === String(sellerId).toLowerCase()) ||
      (sellerId && currentUser.name && currentUser.name.toLowerCase() === String(sellerId).toLowerCase()) ||
      (sellerId && currentUser.email && currentUser.email.toLowerCase() === String(sellerId).toLowerCase()) ||
      sellerId === 'self' ||
      sellerId === 'me' ||
      (profile && (
        (currentUser.id && profile.id && String(currentUser.id) === String(profile.id)) ||
        (currentUser.email && profile.email && currentUser.email.toLowerCase() === profile.email.toLowerCase()) ||
        (currentUser.organization && profile.organization && currentUser.organization.toLowerCase() === profile.organization.toLowerCase()) ||
        (currentUser.name && profile.name && currentUser.name.toLowerCase() === profile.name.toLowerCase())
      ))
    )
  );

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      if (!sellerId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(sellerId)}/public-profile`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            // If it's own profile, ensure latest currentUser fields take precedence
            if (isOwnProfile && currentUser) {
              setProfile({
                ...data.profile,
                name: currentUser.name || data.profile.name,
                organization: currentUser.organization || data.profile.organization,
                district: currentUser.district || data.profile.district,
                bio: currentUser.bio || data.profile.bio,
                phone: currentUser.phone || data.profile.phone,
                whatsapp: currentUser.whatsapp || currentUser.phone || data.profile.whatsapp,
                gpayNumber: currentUser.gpayNumber || currentUser.phone || data.profile.gpayNumber,
                upiId: currentUser.upiId || data.profile.upiId,
                bankAccount: currentUser.bankAccount || data.profile.bankAccount
              });
            } else {
              setProfile(data.profile);
            }
          }
        } else {
          synthesizeProfileFromProducts();
        }
      } catch (e) {
        synthesizeProfileFromProducts();
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    function synthesizeProfileFromProducts() {
      // Products belonging to seller
      const sellerProds = products.filter(p => 
        (p.sellerId && String(p.sellerId) === String(sellerId)) ||
        (p.fpoName && String(p.fpoName).toLowerCase() === String(sellerId).toLowerCase()) ||
        (isOwnProfile && currentUser?.id && p.sellerId === currentUser.id) ||
        (isOwnProfile && currentUser?.organization && p.fpoName === currentUser.organization)
      );

      const firstProd = sellerProds[0] || {};

      if (isOwnProfile && currentUser) {
        const synthesizedOwn = {
          id: currentUser.id || 'owner-me',
          name: currentUser.name || 'Storefront Owner',
          username: (currentUser.organization || currentUser.name || 'grower').toLowerCase().replace(/[^a-z0-9]/g, '_'),
          organization: currentUser.organization || currentUser.name || 'Producer Collective',
          district: currentUser.district || 'Champhai',
          address: currentUser.address || `${currentUser.district || 'Champhai'}, Mizoram`,
          bio: currentUser.bio || `Verified organic farmer and wholesale supplier based in ${currentUser.district || 'Champhai'}, Mizoram. 🏔️🌿`,
          avatarUrl: currentUser.avatarUrl || null,
          phone: currentUser.phone || '+91 94361 00000',
          whatsapp: currentUser.whatsapp || currentUser.phone || '+91 94361 00000',
          email: currentUser.email || '',
          role: currentUser.role || 'farmer',
          isVerified: currentUser.isVerified ?? true,
          gpayNumber: currentUser.gpayNumber || currentUser.phone || '+91 94361 00000',
          upiId: currentUser.upiId || 'grower@upi',
          bankAccount: currentUser.bankAccount || {
            bankName: 'Mizoram Rural Bank',
            accountNumber: '30291847562',
            ifsc: 'SBIN0RRMIGB',
            beneficiary: currentUser.organization || currentUser.name || 'Producer Collective'
          },
          stats: {
            postsCount: sellerProds.length,
            followersCount: 180 + sellerProds.length * 10,
            followingCount: 11
          },
          posts: sellerProds,
          collections: []
        };
        if (isMounted) setProfile(synthesizedOwn);
        return;
      }

      const synthesizedVisitor = {
        id: sellerId,
        name: firstProd.fpoName || 'Grassroots Producer Collective',
        username: (firstProd.fpoName || 'grower').toLowerCase().replace(/[^a-z0-9]/g, '_'),
        organization: firstProd.fpoName || 'Producer Cooperative',
        district: firstProd.district || 'Champhai',
        address: `${firstProd.district || 'Champhai'}, Mizoram`,
        bio: `Verified organic farmer collective in ${firstProd.district || 'Champhai'}, Mizoram. Growing authentic hillside spices, grains, and produce with direct farm-gate dispatch. 🏔️🌿`,
        avatarUrl: null,
        phone: '+91 94361 00000',
        whatsapp: '+91 94361 00000',
        email: 'collective@zoharvest.in',
        role: 'farmer',
        isVerified: true,
        gpayNumber: '+91 94361 00000',
        upiId: `${(firstProd.district || 'mizoram').toLowerCase()}.fpo@okhdfcbank`,
        bankAccount: {
          bankName: 'Mizoram Rural Bank',
          accountNumber: '30291847562',
          ifsc: 'SBIN0RRMIGB',
          beneficiary: firstProd.fpoName || 'Mizoram Producer Co-op'
        },
        stats: {
          postsCount: sellerProds.length,
          followersCount: 180 + sellerProds.length * 10,
          followingCount: 11
        },
        posts: sellerProds,
        collections: []
      };
      if (isMounted) setProfile(synthesizedVisitor);
    }

    fetchProfile();
    return () => { isMounted = false; };
  }, [sellerId, products, currentUser, isOwnProfile]);

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Resolve all active posts for this profile
  const rawPosts = isOwnProfile
    ? products.filter(p => 
        (currentUser?.id && p.sellerId === currentUser.id) ||
        (currentUser?.organization && p.fpoName && p.fpoName.toLowerCase() === currentUser.organization.toLowerCase()) ||
        (currentUser?.name && p.fpoName && p.fpoName.toLowerCase() === currentUser.name.toLowerCase()) ||
        (profile?.id && p.sellerId === profile.id) ||
        (sellerId && (p.sellerId === sellerId || p.fpoName === sellerId))
      )
    : (profile?.posts?.length ? profile.posts : products.filter(p => 
        p.sellerId === sellerId || p.fpoName === sellerId
      ));

  // Quota calculation for owner (10 image posts, 30 text posts)
  const photoListings = rawPosts.filter(p => 
    Array.isArray(p.images) && p.images.length > 0 && p.images.some(img => img && img.trim() !== '')
  );
  const textListings = rawPosts.filter(p => 
    !Array.isArray(p.images) || p.images.length === 0 || p.images.every(img => !img || img.trim() === '')
  );

  const MAX_PHOTO = 10;
  const MAX_TEXT = 30;
  const photoLimitReached = photoListings.length >= MAX_PHOTO;
  const textLimitReached = textListings.length >= MAX_TEXT;
  const totalLimitReached = photoLimitReached && textLimitReached;

  const filteredPosts = selectedCategory === 'all' 
    ? rawPosts 
    : rawPosts.filter(p => p.category === selectedCategory);

  const cleanPhone = (profile?.whatsapp || profile?.phone || '').replace(/[^0-9]/g, '');

  // Delete product handler from inside the profile
  const handleDeletePost = async (post, e) => {
    if (e) e.stopPropagation();
    if (!onDeleteProduct) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete listing "${post.name}"?\n\nDeleting this listing will permanently remove it from the marketplace and immediately release 1 quota slot back to your account.`
    );
    if (!confirmed) return;

    setDeletingId(post.id);
    try {
      await onDeleteProduct(post.id);
      setActionNotice(`Listing "${post.name}" deleted. 1 quota slot released!`);
      setTimeout(() => setActionNotice(''), 4000);
    } catch (err) {
      alert('Failed to delete listing. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Effective mode: owner mode vs visitor view
  const isOwnerMode = isOwnProfile && !previewAsBuyer;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition cursor-pointer"
              title="Close"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm text-slate-900 font-mono tracking-tight">
                @{profile?.username || 'grower'}
              </span>
              {profile?.isVerified && (
                <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
              )}
              {isOwnProfile && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs">
                  {previewAsBuyer ? '👁️ Previewing as Buyer' : '👑 You (Owner Mode)'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Owner Toggle: Preview As Buyer vs Owner Management */}
            {isOwnProfile && (
              <button
                onClick={() => setPreviewAsBuyer(!previewAsBuyer)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                  previewAsBuyer
                    ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
                title={previewAsBuyer ? 'Return to Owner Management' : 'Preview how buyers see your profile'}
              >
                {previewAsBuyer ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Exit Buyer Preview</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>Preview as Buyer</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: profile?.organization || profile?.name,
                    text: `Check out ${profile?.organization} on ZOHARVEST!`,
                    url: window.location.href
                  }).catch(() => {});
                } else {
                  copyToClipboard(window.location.href, 'share');
                }
              }}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              title="Share Profile"
            >
              {copiedKey === 'share' ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Temporary Action Feedback Banner */}
        {actionNotice && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Scrollable Profile Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-semibold">Loading Profile...</p>
            </div>
          ) : (
            <div>
              {/* Profile Bio & Stats Header */}
              <div className="p-4 sm:p-6 space-y-4 border-b border-slate-100">
                
                {/* Mode Context Notice for Owner */}
                {isOwnProfile && (
                  <div className={`p-3 rounded-2xl border text-xs flex flex-wrap items-center justify-between gap-3 ${
                    previewAsBuyer 
                      ? 'bg-amber-50 border-amber-300 text-amber-950' 
                      : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${previewAsBuyer ? 'text-amber-700' : 'text-emerald-700'}`} />
                      <div>
                        <div className="font-extrabold">
                          {previewAsBuyer ? 'Buyer Preview Mode Activated' : 'Storefront Owner Controls Active'}
                        </div>
                        <p className={`text-[11px] mt-0.5 ${previewAsBuyer ? 'text-amber-800' : 'text-emerald-800'}`}>
                          {previewAsBuyer 
                            ? 'You are viewing your storefront exactly as buyers see it with WhatsApp, Call, and Direct P2P payment links.' 
                            : 'You have full access to edit profile details, manage GPay/Bank payouts, post new harvests, and edit or delete your listings to free up quota.'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setPreviewAsBuyer(!previewAsBuyer)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg border transition cursor-pointer shrink-0 ${
                        previewAsBuyer 
                          ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 border-amber-500 font-extrabold' 
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-800'
                      }`}
                    >
                      {previewAsBuyer ? 'Back to Owner Controls ➜' : '👁️ View as Buyer'}
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  
                  {/* Story Gradient Ring Avatar */}
                  <div className="relative shrink-0 mx-auto sm:mx-0">
                    <div className="p-[3px] bg-gradient-to-tr from-amber-500 via-emerald-600 to-teal-500 rounded-full shadow-md">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-white flex items-center justify-center text-3xl font-extrabold text-emerald-800">
                        {profile?.avatarUrl ? (
                          <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>👨‍🌾</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Profile Info & Header Actions */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                          {profile?.organization || profile?.name}
                        </h2>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{profile?.district} District, Mizoram</span>
                        </div>
                      </div>

                      {/* Header Primary Action Button */}
                      <div>
                        {isOwnerMode ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                onClose();
                                if (onOpenEditProfile) onOpenEditProfile('general');
                              }}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                              <span>Edit Bio & Info</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setIsFollowing(!isFollowing)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                              isFollowing 
                                ? 'bg-slate-100 text-slate-800 hover:bg-slate-200' 
                                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                            }`}
                          >
                            {isFollowing ? 'Following ✓' : 'Follow Seller'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stats Counter (Instagram Style) */}
                    <div className="flex items-center gap-6 text-xs pt-1 border-y border-slate-100 py-2">
                      <div>
                        <span className="font-extrabold text-slate-900 block text-sm">{rawPosts.length}</span>
                        <span className="text-slate-500 text-[11px]">Listings</span>
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block text-sm">{profile?.stats?.followersCount || 180}</span>
                        <span className="text-slate-500 text-[11px]">Followers</span>
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block text-sm">{profile?.stats?.followingCount || 11}</span>
                        <span className="text-slate-500 text-[11px]">Districts</span>
                      </div>
                    </div>

                    {/* Bio Description */}
                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      {profile?.bio}
                    </p>

                    {/* ACTION ROW: SPECIFIC FUNCTIONS FOR OWNER VS VISITOR */}
                    {isOwnerMode ? (
                      /* OWNER FUNCTIONS ROW */
                      <div className="flex flex-wrap items-center gap-2 pt-1 w-full">
                        <button
                          onClick={() => {
                            if (totalLimitReached) {
                              alert('Posting Quota Limit Reached!\n\nYou have used all 10 photo posts and 30 text posts. Please delete an existing listing from your profile below to free up quota before creating a new post.');
                              return;
                            }
                            onClose();
                            if (onOpenNewListing) onOpenNewListing();
                          }}
                          className={`flex-1 font-bold py-2 px-3 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                            totalLimitReached 
                              ? 'bg-slate-100 text-slate-400 border border-slate-200' 
                              : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          }`}
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                          <span>+ Post New Harvest Listing</span>
                        </button>

                        <button
                          onClick={() => {
                            onClose();
                            if (onOpenEditProfile) onOpenEditProfile('payment');
                          }}
                          className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          title="Manage GPay and Bank Account for direct buyer payouts"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Manage Payouts (GPay & Bank)</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('payment')}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-600" />
                          <span>View Payout Cards</span>
                        </button>
                      </div>
                    ) : (
                      /* VISITOR / BUYER FUNCTIONS ROW */
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${profile?.organization || profile?.name}, I found your produce on ZOHARVEST and would like to place an order.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 min-w-[130px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Chat on WhatsApp</span>
                          </a>
                        )}

                        {profile?.phone && (
                          <a
                            href={`tel:${profile.phone}`}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-600" />
                            <span>Call Direct</span>
                          </a>
                        )}

                        <button
                          onClick={() => setActiveTab('payment')}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-amber-300/80"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                          <span>GPay & Bank Info</span>
                        </button>
                      </div>
                    )}

                  </div>
                </div>

                {/* POSTING QUOTA STATUS CARD (OWNER MANAGEMENT ONLY) */}
                {isOwnerMode && (
                  <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                        <BarChart3 className="w-4 h-4 text-emerald-700" />
                        <span>Your Post Limits & Quota Status</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Deleting a listing immediately releases quota
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Photo Posts Quota */}
                      <div className={`p-3 rounded-xl border ${
                        photoLimitReached 
                          ? 'bg-rose-50 border-rose-200 text-rose-950' 
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold flex items-center gap-1">
                            <span>📸 Photo Listings</span>
                            {photoLimitReached && <span className="text-[10px] bg-rose-600 text-white font-extrabold px-1.5 rounded">Limit Hit</span>}
                          </span>
                          <span className="font-mono font-black">
                            {photoListings.length} / {MAX_PHOTO}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              photoLimitReached ? 'bg-rose-500' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${Math.min(100, (photoListings.length / MAX_PHOTO) * 100)}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1.5">
                          {photoLimitReached 
                            ? 'Maximum 10 photo posts reached. Delete an existing photo listing below to post more photos.' 
                            : `${MAX_PHOTO - photoListings.length} photo post slots available.`}
                        </p>
                      </div>

                      {/* Text Posts Quota */}
                      <div className={`p-3 rounded-xl border ${
                        textLimitReached 
                          ? 'bg-rose-50 border-rose-200 text-rose-950' 
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold flex items-center gap-1">
                            <span>📝 Text-Only Listings</span>
                            {textLimitReached && <span className="text-[10px] bg-rose-600 text-white font-extrabold px-1.5 rounded">Limit Hit</span>}
                          </span>
                          <span className="font-mono font-black">
                            {textListings.length} / {MAX_TEXT}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              textLimitReached ? 'bg-rose-500' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${Math.min(100, (textListings.length / MAX_TEXT) * 100)}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1.5">
                          {textLimitReached 
                            ? 'Maximum 30 text posts reached. Delete an existing text listing below to post more.' 
                            : `${MAX_TEXT - textListings.length} text post slots available.`}
                        </p>
                      </div>
                    </div>

                    {totalLimitReached && (
                      <div className="bg-rose-100 border border-rose-300 text-rose-900 rounded-xl p-2.5 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                        <span>You have hit your maximum posting limit. Delete an existing post from your grid below to immediately free up a posting slot.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Story Highlights / Collections Chips */}
                <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-2 no-scrollbar">
                  <button
                    onClick={() => { setSelectedCategory('all'); setActiveTab('posts'); }}
                    className={`flex flex-col items-center gap-1 shrink-0 cursor-pointer group`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg transition border-2 ${
                      selectedCategory === 'all' && activeTab === 'posts'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 group-hover:border-slate-300'
                    }`}>
                      🌾
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">All ({rawPosts.length})</span>
                  </button>

                  <button
                    onClick={() => { setSelectedCategory('spices'); setActiveTab('posts'); }}
                    className={`flex flex-col items-center gap-1 shrink-0 cursor-pointer group`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg transition border-2 ${
                      selectedCategory === 'spices'
                        ? 'border-amber-600 bg-amber-50 text-amber-800 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 group-hover:border-slate-300'
                    }`}>
                      🌶️
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">Spices</span>
                  </button>

                  <button
                    onClick={() => { setSelectedCategory('fruits'); setActiveTab('posts'); }}
                    className={`flex flex-col items-center gap-1 shrink-0 cursor-pointer group`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg transition border-2 ${
                      selectedCategory === 'fruits'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 group-hover:border-slate-300'
                    }`}>
                      🍊
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">Fresh Produce</span>
                  </button>

                  <button
                    onClick={() => { setSelectedCategory('grains'); setActiveTab('posts'); }}
                    className={`flex flex-col items-center gap-1 shrink-0 cursor-pointer group`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg transition border-2 ${
                      selectedCategory === 'grains'
                        ? 'border-amber-600 bg-amber-50 text-amber-800 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 group-hover:border-slate-300'
                    }`}>
                      🌾
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">Grains</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('payment')}
                    className={`flex flex-col items-center gap-1 shrink-0 cursor-pointer group`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg transition border-2 ${
                      activeTab === 'payment'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 group-hover:border-slate-300'
                    }`}>
                      💳
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">GPay & Bank</span>
                  </button>
                </div>
              </div>

              {/* Instagram Profile Tabs */}
              <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition border-b-2 cursor-pointer ${
                    activeTab === 'posts'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent hover:text-slate-700'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span className="uppercase tracking-wider">
                    {isOwnerMode ? 'My Listings' : 'Listings'} ({rawPosts.length})
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('collections')}
                  className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition border-b-2 cursor-pointer ${
                    activeTab === 'collections'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent hover:text-slate-700'
                  }`}
                >
                  <FolderHeart className="w-4 h-4" />
                  <span className="uppercase tracking-wider">Galleries</span>
                </button>

                <button
                  onClick={() => setActiveTab('payment')}
                  className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition border-b-2 cursor-pointer ${
                    activeTab === 'payment'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent hover:text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="uppercase tracking-wider">
                    {isOwnerMode ? 'My Payout Setup' : 'Direct Payment Info'}
                  </span>
                </button>
              </div>

              {/* TAB 1: POSTS GRID (INSTAGRAM STYLE) */}
              {activeTab === 'posts' && (
                <div className="p-3 sm:p-4 space-y-3">
                  
                  {/* Owner Header Bar inside Posts Tab */}
                  {isOwnerMode && (
                    <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-800">
                        Manage your published listings ({filteredPosts.length})
                      </span>
                      <button
                        onClick={() => {
                          if (totalLimitReached) {
                            alert('Post limit reached. Delete an existing listing to free up quota.');
                            return;
                          }
                          onClose();
                          if (onOpenNewListing) onOpenNewListing();
                        }}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1 rounded-lg text-xs transition cursor-pointer flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                        <span>+ New Post</span>
                      </button>
                    </div>
                  )}

                  {filteredPosts.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <Grid className="w-10 h-10 mx-auto text-slate-300" />
                      <div className="font-bold text-sm text-slate-700">No Listings Found</div>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {isOwnerMode 
                          ? 'You have not published any harvest listings yet. Click the button below to add your first produce listing!' 
                          : 'This grower has not posted commodities under this highlight yet.'}
                      </p>
                      {isOwnerMode && (
                        <button
                          onClick={() => {
                            onClose();
                            if (onOpenNewListing) onOpenNewListing();
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>+ Create Your First Post</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {filteredPosts.map(post => {
                        const hasImg = post.images && post.images.length > 0 && post.images[0];
                        const isDeletingThis = deletingId === post.id;

                        return (
                          <div
                            key={post.id}
                            onClick={() => {
                              if (isOwnerMode) {
                                // In owner mode, clicking opens edit product
                                if (onEditProduct) {
                                  onClose();
                                  onEditProduct(post);
                                }
                              } else {
                                // In visitor mode, clicking opens product detail modal for purchasing
                                onClose();
                                onSelectProduct(post);
                              }
                            }}
                            className={`group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 cursor-pointer shadow-2xs hover:shadow-md transition ${
                              isDeletingThis ? 'opacity-40 pointer-events-none' : ''
                            }`}
                          >
                            {/* Listing Thumbnail */}
                            {hasImg ? (
                              <img
                                src={post.images[0]}
                                alt={post.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 p-3 flex flex-col justify-between text-white">
                                <div className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                                  {post.category}
                                </div>
                                <div className="font-extrabold text-xs line-clamp-3 leading-snug">
                                  {post.name}
                                </div>
                                <div className="text-[10px] text-emerald-300 font-mono">
                                  MOQ: {post.minOrderQty} {post.unit}
                                </div>
                              </div>
                            )}

                            {/* OWNER MODE: EXPLICIT EDIT & DELETE ACTION BUTTONS ON CARD */}
                            {isOwnerMode ? (
                              <>
                                {/* Top Badges & Action Buttons */}
                                <div className="absolute top-2 left-2 z-10 bg-emerald-950/90 text-amber-300 border border-emerald-400/40 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                                  Your Post
                                </div>

                                <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onEditProduct) {
                                        onClose();
                                        onEditProduct(post);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-900 text-amber-300 transition shadow-sm cursor-pointer border border-white/20"
                                    title="Edit this listing"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={(e) => handleDeletePost(post, e)}
                                    className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white transition shadow-sm cursor-pointer border border-rose-400/30"
                                    title="Delete listing (Releases 1 quota slot)"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Owner Overlay */}
                                <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 text-white">
                                  <div className="flex justify-between items-start text-[10px]">
                                    <span className="bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                                      {post.grade || 'Grade A'}
                                    </span>
                                    <span className="bg-emerald-800 text-amber-300 font-extrabold px-1.5 py-0.5 rounded border border-emerald-600">
                                      {hasImg ? '📸 Photo' : '📝 Text'}
                                    </span>
                                  </div>

                                  <div className="text-center space-y-0.5">
                                    <div className="font-extrabold text-sm text-white line-clamp-1">
                                      {post.name}
                                    </div>
                                    <div className="font-black text-amber-300 text-base font-mono">
                                      ₹{post.pricePerUnit?.toLocaleString('en-IN')} <span className="text-xs font-normal text-white">/{post.unit}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-300">
                                      Available: {post.availableStock} {post.unit}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 pt-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (onEditProduct) {
                                          onClose();
                                          onEditProduct(post);
                                        }
                                      }}
                                      className="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-1 px-2 rounded-lg text-[10px] transition flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      <span>Edit</span>
                                    </button>

                                    <button
                                      onClick={(e) => handleDeletePost(post, e)}
                                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-1 px-2 rounded-lg text-[10px] transition flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>
                              </>
                            ) : (
                              /* VISITOR MODE: TAP TO VIEW PRODUCE AND BUY */
                              <div className="absolute inset-0 bg-slate-950/65 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 text-white">
                                <div className="flex justify-between items-start text-[10px]">
                                  <span className="bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                                    {post.grade || 'Grade A'}
                                  </span>
                                  <span className="bg-slate-800/80 text-white font-medium px-1.5 py-0.5 rounded">
                                    {post.district}
                                  </span>
                                </div>

                                <div className="text-center space-y-0.5">
                                  <div className="font-extrabold text-sm text-white line-clamp-1">
                                    {post.name}
                                  </div>
                                  <div className="font-black text-amber-300 text-base font-mono">
                                    ₹{post.pricePerUnit?.toLocaleString('en-IN')} <span className="text-xs font-normal text-white">/{post.unit}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-300">
                                    MOQ: {post.minOrderQty} {post.unit}
                                  </div>
                                </div>

                                <div className="text-[10px] text-emerald-300 text-center font-bold">
                                  Tap to View Details & Order ➜
                                </div>
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: COLLECTIONS & GALLERIES */}
              {activeTab === 'collections' && (
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="text-xs text-slate-600 flex items-center justify-between">
                    <span>Produce galleries and harvest categories for this collective.</span>
                    {isOwnerMode && (
                      <button
                        onClick={() => {
                          onClose();
                          if (onOpenNewListing) onOpenNewListing();
                        }}
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        + Add Listing
                      </button>
                    )}
                  </div>

                  {profile?.collections && profile.collections.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile.collections.map(col => (
                        <div
                          key={col.id}
                          onClick={() => {
                            setSelectedCategory(col.id.replace('col-', ''));
                            setActiveTab('posts');
                          }}
                          className="bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:border-emerald-600 transition cursor-pointer flex items-center gap-4 group"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200 flex items-center justify-center text-2xl font-bold">
                            {col.coverImage ? (
                              <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                            ) : (
                              <span>🌿</span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-800 transition">
                              {col.name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {col.count} {col.count === 1 ? 'Produce listing' : 'Produce listings'}
                            </p>
                            <span className="text-[10px] font-bold text-emerald-700 mt-1 inline-block">
                              Browse Gallery ➜
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                      Collections automatically group as commodities and harvests are published across Spices, Fresh Produce, and Grains.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DIRECT PAYMENT & CONTACT INFO */}
              {activeTab === 'payment' && (
                <div className="p-4 sm:p-6 space-y-5">
                  
                  {/* Notice Banner */}
                  <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 space-y-1">
                    <div className="font-extrabold flex items-center gap-1.5 text-amber-900">
                      <Sparkles className="w-4 h-4 text-amber-700" />
                      <span>
                        {isOwnerMode 
                          ? 'Your Direct Receiving Payout Details (0% Platform Fee)' 
                          : 'Direct P2P Settlement (No Platform Middleman Fees)'}
                      </span>
                    </div>
                    <p className="leading-relaxed text-amber-900/90 text-[11px]">
                      {isOwnerMode 
                        ? 'ZOHARVEST does not deduct transaction fees or handle escrow on this platform. Buyers view your verified Google Pay number, UPI ID, and Bank Account below to pay you directly. Keep your payout details up to date.' 
                        : 'ZOHARVEST does not handle escrow or deduct transaction fees on this website. Connect directly with the seller via WhatsApp or phone, confirm weight and dispatch details, and transfer payment directly to their verified GPay or Bank Account below.'}
                    </p>
                  </div>

                  {/* Owner Action Button to Update Bank/GPay details */}
                  {isOwnerMode && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          onClose();
                          if (onOpenEditProfile) onOpenEditProfile('payment');
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <CreditCard className="w-4 h-4 text-amber-300" />
                        <span>✏️ Update Your GPay & Bank Details</span>
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Google Pay / UPI Card */}
                    <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-5 rounded-2xl shadow-sm border border-emerald-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-white text-emerald-950 font-black text-xs flex items-center justify-center shadow-xs">
                            GPay
                          </div>
                          <div>
                            <div className="font-extrabold text-xs text-white">Google Pay / UPI</div>
                            <div className="text-[10px] text-emerald-200">
                              {isOwnerMode ? 'Your Receiving UPI' : 'Instant UPI Direct Transfer'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      </div>

                      <div className="bg-white/10 p-3 rounded-xl border border-white/15 space-y-2">
                        <div>
                          <div className="text-[10px] text-emerald-300 uppercase font-semibold">UPI ID</div>
                          <div className="font-mono font-bold text-xs text-white break-all flex items-center justify-between gap-2 mt-0.5">
                            <span>{profile?.upiId || (isOwnerMode ? 'Not configured yet' : 'farmer@upi')}</span>
                            <button
                              onClick={() => copyToClipboard(profile?.upiId, 'upi')}
                              className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md transition font-sans font-bold shrink-0 cursor-pointer flex items-center gap-1"
                            >
                              {copiedKey === 'upi' ? <Check className="w-3 h-3 text-amber-300" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedKey === 'upi' ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>

                        {profile?.gpayNumber && (
                          <div className="pt-1 border-t border-white/10">
                            <div className="text-[10px] text-emerald-300 uppercase font-semibold">GPay Mobile Number</div>
                            <div className="font-mono font-bold text-xs text-white flex items-center justify-between gap-2 mt-0.5">
                              <span>{profile.gpayNumber}</span>
                              <button
                                onClick={() => copyToClipboard(profile.gpayNumber, 'gpay')}
                                className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md transition font-sans font-bold shrink-0 cursor-pointer flex items-center gap-1"
                              >
                                {copiedKey === 'gpay' ? <Check className="w-3 h-3 text-amber-300" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedKey === 'gpay' ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {!isOwnerMode && profile?.upiId && (
                        <a
                          href={`upi://pay?pa=${encodeURIComponent(profile.upiId)}&pn=${encodeURIComponent(profile.organization || profile.name)}&cu=INR`}
                          className="w-full bg-white hover:bg-emerald-50 text-emerald-950 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Pay via UPI App</span>
                        </a>
                      )}
                    </div>

                    {/* Bank Account Transfer Card */}
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center">
                            🏦
                          </div>
                          <div>
                            <div className="font-extrabold text-xs text-slate-900">Direct Bank Account</div>
                            <div className="text-[10px] text-slate-500">
                              {isOwnerMode ? 'Your Receiving Bank Wire Details' : 'NEFT / IMPS / RTGS Wire'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Bank Name</span>
                            <span className="font-bold text-slate-900">{profile?.bankAccount?.bankName || 'Mizoram Rural Bank'}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Beneficiary (Account Name)</span>
                            <span className="font-bold text-slate-900">{profile?.bankAccount?.beneficiary || profile?.organization || profile?.name}</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(profile?.bankAccount?.beneficiary, 'ben')}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                            title="Copy Beneficiary Name"
                          >
                            {copiedKey === 'ben' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Account Number</span>
                            <span className="font-mono font-bold text-slate-900">{profile?.bankAccount?.accountNumber || '30291847562'}</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(profile?.bankAccount?.accountNumber, 'acc')}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                            title="Copy Account Number"
                          >
                            {copiedKey === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">IFSC Code</span>
                            <span className="font-mono font-bold text-emerald-800">{profile?.bankAccount?.ifsc || 'SBIN0RRMIGB'}</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(profile?.bankAccount?.ifsc, 'ifsc')}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                            title="Copy IFSC Code"
                          >
                            {copiedKey === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
