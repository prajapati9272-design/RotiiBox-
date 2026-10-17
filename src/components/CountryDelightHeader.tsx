import React from 'react';
import { 
  Calendar, 
  Search, 
  ShoppingBag, 
  Clock, 
  ChevronDown, 
  X, 
  Wallet, 
  Flame, 
  Compass, 
  Bike,
  ChefHat,
  ShieldCheck,
  User,
  Smartphone,
  Gift
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RottiBoxLogo } from './RottiBoxLogo';

interface HeaderProps {
  currentView: 'storefront' | 'tracker' | 'admin';
  setCurrentView: (view: 'storefront' | 'tracker' | 'admin') => void;
  onOpenScheduleModal: () => void;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearching: boolean;
  setIsSearching: (s: boolean) => void;
}

export const CountryDelightHeader: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  onOpenScheduleModal,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  isSearching,
  setIsSearching,
}) => {
  const { 
    cartItemCount, 
    cartTotal, 
    isLunchCutoffPassed, 
    lunchCutoffMinutesLeft, 
    walletBalance,
    isAdminLoggedIn,
    customerUser,
    openCustomerAuthModal,
    openReferralModal
  } = useApp();

  // Dynamic date representation matching Country Delight screenshot
  const today = new Date();
  const dayNameShort = today.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNameFull = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNum = today.getDate();
  const monthName = today.toLocaleDateString('en-US', { month: 'long' });
  const monthShort = today.toLocaleDateString('en-US', { month: 'short' });
  
  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const mobileDateText = `${dayNameShort}, ${dayNum}${getOrdinal(dayNum)} ${monthShort}`;
  const desktopDateText = `${dayNameFull}, ${dayNum}${getOrdinal(dayNum)} ${monthName}`;

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EFE3D3] shadow-2xs">
      
      {/* Search Overlay Mode on Mobile (< 640px) */}
      {isSearching && (
        <div className="sm:hidden px-3 h-14 flex items-center gap-2 bg-[#FFFDF9]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8B5E3C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Phulkas, Parathas, Theplas, Rotlas..."
              className="w-full text-xs bg-[#FAF4EB] border border-[#DFCBB5] rounded-full pl-9 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#D97706] text-[#2B1408]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B5E3C] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => {
              setIsSearching(false);
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-[#8B5E3C] hover:text-[#2B1408] px-2 py-1"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Main Bar: Responsive Layout for Phone, Tablet, PC */}
      <div className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8 ${isSearching ? 'hidden sm:flex' : 'flex'}`}>
        
        {/* =========================================
            ZONE 1: BRAND LOGO
           ========================================= */}
        <div className="flex items-center shrink-0">
          {/* Main Official Rotiibox Brand Logo */}
          <div 
            onClick={() => setCurrentView('storefront')}
            className="cursor-pointer flex items-center group shrink-0 transition-transform active:scale-95"
            title="Rotiibox - Fresh Roti Subscriptions"
          >
            {/* Authentic RottiBox illustrated brand logo */}
            <RottiBoxLogo size="md" className="h-9 xs:h-10 sm:h-11 w-auto" />
          </div>
        </div>

        {/* =========================================
            ZONE 2: CENTER NAVIGATION & SEARCH (Tablet & PC)
           ========================================= */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-1 justify-center max-w-xl">
          
          {/* View Toggle Tabs */}
          <nav className="flex items-center p-1 bg-[#F5EBE0] rounded-xl border border-[#E2D2BD] text-xs font-semibold shrink-0">
            <button
              onClick={() => setCurrentView('storefront')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                currentView === 'storefront'
                  ? 'bg-white text-[#2B1408] shadow-2xs font-bold'
                  : 'text-[#8B5E3C] hover:text-[#2B1408]'
              }`}
            >
              Storefront
            </button>
            <button
              onClick={() => setCurrentView('tracker')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'tracker'
                  ? 'bg-white text-[#2B1408] shadow-2xs font-bold'
                  : 'text-[#8B5E3C] hover:text-[#2B1408]'
              }`}
            >
              <span>Live Tracker</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse"></span>
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'admin'
                  ? 'bg-[#3B170B] text-[#FEF3C7] shadow-2xs font-bold'
                  : 'text-[#8B5E3C] hover:text-[#2B1408]'
              }`}
            >
              <span>Admin</span>
              {isAdminLoggedIn && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
            </button>
          </nav>

          {/* Desktop Inline Search Bar */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-[#8B5E3C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Phulkas, Parathas, Theplas, Rotlas..."
              className="w-full text-xs bg-[#FAF4EB] hover:bg-[#F5ECE0] border border-[#DFCBB5] rounded-lg pl-8 pr-7 py-1.5 text-[#2B1408] placeholder-[#A88871] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D97706] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8B5E3C] hover:text-[#2B1408] p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

        </div>

        {/* =========================================
            ZONE 3: RIGHT ACTIONS (Phone, Tablet & PC)
           ========================================= */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
          
          {/* Wallet credits (PC only) */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF4EB] border border-[#E2D2BD] text-xs font-semibold text-[#2B1408]">
            <Wallet className="w-3.5 h-3.5 text-[#D97706]" />
            <span>₹{walletBalance}</span>
            <span className="text-[10px] text-[#8B5E3C] font-normal">Credits</span>
          </div>

          {/* Refer & Earn 5 Free Phulkas Button */}
          <button
            onClick={openReferralModal}
            className="flex items-center gap-1 px-1.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] border border-[#FDE68A] text-[#78350F] font-bold text-xs transition-transform active:scale-95 shadow-2xs shrink-0 cursor-pointer"
            title="Refer a Friend & Get 5 Free Plain Phulkas"
          >
            <Gift className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
            <span className="bg-[#D97706] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
              +5 Free
            </span>
          </button>

          {/* Calendar Schedule Tuning Button (Desktop/Tablet) */}
          <button
            onClick={onOpenScheduleModal}
            className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF4EB] hover:bg-[#FEF3C7] border border-[#E2D2BD] hover:border-[#D97706] items-center justify-center text-[#78350F] transition-colors relative shadow-2xs shrink-0 cursor-pointer"
            title="Daily Delivery Schedule & Cutoff Tuning"
          >
            <Calendar className="w-4 h-4 text-[#D97706]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#D97706] ring-2 ring-white"></span>
          </button>

          {/* Search Trigger Button (Phone & Tablet) */}
          <button
            onClick={() => setIsSearching(true)}
            className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#FAF4EB] hover:bg-[#FEF3C7] border border-[#E2D2BD] flex items-center justify-center text-[#78350F] transition-colors shadow-2xs shrink-0 cursor-pointer"
            title="Search"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Customer Signup / Login / Account Button */}
          <button
            onClick={openCustomerAuthModal}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0 border cursor-pointer ${
              customerUser?.isLoggedIn
                ? 'bg-[#FAF4EB] border-[#DFCBB5] text-[#2B1408] hover:bg-[#FEF3C7]'
                : 'bg-[#D97706] hover:bg-[#B45309] border-[#B45309] text-white'
            }`}
            title={customerUser?.isLoggedIn ? `Logged in as ${customerUser.phone}` : 'Signup / Login with Mobile & OTP'}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline max-w-[80px] sm:max-w-[110px] truncate">
              {customerUser?.isLoggedIn ? (customerUser.name || customerUser.phone.slice(-4)) : 'Login'}
            </span>
          </button>

          {/* Cart Bag Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-1 px-2 sm:px-3.5 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-[#3B170B] hover:bg-[#2B1006] text-[#FEF3C7] font-semibold text-xs transition-colors shadow-2xs shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="hidden sm:inline">Bag</span>
            {cartItemCount > 0 && (
              <span className="bg-[#D97706] text-[#3B170B] text-[10px] sm:text-[11px] font-bold px-1.5 py-0.2 rounded-full font-mono-numbers">
                {cartItemCount}
              </span>
            )}
          </button>

        </div>

      </div>

    </header>
  );
};
