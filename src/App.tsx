import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CountryDelightHeader } from './components/CountryDelightHeader';
import { CategorySlider } from './components/CategorySlider';
import { ProductCard } from './components/ProductCard';
import { SubscribeModal } from './components/SubscribeModal';
import { ScheduleModal } from './components/ScheduleModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerView } from './components/OrderTrackerView';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { ReferralModal } from './components/ReferralModal';
import { SeasonalSpecialsBanner } from './components/SeasonalSpecialsBanner';
import { FloatingBottomBar } from './components/FloatingBottomBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { REGULAR_MENU_ITEMS } from './data/mockData';
import { RegularMenuItem, Order } from './types';
import { Calendar, CheckCircle2, Flame, Clock, Gift } from 'lucide-react';

function RottiBoxApp() {
  const { toastMessage, setActiveOrderToTrack, isAdminLoggedIn, menuItems, openReferralModal } = useApp();

  // Navigation & Modal States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubFilter, setSelectedSubFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [subscribingItem, setSubscribingItem] = useState<RegularMenuItem | null>(null);
  const [currentView, setCurrentView] = useState<'storefront' | 'tracker' | 'admin'>('storefront');

  // Filter products based on category, sub-filters, and search
  const filteredProducts = menuItems.filter((item) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCat = item.subCategory?.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const isRiceFilter = selectedCategory.toLowerCase() === 'rice' || selectedCategory.toLowerCase() === 'rice_khichdi';
      const isRiceItem = item.category === 'rice_khichdi' || item.subCategory?.toLowerCase() === 'rice';
      if (isRiceFilter) {
        if (!isRiceItem) return false;
      } else {
        const matchSub = item.subCategory?.toLowerCase() === selectedCategory.toLowerCase();
        const matchCategory = item.category?.toLowerCase() === selectedCategory.toLowerCase();
        if (!matchSub && !matchCategory) return false;
      }
    }

    // Sub-filter pills
    if (selectedSubFilter === 'seasonal') {
      if (!item.isLimitedTime && !item.isSeasonal) return false;
    } else if (selectedSubFilter === 'subscribable') {
      if (!item.canSubscribe) return false;
    } else if (selectedSubFilter === 'pure_wheat') {
      if (!item.ingredients.toLowerCase().includes('wheat')) return false;
    } else if (selectedSubFilter === 'protein') {
      if (!item.badgeText?.toLowerCase().includes('protein')) return false;
    } else if (selectedSubFilter === 'gluten_free') {
      if (!item.badgeText?.toLowerCase().includes('gluten')) return false;
    }

    return true;
  });

  const handleOrderSuccess = (newOrder: Order) => {
    setActiveOrderToTrack(newOrder);
    setCurrentView('tracker');
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-stone-900 selection:bg-emerald-200">
      
      {/* Country Delight App Header: Phone, Tablet, PC Aligned */}
      <CountryDelightHeader
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-stone-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-stone-800 animate-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Main Body */}
      <main className="flex-1 pb-24 md:pb-16">
        
        {currentView === 'storefront' ? (
          <>
            {/* Horizontal Categories with Circular Icons & Sub-Filters (Country Delight Style) */}
            <CategorySlider
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedSubFilter={selectedSubFilter}
              onSelectSubFilter={setSelectedSubFilter}
            />

            {/* Rotiibox Daily Subscription Assurance Strip */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-1">
              <div className="bg-linear-to-r from-[#3B170B] via-[#4A1E0E] to-[#2B1006] text-[#FEF3C7] rounded-xl p-3 sm:p-3.5 shadow-xs border border-[#5C2712] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-bold text-[#F59E0B] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white">Daily Tuning Cutoff Guarantee:</span>{' '}
                    <span className="text-[#FDE68A]">
                      Change quantities, swap grains, or pause today's meal before 10:30 AM (Lunch) & 6:30 PM (Dinner).
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-[#2B1006] font-bold text-[11px] transition-colors whitespace-nowrap shadow-xs"
                >
                  Manage Cutoff Calendar
                </button>
              </div>
            </div>

            {/* Refer & Earn 5 Free Phulkas Banner Strip */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 pb-1">
              <div className="bg-linear-to-r from-[#FEF3C7] via-[#FFFBEB] to-[#FEF3C7] text-[#78350F] rounded-xl p-3 sm:p-3.5 shadow-xs border border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#D97706]/15 text-[#D97706] flex items-center justify-center font-bold shrink-0">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-[#3B170B]">Refer a Friend, Both Get 5 FREE Plain Phulkas! 🎁</span>{' '}
                    <span className="text-[#8B5E3C]">
                      Share your referral code to gift 5 Free Phulkas on daily subscription to your friend and get 5 Free Phulkas added to your next daily subscription meal!
                    </span>
                  </div>
                </div>

                <button
                  onClick={openReferralModal}
                  className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-[#3B170B] hover:bg-[#2B1006] text-[#FEF3C7] font-bold text-[11px] transition-all whitespace-nowrap shadow-xs active:scale-95 cursor-pointer"
                >
                  Share Referral Code
                </button>
              </div>
            </div>

            {/* 'Seasonal Specials' Banner Section: Highlights limited-time items with distinct background color & 'Limited Time' tag */}
            {selectedCategory === 'all' && !searchQuery.trim() && (
              <SeasonalSpecialsBanner
                onOpenSubscribeModal={(item) => setSubscribingItem(item)}
              />
            )}

            {/* 2-Column Product Grid */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
              
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 mb-3">
                <div className="text-xs font-bold text-[#3B170B] uppercase tracking-wider">
                  {selectedSubFilter === 'seasonal'
                    ? 'Limited-Time Seasonal Specials'
                    : selectedCategory === 'all' 
                      ? 'All Daily Rotis & Accompaniments' 
                      : `${selectedCategory === 'Rice' || selectedCategory === 'rice_khichdi' ? 'Rice & Khichdi' : selectedCategory} Collection`}
                  <span className="ml-1 text-[#8B5E3C] font-normal font-mono-numbers">
                    ({filteredProducts.length} items)
                  </span>
                </div>
                <div className="text-[11px] text-[#8B5E3C]">
                  Tap <Calendar className="w-3 h-3 inline text-[#D97706]" /> to subscribe · <span className="font-semibold text-[#78350F]">ADD</span> for regular order
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-[#FFFDF9] rounded-2xl p-12 text-center border border-[#EFE3D3]">
                  <Flame className="w-8 h-8 text-[#D97706] mx-auto mb-2" />
                  <div className="font-bold text-[#2B1408]">No items found</div>
                  <p className="text-xs text-[#8B5E3C] mt-1">Try resetting search or category filters.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedSubFilter('all');
                      setSearchQuery('');
                    }}
                    className="mt-3 px-4 py-1.5 rounded-lg bg-[#3B170B] hover:bg-[#2B1006] text-[#FEF3C7] text-xs font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                /* Responsive 2-column grid on phones & tablets matching Country Delight screenshot */
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      item={product}
                      onOpenSubscribeModal={(item) => setSubscribingItem(item)}
                    />
                  ))}
                </div>
              )}

            </div>
          </>
        ) : currentView === 'tracker' ? (
          /* Live Order Tracking View */
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
            <OrderTrackerView />
          </div>
        ) : (
          /* Admin Operations Panel (Protected by Auth) */
          isAdminLoggedIn ? (
            <AdminPanel onBackToStorefront={() => setCurrentView('storefront')} />
          ) : (
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
              <AdminLoginModal
                onCancel={() => setCurrentView('storefront')}
                onSuccess={() => setCurrentView('admin')}
              />
            </div>
          )
        )}

      </main>

      {/* Floating Bottom Bar on Desktop & Tablet */}
      <div className="hidden md:block">
        <FloatingBottomBar
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSchedule={() => setIsScheduleModalOpen(true)}
        />
      </div>

      {/* Native Thumb Navigation on Mobile Phones */}
      <MobileBottomNav
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Subscription Configuration Modal */}
      <SubscribeModal
        item={subscribingItem}
        onClose={() => setSubscribingItem(null)}
      />

      {/* 7-Day Meal Schedule & Cutoff Tuning Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      {/* Cart & Regular Order Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Customer Mobile & OTP Authentication Modal */}
      <CustomerAuthModal />

      {/* Refer a Friend & Free Phulkas Modal */}
      <ReferralModal />

      {/* Clean Footer with Admin Portal trigger */}
      <Footer onOpenAdmin={() => setCurrentView('admin')} />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <RottiBoxApp />
    </AppProvider>
  );
}
