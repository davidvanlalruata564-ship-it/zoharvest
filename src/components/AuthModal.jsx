import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  Building, 
  MapPin, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  KeyRound,
  Smartphone,
  Send,
  Check
} from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '360587275546-930r3jboqt9jed504oa438upknfosgok.apps.googleusercontent.com';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, districts = [], t, currentLang }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'phone_otp'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states (Email/Password)
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  // Register extra states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('farmer');
  const [organization, setOrganization] = useState('');
  const [district, setDistrict] = useState(districts[0] || 'Champhai');
  const [address, setAddress] = useState('');

  // Phone OTP states
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [testOtpNotice, setTestOtpNotice] = useState('');

  // Email / Gmail OTP verification states
  const [emailOtp, setEmailOtp] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpNotice, setEmailOtpNotice] = useState('');
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);

  // Cryptographic Google GIS verification handler
  const handleGoogleCredentialResponse = async (response) => {
    if (!response?.credential) {
      setErrorMessage('Google authentication cancelled or credential not provided.');
      return;
    }
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: response.credential,
          role,
          district
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Google login failed.');
      }

      if (data.token) {
        localStorage.setItem('zh_token', data.token);
        localStorage.setItem('zh_user', JSON.stringify(data.user));
      }

      setSuccessMessage(`Welcome, ${data.user.name}! Verified with Google.`);
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
        onClose();
      }, 700);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerGooglePrompt = () => {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
        });
        window.google.accounts.id.prompt();
      } catch (e) {
        console.warn('Google prompt failed:', e);
      }
    } else {
      setErrorMessage('Google Identity Services is loading. Please check your internet connection.');
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const renderButtons = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          const loginContainer = document.getElementById('google-btn-login');
          if (loginContainer) {
            loginContainer.innerHTML = '';
            window.google.accounts.id.renderButton(loginContainer, {
              theme: 'outline',
              size: 'large',
              width: 320,
              text: 'continue_with',
              shape: 'pill'
            });
          }

          const regContainer = document.getElementById('google-btn-register');
          if (regContainer) {
            regContainer.innerHTML = '';
            window.google.accounts.id.renderButton(regContainer, {
              theme: 'outline',
              size: 'large',
              width: 320,
              text: 'signup_with',
              shape: 'pill'
            });
          }
        } catch (err) {
          console.warn('Google Identity Services initialization warning:', err);
        }
      }
    };

    const timer = setTimeout(renderButtons, 120);
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        renderButtons();
        clearInterval(interval);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen, mode, role, district]);

  // 1. Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      if (data.token) {
        localStorage.setItem('zh_token', data.token);
        localStorage.setItem('zh_user', JSON.stringify(data.user));
      }

      setSuccessMessage('Logged in successfully!');
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
        onClose();
      }, 700);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Request Email / Gmail OTP
  const handleRequestEmailOtp = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address first to receive the verification code.');
      return false;
    }
    setErrorMessage('');
    setSendingEmailOtp(true);

    try {
      const res = await fetch('/api/auth/email-otp-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch email verification code.');
      }

      setEmailOtpSent(true);
      if (data.testOtp) {
        setEmailOtpNotice(data.testOtp);
      }
      setSuccessMessage(`6-digit verification code sent to ${email}. Please enter the code below to complete registration.`);
      return true;
    } catch (err) {
      setErrorMessage(err.message);
      return false;
    } finally {
      setSendingEmailOtp(false);
    }
  };

  // 3. Email/Password Register (Mandatory OTP Verification)
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!emailOtpSent) {
      const sent = await handleRequestEmailOtp();
      if (!sent) return;
      return;
    }

    if (!emailOtp || emailOtp.trim().length < 6) {
      setErrorMessage('Please enter the 6-digit verification code sent to your email to verify account ownership.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role,
          organization: organization || (role === 'farmer' ? `${district} Organic Union` : 'Enterprise Buyer Corp'),
          district,
          address: address || `${district}, Mizoram`,
          emailOtp: emailOtp.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      if (data.token) {
        localStorage.setItem('zh_token', data.token);
        localStorage.setItem('zh_user', JSON.stringify(data.user));
      }

      setSuccessMessage('Gmail verified and account created successfully!');
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
        onClose();
      }, 800);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Request Phone OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: otpPhone })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP.');
      }

      setOtpSent(true);
      if (data.testOtp) {
        setTestOtpNotice(data.testOtp);
      }
      setSuccessMessage(`6-digit code dispatched to ${otpPhone}`);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. Verify Phone OTP & Sign In / Register
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: otpPhone,
          otp: otpCode,
          name: name || 'Verified Phone Member',
          role,
          district
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'OTP verification failed.');
      }

      if (data.token) {
        localStorage.setItem('zh_token', data.token);
        localStorage.setItem('zh_user', JSON.stringify(data.user));
      }

      setSuccessMessage('Phone verified successfully!');
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
        onClose();
      }, 700);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-amber-500 text-slate-950 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Verified B2B Exchange Portal
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            {mode === 'login' ? 'Sign In to ZOHARVEST' : mode === 'register' ? 'Create Business Account' : 'Phone Number Authentication'}
          </h3>
          <p className="text-xs text-emerald-200 mt-1">
            Connecting grassroots Mizoram producers with national wholesale buyers with 0% intermediary take.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 mt-5 bg-emerald-950/80 p-1 rounded-2xl border border-emerald-800">
            <button
              onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                mode === 'login' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                mode === 'register' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <span>Create Account</span>
            </button>
            <button
              onClick={() => { setMode('phone_otp'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                mode === 'phone_otp' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone OTP</span>
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. SIGN IN TAB */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            
            {/* Real Cryptographic Google Sign In */}
            <div className="w-full flex flex-col items-center justify-center pt-1 pb-1">
              <div id="google-btn-login" className="flex justify-center min-h-[44px]"></div>
              <button
                type="button"
                onClick={triggerGooglePrompt}
                className="mt-2 text-[11px] text-stone-500 hover:text-emerald-800 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Click here if Google prompt did not appear</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-stone-200 w-full"></div>
              <span className="bg-white px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">or sign in with credentials</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email or Phone Number</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="name@company.com or +91 98620..."
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2 text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-amber-300" />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>
        )}

        {/* 2. CREATE ACCOUNT TAB */}
        {mode === 'register' && (
          <div className="p-6 space-y-4">
            
            {/* Role Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">I am joining as:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'farmer' ? 'bg-emerald-900 text-white border-emerald-950 shadow-xs' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>🌾 Farmer / Collective</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'buyer' ? 'bg-emerald-900 text-white border-emerald-950 shadow-xs' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>🏢 Wholesale Buyer</span>
                </button>
              </div>
            </div>

            {/* Real Cryptographic Google Sign Up */}
            <div className="w-full flex flex-col items-center justify-center pt-1 pb-1">
              <div id="google-btn-register" className="flex justify-center min-h-[44px]"></div>
              <button
                type="button"
                onClick={triggerGooglePrompt}
                className="mt-2 text-[11px] text-stone-500 hover:text-emerald-800 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Click here if Google prompt did not appear</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-stone-200 w-full"></div>
              <span className="bg-white px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">or register with email form</span>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lalthanmawia"
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number (SMS OTP)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98620 12345"
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-700">Gmail / Business Email</label>
                  {email && email.includes('@') && !emailOtpSent && (
                    <button
                      type="button"
                      onClick={handleRequestEmailOtp}
                      disabled={sendingEmailOtp}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer disabled:opacity-50"
                    >
                      {sendingEmailOtp ? 'Sending code...' : 'Send OTP'}
                    </button>
                  )}
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailOtpSent) {
                      setEmailOtpSent(false);
                      setEmailOtp('');
                    }
                  }}
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Mizoram District / Region</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>{d} District</option>
                  ))}
                  <option value="National / Other">National / Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {role === 'farmer' ? 'FPO / Cooperative / Farm Name' : 'Company / Buying House Legal Name'}
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder={role === 'farmer' ? 'e.g. Champhai High-Altitude Organic Union' : 'e.g. Spices India Wholesale Ltd'}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Password (Min. 8 characters with numbers & letters)</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create secure password"
                  className="w-full px-3 pr-10 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Mandatory 6-Digit Email Verification Box */}
            {emailOtpSent && (
              <div className="p-3.5 bg-amber-50/90 border border-amber-300 rounded-2xl space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                    <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Enter 6-Digit Code Sent to {email}</span>
                  </div>
                  {emailOtpNotice && (
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                      Code: {emailOtpNotice}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    className="flex-1 px-3 py-2 text-sm font-mono font-bold text-center tracking-widest bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleRequestEmailOtp}
                    disabled={sendingEmailOtp}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 py-2 px-3 border border-slate-300 rounded-xl bg-white cursor-pointer disabled:opacity-50"
                  >
                    {sendingEmailOtp ? 'Sending...' : 'Resend'}
                  </button>
                </div>
                <p className="text-[10px] text-amber-800 font-medium">
                  Gmail ownership verification is required before your account can be created.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || sendingEmailOtp}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 rounded-xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>
                {loading
                  ? 'Verifying & Registering...'
                  : !emailOtpSent
                  ? 'Send Verification Code & Continue'
                  : 'Verify Gmail & Complete Registration'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          </div>
        )}

        {/* 3. PHONE NUMBER OTP TAB */}
        {mode === 'phone_otp' && (
          <div className="p-6 space-y-4">
            {!otpSent ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-2.5">
                  <Smartphone className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950">
                    <span className="font-bold block">Mobile Verification</span>
                    Enter your phone number to receive a 6-digit code for quick sign-in without a password.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Phone Number</label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3" />
                    <input
                      type="tel"
                      required
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value)}
                      placeholder="+91 98620 12345"
                      className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>{loading ? 'Sending code...' : 'Send Verification Code'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">OTP Sent to {otpPhone}</span>
                    <span className="text-[11px] text-slate-500">Please enter the 6-digit code sent to your phone.</span>
                  </div>
                  {testOtpNotice && (
                    <div className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-lg text-xs font-bold font-mono">
                      Test Code: {testOtpNotice}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter 6-Digit Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="e.g. 556677"
                    className="w-full text-center tracking-widest text-lg font-bold font-mono py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Account Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="farmer">Farmer / FPO</option>
                      <option value="buyer">Wholesale Buyer</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                  >
                    Change Number
                  </button>
                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{loading ? 'Verifying...' : 'Verify OTP & Enter'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
