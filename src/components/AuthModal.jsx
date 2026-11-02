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

export default function AuthModal({ isOpen, onClose, onAuthSuccess, districts = [], t, currentLang }) {
  // Mode: 'login' | 'register' | 'phone_otp' | 'forgot_password'
  const [mode, setMode] = useState('login');
  const [registerStep, setRegisterStep] = useState('form'); // 'form' | 'otp'
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

  // Forgot / Set Password states
  const [forgotStep, setForgotStep] = useState('request'); // 'request' | 'verify'
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotOtpNotice, setForgotOtpNotice] = useState('');

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
          if (googleSignUpRef.current && mode === 'register' && registerStep === 'form') {
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
  }, [isOpen, mode, registerStep, role, district]);

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
    if (!isPasswordValid) {
      setErrorMessage('Password must be at least 8 characters long and contain uppercase letters (A-Z), lowercase letters (a-z), and numbers (0-9).');
      return;
    }

    setSendingEmailOtp(true);

    try {
      const res = await fetch('/api/auth/email-otp-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(),
          phone: phone.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch email verification code.');
      }

      setEmailOtpSent(true);
      setRegisterStep('otp'); // Immediately transition to dedicated OTP page

      if (data.testOtp) {
        setEmailOtpNotice(data.testOtp);
        setEmailOtp(data.testOtp);
        setSuccessMessage(
          data.emailDispatchedViaSmtp
            ? `Verification code dispatched to ${email}! Enter the 6-digit code below to finish.`
            : `Verification code generated for ${email}! Code auto-filled below. Click "Verify Email & Complete Registration".`
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

  // 4. Request Phone OTP
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

  // 5. Verify Phone OTP
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

  // 6. Forgot / Set Password Request: 6-digit code
  const handleForgotPasswordRequest = async (emailOverride) => {
    const targetEmail = (emailOverride || forgotEmail || emailOrPhone).trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      setErrorMessage('Please enter your account email address.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await fetch('/api/auth/forgot-password-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send password setup code.');
      }
      setForgotEmail(targetEmail);
      setForgotStep('verify');
      if (data.testOtp) {
        setForgotOtpNotice(data.testOtp);
        setForgotOtp(data.testOtp);
        setSuccessMessage(`Verification code ${data.testOtp} auto-filled! Choose your new password.`);
      } else {
        setSuccessMessage(`Verification code sent to ${targetEmail}. Please check your inbox.`);
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 7. Reset / Save Password with Code
  const handleResetPasswordSubmit = async (e) => {
    if (e) e.preventDefault();
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-6 relative">
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
              Verified B2B Exchange Portal
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            {mode === 'login' 
              ? 'Sign In to ZOHARVEST' 
              : mode === 'register' 
              ? 'Create Business Account' 
              : mode === 'forgot_password'
              ? 'Set Account Password'
              : 'Phone Authentication'}
          </h3>
          <p className="text-xs text-emerald-200 mt-1">
            Mizoram’s direct agricultural exchange connecting local producers with wholesale buyers.
          </p>

          {/* Mode Switcher Tabs */}
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
              onClick={() => { setMode('register'); setRegisterStep('form'); setErrorMessage(''); setSuccessMessage(''); setGoogleDetectedEmail(''); }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                mode === 'register' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <span>Create Account</span>
            </button>
            <button
              onClick={() => { setMode('phone_otp'); setErrorMessage(''); setSuccessMessage(''); setGoogleDetectedEmail(''); }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
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
              <div className="p-3.5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🟢</span>
                  <span className="font-extrabold text-emerald-950">Linked Google Account</span>
                </div>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  The account for <strong>{googleDetectedEmail}</strong> is connected via Google. Use the Google button above to sign in with 1 click, or set an account password below for direct login.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot_password');
                      setForgotStep('request');
                      setForgotEmail(googleDetectedEmail);
                      handleForgotPasswordRequest(googleDetectedEmail);
                    }}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <span>Set Password for Direct Login ➜</span>
                  </button>
                </div>
              </div>
            )}

            <div className="relative flex items-center justify-center">
              <div className="border-t border-stone-200 w-full"></div>
              <span className="bg-white px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                or sign in with password
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Gmail / Email or Phone Number</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="name@gmail.com or +91 98620..."
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
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
                >
                  Forgot or set password?
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
                  setRegisterStep('form');
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

        {/* 2. CREATE ACCOUNT TAB - STEP 1: Details Form */}
        {mode === 'register' && registerStep === 'form' && (
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
                  Instant Verification
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
                Verifies your Gmail identity instantly with Google as {role === 'farmer' ? '🌾 Farmer / Collective' : '🏢 Wholesale Buyer'} ({district}). No OTP code needed.
              </p>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-stone-200 w-full"></div>
              <span className="bg-white px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                or register with email form & OTP
              </span>
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
                    placeholder="e.g. Lalthanmawia Fanai"
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

            {/* Verification code notice & auto-fill */}
            {emailOtpNotice && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🔑</span>
                  <div>
                    <span className="font-extrabold text-emerald-950 block text-xs">
                      Verification Code: <span className="font-mono text-base tracking-widest text-emerald-900 font-extrabold">{emailOtpNotice}</span>
                    </span>
                    <span className="text-[10px] text-emerald-700">Code issued for this account. Auto-filled below.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailOtp(emailOtpNotice)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition cursor-pointer shadow-xs shrink-0"
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

        {/* 3. SET OR RESET PASSWORD FLOW */}
        {mode === 'forgot_password' && (
          <div className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl mx-auto flex items-center justify-center text-xl shadow-xs">
                🔑
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {forgotStep === 'request' ? 'Set or Reset Account Password' : 'Enter Verification Code'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {forgotStep === 'request'
                  ? 'Enter your Gmail or account email to receive a 6-digit verification code.'
                  : `Enter the 6-digit code sent to ${forgotEmail} to set your new password.`}
              </p>
            </div>

            {forgotStep === 'request' ? (
              <form onSubmit={(e) => { e.preventDefault(); handleForgotPasswordRequest(); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Account Email / Gmail</label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
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

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                    className="text-xs text-stone-500 hover:text-stone-800 font-semibold cursor-pointer"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                {forgotOtpNotice && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-emerald-950">
                      Code: <span className="font-mono text-sm tracking-widest text-emerald-900">{forgotOtpNotice}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setForgotOtp(forgotOtpNotice)}
                      className="bg-emerald-800 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer"
                    >
                      Auto-Fill
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">6-Digit Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full py-2 px-3 text-center text-lg font-mono font-extrabold tracking-widest bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
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
                    className="w-full py-2 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full py-2 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || forgotOtp.length < 6 || forgotNewPassword.length < 8}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>{loading ? 'Saving...' : 'Save Password & Sign In'}</span>
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotStep('request')}
                    className="text-stone-500 hover:text-stone-800 font-semibold cursor-pointer text-[11px]"
                  >
                    ← Change Email
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                    className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer text-[11px]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 4. PHONE NUMBER OTP TAB */}
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
                      <option value="farmer">Farmer / Collective</option>
                      <option value="buyer">Wholesale Buyer</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                  >
                    Change Number
                  </button>
                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
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