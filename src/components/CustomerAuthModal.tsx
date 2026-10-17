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
  Flame
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
    activeSubscription,
    orders,
    rottiPoints,
    rottiPointsHistory,
    redeemRottiPoints
  } = useApp();

  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
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
              STEP 3: LOGGED IN PROFILE VIEW
             ==================================================== */}
          {step === 'profile' && customerUser && (
            <div className="space-y-4">
              
              {/* User Identity Card */}
              <div className="bg-[#FAF4EB] border border-[#DFCBB5] rounded-2xl p-4 flex items-center gap-3 relative">
                <div className="w-12 h-12 rounded-full bg-[#3B170B] text-[#FEF3C7] font-bold text-lg flex items-center justify-center shrink-0 border-2 border-[#D97706]">
                  {customerUser.name ? customerUser.name.charAt(0).toUpperCase() : 'U'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display font-bold text-sm text-[#2B1408] truncate">
                      {customerUser.name || 'RotiiBox Foodie'}
                    </h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-xs font-mono text-[#8B5E3C]">{customerUser.phone}</p>
                  <span className="inline-block text-[9px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.2 rounded-md mt-0.5 border border-[#FDE68A] truncate max-w-[200px]">
                    {customerUser.id}
                  </span>
                </div>
              </div>

              {/* Account Quick Stats */}
              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="bg-white border border-[#DFCBB5] rounded-xl p-2.5">
                  <span className="text-[10px] font-bold text-[#8B5E3C] uppercase block mb-0.5">Active Subscription</span>
                  <span className="text-xs font-bold text-[#2B1408] block truncate">
                    {activeSubscription ? activeSubscription.planName : 'No Active Plan'}
                  </span>
                </div>

                <div className="bg-white border border-[#DFCBB5] rounded-xl p-2.5">
                  <span className="text-[10px] font-bold text-[#8B5E3C] uppercase block mb-0.5">Total Orders</span>
                  <span className="text-xs font-bold text-[#2B1408] block font-mono">
                    {orders.length} Orders
                  </span>
                </div>
              </div>

              {/* RottiPoints Crown Loyalty Balance Banner */}
              <div className="bg-gradient-to-r from-[#3B170B] via-[#4A1E0E] to-[#2B1006] text-[#FEF3C7] rounded-2xl p-4 shadow-lg border border-[#D97706]/40 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#D97706]/20 border border-[#D97706] text-[#D97706] flex items-center justify-center font-bold shadow-2xs">
                      <Crown className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FDE68A] block">
                        RottiPoints Loyalty Balance
                      </span>
                      <div className="text-xl font-extrabold text-white font-mono flex items-center gap-1.5">
                        <span>{rottiPoints}</span>
                        <span className="text-xs font-normal text-[#FDE68A]">RottiPoints 👑</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPointsHistory(!showPointsHistory)}
                    className="text-[10px] font-bold bg-white/10 hover:bg-white/20 text-[#FEF3C7] px-2.5 py-1.5 rounded-lg border border-white/20 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Log</span>
                    {showPointsHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                <div className="bg-[#2B1006]/70 rounded-xl p-2.5 text-[11px] text-[#FDE68A] flex items-center gap-2 border border-[#5C2712]">
                  <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span>
                    <strong>Earn +150 RottiPoints</strong> on every subscription plan renewal or wallet recharge!
                  </span>
                </div>
              </div>

              {/* RottiPoints Transaction History Log */}
              {showPointsHistory && (
                <div className="bg-white border border-[#DFCBB5] rounded-xl p-3 space-y-2 max-h-48 overflow-y-auto shadow-2xs">
                  <div className="text-[11px] font-bold text-[#2B1408] uppercase tracking-wider flex items-center justify-between border-b border-[#EFE3D3] pb-1">
                    <span>Loyalty Points Log</span>
                    <span className="text-[10px] text-[#8B5E3C] font-normal">{rottiPointsHistory.length} entries</span>
                  </div>
                  {rottiPointsHistory.length === 0 ? (
                    <div className="text-xs text-stone-500 text-center py-2">No points history yet.</div>
                  ) : (
                    <div className="space-y-1.5">
                      {rottiPointsHistory.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between text-xs p-2 bg-[#FAF4EB] rounded-lg">
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="font-semibold text-[#2B1408] truncate text-[11px]">{tx.description}</div>
                            <div className="text-[10px] text-[#8B5E3C]">{tx.date}</div>
                          </div>
                          <span className={`font-mono font-bold text-xs shrink-0 ${tx.type === 'earned' ? 'text-emerald-700' : 'text-amber-800'}`}>
                            {tx.type === 'earned' ? `+${tx.points}` : `-${tx.points}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Redeem Points for Free Rotis & Benefits Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#2B1408] uppercase tracking-wider flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-[#D97706]" />
                    Redeem Points for Free Rotis
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Instant Wallet & Roti Credit
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ROTTI_POINTS_REWARDS.map((reward) => {
                    const canAfford = rottiPoints >= reward.pointsRequired;
                    return (
                      <div
                        key={reward.id}
                        className={`p-3 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${
                          canAfford 
                            ? 'bg-white border-[#DFCBB5] hover:border-[#D97706] shadow-2xs' 
                            : 'bg-[#FAF4EB]/60 border-stone-200 opacity-80'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="font-bold text-xs text-[#2B1408] leading-snug">
                              {reward.title}
                            </span>
                            {reward.badge && (
                              <span className="text-[9px] font-extrabold bg-[#D97706] text-white px-1.5 py-0.2 rounded-md shrink-0">
                                {reward.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#8B5E3C] leading-tight">
                            {reward.description}
                          </p>
                        </div>

                        <div className="pt-1.5 border-t border-[#EFE3D3] flex items-center justify-between gap-2">
                          <div className="font-mono text-xs font-bold text-[#78350F] flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5 text-[#D97706]" />
                            <span>{reward.pointsRequired} pts</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => redeemRottiPoints(reward.id)}
                            disabled={!canAfford}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              canAfford
                                ? 'bg-[#3B170B] hover:bg-[#2B1006] text-[#FEF3C7] shadow-2xs active:scale-95 cursor-pointer'
                                : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                            }`}
                          >
                            {canAfford ? 'Redeem' : `Need ${reward.pointsRequired - rottiPoints} pts`}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={closeCustomerAuthModal}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Continue Ordering Fresh Rotis</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logoutCustomer();
                    closeCustomerAuthModal();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out from Device</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
