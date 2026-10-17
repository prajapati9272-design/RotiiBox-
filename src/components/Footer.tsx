import React from 'react';
import { RottiBoxLogo } from './RottiBoxLogo';
import { Lock, ShieldCheck, ChefHat, Gift } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { openReferralModal } = useApp();

  return (
    <footer className="bg-[#240F06] text-[#D5C2AB] text-xs py-12 border-t border-[#3D1A0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#3D1A0D]">
          
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="bg-[#FFFDF9] rounded-lg p-1.5 inline-block shadow-sm">
                <RottiBoxLogo size="sm" className="h-8 w-auto" />
              </div>
            </div>
            <p className="text-[#C49A6C] text-xs leading-relaxed">
              Handcrafted daily roti subscriptions and fresh regular deliveries. Stone-ground MP Sharbati wheat puffed over live flame and delivered fresh to your doorstep.
            </p>

            <button
              onClick={openReferralModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF8A3D]/20 hover:bg-[#FF8A3D]/30 border border-[#FF8A3D]/40 text-[#FFD39B] text-[11px] font-bold transition-all active:scale-95 cursor-pointer block"
            >
              <Gift className="w-3.5 h-3.5 text-[#FF8A3D]" />
              <span>Refer & Get 5 Free Phulkas</span>
            </button>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3D1A0D] hover:bg-[#522312] border border-[#5C2712] text-[#FDE68A] text-[11px] font-semibold transition-all active:scale-95 cursor-pointer block"
              >
                <ChefHat className="w-3.5 h-3.5 text-[#FF8A3D]" />
                <span>Kitchen & Admin Portal</span>
                <Lock className="w-3 h-3 text-[#C49A6C]" />
              </button>
            )}
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-[#FDE68A] text-xs uppercase tracking-wider">
              Subscription Features
            </div>
            <ul className="space-y-1.5 text-[#C49A6C]">
              <li>Daily Lunch & Dinner Pass</li>
              <li>Office Lunch Express</li>
              <li>Millet & High-Fiber Options</li>
              <li>Zero-Fee Scheduled Deliveries</li>
              <li>100% Skip Rollover Guarantee</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-[#FDE68A] text-xs uppercase tracking-wider">
              Cutoff & Tuning Policy
            </div>
            <ul className="space-y-1.5 text-[#C49A6C]">
              <li>Lunch Cutoff: 10:30 AM Daily</li>
              <li>Dinner Cutoff: 06:30 PM Daily</li>
              <li>Instant Wallet Credit on Skips</li>
              <li>Grain Swap on 7-Day Calendar</li>
              <li>No Cold Storage Guarantee</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-[#FDE68A] text-xs uppercase tracking-wider">
              Purity & Hygiene
            </div>
            <ul className="space-y-1.5 text-[#C49A6C]">
              <li>100% Chakki Stone Ground (0% Maida)</li>
              <li>Gir Cow Bilona Vedic A2 Ghee</li>
              <li>RO Purified Dough Kneading</li>
              <li>Food-Grade Unbleached Butter Paper</li>
              <li>FSSAI Certified Cloud Kitchens</li>
            </ul>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#A88871]">
          <div>
            © {new Date().getFullYear()} Rotiibox Technologies Pvt Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#FDE68A] cursor-pointer transition-colors">Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-[#FDE68A] cursor-pointer transition-colors">Terms of Subscription</span>
            <span aria-hidden="true">·</span>
            {onOpenAdmin && (
              <>
                <button
                  onClick={onOpenAdmin}
                  className="text-[#FFB680] hover:text-[#FFD39B] font-semibold underline cursor-pointer transition-colors"
                >
                  Admin Login
                </button>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span className="hover:text-[#FDE68A] cursor-pointer transition-colors">Food Safety Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
