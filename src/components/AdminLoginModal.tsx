import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, User, Eye, EyeOff, KeyRound, ArrowLeft, Sparkles, ChefHat } from 'lucide-react';
import { RottiBoxLogo } from './RottiBoxLogo';

interface AdminLoginModalProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onCancel, onSuccess }) => {
  const { loginAdmin } = useApp();
  const [adminId, setAdminId] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = loginAdmin(adminId, password);
      setIsSubmitting(false);
      if (res.success) {
        onSuccess();
      } else {
        setErrorMsg(res.message);
      }
    }, 300);
  };

  const fillDemoCredentials = () => {
    setAdminId('admin');
    setPassword('admin123');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 bg-gradient-to-br from-[#240F06] via-[#2D1308] to-[#1A0B04] rounded-2xl border border-[#4A2312] shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C15822]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Top Back Link */}
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs text-[#E6C6AC] hover:text-[#FFD39B] transition-colors mb-6 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Customer Site</span>
        </button>

        {/* Login Card */}
        <div className="bg-[#1C0B04]/90 backdrop-blur-md rounded-2xl border border-[#4A2312] p-6 sm:p-8 shadow-2xl space-y-6 text-[#FFFDF9]">
          
          {/* Header & Logo */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="bg-[#FFFDF9] rounded-xl p-2 shadow-lg inline-block">
                <RottiBoxLogo size="md" className="h-10 w-auto" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C15822]/20 border border-[#C15822]/40 text-[#FFB680] text-xs font-medium">
              <ChefHat className="w-3.5 h-3.5 text-[#FF8A3D]" />
              <span>RotiiBox Kitchen Operations Portal</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#FFFDF9] tracking-tight">
              Admin & Kitchen Login
            </h1>
            <p className="text-xs text-[#D8B493] leading-relaxed">
              Restricted portal for kitchen managers, tawa operators, and dispatch coordinators. Enter Admin ID & Password to access.
            </p>
          </div>

          {/* Quick Demo Fill Button */}
          <div className="bg-[#2D1308] p-3 rounded-xl border border-[#4A2312] flex items-center justify-between gap-2">
            <div className="text-[11px] text-[#E6C6AC] space-y-0.5">
              <span className="font-semibold text-[#FF8A3D] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Quick Demo Credentials
              </span>
              <p className="text-[10px] text-[#B89B84]">ID: <code className="text-[#FFD39B]">admin</code> | Pass: <code className="text-[#FFD39B]">admin123</code></p>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="px-2.5 py-1 text-[11px] font-semibold bg-[#C15822] hover:bg-[#D96528] text-white rounded-lg shadow transition-all active:scale-95"
            >
              Fill Credentials
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Admin ID Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#E6C6AC]">
                Admin ID / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A88266]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#120703] border border-[#4A2312] focus:border-[#C15822] focus:ring-1 focus:ring-[#C15822] rounded-xl text-sm text-white placeholder-[#785C47] outline-none transition-all"
                />
              </div>
            </div>

            {/* Admin Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#E6C6AC]">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A88266]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#120703] border border-[#4A2312] focus:border-[#C15822] focus:ring-1 focus:ring-[#C15822] rounded-xl text-sm text-white placeholder-[#785C47] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#A88266] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-[#C15822] to-[#E06728] hover:from-[#D96528] hover:to-[#EF7432] text-white font-semibold rounded-xl text-sm shadow-lg shadow-[#C15822]/25 hover:shadow-[#C15822]/40 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Unlock Admin Operations</span>
                </>
              )}
            </button>
          </form>

          {/* Security Note Footer */}
          <div className="pt-2 text-center border-t border-[#3B1B0E] flex items-center justify-center gap-1.5 text-[10px] text-[#A88266]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit Encrypted Operations Console</span>
          </div>

        </div>
      </div>
    </div>
  );
};
