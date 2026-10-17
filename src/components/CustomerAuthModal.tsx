import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  User, 
  LogOut, 
  Sparkles, 
  RotateCcw,
  Smartphone,
  Loader2,
  Crown,
  Coins,
  Gift,
  History,
  Award,
  ChevronDown,
  ChevronUp,
  Flame,
  Mail,
  ChefHat
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ROTTI_POINTS_REWARDS } from '../data/mockData';

export const CustomerAuthModal: React.FC = () => {
  const { 
    customerUser, 
    isCustomerAuthModalOpen, 
    closeCustomerAuthModal, 
    sendCustomerOTP, 
    verifyCustomerOTP, 
    logoutCustomer,
    isAdminLoggedIn,
    loginAdminWithEmail,
    activeSubscription,
    orders,
    rottiPoints,
    rottiPointsHistory,
    redeemRottiPoints
  } = useApp();

  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showPointsHistory, setShowPointsHistory] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (customerUser?.isLoggedIn) {
      setStep('profile');
    } else {
      setStep('phone');
    }
  }, [customerUser, isCustomerAuthModalOpen]);

  // Resend OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  // Clean memory cleanup when modal unmounts
  useEffect(() => {
    return () => {
      // Clear reCAPTCHA badge DOM element if needed
      const recaptchaEl = document.getElementById('recaptcha-container');
      if (recaptchaEl) {
        recaptchaEl.innerHTML = '';
      }
    };
  }, []);

  if (!isCustomerAuthModalOpen) return null;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendCustomerOTP(cleanPhone, 'recaptcha-container');
      setIsLoading(false);
      if (res.success) {
        setStep('otp');
        if (res.otp === '1234') {
          setOtpDigits(['1', '2', '3', '4', '', '']);
        } else {
          setOtpDigits(['', '', '', '', '', '']);
        }
        setResendTimer(30);
        setCanResend(false);
        setTimeout(() => {
          inputRefs[0].current?.focus();
        }, 200);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Failed to send OTP code.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Handle paste of whole code
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = ['', '', '', '', '', ''];
      digits.forEach((d, i) => { newOtp[i] = d; });
      setOtpDigits(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      inputRefs[nextIndex].current?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = value.slice(-1);
    setOtpDigits(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyAndLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 4) {
      setErrorMessage('Please enter the OTP verification code');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyCustomerOTP(phoneNumber, enteredOtp, fullName);
      setIsLoading(false);
      if (res.success) {
        closeCustomerAuthModal();
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Verification failed.');
    }
  };

  const handleResendOtpCode = async () => {
    if (!canResend || isLoading) return;
    setIsLoading(true);
    try {
      const res = await sendCustomerOTP(phoneNumber, 'recaptcha-container');
      setIsLoading(false);
      if (res.success) {
        setResendTimer(30);
        setCanResend(false);
        if (res.otp === '1234') {
          setOtpDigits(['1', '2', '3', '4', '', '']);
        } else {
          setOtpDigits(['', '', '', '', '', '']);
        }
        setErrorMessage('');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFDF9] border border-[#DFCBB5] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Invisible Firebase reCAPTCHA container */}
        <div id="recaptcha-container"></div>

        {/* Header Bar */}
        <div className="bg-[#3B170B] text-[#FEF3C7] px-6 py-4 flex items-center justify-between border-b border-[#542312]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706]">
              {step === 'profile' ? <User className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white leading-tight">
                {step === 'profile' ? 'Your Account' : 'Customer Login / Signup'}
              </h3>
              <p className="text-[10px] text-[#FFB680]">
                {step === 'profile' ? 'RotiiBox Fresh Subscription Portal' : 'Instant access via Mobile & Firebase OTP'}
              </p>
            </div>
          </div>

          <button
            onClick={closeCustomerAuthModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* ====================================================
              STEP 1: ENTER PHONE NUMBER
             ==================================================== */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-center space-y-1 mb-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#78350F] text-xs font-bold border border-[#FDE68A]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Firebase OTP Login</span>
                </div>
                <h4 className="font-display font-bold text-lg text-[#2B1408]">Enter your mobile number</h4>
                <p className="text-xs text-[#8B5E3C]">
                  We will send you a verification code to log in or create your RotiiBox account.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium text-center">
                  {errorMessage}
                </div>
              )}

              {/* Full Name Input (Optional for initial registration) */}
              <div>
                <label className="block text-xs font-bold text-[#2B1408] mb-1">Your Full Name (Optional)</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3.5 py-2.5 text-xs text-[#2B1408] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 transition-all"
                />
              </div>

              {/* Email / Gmail Input (Optional for initial registration, required for Admin) */}
              <div>
                <label className="block text-xs font-bold text-[#2B1408] mb-1">Email / Gmail Address (Optional)</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#8B5E3C] absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul@gmail.com or admin@gmail.com"
                    className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#2B1408] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 transition-all"
                  />
                </div>
              </div>

              {/* Admin Gmail Login Quick Trigger */}
              {(email.toLowerCase().includes('admin') || email.endsWith('@admin.com') || email === 'admin@gmail.com') && (
                <div className="p-2.5 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl text-[#78350F] text-xs flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ChefHat className="w-4 h-4 text-[#D97706]" />
                    <span>Admin Gmail Detected</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      loginAdminWithEmail(email || 'admin@gmail.com');
                      closeCustomerAuthModal();
                    }}
                    className="px-2.5 py-1 bg-[#3B170B] text-[#FEF3C7] rounded-lg text-[11px] font-bold hover:bg-[#2B1006] transition-all cursor-pointer"
                  >
                    Login as Admin
                  </button>
                </div>
              )}

              {/* Phone Input with +91 Country Code */}
              <div>
                <label className="block text-xs font-bold text-[#2B1408] mb-1">Mobile Number *</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-[#2B1408] border-r border-[#DFCBB5] pr-2.5">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    autoFocus
                    className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl pl-20 pr-3.5 py-2.5 text-sm font-bold tracking-wider text-[#2B1408] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 transition-all"
                  />
                </div>
              </div>

              {/* Quick Demo OTP Hint */}
              <div className="bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[#8B5E3C] text-[11px]">Demo Mode: OTP is <strong className="text-[#2B1408]">1234</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPhoneNumber('9876543210');
                    if (!fullName) setFullName('Prajapati');
                  }}
                  className="text-[10px] font-bold text-[#D97706] hover:underline"
                >
                  Fill Demo
                </button>
              </div>

              {/* Send OTP Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Verification Code...</span>
                  </>
                ) : (
                  <>
                    <span>Get OTP Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-[#A88871]">
                By signing in, you agree to RotiiBox Terms of Service & Privacy Policy.
              </p>
            </form>
          )}

          {/* ====================================================
              STEP 2: ENTER & VERIFY OTP
             ==================================================== */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyAndLogin} className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="font-display font-bold text-lg text-[#2B1408]">Verify OTP Code</h4>
                <p className="text-xs text-[#8B5E3C] flex items-center justify-center gap-1">
                  <span>Enter code sent to <strong>+91 {phoneNumber}</strong></span>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-[#D97706] hover:underline font-bold text-[11px] ml-1"
                  >
                    Edit
                  </button>
                </p>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium text-center">
                  {errorMessage}
                </div>
              )}

              {/* OTP 6 Input Boxes */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-10 h-11 sm:w-11 sm:h-12 rounded-xl bg-[#FAF4EB] border-2 border-[#DFCBB5] text-center font-mono font-bold text-lg text-[#2B1408] focus:bg-white focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 focus:outline-none transition-all shadow-2xs"
                  />
                ))}
              </div>

              {/* Demo Hint */}
              <div className="text-center">
                <span className="text-[11px] bg-[#FEF3C7] text-[#78350F] px-3 py-1 rounded-full font-semibold border border-[#FDE68A]">
                  💡 Demo Mode / Fallback code: <strong>1234</strong>
                </span>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#3B170B] hover:bg-[#2B1006] text-[#FEF3C7] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#D97706]" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#D97706]" />
                    <span>Verify & Complete Login</span>
                  </>
                )}
              </button>

              {/* Resend Timer */}
              <div className="text-center pt-1">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtpCode}
                    disabled={isLoading}
                    className="text-xs font-bold text-[#D97706] hover:underline flex items-center justify-center gap-1 mx-auto disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend OTP Code</span>
                  </button>
                ) : (
                  <span className="text-xs text-[#8B5E3C]">
                    Resend code in <strong className="text-[#2B1408] font-mono">{resendTimer}s</strong>
                  </span>
                )}
              </div>
            </form>
          )}

          {/* ====================================================
              STEP 3: SIMPLE CLEAN PROFILE VIEW
             ==================================================== */}
          {step === 'profile' && customerUser && (
            <div className="space-y-4">
              
              {/* Simple User Identity Header */}
              <div className="bg-[#FAF4EB] border border-[#DFCBB5] rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#3B170B] text-[#FEF3C7] font-bold text-lg flex items-center justify-center shrink-0 border-2 border-[#D97706] shadow-xs">
                  {customerUser.name ? customerUser.name.charAt(0).toUpperCase() : 'U'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-extrabold text-base text-[#2B1408] truncate">
                      {customerUser.name || 'RotiiBox Customer'}
                    </h4>
                    <span className="bg-[#FEF3C7] text-[#78350F] border border-[#FDE68A] text-[10px] font-extrabold px-2 py-0.5 rounded-md font-mono shrink-0">
                      ID: {customerUser.id.startsWith('RB-') ? customerUser.id : `RB-CUST-${customerUser.id.slice(-4).toUpperCase()}`}
                    </span>
                  </div>
                  <p className="text-xs font-mono font-medium text-[#8B5E3C] mt-0.5">
                    {customerUser.phone}
                  </p>
                </div>
              </div>

              {/* Simple Account Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-[#DFCBB5] rounded-2xl p-3.5 text-center shadow-2xs">
                  <span className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-wider block mb-1">
                    Total Orders
                  </span>
                  <span className="text-base font-extrabold text-[#3B170B] font-mono">
                    {orders.length} Placed
                  </span>
                </div>

                <div className="bg-white border border-[#DFCBB5] rounded-2xl p-3.5 text-center shadow-2xs">
                  <span className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-wider block mb-1">
                    RottiPoints
                  </span>
                  <span className="text-base font-extrabold text-[#D97706] font-mono">
                    {rottiPoints} Pts 👑
                  </span>
                </div>
              </div>

              {/* Simple Clean Actions */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={closeCustomerAuthModal}
                  className="w-full py-3 px-4 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <span>Continue Ordering Fresh Rotis</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logoutCustomer();
                    closeCustomerAuthModal();
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white border border-stone-300 text-stone-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
