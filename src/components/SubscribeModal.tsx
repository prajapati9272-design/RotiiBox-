import React, { useState } from 'react';
import { Calendar, Clock, Check, X, ShieldCheck, Sparkles, Plus, Minus, ArrowRight } from 'lucide-react';
import { RegularMenuItem, RotiSpreadOption } from '../types';
import { useApp } from '../context/AppContext';

interface SubscribeModalProps {
  item: RegularMenuItem | null;
  onClose: () => void;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({ item, onClose }) => {
  const { subscribeToPlan, selectedAddress, showToast } = useApp();

  const [frequency, setFrequency] = useState<'daily' | 'alternate' | 'weekdays'>('daily');
  const [mealSlot, setMealSlot] = useState<'lunch' | 'dinner' | 'both'>('lunch');
  const [quantity, setQuantity] = useState<number>(4);
  const [durationDays, setDurationDays] = useState<number>(30);
  const [spread, setSpread] = useState<RotiSpreadOption>('ghee');

  if (!item) return null;

  const pricePerRoti = Math.round(item.price / 5);
  const dailyTotal = (pricePerRoti * quantity) * (mealSlot === 'both' ? 2 : 1);
  const estimatedMonthTotal = dailyTotal * durationDays;

  const handleConfirm = () => {
    // Generate a custom plan
    const customPlan = {
      id: `custom_${item.id}_${Date.now()}`,
      name: `${item.name} Daily Box`,
      tagline: `${frequency === 'daily' ? 'Daily' : frequency === 'weekdays' ? 'Weekdays' : 'Alternate'} delivery of ${item.name}`,
      rotisPerMeal: quantity,
      mealSlot,
      defaultRotiType: item.id.includes('ghee') ? ('ghee_phulka' as const) : ('phulka_wheat' as const),
      durationDays,
      pricePerDay: dailyTotal,
      totalPrice: estimatedMonthTotal,
      originalPrice: Math.round(estimatedMonthTotal * 1.25),
      savingsPercentage: 20,
      rotiUnitPrice: pricePerRoti,
      totalRotisCount: quantity * durationDays * (mealSlot === 'both' ? 2 : 1),
      extraCreditsBonus: Math.round(estimatedMonthTotal * 0.10),
      features: [
        `${quantity} Hot Rotis per meal (${mealSlot === 'both' ? 'Lunch & Dinner' : mealSlot})`,
        'Change quantity or pause before 10:30 AM / 6:30 PM cutoff',
        'Skipped meals converted to reusable wallet balance',
        'Zero delivery fees across all days',
      ],
    };

    subscribeToPlan(customPlan, selectedAddress);
    onClose();
    showToast(`Subscribed to ${item.name}! Your daily schedule is active.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#EFE3D3]">
          <div className="flex items-center gap-2.5">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-[#E2D2BD] shadow-2xs shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#FAF0DC] text-[#78350F] flex items-center justify-center font-bold border border-[#E2D2BD] shrink-0">
                <Calendar className="w-5 h-5 text-[#D97706]" />
              </div>
            )}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#78350F]">
                Rotiibox Subscription
              </div>
              <h3 className="font-display font-bold text-base sm:text-lg text-[#2B1408] leading-tight">
                {item.name}
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

        {/* Frequency Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-stone-700">Delivery Frequency:</label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'daily', label: 'Daily (7 Days)' },
              { id: 'weekdays', label: 'Mon - Fri' },
              { id: 'alternate', label: 'Alternate Days' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFrequency(f.id as any)}
                className={`py-2 px-1 rounded-lg border font-medium text-center transition-all ${
                  frequency === f.id
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-2xs'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Slot Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-stone-700">Meal Window:</label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'lunch', label: 'Lunch (12:30 PM)' },
              { id: 'dinner', label: 'Dinner (07:30 PM)' },
              { id: 'both', label: 'Both Meals' },
            ].map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setMealSlot(slot.id as any)}
                className={`py-2 px-1 rounded-lg border font-medium text-center transition-all ${
                  mealSlot === slot.id
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-2xs'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preparation / Spread Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-stone-700">Preparation / Spread:</label>
          <div className="grid grid-cols-5 gap-1.5 text-xs">
            {[
              { id: 'oil', label: 'Oil' },
              { id: 'ghee', label: 'Ghee' },
              { id: 'butter', label: 'Butter' },
              { id: 'white_butter', label: 'White butter' },
              { id: 'plain', label: 'Plain' },
            ].map((sp) => (
              <button
                key={sp.id}
                type="button"
                onClick={() => setSpread(sp.id as any)}
                className={`py-1.5 px-0.5 rounded-lg border text-[10px] sm:text-xs font-medium text-center transition-all truncate ${
                  spread === sp.id
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-2xs'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Stepper & Direct Input up to 1000 Rotis */}
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-stone-800">Rotis per Meal:</div>
              <div className="text-[11px] text-stone-500">
                {quantity >= 50 ? '🔥 Bulk / Event & Mess order tier active' : 'Customizable up to 1,000 rotis'}
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - (quantity > 50 ? 10 : 2)))}
                className="w-8 h-8 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-800 transition-colors"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <input
                type="number"
                min={1}
                max={1000}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 1) {
                    setQuantity(Math.min(1000, val));
                  } else if (e.target.value === '') {
                    setQuantity(1);
                  }
                }}
                className="w-16 text-center font-mono-numbers font-extrabold text-sm text-stone-900 bg-amber-50 border border-amber-300 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
              />

              <button
                type="button"
                onClick={() => setQuantity(Math.min(1000, quantity + (quantity >= 50 ? 10 : 2)))}
                className="w-8 h-8 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-800 transition-colors"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Bulk Presets */}
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-200/60">
            <span className="text-stone-500 font-medium">Quick Add Bulk:</span>
            <div className="flex items-center gap-1 flex-wrap">
              {[10, 50, 100, 250, 500, 1000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setQuantity(preset)}
                  className={`px-2 py-0.5 rounded font-bold transition-all text-[10px] ${
                    quantity === preset
                      ? 'bg-amber-700 text-amber-50 border border-amber-800 shadow-2xs'
                      : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {preset === 1000 ? '1,000 Max' : preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cutoff Transparency Guarantee Banner */}
        <div className="p-3 rounded-xl bg-[#FAF0DC] border border-[#DFCBB5] text-xs text-[#3B170B] space-y-1">
          <div className="font-semibold text-[#2B1408] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Daily Cutoff Flexibility Policy</span>
          </div>
          <p className="text-[11px] text-[#78350F] leading-relaxed">
            Change quantity, swap grain, or pause delivery before <strong>10:30 AM</strong> for Lunch and <strong>6:30 PM</strong> for Dinner. Unused skipped rotis are automatically credited to your wallet.
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-[#EFE3D3] flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#8B5E3C]">Daily cost</div>
            <div className="text-lg font-mono-numbers font-extrabold text-[#2B1408]">
              ₹{dailyTotal} <span className="text-xs font-normal text-[#8B5E3C]">/ day</span>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-[#3B170B] hover:bg-[#2B1006] text-[#FEF3C7] font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 border border-[#2B1006]"
          >
            <span>Activate Subscription</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D97706]" />
          </button>
        </div>

      </div>
    </div>
  );
};
