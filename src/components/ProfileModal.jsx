import React, { useState, useRef } from 'react';
import { 
  X, 
  User, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Save,
  KeyRound,
  Store,
  Sparkles,
  Camera,
  Trash2,
  Loader2,
  Upload
} from 'lucide-react';
import { compressImage, formatBytes } from '../utils/imageCompressor';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '360587275546-930r3jboqt9jed504oa438upknfosgok.apps.googleusercontent.com';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function ProfileModal({
  isOpen,
  onClose,
  currentUser,
  districts = [],
  onProfileUpdated,
  initialTab = 'general',
  onViewPublicProfile,
  t
}) {
  if (!isOpen || !currentUser) return null;

  const [activeTab, setActiveTab] = useState(initialTab || 'general');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const googleLinkRef = React.useRef(null);

  // Synchronize initialTab when opening
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // General fields
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [avatarStats, setAvatarStats] = useState(null);
  const [compressingAvatar, setCompressingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [organization, setOrganization] = useState(currentUser.organization || '');
  const [district, setDistrict] = useState(currentUser.district || districts[0] || 'Champhai');
  const [address, setAddress] = useState(currentUser.address || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [gstinOrFpoNumber, setGstinOrFpoNumber] = useState(currentUser.verificationDoc || '');
  const [instagram, setInstagram] = useState(currentUser.instagram || '');
  const [website, setWebsite] = useState(currentUser.website || '');
  const [twitter, setTwitter] = useState(currentUser.twitter || '');

  // Direct Payment & Bank fields
  const [bankName, setBankName] = useState(currentUser.bankAccount?.bankName || '');
  const [accountNumber, setAccountNumber] = useState(currentUser.bankAccount?.accountNumber || '');
  const [ifsc, setIfsc] = useState(currentUser.bankAccount?.ifsc || '');
  const [beneficiary, setBeneficiary] = useState(currentUser.bankAccount?.beneficiary || currentUser.name || '');
  const [upiId, setUpiId] = useState(currentUser.upiId || '');
  const [gpayNumber, setGpayNumber] = useState(currentUser.gpayNumber || currentUser.phone || '');
  const [whatsapp, setWhatsapp] = useState(currentUser.whatsapp || currentUser.phone || '');

  // Security / Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const token = localStorage.getItem('zh_token');

  // Handle avatar file selection & auto-downscaling
  const handleAvatarPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    setCompressingAvatar(true);
    setErrorMsg('');

    try {
      const result = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.8,
        cropToSquare: true
      });
      setAvatarUrl(result.dataUrl);
      setAvatarStats({
        orig: formatBytes(result.originalSize),
        comp: formatBytes(result.compressedSize),
        saved: result.savedPercent
      });
    } catch (err) {
      setErrorMsg('Failed to process avatar image.');
    } finally {
      setCompressingAvatar(false);
    }
  };

  // Submit profile details
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          phone,
          whatsapp,
          gpayNumber,
          upiId,
          organization,
          district,
          address,
          bio,
          avatarUrl,
          gstinOrFpoNumber,
          instagram,
          website,
          twitter,
          bankAccount: {
            bankName,
            accountNumber,
            ifsc,
            beneficiary
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile.');
      }

      // Update storage and parent state
      localStorage.setItem('zh_user', JSON.stringify(data.user));
      onProfileUpdated(data.user);
      setSuccessMsg('Profile settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const hasExistingPassword = currentUser?.hasPassword === true || (currentUser?.authProvider !== 'google' && currentUser?.hasPassword !== false);
  const isGoogleLinked = currentUser?.googleLinked === true || currentUser?.authProvider === 'google';

  // Link Google account to existing user
  const handleLinkGoogle = async (response) => {
    if (!response?.credential) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/google/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ credential: response.credential })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to link Google account.');
      }

      setSuccessMsg(data.message || 'Google account linked successfully!');
      if (data.user) {
        localStorage.setItem('zh_user', JSON.stringify(data.user));
        onProfileUpdated(data.user);
      }
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!isOpen || activeTab !== 'security' || isGoogleLinked) return;

    let mounted = true;
    const renderGoogleLinkBtn = () => {
      if (!mounted) return;
      if (typeof window !== 'undefined' && window.google?.accounts?.id && googleLinkRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleLinkGoogle,
            auto_select: false,
            itp_support: true,
          });
          googleLinkRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleLinkRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'medium',
            text: 'continue_with',
            shape: 'pill',
            width: 260,
          });
        } catch (err) {
          console.warn('[GIS] Error rendering link button:', err);
        }
      }
    };

    renderGoogleLinkBtn();
    const timer = setTimeout(renderGoogleLinkBtn, 150);
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        renderGoogleLinkBtn();
        clearInterval(interval);
      }
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen, activeTab, isGoogleLinked]);

  // Submit password change or initial setup for Google accounts
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (hasExistingPassword && !currentPassword) {
      setErrorMsg('Please enter your current password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: hasExistingPassword ? currentPassword : '',
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password update failed.');
      }

      setSuccessMsg(data.message || (hasExistingPassword ? 'Password updated successfully!' : 'Password setup complete! You can now log in with email & password.'));
      if (data.user) {
        localStorage.setItem('zh_user', JSON.stringify(data.user));
        onProfileUpdated(data.user);
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
                {currentUser.role === 'farmer' ? '👨‍🌾' : currentUser.role === 'buyer' ? '🏢' : '🛡️'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-extrabold text-white">{currentUser.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                    {currentUser.role}
                  </span>
                  {currentUser.isVerified ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-700">
                      <ShieldCheck className="w-3 h-3" />
                      <span>KYC Verified</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-200 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-700">
                      KYC Under Review
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-200 mt-0.5 font-medium">
                  {currentUser.organization} • {currentUser.email}
                </p>
              </div>
            </div>

            {onViewPublicProfile && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewPublicProfile(currentUser.id || currentUser.organization);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-800/90 hover:bg-emerald-700 text-amber-300 border border-emerald-600/70 transition cursor-pointer shadow-xs shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View My Public Storefront</span>
              </button>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-6 pt-2 border-t border-emerald-800/60">
            <button
              onClick={() => { setActiveTab('general'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'general' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>General Profile</span>
            </button>
            <button
              onClick={() => { setActiveTab('bank'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'bank' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Direct Payments (GPay & Bank)</span>
            </button>
            <button
              onClick={() => { setActiveTab('security'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'security' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{hasExistingPassword ? 'Security & Password' : 'Setup Password'}</span>
              {!hasExistingPassword && (
                <span className="bg-amber-400 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase ml-1">
                  New
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: General Profile */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveProfile} className="p-6 space-y-4">

            {/* Profile Photo Upload & Auto-Downscale Card */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden bg-white border-2 border-emerald-600 shadow-sm flex items-center justify-center text-2xl font-black text-emerald-800">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{name ? name[0].toUpperCase() : '👤'}</span>
                  )}
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Profile Photo</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Large camera photos are automatically downscaled to ~40KB to save device storage and bandwidth.
                </p>

                {avatarStats && (
                  <div className="text-emerald-800 text-[10px] font-bold bg-emerald-100/70 px-2 py-0.5 rounded w-fit mx-auto sm:mx-0">
                    ⚡ Compressed {avatarStats.orig} ➔ {avatarStats.comp} ({avatarStats.saved}% saved)
                  </div>
                )}

                <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={compressingAvatar}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {compressingAvatar ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Downscaling...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3" />
                        <span>{avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
                      </>
                    )}
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarUrl('');
                        setAvatarStats(null);
                      }}
                      className="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={avatarInputRef}
                  accept="image/*"
                  onChange={handleAvatarPick}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Collective / FPO Name</label>
                <div className="relative flex items-center">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mizoram District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full py-2 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>{d} District</option>
                  ))}
                  <option value="National / Other">National / Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Physical Address / Hub Depot</label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, locality, postal code"
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">FPO Reg # / GSTIN / Trade License</label>
              <input
                type="text"
                value={gstinOrFpoNumber}
                onChange={(e) => setGstinOrFpoNumber(e.target.value)}
                placeholder="e.g. FPO-MZ-2024-8901 or 27AABCS1429Q1ZT"
                className="w-full py-2 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Producer / Business Story</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your farm altitude, organic soil certifications, and bulk capacity..."
                className="w-full py-2 px-3 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Social & Web Links for Profile Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Instagram Username / Handle</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="e.g. @mizo_organic_spices"
                  className="w-full py-2 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Website or Portfolio Link</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. https://zoharvest.in"
                  className="w-full py-2 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-md disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Direct P2P Payment Details (GPay & Bank) */}
        {activeTab === 'bank' && (
          <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-950">
                <span className="font-bold block">Direct Buyer-to-Seller Payment Setup</span>
                ZOHARVEST does not handle payments or deduct platform commissions on this website. Buyers will see your Google Pay / UPI and Bank Account details on your public profile to pay you directly.
              </div>
            </div>

            {/* Google Pay / UPI Details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center text-[10px] font-black">
                  UPI
                </span>
                <span>Google Pay & UPI Transfer Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    UPI ID (Google Pay, PhonePe, Paytm, BHIM)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. 9436100000@okhdfcbank or farmer@upi"
                    className="w-full py-2 px-3 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Google Pay / WhatsApp Mobile Number
                  </label>
                  <input
                    type="text"
                    value={gpayNumber}
                    onChange={(e) => setGpayNumber(e.target.value)}
                    placeholder="e.g. +91 94361 00000"
                    className="w-full py-2 px-3 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bank Account Wire Details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center text-xs">
                  🏦
                </span>
                <span>Direct Bank Account Details (NEFT / IMPS)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. Mizoram Rural Bank / State Bank of India"
                    className="w-full py-2 px-3 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Account Holder (Beneficiary Name)</label>
                  <input
                    type="text"
                    value={beneficiary}
                    onChange={(e) => setBeneficiary(e.target.value)}
                    placeholder="Name as printed on passbook"
                    className="w-full py-2 px-3 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. 102938475612"
                    className="w-full py-2 px-3 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Bank IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    placeholder="e.g. SBIN0RRMIGB"
                    className="w-full py-2 px-3 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-md disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Direct Payment Details'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Security & Password Setup / Change */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="p-6 space-y-4">
            
            {/* Connected Identities & Login Methods */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Connected Login Methods
                </span>
                <span className="text-[11px] font-bold text-emerald-800">
                  Unified ZOHARVEST Identity
                </span>
              </div>

              {/* Google Connection Card */}
              {isGoogleLinked ? (
                <div className="flex items-center justify-between p-3 bg-white border border-emerald-300 rounded-xl shadow-2xs">
                  <div className="flex items-center gap-3">
                    <GoogleIcon />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Google / Gmail Account</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Connected</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    1-Click Sign In Active
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <GoogleIcon />
                      <div>
                        <span className="text-xs font-bold text-slate-900">Connect Google (Gmail)</span>
                        <p className="text-[11px] text-slate-500">Enable 1-click Google sign in for this account</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center pt-1 min-h-[40px]">
                    <div ref={googleLinkRef}></div>
                  </div>
                </div>
              )}

              {/* Password Status Card */}
              <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
                    🔑
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Direct Password Login</span>
                      {hasExistingPassword ? (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                          Not Set (Google Account)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {hasExistingPassword 
                        ? 'You can sign in directly using your email and password.' 
                        : 'Set a password below to enable direct email & password sign-in.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!hasExistingPassword ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-lg shadow-2xs">
                  🔑
                </div>
                <div className="text-xs text-emerald-950 space-y-1">
                  <span className="font-extrabold text-sm block text-emerald-900">Set Up Password for Direct Email Login</span>
                  <p className="text-emerald-800 leading-relaxed">
                    You logged in via Google (<strong>{currentUser?.email}</strong>). By creating a password below, you can sign in directly using your email and password at any time without needing Google.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <KeyRound className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-950">
                  <span className="font-bold block">Enterprise Password Protection</span>
                  Ensure your password contains at least 8 characters, combining uppercase, lowercase, numbers, and symbols to protect your account and listing management.
                </div>
              </div>
            )}

            {hasExistingPassword && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full py-2 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {hasExistingPassword ? 'New Password' : 'Create Account Password'}
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full py-2 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {hasExistingPassword ? 'Confirm New Password' : 'Confirm Password'}
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full py-2 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-md disabled:opacity-50 cursor-pointer ${
                  !hasExistingPassword 
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white' 
                    : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>
                  {loading 
                    ? 'Saving Password...' 
                    : !hasExistingPassword 
                    ? 'Set Account Password' 
                    : 'Change Password'}
                </span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
