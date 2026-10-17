import React from 'react';
import { ShoppingBag, ArrowRight, Calendar, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FloatingBottomBarProps {
  onOpenCart: () => void;
  onOpenSchedule: () => void;
}

export const FloatingBottomBar: React.FC<FloatingBottomBarProps> = ({
  onOpenCart,
  onOpenSchedule,
}) => {
  const { cartItemCount, cartTotal, activeSubscription } = useApp();

  if (cartItemCount === 0 && !activeSubscription) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 z-30 px-4 max-w-lg mx-auto pointer-events-none">
      <div className="bg-emerald-900 text-white rounded-2xl p-3 shadow-xl border border-emerald-800 flex items-center justify-between pointer-events-auto backdrop-blur-md">
        
        {cartItemCount > 0 ? (
          <>
            <div className="flex items-center gap-2.5 pl-2">
              <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-xs">
                {cartItemCount}
              </div>
              <div>
                <div className="font-mono-numbers font-bold text-sm leading-tight">
                  ₹{cartTotal}
                </div>
                <div className="text-[10px] text-emerald-200">
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in bag
                </div>
              </div>
            </div>

            <button
              onClick={onOpenCart}
              className="px-4 py-2 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>View Bag</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2.5 pl-2">
              <Calendar className="w-4 h-4 text-emerald-300" />
              <div>
                <div className="font-semibold text-xs leading-tight text-white">
                  Next Delivery: Tomorrow 12:30 PM
                </div>
                <div className="text-[10px] text-emerald-300">
                  {activeSubscription?.rotisPerMeal} Hot Rotis · Editable before 10:30 AM
                </div>
              </div>
            </div>

            <button
              onClick={onOpenSchedule}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-xs border border-emerald-700 transition-colors"
            >
              Tune Order
            </button>
          </>
        )}

      </div>
    </div>
  );
};
