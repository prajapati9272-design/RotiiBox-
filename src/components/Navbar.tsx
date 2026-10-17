import React from 'react';
import { ShoppingBag, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RottiBoxLogo } from './RottiBoxLogo';

interface NavbarProps {
  activeTab: 'subscription' | 'schedule' | 'regular' | 'orders';
  setActiveTab: (tab: 'subscription' | 'schedule' | 'regular' | 'orders') => void;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenCart }) => {
  const { cartItemCount, walletBalance } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EFE3D3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single-element Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('subscription');
            }}
            className="flex items-center gap-2.5 text-[#2B1408] group"
          >
            <RottiBoxLogo size="sm" className="h-9 w-auto" />
          </a>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#8B5E3C]">
          <button
            onClick={() => setActiveTab('subscription')}
            className={`whitespace-nowrap pb-1 transition-colors ${
              activeTab === 'subscription'
                ? 'text-[#2B1408] font-bold border-b-2 border-[#D97706]'
                : 'hover:text-[#2B1408]'
            }`}
          >
            Subscription Plans
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`whitespace-nowrap pb-1 transition-colors flex items-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'text-[#2B1408] font-bold border-b-2 border-[#D97706]'
                : 'hover:text-[#2B1408]'
            }`}
          >
            <span>Meal Tuning & Cutoffs</span>
            <span className="w-2 h-2 rounded-full bg-[#D97706]" title="Active Daily Tuning"></span>
          </button>

          <button
            onClick={() => setActiveTab('regular')}
            className={`whitespace-nowrap pb-1 transition-colors ${
              activeTab === 'regular'
                ? 'text-[#2B1408] font-bold border-b-2 border-[#D97706]'
                : 'hover:text-[#2B1408]'
            }`}
          >
            Regular Menu
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap pb-1 transition-colors ${
              activeTab === 'orders'
                ? 'text-[#2B1408] font-bold border-b-2 border-[#D97706]'
                : 'hover:text-[#2B1408]'
            }`}
          >
            Live Tracking
          </button>
        </nav>

        {/* Zone 3: Action Area */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF4EB] text-[#2B1408] text-xs font-medium border border-[#EFE3D3]">
            <Wallet className="w-3.5 h-3.5 text-[#D97706]" />
            <span>₹{walletBalance}</span>
            <span className="text-[#8B5E3C] font-normal">Credits</span>
          </div>

          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-white bg-[#3B170B] rounded-lg hover:bg-[#2C1108] transition-colors whitespace-nowrap shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-[#FFB680]" />
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="bg-[#D97706] text-[#2B1408] px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
