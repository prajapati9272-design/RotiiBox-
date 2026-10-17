import React, { useState } from 'react';
import { Check, ShieldCheck, Zap, Sparkles, Clock, Heart, Award, Wallet, Gift, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_PLANS, ROTI_VARIANTS } from '../data/mockData';
import { SubscriptionPlan, DeliveryAddress } from '../types';
import { SubscriptionRechargeModal } from './SubscriptionRechargeModal';

export const SubscriptionPlans: React.FC = () => {
  const { subscribeToPlan, activeSubscription, selectedAddress, addresses, walletBalance } = useApp();
  const [selectedPlanModal, setSelectedPlanModal] = useState<SubscriptionPlan | null>(null);
  const [chosenAddress, setChosenAddress] = useState<DeliveryAddress>(selectedAddress);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState<boolean>(false);

  const handleConfirmSubscription = () => {
    if (!selectedPlanModal) return;
    subscribeToPlan(selectedPlanModal, chosenAddress);
    setSelectedPlanModal(null);
  };

  return (
    <div className="space-y-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="text-xs font-semibold text-amber-800 tracking-wider uppercase flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>RotiiBox Subscription Model · Continuous Freshness</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900 tracking-tight">
          Crafted Roti Subscriptions & Recharge Benefits
        </h2>
        <p className="text-sm sm:text-base text-stone-600">
          Transparent per-chapati pricing. Freshly rolled and tawa-puffed twice daily. Recharge your subscription wallet to unlock instant extra credit bonuses!
        </p>
      </div>

      {/* Subscription Wallet & Recharge Banner */}
      <div className="bg-gradient-to-r from-[#2B1408] via-[#3B170B] to-[#4A1E0E] text-[#FEF3C7] rounded-2xl p-5 sm:p-6 shadow-xl border border-[#5C2612] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-extrabold shrink-0 shadow-inner">
            <Wallet className="w-6 h-6 text-amber-300" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Subscription Wallet Balance
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                Extra Credits Benefits
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-mono-numbers font-extrabold text-white">
              ₹{walletBalance} <span className="text-xs font-normal text-amber-200/80">Available Credits</span>
            </div>
            <p className="text-xs text-amber-200/70">
              Recharge ₹2,000 to get ₹2,300 (+₹300 Extra Bonus Credit) or up to 25% extra credits!
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsRechargeModalOpen(true)}
          className="w-full md:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs transition-all shadow-md hover:shadow-amber-500/20 flex items-center justify-center gap-2 border border-amber-300 shrink-0"
        >
          <Gift className="w-4 h-4 text-stone-900" />
          <span>Recharge Wallet & Get Extra Credits</span>
          <ArrowRight className="w-4 h-4 text-stone-900" />
        </button>
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrentActive = activeSubscription?.planName === plan.name;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl flex flex-col justify-between transition-all bg-white border ${
                plan.recommended
                  ? 'border-amber-400 ring-2 ring-amber-500/30 shadow-md relative'
                  : 'border-stone-200 shadow-2xs hover:border-stone-300'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-700 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs">
                  Most Popular Daily Choice
                </div>
              )}

              <div className="p-6 space-y-4">
                
                {/* Plan Header */}
                <div>
                  <h3 className="font-display font-bold text-lg text-stone-900">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 min-h-[32px]">
                    {plan.tagline}
                  </p>
                </div>

                {/* Price & Chapati Breakdown Display */}
                <div className="pt-2 border-t border-stone-100 space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-mono-numbers font-extrabold text-stone-900">
                      ₹{plan.pricePerDay}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">/ day</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="line-through">₹{plan.originalPrice}</span>
                    <span className="font-semibold text-emerald-700 font-mono-numbers">
                      Save {plan.savingsPercentage}%
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{plan.durationDays} Days</span>
                  </div>

                  {/* Explicit Chapati Rate Badge */}
                  <div className="pt-1 flex items-center gap-1.5 text-xs text-amber-900 font-bold bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/60">
                    <Zap className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>₹{plan.rotiUnitPrice}/Chapati ({plan.totalRotisCount} Total)</span>
                  </div>
                </div>

                {/* Key Spec Badges */}
                <div className="bg-stone-50 rounded-lg p-3 text-xs space-y-1.5 border border-stone-100 font-mono-numbers">
                  <div className="flex justify-between text-stone-700">
                    <span className="text-stone-500">Total Delivery:</span>
                    <span className="font-bold text-stone-900">{plan.totalRotisCount} Chapatis</span>
                  </div>
                  <div className="flex justify-between text-stone-700">
                    <span className="text-stone-500">Meal Slot:</span>
                    <span className="font-semibold capitalize text-stone-900">{plan.mealSlot}</span>
                  </div>
                  <div className="flex justify-between text-stone-700">
                    <span className="text-stone-500">Rotis / Meal:</span>
                    <span className="font-semibold text-stone-900">{plan.rotisPerMeal} Rotis</span>
                  </div>
                  {plan.extraCreditsBonus > 0 && (
                    <div className="flex justify-between text-emerald-800 font-bold border-t border-stone-200/60 pt-1">
                      <span>Extra Bonus Credit:</span>
                      <span>+₹{plan.extraCreditsBonus} Gift</span>
                    </div>
                  )}
                </div>

                {/* Feature Bullet Points */}
                <ul className="space-y-2 text-xs text-stone-600 pt-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

              </div>

              {/* Action Button */}
              <div className="p-6 pt-0 border-t border-stone-100 mt-4">
                {isCurrentActive ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold text-xs text-center cursor-default"
                  >
                    Currently Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedPlanModal(plan)}
                    className="w-full py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-colors shadow-2xs"
                  >
                    Subscribe to {plan.name}
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Artisanal Grain Transparency Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Flour Purity & Transparency
            </div>
            <h3 className="text-xl font-display font-bold text-stone-900 mt-0.5">
              Available Grain Varieties for Your Subscription
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              You can freely mix and match these options on any day in your daily schedule planner before the cutoff.
            </p>
          </div>
          <div className="text-xs text-stone-500 bg-stone-50 px-3 py-2 rounded-lg border border-stone-200">
            Stone-ground chakki flour · Zero preservatives
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {ROTI_VARIANTS.map((v) => (
            <div key={v.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900">{v.name}</span>
                <span className="text-xs font-mono-numbers font-bold text-amber-800">₹{v.pricePerPiece}/pc</span>
              </div>
              <div className="text-xs text-amber-900 font-medium mt-0.5">{v.hindiName}</div>
              <p className="text-xs text-stone-600 mt-2 line-clamp-2">{v.description}</p>
              <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-3 pt-2 border-t border-stone-200/60 font-mono-numbers">
                <span>{v.caloriesPerPiece} kcal</span>
                <span aria-hidden="true">·</span>
                <span>{v.flourComposition}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Confirmation Modal */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-700 uppercase">Confirm Subscription</span>
                <h3 className="text-xl font-display font-bold text-stone-900">{selectedPlanModal.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPlanModal(null)}
                className="text-stone-400 hover:text-stone-600 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Plan Duration:</span>
                <span className="font-semibold text-stone-900">{selectedPlanModal.durationDays} Days</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Total Chapatis Included:</span>
                <span className="font-bold text-stone-900 font-mono-numbers">{selectedPlanModal.totalRotisCount} Chapatis (@ ₹{selectedPlanModal.rotiUnitPrice}/pc)</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Rotis per meal:</span>
                <span className="font-semibold text-stone-900 font-mono-numbers">{selectedPlanModal.rotisPerMeal} Rotis</span>
              </div>
              {selectedPlanModal.extraCreditsBonus > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <span>Instant Extra Bonus Credit:</span>
                  <span>+₹{selectedPlanModal.extraCreditsBonus} Wallet Gift</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Delivery Charges:</span>
                <span className="font-semibold text-emerald-700">₹0 Free Everyday Delivery</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Cutoff Tuning Window:</span>
                <span className="font-semibold text-stone-900">Before 10:30 AM & 06:30 PM</span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-sm text-stone-900">
                <span>Total Amount:</span>
                <span className="font-mono-numbers text-amber-900">₹{selectedPlanModal.totalPrice}</span>
              </div>
            </div>

            {/* Address Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-2">
                Select Delivery Address:
              </label>
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                      chosenAddress.id === addr.id
                        ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="addressRadio"
                          checked={chosenAddress.id === addr.id}
                          onChange={() => setChosenAddress(addr)}
                          className="text-amber-600"
                        />
                        <span className="font-bold text-stone-900">{addr.label}</span>
                      </div>
                      <span className="text-stone-500 text-[11px] font-mono-numbers">{addr.phone}</span>
                    </div>
                    <p className="text-stone-600 mt-1 pl-5">
                      {addr.houseFlat}, {addr.streetArea}, {addr.city} - {addr.pincode}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedPlanModal(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubscription}
                className="px-5 py-2.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Confirm & Start Daily Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Wallet Recharge Modal */}
      <SubscriptionRechargeModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
      />

    </div>
  );
};
