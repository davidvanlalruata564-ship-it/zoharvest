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
  Check 
} from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '360587275546-930r3jboqt9jed504oa438upknfosgok.apps.googleusercontent.com';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, districts = [], t, currentLang }) {
  // Mode: 'login' | 'register' | 'forgot_password'
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Google Identity Services (GIS) button refs
  const googleSignInRef = React.useRef(null);
  const googleSignUpRef = React.useRef(null);
  const [gisLoaded, setGisLoaded] = useState(false);

  // Form states (Email/Password Login)
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [googleDetectedEmail, setGoogleDetectedEmail] = useState('');

  // Register extra states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('farmer'); // 'farmer' | 'buyer'
  const [organization, setOrganization] = useState('');
  const [district, setDistrict] = useState(districts[0] || 'Champhai');
  const [address, setAddress] = useState('');

  // Forgot / Set Password states
  const [forgotStep, setForgotStep] = useState('request'); // 'request' | 'verify'
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');

  // Dynamic Password Policy Checks (NIST SP 800-63B standards)
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber;

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
          district,
          phone: phone ? phone.trim() : undefined
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

      setSuccessMessage(`Welcome, ${data.user.name}! Logged in with Google.`);
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

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;

    const renderGISButtons = () => {
      if (!mounted) return;
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        setGisLoaded(true);
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            itp_support: true,
          });

          // Render into Sign In button container if on login mode
          if (googleSignInRef.current && mode === 'login') {
            googleSignInRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleSignInRef.current, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'pill',
              width: 320,
              logo_alignment: 'left',
            });
          }

          // Render into Sign Up button container if on register mode
          if (googleSignUpRef.current && mode === 'register') {
            googleSignUpRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleSignUpRef.current, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'signup_with',
              shape: 'pill',
              width: 320,
              logo_alignment: 'left',
            });
          }
        } catch (err) {
          console.warn('[GIS] Error rendering Google button:', err);
        }
      }
    };

    renderGISButtons();
    const timer = setTimeout(renderGISButtons, 150);
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        renderGISButtons();
        clearInterval(interval);
      }
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen, mode, role, district]);

  // 1. Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setGoogleDetectedEmail('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password })
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.isGoogleAccount) {
          setGoogleDetectedEmail(data.email || emailOrPhone);
        }
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
      }, 600);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Direct Registration (No OTP required)
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name || name.trim().length < 2) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!phone || phone.trim().length < 8) {
      setErrorMessage('Please enter a valid phone number for direct WhatsApp & delivery coordination.');
      return;
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!isPasswordValid) {
      setErrorMessage('Password must be at least 8 characters long and contain uppercase letters (A-Z), lowercase letters (a-z), and numbers (0-9).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          role,
          organization: organization ? organization.trim() : (role === 'farmer' ? `${district} Organic Union` : `${name.trim()}'s Wholesale Enterprise`),
          district,
          address: address || `${district}, Mizoram`
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

      setSuccessMessage(data.message || 'Account created successfully! Welcome to ZOHARVEST.');
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

  // 3. Forgot Password / Set Direct Password: Request Code
  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!forgotEmail || !forgotEmail.includes('@')) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch verification code.');
      }

      setForgotStep('verify');
      setSuccessMessage(data.message || `Verification code sent to ${forgotEmail}. Please check your inbox.`);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Forgot Password: Verify Code & Set New Password
  const handleForgotVerifyAndSet = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!forgotOtp || forgotOtp.trim().length < 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    if (forgotNewPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim().toLowerCase(),
          otp: forgotOtp.trim(),
          newPassword: forgotNewPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password setup failed.');
      }

      if (data.token) {
        localStorage.setItem('zh_token', data.token);
        localStorage.setItem('zh_user', JSON.stringify(data.user));
      }

      setSuccessMessage('Password saved successfully! You are now logged in.');
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

  // Early return AFTER all hooks to respect React Rules of Hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-amber-500 text-slate-950 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Account
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            {mode === 'login' 
              ? 'Sign In to ZOHARVEST' 
              : mode === 'register' 
              ? 'Create Business Account' 
              : 'Set Account Password'}
          </h3>
          <p className="text-xs text-emerald-200 mt-1">
            Mizoram’s direct agricultural exchange connecting local producers with wholesale buyers.
          </p>

          {/* Mode Switcher Tabs (Sign In vs Create Account) */}
          <div className="flex items-center gap-1.5 mt-5 bg-emerald-950/80 p-1 rounded-2xl border border-emerald-800">
            <button
              onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); setGoogleDetectedEmail(''); }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                mode === 'login' || mode === 'forgot_password' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMessage(''); setSuccessMessage(''); setGoogleDetectedEmail(''); }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                mode === 'register' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <span>{errorMessage}</span>
            {errorMessage.toLowerCase().includes('already registered') && (
              <button
                type="button"
                onClick={() => { 
                  setMode('login'); 
                  if (email || phone) setEmailOrPhone(email || phone);
                  setErrorMessage(''); 
                  setSuccessMessage(''); 
                }}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition shadow-xs cursor-pointer shrink-0 flex items-center gap-1"
              >
                <span>Switch to Sign In ➜</span>
              </button>
            )}
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
            
            {/* Primary Action: 1-Click Continue with Google */}
            <div className="w-full flex flex-col items-center justify-center pt-1 pb-1">
              <div className="w-full flex justify-center min-h-[44px]">
                <div ref={googleSignInRef} className="flex justify-center w-full"></div>
              </div>
              {!gisLoaded && (
                <div className="text-[11px] text-stone-400 animate-pulse mt-1">
                  Connecting Google Identity Services...
                </div>
              )}
              <p className="mt-1.5 text-[11px] text-stone-400">
                Fast, 1-click sign-in with your verified Google account
              </p>
            </div>

            {/* Contextual Google Account Detection Alert */}
            {googleDetectedEmail && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Google Account Detected ({googleDetectedEmail})</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  This account is linked to Google. Please click <strong>"Continue with Google"</strong> above to log in instantly.
                </p>
              </div>
            )}

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-stone-200 w-full"></div>
              <span className="bg-white px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                or sign in with password
              </span>
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
                  placeholder="name@gmail.com or +91 94361 00000"
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot_password');
                    setForgotStep('request');
                    setForgotEmail(emailOrPhone.includes('@') ? emailOrPhone : '');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                >
                  Forgot / Set Password?
                </button>
              </div>
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
              <span>{loading ? 'Signing in...' : 'Sign In with Password'}</span>
            </button>

            <div className="flex items-center justify-center text-xs pt-1">
              <span className="text-stone-400">Don't have an account yet?</span>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="ml-1 text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
              >
                Create Account ➜
              </button>
            </div>
          </form>
        )}

        {/* 2. CREATE ACCOUNT TAB (Direct Registration - No OTP required) */}
        {mode === 'register' && (
          <div className="p-6 space-y-4">
            
            {/* Role & District Selector */}
            <div className="space-y-3">
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

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Mizoram District / Operating Region</label>
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

            {/* FAST TRACK: Instant Google Sign Up */}
            <div className="p-3.5 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Fastest: Sign Up with Google</span>
                </span>
                <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Instant Access
                </span>
              </div>
              <div className="w-full flex justify-center min-h-[44px] py-1">
                <div ref={googleSignUpRef} className="flex justify-center w-full"></div>
              </div>
              {!gisLoaded && (
                <div className="text-[11px] text-stone-400 text-center animate-pulse">
                  Connecting Google Identity Services...
                </div>
              )}
              <p className="text-[10px] text-emerald-800 text-center">
                Signs up instantly with your Google account as {role === 'farmer' ? '🌾 Farmer / Collective' : '🏢 Wholesale Buyer'} ({district}).
              </p>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-stone-200 w-full"></div>
              <span className="bg-white px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                or create account with password (no OTP required)
              </span>
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
                    placeholder="e.g. Lalthanmawia Fanai"
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Phone Number (WhatsApp / Orders)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 94361 00000"
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Gmail / Business Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {role === 'farmer' ? 'FPO / Collective / Farm Name' : 'Company / Buying House Legal Name'}
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
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Password (Min. 8 characters with numbers & letters)
                </label>
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
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {password && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2 text-[10px]">
                    <span className={`flex items-center gap-1 font-semibold ${hasMinLength ? 'text-emerald-700' : 'text-slate-400'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasMinLength ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                        {hasMinLength ? '✓' : '•'}
                      </span>
                      8+ chars
                    </span>
                    <span className={`flex items-center gap-1 font-semibold ${hasUpper ? 'text-emerald-700' : 'text-slate-400'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasUpper ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                        {hasUpper ? '✓' : '•'}
                      </span>
                      Upper (A-Z)
                    </span>
                    <span className={`flex items-center gap-1 font-semibold ${hasLower ? 'text-emerald-700' : 'text-slate-400'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasLower ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                        {hasLower ? '✓' : '•'}
                      </span>
                      Lower (a-z)
                    </span>
                    <span className={`flex items-center gap-1 font-semibold ${hasNumber ? 'text-emerald-700' : 'text-slate-400'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasNumber ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                        {hasNumber ? '✓' : '•'}
                      </span>
                      Number (0-9)
                    </span>
                  </div>
                )}
              </div>

              {/* Inline Error Message */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-in fade-in">
                  <span>{errorMessage}</span>
                  {errorMessage.toLowerCase().includes('already registered') && (
                    <button
                      type="button"
                      onClick={() => { 
                        setMode('login'); 
                        if (email || phone) setEmailOrPhone(email || phone);
                        setErrorMessage(''); 
                        setSuccessMessage(''); 
                      }}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition shadow-xs cursor-pointer shrink-0"
                    >
                      Switch to Sign In ➜
                    </button>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 rounded-xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center text-xs pt-1">
                <span className="text-stone-400">Already registered?</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="ml-1 text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
                >
                  Sign In ➜
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. FORGOT / SET PASSWORD TAB */}
        {mode === 'forgot_password' && (
          <div className="p-6 space-y-4">
            {forgotStep === 'request' ? (
              <form onSubmit={handleForgotRequest} className="space-y-4">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-2.5">
                  <KeyRound className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950">
                    <span className="font-bold block">Reset or Set Account Password</span>
                    Enter your registered email address to receive a 6-digit code.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Registered Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                    className="py-2.5 px-4 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-50 transition cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <span>{loading ? 'Sending code...' : 'Send Verification Code'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotVerifyAndSet} className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                  <span className="text-xs font-bold text-slate-900 block">Code Dispatched to {forgotEmail}</span>
                  <span className="text-[11px] text-slate-500">Please enter the 6-digit code sent to your email inbox.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter 6-Digit Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="e.g. 556677"
                    className="w-full text-center tracking-widest text-lg font-bold font-mono py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Password (Min. 8 characters)</label>
                  <input
                    type="password"
                    required
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep('request')}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                  >
                    Resend Code
                  </button>
                  <button
                    type="submit"
                    disabled={loading || forgotOtp.length < 6}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Set New Password & Sign In'}</span>
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
