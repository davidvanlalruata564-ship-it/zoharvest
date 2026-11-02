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
  const [registerStep, setRegisterStep] = useState('form'); // 'form' | 'otp'
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
          itp_support: true,
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
            itp_support: true,
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

  // 2. Step 1 Submit: Validate details & dispatch Email OTP
  const handleProceedToOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name || name.trim().length < 2) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!phone || phone.trim().length < 8) {
      setErrorMessage('Please enter a valid phone number for delivery coordination.');
      return;
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long and contain letters and numbers.');
      return;
    }

    setSendingEmailOtp(true);

    try {
      const res = await fetch('/api/auth/email-otp-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch email verification code.');
      }

      setEmailOtpSent(true);
      setRegisterStep('otp'); // Immediately transition to dedicated OTP page!

      if (data.testOtp) {
        setEmailOtpNotice(data.testOtp);
        setEmailOtp(data.testOtp);
        setSuccessMessage(
          data.emailDispatchedViaSmtp
            ? `Verification code dispatched to ${email}! Enter the 6-digit code below to finish.`
            : `Verification code generated for ${email}! Code auto-filled below. Click "Verify & Complete Registration".`
        );
      } else {
        setSuccessMessage(`Verification code sent to ${email}! Please check your email inbox.`);
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSendingEmailOtp(false);
    }
  };

  // 3. Step 2 Submit: Verify Email OTP & Finalize Registration
  const handleVerifyEmailAndRegister = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!emailOtp || emailOtp.trim().length < 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
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
          organization: organization ? organization.trim() : (role === 'farmer' ? `${district} Organic Union` : 'Enterprise Buyer Corp'),
          district,
          address: address || `${district}, Mizoram`,
          emailOtp: emailOtp.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.requiresOtp && data.testOtp) {
          setEmailOtpSent(true);
          setRegisterStep('otp');
          setEmailOtpNotice(data.testOtp);
          setEmailOtp(data.testOtp);
          setSuccessMessage(`Verification code ${data.testOtp} auto-filled! Click "Verify & Complete Registration" to finish.`);
          return;
        }
        throw new Error(data.error || 'Registration failed.');
      }

      if (data.token) {
        localStorage.setItem('zh_token', data.token);
        localStorage.setItem('zh_user', JSON.stringify(data.user));
      }

      setSuccessMessage('Account created and email verified successfully!');
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
              onClick={() => { setMode('register'); setRegisterStep('form'); setErrorMessage(''); setSuccessMessage(''); }}
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
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex flex-wrap items-center justify-between gap-2">
            <span>{errorMessage}</span>
            {errorMessage.toLowerCase().includes('already registered') && (
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1 rounded-lg text-[11px] transition shadow-xs cursor-pointer shrink-0"
              >
                Switch to Sign In ➜
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

        {/* 2. CREATE ACCOUNT TAB - STEP 1: Details Form */}
        {mode === 'register' && registerStep === 'form' && (
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

            <form onSubmit={handleProceedToOtp} className="space-y-3.5">
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
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number (SMS / WhatsApp)</label>
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
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={sendingEmailOtp}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 rounded-xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{sendingEmailOtp ? 'Dispatching Verification Code...' : 'Continue to Email Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* 2. CREATE ACCOUNT TAB - STEP 2: Dedicated OTP Enter Screen */}
        {mode === 'register' && registerStep === 'otp' && (
          <div className="p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-xs">
                ✉️
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Verify Your Email Address</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Enter the 6-digit verification code sent to <strong className="text-slate-900 font-bold">{email}</strong>.
              </p>
            </div>

            {/* Test Mode / Immediate Code auto-fill banner */}
            {emailOtpNotice && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">🔑</span>
                  <div>
                    <span className="font-extrabold text-emerald-950 block">Verification Code: <span className="font-mono text-sm tracking-widest text-emerald-900 font-bold">{emailOtpNotice}</span></span>
                    <span className="text-[10px] text-emerald-700">Code issued for this account. Click Auto-Fill or check your inbox.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailOtp(emailOtpNotice)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer shadow-xs shrink-0"
                >
                  Auto-Fill Code
                </button>
              </div>
            )}

            <form onSubmit={handleVerifyEmailAndRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 text-center mb-2">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full max-w-xs mx-auto block py-3 px-4 text-center text-2xl font-mono font-extrabold tracking-[0.4em] bg-slate-50 border-2 border-emerald-600 rounded-2xl shadow-inner focus:ring-4 focus:ring-emerald-500/20 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={loading || emailOtp.length < 6}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3.5 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Verifying & Creating Account...' : 'Verify Email & Complete Registration'}</span>
                <Check className="w-4 h-4 text-amber-400" />
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setRegisterStep('form')}
                  className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  ← Edit details / change email
                </button>

                <button
                  type="button"
                  onClick={handleProceedToOtp}
                  disabled={sendingEmailOtp}
                  className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer disabled:opacity-50"
                >
                  {sendingEmailOtp ? 'Sending...' : 'Resend Code'}
                </button>
              </div>
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
