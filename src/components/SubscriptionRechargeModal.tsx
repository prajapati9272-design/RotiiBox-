import React, { useState } from 'react';
import { X, Sparkles, Wallet, Gift, ArrowRight, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RECHARGE_PACKAGES } from '../data/mockData';

interface SubscriptionRechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionRechargeModal: React.FC<SubscriptionRechargeModalProps> = ({ isOpen, onClose }) => {
  const { walletBalance, rechargeWallet } = useApp();
  
  const [selectedPackageId, setSelectedPackageId] = useState<string>('recharge_2000');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedPkg = RECHARGE_PACKAGES.find((p) => p.id === selectedPackageId) || RECHARGE_PACKAGES[1];

  // Calculate bonus for custom amount
  const getCustomBonus = (amt: number): number => {
    if (amt >= 5000) return Math.round(amt * 0.25);
    if (amt >= 3000) return Math.round(amt * 0.20);
    if (amt >= 2000) return Math.round(amt * 0.15);
    if (amt >= 1000) return Math.round(amt * 0.10);
    if (amt >= 500) return Math.round(amt * 0.05);
    return 0;
  };

  const currentAmount = isCustom ? Number(customAmount) || 0 : selectedPkg.amount;
  const currentBonus = isCustom ? getCustomBonus(currentAmount) : selectedPkg.extraCredits;
  const currentTotal = currentAmount + currentBonus;
  const approxChapatis = Math.floor(currentTotal / 9); // ₹9 per chapati in subscription

  const handleRecharge = () => {
    if (currentAmount < 100) {
      alert('Minimum recharge amount is ₹100.');
      return;
    }
    rechargeWallet(currentAmount, currentBonus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#EFE3D3]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold border border-amber-300 shrink-0 shadow-2xs">
              <Wallet className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  RotiiBox Wallet & Benefits
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Extra Credits
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-[#2B1408] leading-tight">
                Subscription Wallet Recharge
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Banner */}
        <div className="bg-gradient-to-r from-[#2B1408] to-[#421D0C] text-[#FEF3C7] rounded-xl p-4 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs text-amber-200/80 font-medium">Current RotiiBox Wallet Balance</div>
            <div className="text-2xl font-mono-numbers font-extrabold text-amber-300 mt-0.5">
              ₹{walletBalance}
            </div>
          </div>
          <div className="text-right text-xs text-amber-100/90 space-y-0.5">
            <div className="flex items-center gap-1 justify-end text-emerald-300 font-semibold">
              <Gift className="w-3.5 h-3.5" />
              <span>Use for Daily Meals</span>
            </div>
            <div className="text-[11px] text-amber-200/70">No expiration date</div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-stone-800 flex items-center justify-between">
            <span>Select Recharge Plan for Extra Credit Benefits:</span>
            <span className="text-[11px] text-amber-800 font-semibold">Up to 25% Extra Cashback</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {RECHARGE_PACKAGES.map((pkg) => {
              const isSelected = !isCustom && selectedPackageId === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => {
                    setIsCustom(false);
                    setSelectedPackageId(pkg.id);
                  }}
                  className={`relative p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/30 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-stone-50'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2 right-2 bg-amber-700 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                      Popular
                    </span>
                  )}

                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-mono-numbers font-extrabold text-stone-900">
                        ₹{pkg.amount}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <Sparkles className="w-3.5 h-3.5 fill-emerald-100 shrink-0" />
                      <span>+ ₹{pkg.extraCredits} Extra Credit</span>
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-600">
                    <span>Total ₹{pkg.totalBenefit}</span>
                    <span className="font-bold text-amber-800">+{pkg.bonusPercent}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Amount Toggle */}
        <div className="pt-1">
          {!isCustom ? (
            <button
              type="button"
              onClick={() => {
                setIsCustom(true);
                setCustomAmount('1500');
              }}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 underline flex items-center gap-1"
            >
              <span>+ Enter Custom Recharge Amount</span>
            </button>
          ) : (
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800">Custom Amount (₹):</label>
                <button
                  type="button"
                  onClick={() => setIsCustom(false)}
                  className="text-[11px] text-stone-500 hover:text-stone-700"
                >
                  Back to Packages
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-stone-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount (e.g. 1500)"
                    className="w-full pl-7 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                {currentAmount > 0 && (
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg px-3 py-2 text-xs font-bold shrink-0">
                    + ₹{currentBonus} Bonus
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Item & Chapati Benefit Breakdown Box */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-1.5">
          <div className="font-bold flex items-center justify-between text-amber-900 border-b border-amber-200/80 pb-1">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-700" />
              <span>Recharge Benefit Calculation</span>
            </span>
            <span className="font-mono-numbers text-emerald-800">
              Total ₹{currentTotal} Value
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-700 pt-0.5">
            <div>
              <span className="text-stone-500 block">Recharge Payment:</span>
              <span className="font-bold font-mono-numbers text-stone-900">₹{currentAmount}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Extra Credit Gifted:</span>
              <span className="font-bold font-mono-numbers text-emerald-700">+ ₹{currentBonus} Bonus</span>
            </div>
            <div>
              <span className="text-stone-500 block">Approx. Chapatis @ ₹9:</span>
              <span className="font-bold font-mono-numbers text-amber-900">~{approxChapatis} Hot Phulkas</span>
            </div>
            <div>
              <span className="text-stone-500 block">Delivery Charges:</span>
              <span className="font-bold text-emerald-700">₹0 Free Always</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-[#EFE3D3] flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-stone-500">New Total Balance</div>
            <div className="text-lg font-mono-numbers font-extrabold text-[#2B1408]">
              ₹{walletBalance + currentTotal}
            </div>
          </div>

          <button
            onClick={handleRecharge}
            className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 border border-amber-800"
          >
            <span>Proceed to Recharge ₹{currentAmount}</span>
            <ArrowRight className="w-4 h-4 text-amber-200" />
          </button>
        </div>

      </div>
    </div>
  );
};
