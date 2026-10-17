import React from 'react';
import { Store, Calendar, Bike, ShoppingBag, SlidersHorizontal, ShieldCheck, User, ChefHat } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MobileBottomNavProps {
  currentView: 'storefront' | 'tracker' | 'admin';
  setCurrentView: (view: 'storefront' | 'tracker' | 'admin') => void;
  onOpenScheduleModal: () => void;
  onOpenCart: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  setCurrentView,
  onOpenScheduleModal,
  onOpenCart,
}) => {
  const { cartItemCount, isAdminLoggedIn, customerUser, openCustomerAuthModal } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 py-1.5 px-2 shadow-lg">
      <div className="grid grid-cols-5 items-center justify-around text-center">
        
        {/* Storefront Tab */}
        <button
          onClick={() => setCurrentView('storefront')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentView === 'storefront'
              ? 'text-[#3B170B] font-bold'
              : 'text-stone-500 hover:text-stone-800 font-medium'
          }`}
        >
          <Store className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] leading-tight">Store</span>
        </button>

        {/* Daily Schedule Tuning Tab */}
        <button
          onClick={onOpenScheduleModal}
          className="flex flex-col items-center justify-center py-1 text-stone-500 hover:text-[#3B170B] transition-colors font-medium relative"
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] leading-tight">Schedule</span>
          <span className="absolute top-1 right-3 w-1.5 h-1.5 rounded-full bg-[#D97706]"></span>
        </button>

        {/* Live Tracker Tab */}
        <button
          onClick={() => setCurrentView('tracker')}
          className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
            currentView === 'tracker'
              ? 'text-[#3B170B] font-bold'
              : 'text-stone-500 hover:text-stone-800 font-medium'
          }`}
        >
          <Bike className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] leading-tight">Tracker</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse absolute top-1 right-3"></span>
        </button>

        {/* Account / Login Tab */}
        <button
          onClick={openCustomerAuthModal}
          className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
            customerUser?.isLoggedIn ? 'text-[#D97706] font-bold' : 'text-stone-500 hover:text-stone-800 font-medium'
          }`}
        >
          <User className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] leading-tight truncate max-w-[50px]">
            {customerUser?.isLoggedIn ? 'Account' : 'Login'}
          </span>
          {customerUser?.isLoggedIn && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-1 right-2"></span>
          )}
        </button>

        {/* Bag Tab */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center py-1 text-stone-500 hover:text-[#3B170B] transition-colors font-medium relative"
        >
          <ShoppingBag className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] leading-tight">Bag</span>
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-2 bg-[#D97706] text-[#3B170B] font-mono-numbers font-bold text-[9px] px-1 py-0.2 rounded-full">
              {cartItemCount}
            </span>
          )}
        </button>

      </div>
    </nav>
  );
};
