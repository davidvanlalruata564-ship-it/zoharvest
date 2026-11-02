import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Share2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Mail, 
  Grid, 
  CreditCard, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Instagram, 
  Globe, 
  Copy, 
  Check, 
  MoreVertical, 
  Sparkles,
  BarChart3,
  Camera,
  Loader2
} from 'lucide-react';

import { compressImage, formatBytes } from '../utils/imageCompressor';

export default function ProfilePage({
  profileUserId,
  currentUser,
  products = [],
  onSelectProduct,
  onOpenEditProfile,
  onOpenNewListing,
  onEditProduct,
  onDeleteProduct,
  onBack,
  onLogout
}) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'payout'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedKey, setCopiedKey] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  // Target User ID (either passed or logged-in user)
  const targetId = profileUserId || currentUser?.id;

  // Determine if viewing own profile
  const isOwnProfile = Boolean(
    currentUser && targetId && (
      String(currentUser.id) === String(targetId) ||
      (currentUser.organization && currentUser.organization.toLowerCase() === String(targetId).toLowerCase()) ||
      (currentUser.name && currentUser.name.toLowerCase() === String(targetId).toLowerCase()) ||
      (currentUser.email && currentUser.email.toLowerCase() === String(targetId).toLowerCase()) ||
      targetId === 'self' ||
      targetId === 'me'
    )
  );

  // Handle client-side profile picture selection & auto-downscaling
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setToastMessage('Please select a valid image file (JPG, PNG, or WebP).');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    setUploadingAvatar(true);
    setToastMessage('Optimizing & downscaling photo...');

    try {
      const result = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.8,
        cropToSquare: true
      });

      const token = localStorage.getItem('zh_token');
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatarUrl: result.dataUrl })
      });

      if (res.ok) {
        setProfile(prev => ({ ...prev, avatarUrl: result.dataUrl }));
        if (currentUser) {
          currentUser.avatarUrl = result.dataUrl;
        }
        const stored = localStorage.getItem('zh_user');
        if (stored) {
          const u = JSON.parse(stored);
          u.avatarUrl = result.dataUrl;
          localStorage.setItem('zh_user', JSON.stringify(u));
        }
        setToastMessage(`Profile photo updated! (${formatBytes(result.originalSize)} ➔ ${formatBytes(result.compressedSize)})`);
      } else {
        const err = await res.json();
        setToastMessage(err.error || 'Failed to update avatar');
      }
    } catch (err) {
      setToastMessage('Failed to process image file');
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
      setTimeout(() => setToastMessage(''), 4500);
    }
  };

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      if (!targetId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(targetId)}/public-profile`);
        if (res.ok) {
          const data = await res.json();
          if (mounted) {
            const p = data.profile;
            // If own profile, overlay with latest currentUser details
            if (isOwnProfile && currentUser) {
              setProfile({
                ...p,
                name: currentUser.name || p.name,
                organization: currentUser.organization || p.organization,
                district: currentUser.district || p.district,
                bio: currentUser.bio || p.bio,
                phone: currentUser.phone || p.phone,
                whatsapp: currentUser.whatsapp || currentUser.phone || p.whatsapp,
                gpayNumber: currentUser.gpayNumber || currentUser.phone || p.gpayNumber,
                upiId: currentUser.upiId || p.upiId,
                bankAccount: currentUser.bankAccount || p.bankAccount,
                socialLinks: {
                  instagram: currentUser.instagram || p.socialLinks?.instagram || '',
                  website: currentUser.website || p.socialLinks?.website || ''
                }
              });
            } else {
              setProfile(p);
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProfile();
    return () => { mounted = false; };
  }, [targetId, isOwnProfile, currentUser]);

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleShareProfile = () => {
    const shareUrl = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setToastMessage('Profile link copied to clipboard!');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  // Filter listings (posts ARE inventory)
  const allUserPosts = isOwnProfile
    ? products.filter(p => 
        (currentUser?.id && p.sellerId === currentUser.id) ||
        (currentUser?.organization && p.fpoName && p.fpoName.toLowerCase() === currentUser.organization.toLowerCase()) ||
        (currentUser?.name && p.fpoName && p.fpoName.toLowerCase() === currentUser.name.toLowerCase()) ||
        (profile?.id && p.sellerId === profile.id) ||
        (targetId && (p.sellerId === targetId || p.fpoName === targetId))
      )
    : (profile?.posts?.length ? profile.posts : products.filter(p => 
        p.sellerId === targetId || p.fpoName === targetId
      ));

  const filteredPosts = selectedCategory === 'all'
    ? allUserPosts
    : allUserPosts.filter(p => p.category === selectedCategory);

  // Quotas for own profile: 10 photo posts, 30 text posts
  const photoListings = allUserPosts.filter(p => 
    Array.isArray(p.images) && p.images.length > 0 && p.images.some(img => img && img.trim() !== '')
  );
  const textListings = allUserPosts.filter(p => 
    !Array.isArray(p.images) || p.images.length === 0 || p.images.every(img => !img || img.trim() === '')
  );

  const MAX_PHOTO = 10;
  const MAX_TEXT = 30;
  const photoLimitReached = photoListings.length >= MAX_PHOTO;
  const textLimitReached = textListings.length >= MAX_TEXT;
  const totalLimitReached = photoLimitReached && textLimitReached;

  // Delete post with immediate quota release
  const handleDeletePost = async (post, e) => {
    if (e) e.stopPropagation();
    if (!onDeleteProduct) return;
    const confirmed = window.confirm(
      `Delete listing "${post.name}" from your posts?\n\nThis will remove the listing and immediately release 1 quota slot back to your account.`
    );
    if (!confirmed) return;

    setDeletingId(post.id);
    try {
      await onDeleteProduct(post.id);
      setToastMessage(`Listing "${post.name}" deleted. Quota slot released!`);
      setTimeout(() => setToastMessage(''), 3500);
    } catch (err) {
      alert('Failed to delete listing.');
    } finally {
      setDeletingId(null);
    }
  };

  const cleanPhone = (profile?.whatsapp || profile?.phone || '').replace(/[^0-9]/g, '');

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-28 md:pb-16 space-y-4 animate-in fade-in duration-200">
      
      {/* Top Mobile-App Style App Bar */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md -mx-3 sm:-mx-6 px-4 sm:px-6 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold text-sm text-slate-900 font-mono">
              @{profile?.username || 'member'}
            </span>
            {profile?.isVerified && (
              <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
            )}
            {isOwnProfile && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-950 border border-emerald-300">
                You
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* Share Profile button */}
          <button
            onClick={handleShareProfile}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Share Profile Link"
          >
            <Share2 className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Settings / Options Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            title="Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-11 z-30 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 text-xs text-slate-700 animate-in fade-in zoom-in-95">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={() => { setMenuOpen(false); if (onOpenEditProfile) onOpenEditProfile('general'); }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); if (onOpenEditProfile) onOpenEditProfile('payment'); }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 font-semibold"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                    <span>Payment Settings</span>
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  {onLogout && (
                    <button
                      onClick={() => { setMenuOpen(false); onLogout(); }}
                      className="w-full px-4 py-2 text-left hover:bg-rose-50 text-rose-700 flex items-center gap-2 font-bold"
                    >
                      <span>Sign Out</span>
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => { setMenuOpen(false); handleShareProfile(); }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 font-semibold"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Profile Link</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-2xl text-center shadow-md animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Profile Bio & Showcase Header Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          
          {/* Avatar with gradient ring */}
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

            {/* Quick Set / Edit Profile Picture Button (Own Profile Only) */}
            {isOwnProfile && (
              <>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-slate-900 text-amber-300 hover:bg-slate-800 border-2 border-white shadow-md transition cursor-pointer group"
                  title="Change profile picture (auto-compressed to save space)"
                >
                  {uploadingAvatar ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  ) : (
                    <Camera className="w-3.5 h-3.5 group-hover:scale-110 transition" />
                  )}
                </button>
                <input
                  type="file"
                  ref={avatarInputRef}
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* Profile Name & Identity */}
          <div className="flex-1 space-y-2.5 w-full">
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

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {isOwnProfile ? (
                  <button
                    onClick={() => onOpenEditProfile && onOpenEditProfile('general')}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('payout')}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>GPay & Payment</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Metrics (Listings & Verification) */}
            <div className="flex items-center gap-6 text-xs pt-1 border-y border-slate-100 py-2">
              <div>
                <span className="font-extrabold text-slate-900 block text-sm">{allUserPosts.length}</span>
                <span className="text-slate-500 text-[11px]">Listings</span>
              </div>
              <div>
                <span className="font-extrabold text-emerald-700 block text-sm">
                  {profile?.isVerified ? 'Verified' : 'Active'}
                </span>
                <span className="text-slate-500 text-[11px]">Status</span>
              </div>
              <div>
                <span className="font-extrabold text-slate-900 block text-sm">
                  {profile?.district || 'Mizoram'}
                </span>
                <span className="text-slate-500 text-[11px]">Region</span>
              </div>
            </div>

            {/* Bio Description */}
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {profile?.bio || 'Local grower and producer based in Mizoram.'}
            </p>

            {/* Social Links Chips */}
            {(profile?.socialLinks?.instagram || profile?.socialLinks?.website) && (
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {profile.socialLinks.instagram && (
                  <a
                    href={`https://instagram.com/${profile.socialLinks.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-50 text-pink-900 border border-pink-200 text-[11px] font-bold hover:bg-pink-100 transition"
                  >
                    <Instagram className="w-3 h-3 text-pink-600" />
                    <span>@{profile.socialLinks.instagram.replace('@', '')}</span>
                  </a>
                )}
                {profile.socialLinks.website && (
                  <a
                    href={profile.socialLinks.website.startsWith('http') ? profile.socialLinks.website : `https://${profile.socialLinks.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-bold hover:bg-slate-200 transition"
                  >
                    <Globe className="w-3 h-3 text-slate-600" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            )}

            {/* CONTACT SHOWCASE ROW */}
            {isOwnProfile ? (
              <div className="flex flex-wrap items-center gap-2 pt-1 w-full">
                <button
                  onClick={() => {
                    if (totalLimitReached) {
                      alert('Posting Quota Limit Reached!\n\nYou have used all 10 photo posts and 30 text posts. Delete an existing listing below to release quota before creating a new post.');
                      return;
                    }
                    if (onOpenNewListing) onOpenNewListing();
                  }}
                  className={`flex-1 font-bold py-2 px-3 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                    totalLimitReached 
                      ? 'bg-slate-100 text-slate-400 border border-slate-200' 
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                  <span>+ Post Produce Listing</span>
                </button>

                <button
                  onClick={() => setActiveTab('payout')}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-amber-300/80"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                  <span>GPay & Bank</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {cleanPhone && (
                  <a
                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${profile?.name || profile?.organization}, I found your produce listing on ZOHARVEST and would like to contact you.`)}`}
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
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                    <span>Call Direct</span>
                  </a>
                )}

                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-600" />
                    <span>Email</span>
                  </a>
                )}
              </div>
            )}

          </div>
        </div>

        {/* POSTING QUOTA STATUS (OWN PROFILE ONLY) */}
        {isOwnProfile && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                <span>Your Produce Listings & Quota</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Unified Posts & Inventory • Deleting releases quota
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">📸 Photo Listings</span>
                  <span className="font-mono font-black">{photoListings.length} / {MAX_PHOTO}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className={`h-full rounded-full transition-all ${photoLimitReached ? 'bg-rose-500' : 'bg-emerald-600'}`}
                    style={{ width: `${Math.min(100, (photoListings.length / MAX_PHOTO) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">📝 Text Listings</span>
                  <span className="font-mono font-black">{textListings.length} / {MAX_TEXT}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className={`h-full rounded-full transition-all ${textLimitReached ? 'bg-rose-500' : 'bg-emerald-600'}`}
                    style={{ width: `${Math.min(100, (textListings.length / MAX_TEXT) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GALLERIES / HIGHLIGHTS FILTER BAR */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-slate-100">
          <button
            onClick={() => { setSelectedCategory('all'); setActiveTab('posts'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 border ${
              selectedCategory === 'all' && activeTab === 'posts'
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>🌾 All Posts ({allUserPosts.length})</span>
          </button>

          <button
            onClick={() => { setSelectedCategory('spices'); setActiveTab('posts'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 border ${
              selectedCategory === 'spices' && activeTab === 'posts'
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>🌶️ Spices & Herbs</span>
          </button>

          <button
            onClick={() => { setSelectedCategory('fruits'); setActiveTab('posts'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 border ${
              selectedCategory === 'fruits' && activeTab === 'posts'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>🍊 Fresh Produce</span>
          </button>

          <button
            onClick={() => { setSelectedCategory('grains'); setActiveTab('posts'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 border ${
              selectedCategory === 'grains' && activeTab === 'posts'
                ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>🌾 Grains</span>
          </button>

          <button
            onClick={() => setActiveTab('payout')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'payout'
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>💳 GPay & Bank Wire</span>
          </button>
        </div>

      </div>

      {/* TAB 1: POSTS / INVENTORY GRID */}
      {activeTab === 'posts' && (
        <div className="space-y-3">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 space-y-3 shadow-2xs">
              <Grid className="w-10 h-10 mx-auto text-slate-300" />
              <div className="font-bold text-sm text-slate-700">No Listings in this Category</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isOwnProfile
                  ? 'You have not added any produce posts under this category yet. Click below to add a post.'
                  : 'This member does not have active listings under this category.'}
              </p>
              {isOwnProfile && (
                <button
                  onClick={onOpenNewListing}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Post Produce Listing</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
              {filteredPosts.map(post => {
                const hasImg = post.images && post.images.length > 0 && post.images[0];
                const isDeleting = deletingId === post.id;

                return (
                  <div
                    key={post.id}
                    onClick={() => {
                      if (isOwnProfile) {
                        if (onEditProduct) onEditProduct(post);
                      } else {
                        if (onSelectProduct) onSelectProduct(post);
                      }
                    }}
                    className={`group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/90 cursor-pointer shadow-2xs hover:shadow-md transition ${
                      isDeleting ? 'opacity-40 pointer-events-none' : ''
                    }`}
                  >
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
                          Stock: {post.availableStock} {post.unit}
                        </div>
                      </div>
                    )}

                    {/* Own Profile: Top Badges and Action Buttons */}
                    {isOwnProfile ? (
                      <>
                        <div className="absolute top-2 left-2 z-10 bg-emerald-950/90 text-amber-300 border border-emerald-400/40 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                          In Stock: {post.availableStock} {post.unit}
                        </div>

                        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onEditProduct) onEditProduct(post);
                            }}
                            className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-900 text-amber-300 transition shadow-sm cursor-pointer border border-white/20"
                            title="Edit Listing & Stock"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => handleDeletePost(post, e)}
                            className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white transition shadow-sm cursor-pointer border border-rose-400/30"
                            title="Delete Listing (Releases Quota)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="absolute top-2 left-2 z-10 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {post.district}
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 text-white">
                      <div className="flex justify-between items-start text-[10px]">
                        <span className="bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                          {post.grade || 'Grade A'}
                        </span>
                        <span className="text-slate-300 font-mono">
                          MOQ: {post.minOrderQty} {post.unit}
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
                          Stock: {post.availableStock} {post.unit}
                        </div>
                      </div>

                      <div className="text-[10px] text-emerald-300 text-center font-bold">
                        {isOwnProfile ? 'Click to Edit Stock / Price ➜' : 'Tap to Contact & Buy ➜'}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DIRECT PAYOUT DETAILS */}
      {activeTab === 'payout' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 space-y-5 shadow-sm">
          
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 space-y-1">
            <div className="font-extrabold flex items-center gap-1.5 text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Direct Payment Details</span>
            </div>
            <p className="leading-relaxed text-amber-900/90 text-[11px]">
              Transfer payments directly to the verified Google Pay, UPI ID, or Bank Account shown below.
            </p>
          </div>

          {isOwnProfile && (
            <div className="flex justify-end">
              <button
                onClick={() => onOpenEditProfile && onOpenEditProfile('payment')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <CreditCard className="w-4 h-4 text-amber-300" />
                <span>✏️ Update Your GPay & Bank Details</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* GPay / UPI Card */}
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-5 rounded-2xl shadow-sm border border-emerald-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white text-emerald-950 font-black text-xs flex items-center justify-center shadow-xs">
                    GPay
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-white">Google Pay / UPI</div>
                    <div className="text-[10px] text-emerald-200">Instant UPI Direct Transfer</div>
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
                    <span>{profile?.upiId || 'Not configured yet'}</span>
                    {profile?.upiId && (
                      <button
                        onClick={() => copyToClipboard(profile.upiId, 'upi')}
                        className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md transition font-sans font-bold shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        {copiedKey === 'upi' ? <Check className="w-3 h-3 text-amber-300" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'upi' ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
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

              {!isOwnProfile && profile?.upiId && (
                <a
                  href={`upi://pay?pa=${encodeURIComponent(profile.upiId)}&pn=${encodeURIComponent(profile.organization || profile.name)}&cu=INR`}
                  className="w-full bg-white hover:bg-emerald-50 text-emerald-950 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Pay via UPI App</span>
                </a>
              )}
            </div>

            {/* Direct Bank Account Card */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center">
                  🏦
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900">Direct Bank Account</div>
                  <div className="text-[10px] text-slate-500">NEFT / IMPS / Wire Transfer</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">Bank Name</span>
                  <span className="font-bold text-slate-900">{profile?.bankAccount?.bankName || 'Mizoram Rural Bank'}</span>
                </div>

                <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Account Number</span>
                    <span className="font-mono font-bold text-slate-900">{profile?.bankAccount?.accountNumber || '30291847562'}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(profile?.bankAccount?.accountNumber, 'acc')}
                    className="p-1 rounded-md text-slate-400 hover:text-emerald-700 transition"
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
                    className="p-1 rounded-md text-slate-400 hover:text-emerald-700 transition"
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
  );
}
