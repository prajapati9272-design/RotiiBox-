import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CountryDelightHeader } from './components/CountryDelightHeader';
import { CategorySlider } from './components/CategorySlider';
import { StepByStepOrderBuilder } from './components/StepByStepOrderBuilder';
import { SubscribeModal } from './components/SubscribeModal';
import { ScheduleModal } from './components/ScheduleModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerView } from './components/OrderTrackerView';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { ReferralModal } from './components/ReferralModal';
import { FloatingBottomBar } from './components/FloatingBottomBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { RegularMenuItem, Order } from './types';
import { CheckCircle2 } from 'lucide-react';

function RottiBoxApp() {
  const { toastMessage, setActiveOrderToTrack, isAdminLoggedIn } = useApp();

  // Navigation & Modal States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubFilter, setSelectedSubFilter] = useState<string>('all');

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [subscribingItem, setSubscribingItem] = useState<RegularMenuItem | null>(null);
  const [currentView, setCurrentView] = useState<'storefront' | 'tracker' | 'admin'>('storefront');

  const handleOrderSuccess = (newOrder: Order) => {
    setActiveOrderToTrack(newOrder);
    setCurrentView('tracker');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900 selection:bg-amber-200">
      
      {/* Country Delight App Header */}
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

      {/* Sticky Category Navbar Slider */}
      {currentView === 'storefront' && (
        <CategorySlider
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedSubFilter={selectedSubFilter}
          onSelectSubFilter={setSelectedSubFilter}
        />
      )}

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-stone-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-stone-800 animate-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Main Body */}
      <main className="flex-1 pb-28 md:pb-20">
        
        {currentView === 'storefront' ? (
          /* Streamlined Step-By-Step Order Builder */
          <StepByStepOrderBuilder 
            onOrderSuccess={handleOrderSuccess}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
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
