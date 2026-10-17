import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RegularMenuItem, Order, RotiSpreadOption } from '../types';
import { ImageGalleryModal } from './ImageGalleryModal';
import { compressImageFile } from '../utils/imageCompressor';
import { doc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  Users, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Bike, 
  Flame, 
  Search, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  Settings, 
  Calendar, 
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  Sliders,
  Check,
  Eye,
  Camera,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Images
} from 'lucide-react';

const FOOD_IMAGE_PRESETS = [
  { name: 'Phulka', url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80' },
  { name: 'Ghee Roti', url: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=600&auto=format&fit=crop&q=80' },
  { name: 'Multigrain', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80' },
  { name: 'Paratha', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80' },
  { name: 'Sabzi', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80' },
  { name: 'Paneer', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80' },
  { name: 'Dal Tadka', url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80' },
  { name: 'Thali Box', url: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?w=600&auto=format&fit=crop&q=80' },
];

interface AdminPanelProps {
  onBackToStorefront: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToStorefront }) => {
  const { 
    orders, 
    activeSubscription, 
    schedule, 
    simulatedHour, 
    simulatedMinute, 
    setSimulatedTime, 
    resetToRealTime, 
    isRealTime, 
    timeFormatted,
    lunchCutoffMinutesLeft,
    dinnerCutoffMinutesLeft,
    isLunchCutoffPassed,
    isDinnerCutoffPassed,
    walletBalance,
    showToast,
    adminUser,
    logoutAdmin,
    menuItems,
    outOfStockIds,
    stockQuantities,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    updateStockQuantity
  } = useApp();

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'dispatch_queue' | 'catalog' | 'orders' | 'subscriptions' | 'settings'>('dispatch_queue');

  // Search & Filter state in catalog
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState<string>('all');

  // Edit/Add Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<RegularMenuItem> | null>(null);

  // Image Gallery Modal State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryTargetItem, setGalleryTargetItem] = useState<Partial<RegularMenuItem> | null>(null);

  const openImageGalleryModal = (item: Partial<RegularMenuItem> | null) => {
    setGalleryTargetItem(item);
    setIsGalleryModalOpen(true);
  };

  const handleGallerySelectImage = (imageUrl: string) => {
    if (galleryTargetItem && galleryTargetItem.id) {
      updateProduct(galleryTargetItem.id, { imageUrl });
      showToast(`📸 Updated photo for "${galleryTargetItem.name}" from gallery!`);
    } else if (editingItem) {
      setEditingItem((prev) => prev ? { ...prev, imageUrl } : { imageUrl });
      showToast('📸 Selected photo applied to item!');
    }
  };

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'regular' | 'subscription'>('all');
  const [orderList, setOrderList] = useState<Order[]>(orders);

  // Image file upload handler (camera or file picker with automatic canvas compression)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetItemId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }

    try {
      const compressedDataUrl = await compressImageFile(file, 600, 600, 0.75);
      if (targetItemId) {
        updateProduct(targetItemId, { imageUrl: compressedDataUrl });
        showToast('Updated product image successfully!');
      } else if (editingItem) {
        setEditingItem((prev) => prev ? { ...prev, imageUrl: compressedDataUrl } : { imageUrl: compressedDataUrl });
        showToast('Uploaded product photo!');
      }
    } catch (err) {
      console.warn('Image compression failed:', err);
    }
  };

  // Save product modal handler
  const handleSaveProduct = () => {
    if (!editingItem?.name || !editingItem?.price) {
      showToast('Please provide product name and price');
      return;
    }

    if (editingItem.id) {
      // Update existing item in context
      updateProduct(editingItem.id, {
        name: editingItem.name,
        category: editingItem.category || 'roti_basket',
        subCategory: editingItem.subCategory || 'rotis',
        description: editingItem.description || '',
        packSize: editingItem.packSize || '1 Pack',
        price: Number(editingItem.price) || 50,
        originalPrice: Number(editingItem.originalPrice) || Number(editingItem.price) || 60,
        discountPercent: editingItem.discountPercent || 10,
        vegType: editingItem.vegType || 'pure_veg',
        serves: editingItem.serves || '1 Person',
        preparationTimeMins: editingItem.preparationTimeMins || 12,
        calories: editingItem.calories || 250,
        ingredients: editingItem.ingredients || 'Fresh Ingredients',
        popular: editingItem.popular || false,
        canSubscribe: editingItem.canSubscribe ?? true,
        badgeText: editingItem.badgeText || '',
        imageUrl: editingItem.imageUrl || '',
        addOns: editingItem.addOns || []
      });
      showToast(`Updated item: ${editingItem.name}`);
    } else {
      // Add new item to context
      addProduct({
        name: editingItem.name || 'New Item',
        category: editingItem.category || 'roti_basket',
        subCategory: editingItem.subCategory || 'rotis',
        description: editingItem.description || '',
        packSize: editingItem.packSize || '1 Pack',
        price: Number(editingItem.price) || 50,
        originalPrice: Number(editingItem.originalPrice) || Number(editingItem.price) || 60,
        discountPercent: editingItem.discountPercent || 10,
        vegType: editingItem.vegType || 'pure_veg',
        serves: editingItem.serves || '1 Person',
        preparationTimeMins: editingItem.preparationTimeMins || 12,
        calories: editingItem.calories || 250,
        ingredients: editingItem.ingredients || 'Fresh Ingredients',
        popular: editingItem.popular || false,
        canSubscribe: editingItem.canSubscribe ?? true,
        badgeText: editingItem.badgeText || 'Freshly Made',
        imageUrl: editingItem.imageUrl || 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',
        addOns: editingItem.addOns || []
      });
      showToast(`Added new item: ${editingItem.name}`);
    }

    setIsProductModalOpen(false);
    setEditingItem(null);
  };

  // Delete product handler
  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
  };

  // Update order status and sync to Firestore
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const updated = orderList.map((o) => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrderList(updated);

    if (isFirebaseConfigured && db) {
      try {
        const orderRef = doc(db, 'orders', orderId);
        await setDoc(orderRef, { status: newStatus }, { merge: true });
        console.log(`Updated status in Firestore for order ${orderId}: ${newStatus}`);
      } catch (err) {
        console.error('Error updating order status in Firestore:', err);
      }
    }

    showToast(`Updated order ${orderId} status to ${newStatus}`);
  };

  // Kitchen Metrics
  const totalOrdersCount = orderList.length;
  const totalRevenue = orderList.reduce((sum, o) => sum + o.finalAmount, 0) + (activeSubscription ? 2160 : 0);
  const activeOrdersCount = orderList.filter((o) => o.status !== 'delivered').length;
  const totalBakingRotisToday = (activeSubscription ? activeSubscription.rotisPerMeal * 2 : 8) + 15;

  // Filtered Products
  const filteredCatalog = menuItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(catalogSearch.toLowerCase()) || 
                        item.description.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchCat = catalogCategory === 'all' || item.category === catalogCategory;
    return matchSearch && matchCat;
  });

  // Filtered Orders
  const filteredOrders = orderList.filter((o) => {
    const isSub = o.id.startsWith('SUB') || o.type === 'subscription_charge';
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchType = orderTypeFilter === 'all' || (orderTypeFilter === 'subscription' ? isSub : !isSub);
    return matchStatus && matchType;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2B1408]">
      
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#3B170B] text-[#FEF3C7] shadow-md border-b border-[#5C2712]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStorefront}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to App</span>
            </button>
            <div className="h-6 w-px bg-white/20"></div>
            <div>
              <div className="font-display font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                <span>RotiiBox Operations Hub</span>
                <span className="bg-[#D97706] text-[#2B1006] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Kitchen Admin
                </span>
              </div>
              <p className="text-[11px] text-[#FDE68A] hidden sm:block">
                Live Kitchen Dispatch · Daily Roti Tuning Cutoff Monitor · Catalog Controls
              </p>
            </div>
          </div>

          {/* Time Simulator & Logout Controls */}
          <div className="flex items-center gap-3">
            <div className="bg-[#2C1108] border border-[#5C2712] rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
              <Clock className="w-4 h-4 text-[#D97706]" />
              <div>
                <div className="font-bold text-white font-mono">{timeFormatted}</div>
                <div className="text-[10px] text-[#FDE68A]">
                  {isLunchCutoffPassed ? 'Lunch Cutoff Passed' : `Lunch Cutoff: in ${lunchCutoffMinutesLeft}m`}
                </div>
              </div>
            </div>

            {/* Admin Badge */}
            <div className="hidden md:flex items-center gap-2 bg-[#2C1108] border border-[#5C2712] rounded-xl px-3 py-1.5 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-medium text-xs">ID: {adminUser?.id || 'admin'}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                logoutAdmin();
                onBackToStorefront();
              }}
              className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800/80 text-red-200 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
              title="Log out of Admin Portal"
            >
              <span>Log Out Admin</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EFE3D3] mb-6 no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#3B170B] text-[#FEF3C7] shadow-sm'
                : 'bg-white text-[#8B5E3C] hover:bg-[#FAF4EB] border border-[#EFE3D3]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Kitchen Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('dispatch_queue')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'dispatch_queue'
                ? 'bg-[#D97706] text-[#2B1006] shadow-md font-extrabold ring-2 ring-[#B45309]'
                : 'bg-[#FEF3C7] text-[#78350F] hover:bg-[#FDE68A] border border-[#FDE68A]'
            }`}
          >
            <Flame className="w-4 h-4 text-[#D97706]" />
            <span>Kitchen Dispatch Queue 🔥</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'catalog'
                ? 'bg-[#3B170B] text-[#FEF3C7] shadow-sm'
                : 'bg-white text-[#8B5E3C] hover:bg-[#FAF4EB] border border-[#EFE3D3]'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Menu & Price Catalog ({menuItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'orders'
                ? 'bg-[#3B170B] text-[#FEF3C7] shadow-sm'
                : 'bg-white text-[#8B5E3C] hover:bg-[#FAF4EB] border border-[#EFE3D3]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Dispatch</span>
            {activeOrdersCount > 0 && (
              <span className="bg-[#D97706] text-[#2B1006] text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                {activeOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'subscriptions'
                ? 'bg-[#3B170B] text-[#FEF3C7] shadow-sm'
                : 'bg-white text-[#8B5E3C] hover:bg-[#FAF4EB] border border-[#EFE3D3]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Subscriber Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'settings'
                ? 'bg-[#3B170B] text-[#FEF3C7] shadow-sm'
                : 'bg-white text-[#8B5E3C] hover:bg-[#FAF4EB] border border-[#EFE3D3]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Cutoff & Capacity Settings</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white rounded-2xl p-4 border border-[#EFE3D3] shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#8B5E3C] font-semibold">Today's Revenue</div>
                  <div className="text-2xl font-black text-[#2B1408] mt-1 font-mono-numbers">
                    ₹{totalRevenue}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +18.4% from yesterday
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#EFE3D3] shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#8B5E3C] font-semibold">Total Rotis to Bake Today</div>
                  <div className="text-2xl font-black text-[#2B1408] mt-1 font-mono-numbers">
                    {totalBakingRotisToday} <span className="text-xs font-normal text-[#8B5E3C]">Rotis</span>
                  </div>
                  <div className="text-[10px] text-[#78350F] font-bold mt-1">
                    Lunch: {Math.round(totalBakingRotisToday * 0.55)} · Dinner: {Math.round(totalBakingRotisToday * 0.45)}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                  <Flame className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#EFE3D3] shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#8B5E3C] font-semibold">Active Orders & Dispatch</div>
                  <div className="text-2xl font-black text-[#2B1408] mt-1 font-mono-numbers">
                    {totalOrdersCount}
                  </div>
                  <div className="text-[10px] text-amber-700 font-bold mt-1">
                    {activeOrdersCount} in preparation or delivery
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#3B170B] flex items-center justify-center font-bold">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#EFE3D3] shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#8B5E3C] font-semibold">Active Subscriptions</div>
                  <div className="text-2xl font-black text-[#2B1408] mt-1 font-mono-numbers">
                    {activeSubscription ? 1 : 0}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-1">
                    {activeSubscription?.planName || 'No Active Plan'}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Kitchen Cutoff Status & Baking Flour Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Daily Cutoff Monitor */}
              <div className="lg:col-span-2 bg-linear-to-r from-[#3B170B] to-[#2B1006] text-[#FEF3C7] rounded-2xl p-5 shadow-sm border border-[#5C2712] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#D97706]" />
                    <h3 className="font-bold text-sm text-white">Daily Roti Tuning Cutoff Status</h3>
                  </div>
                  <span className="text-xs bg-[#D97706] text-[#2B1006] font-extrabold px-2.5 py-1 rounded-full">
                    {isLunchCutoffPassed ? 'Lunch Locked' : 'Lunch Open'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
                    <div className="text-xs text-[#FDE68A] font-semibold">Lunch Cutoff Target: 10:30 AM</div>
                    <div className="text-lg font-black text-white mt-1">
                      {isLunchCutoffPassed ? 'Cutoff Passed' : `${lunchCutoffMinutesLeft} minutes remaining`}
                    </div>
                    <p className="text-[11px] text-amber-200/80 mt-1">
                      {isLunchCutoffPassed 
                        ? 'Subscribers can no longer modify or skip today\'s lunch. Dough in kneading chamber.' 
                        : 'Subscribers can pause or edit lunch quantity until 10:30 AM.'}
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
                    <div className="text-xs text-[#FDE68A] font-semibold">Dinner Cutoff Target: 06:30 PM</div>
                    <div className="text-lg font-black text-white mt-1">
                      {isDinnerCutoffPassed ? 'Cutoff Passed' : `${dinnerCutoffMinutesLeft} minutes remaining`}
                    </div>
                    <p className="text-[11px] text-amber-200/80 mt-1">
                      {isDinnerCutoffPassed 
                        ? 'Subscribers can no longer modify or skip today\'s dinner.' 
                        : 'Subscribers can pause or edit dinner quantity until 6:30 PM.'}
                    </p>
                  </div>
                </div>

                {/* Quick Time Simulator Controls */}
                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#FDE68A] font-semibold">Fast Cutoff Simulator:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSimulatedTime(10, 15)}
                      className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-medium transition-colors"
                    >
                      10:15 AM (Pre-Lunch Cutoff)
                    </button>
                    <button
                      onClick={() => setSimulatedTime(10, 45)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/30 hover:bg-amber-500/50 text-amber-200 font-medium transition-colors"
                    >
                      10:45 AM (Post-Lunch Cutoff)
                    </button>
                    <button
                      onClick={() => setSimulatedTime(18, 15)}
                      className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-medium transition-colors"
                    >
                      06:15 PM (Pre-Dinner Cutoff)
                    </button>
                    <button
                      onClick={resetToRealTime}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-200 font-medium transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Real Clock
                    </button>
                  </div>
                </div>
              </div>

              {/* Flour Composition Breakdown */}
              <div className="bg-white rounded-2xl p-5 border border-[#EFE3D3] shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-[#2B1408] flex items-center justify-between">
                  <span>Flour Mix Breakdown Today</span>
                  <Flame className="w-4 h-4 text-[#D97706]" />
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-[#2B1408] mb-1">
                      <span>MP Sharbati Whole Wheat</span>
                      <span>60% (18 Rotis)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                      <div className="h-full bg-amber-600 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-[#2B1408] mb-1">
                      <span>7-Grain Fitness Mix</span>
                      <span>20% (6 Rotis)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                      <div className="h-full bg-[#3B170B] rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-[#2B1408] mb-1">
                      <span>Kathiyawadi Bajra & Sorghum</span>
                      <span>15% (5 Rotis)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                      <div className="h-full bg-orange-600 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-[#2B1408] mb-1">
                      <span>Gujarati Spiced Methi</span>
                      <span>5% (2 Rotis)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl p-5 border border-[#EFE3D3] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#2B1408]">Live Kitchen Dispatch Feed</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#D97706] hover:text-[#B45309] flex items-center gap-1"
                >
                  Manage All Orders <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-[#EFE3D3]">
                {orderList.map((order) => (
                  <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#2B1408] font-mono">{order.id}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-[#3B170B]">
                          {order.type === 'regular' ? 'Regular Order' : 'Subscription'}
                        </span>
                        <span className="text-[#8B5E3C]">{order.date}</span>
                      </div>
                      <div className="text-[#8B5E3C] mt-1">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(' · ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-[#2B1408] font-mono text-sm">₹{order.finalAmount}</div>
                        <div className="text-[11px] text-emerald-700 font-semibold">{order.paymentMethod}</div>
                      </div>

                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="bg-[#FAF4EB] border border-[#DFCBB5] text-[#2B1408] text-xs rounded-xl px-2.5 py-1.5 font-semibold focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="kneading_and_baking">Kneading & Baking</option>
                        <option value="thermal_packed">Thermal Packed</option>
                        <option value="out_for_delivery">Out For Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB: KITCHEN DISPATCH QUEUE */}
        {activeTab === 'dispatch_queue' && (
          <div className="space-y-6">
            
            {/* Top Aggregate Summary Banner */}
            <div className="bg-[#3B170B] text-[#FEF3C7] border border-[#5C2712] rounded-3xl p-5 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#5C2712] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-base sm:text-lg text-white">Live Kitchen Dispatch Queue</h2>
                    <p className="text-xs text-[#FDE68A]">Organized Tawa Baking Schedule & Order Dispatch</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold bg-[#2B1006] px-3.5 py-2 rounded-2xl border border-[#5C2712]">
                  <span>Total Active Scheduled Orders:</span>
                  <span className="text-amber-400 font-extrabold font-mono-numbers text-sm">
                    {orderList.filter(o => o.status !== 'delivered').length}
                  </span>
                </div>
              </div>

              {/* Aggregated Baking Totals Calculation */}
              <div className="bg-[#2B1006] rounded-2xl p-4 border border-[#5C2712] space-y-2">
                <div className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#F59E0B]" />
                  <span>Aggregated Baking Totals for Kitchen Staff</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
                  {(() => {
                    // Aggregate items from all active scheduled orders
                    const totals: Record<string, number> = {};
                    let totalRotiCount = 0;

                    orderList.forEach((ord) => {
                      if (ord.status !== 'delivered') {
                        ord.items?.forEach((it) => {
                          const name = it.name;
                          totals[name] = (totals[name] || 0) + it.quantity;
                        });
                        totalRotiCount += ord.totalRotis || 0;
                      }
                    });

                    const entries = Object.entries(totals);
                    if (entries.length === 0) {
                      return <div className="col-span-full text-xs text-[#DFCBB5] py-1">No pending baking items in dispatch queue.</div>;
                    }

                    return (
                      <>
                        {entries.map(([name, qty]) => (
                          <div key={name} className="bg-[#3B170B] p-2.5 rounded-xl border border-[#5C2712]">
                            <div className="text-[11px] text-[#DFCBB5] truncate font-medium">{name}</div>
                            <div className="text-sm font-extrabold text-amber-300 font-mono-numbers mt-0.5">{qty} Pcs / Packs</div>
                          </div>
                        ))}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Scheduled Orders Dispatch List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-[#3B170B] uppercase tracking-wider">
                  Scheduled Orders ({orderList.length})
                </h3>
                <span className="text-xs text-[#8B5E3C] font-semibold">
                  Sorted by dispatch date & slot
                </span>
              </div>

              {orderList.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-[#EFE3D3]">
                  <ShoppingBag className="w-8 h-8 text-[#D97706] mx-auto mb-2" />
                  <div className="font-bold text-[#2B1408]">No orders in dispatch queue</div>
                  <p className="text-xs text-[#8B5E3C] mt-1">New customer bookings will appear here instantly.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orderList.map((order) => {
                    const isScheduled = order.status === 'Scheduled';
                    const isInBaking = order.status === 'In Baking' || order.status === 'kneading_and_baking';
                    const isOutForDelivery = order.status === 'out_for_delivery';
                    const isDelivered = order.status === 'delivered';

                    return (
                      <div 
                        key={order.id} 
                        className="bg-white rounded-3xl p-5 border border-[#EFE3D3] shadow-xs space-y-4 flex flex-col justify-between"
                      >
                        <div>
                          {/* Top Row: Order ID, Date & Slot */}
                          <div className="flex items-center justify-between border-b border-[#EFE3D3] pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-extrabold text-sm text-[#3B170B] bg-[#FEF3C7] px-2 py-0.5 rounded-lg border border-[#FDE68A]">
                                  #{order.orderId || order.id}
                                </span>
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  isDelivered ? 'bg-emerald-100 text-emerald-800' :
                                  isOutForDelivery ? 'bg-amber-100 text-amber-900' :
                                  isInBaking ? 'bg-orange-100 text-orange-900' : 'bg-amber-100 text-amber-900'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              {order.scheduledDate && (
                                <div className="text-xs font-bold text-[#78350F] mt-1 flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                                  <span>{order.scheduledDate}</span>
                                  <span>•</span>
                                  <span>{order.mealSlot || 'Lunch'}</span>
                                </div>
                              )}
                            </div>

                            <div className="text-right font-mono-numbers">
                              <div className="text-xs font-extrabold text-[#3B170B]">₹{order.finalAmount || order.totalAmount}</div>
                              <div className="text-[10px] text-[#8B5E3C] font-semibold">{order.paymentMethod}</div>
                            </div>
                          </div>

                          {/* Customer Name & Address */}
                          <div className="pt-3 space-y-1">
                            <div className="text-xs font-extrabold text-[#2B1408]">
                              👤 {order.customerName || 'Customer'} <span className="text-[#8B5E3C] font-mono font-normal">({order.customerPhone || '+91 9876543210'})</span>
                            </div>
                            <div className="text-xs text-[#8B5E3C] leading-snug">
                              📍 {typeof order.deliveryAddress === 'string' ? order.deliveryAddress : `${order.deliveryAddress?.houseFlat}, ${order.deliveryAddress?.streetArea}`}
                            </div>
                          </div>

                          {/* Items Breakdown */}
                          <div className="bg-[#FAF4EB] border border-[#DFCBB5] rounded-2xl p-3 mt-3 space-y-1">
                            <div className="text-[10px] font-extrabold text-[#8B5E3C] uppercase tracking-wider mb-1">Items Breakdown:</div>
                            {order.items?.map((it, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs text-[#2B1408]">
                                <span>
                                  <span className="font-extrabold text-[#3B170B]">{it.quantity}x</span> {it.name}
                                </span>
                                <span className="font-mono-numbers text-xs font-semibold">₹{it.price * it.quantity}</span>
                              </div>
                            ))}
                            {order.totalRotis ? (
                              <div className="border-t border-[#E2D2BD] pt-1.5 mt-1 flex items-center justify-between text-xs font-bold text-[#3B170B]">
                                <span>Total Rotis to Bake:</span>
                                <span className="text-[#D97706] font-mono-numbers">{order.totalRotis} Pcs</span>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {/* Status Updater Button Group */}
                        <div className="pt-3 border-t border-[#EFE3D3] space-y-1.5">
                          <div className="text-[10px] font-bold text-[#8B5E3C] uppercase">Kitchen Status Control:</div>
                          <div className="grid grid-cols-4 gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateOrderStatus(order.id, 'Scheduled')}
                              className={`py-1.5 text-[10px] font-extrabold rounded-xl border transition-all cursor-pointer ${
                                order.status === 'Scheduled'
                                  ? 'bg-amber-800 text-white border-amber-900 shadow-xs'
                                  : 'bg-[#FAF4EB] text-[#8B5E3C] hover:bg-[#EFE3D3]'
                              }`}
                            >
                              Scheduled
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateOrderStatus(order.id, 'In Baking' as any)}
                              className={`py-1.5 text-[10px] font-extrabold rounded-xl border transition-all cursor-pointer ${
                                order.status === 'In Baking' || order.status === 'kneading_and_baking'
                                  ? 'bg-[#D97706] text-white border-[#B45309] shadow-xs'
                                  : 'bg-[#FAF4EB] text-[#8B5E3C] hover:bg-[#EFE3D3]'
                              }`}
                            >
                              In Baking
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateOrderStatus(order.id, 'out_for_delivery')}
                              className={`py-1.5 text-[10px] font-extrabold rounded-xl border transition-all cursor-pointer ${
                                order.status === 'out_for_delivery'
                                  ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                                  : 'bg-[#FAF4EB] text-[#8B5E3C] hover:bg-[#EFE3D3]'
                              }`}
                            >
                              Dispatched
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                              className={`py-1.5 text-[10px] font-extrabold rounded-xl border transition-all cursor-pointer ${
                                order.status === 'delivered'
                                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                                  : 'bg-[#FAF4EB] text-[#8B5E3C] hover:bg-[#EFE3D3]'
                              }`}
                            >
                              Delivered
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: MENU CATALOG MANAGER */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            
            {/* Top Toolbar: Search, Category Filter, and Add Product */}
            <div className="bg-white rounded-2xl p-4 border border-[#EFE3D3] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8B5E3C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Search menu items by name, ingredients..."
                    className="w-full text-xs bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#D97706] text-[#2B1408]"
                  />
                </div>

                <select
                  value={catalogCategory}
                  onChange={(e) => setCatalogCategory(e.target.value)}
                  className="bg-[#FAF4EB] border border-[#DFCBB5] text-[#2B1408] text-xs rounded-xl px-3 py-2.5 font-semibold focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                >
                  <option value="all">All Categories</option>
                  <option value="roti_basket">Roti Basket</option>
                  <option value="specialty_bread">Specialty Breads</option>
                  <option value="rice_khichdi">Rice & Khichdi</option>
                  <option value="homestyle_sabzi">Homestyle Sabzi</option>
                  <option value="dal_accompaniment">Dal Accompaniments</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingItem({});
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>

            </div>

            {/* Product Catalog Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCatalog.map((item) => {
                const isOutOfStock = outOfStockIds.includes(item.id);

                return (
                  <div 
                    key={item.id} 
                    className={`bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                      isOutOfStock ? 'border-red-200 bg-red-50/20 opacity-75' : 'border-[#EFE3D3] hover:border-[#D97706]/50 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5E3C] bg-[#FAF4EB] px-2 py-0.5 rounded-md">
                            {item.category.replace('_', ' ')}
                          </span>
                          <h4 className="font-bold text-sm text-[#2B1408] mt-1">{item.name}</h4>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 uppercase tracking-wider ${
                            isOutOfStock ? 'bg-red-100 text-red-800 border-red-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          }`}>
                            {isOutOfStock ? 'OFF (Out of Stock)' : 'ON (In Stock)'}
                          </span>
                          {item.badgeText && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#78350F] border border-[#FDE68A] shrink-0">
                              {item.badgeText}
                            </span>
                          )}
                          {(item.isLimitedTime || item.isSeasonal) && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 shrink-0">
                              ⚡ Limited Time
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Product Image Thumbnail & Quick Gallery Action */}
                      <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden bg-[#FAF4EB] border border-[#DFCBB5] mb-2 group/img">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-[#8B5E3C] gap-1.5">
                            <ImageIcon className="w-4 h-4 opacity-60" />
                            <span>No Photo Set</span>
                          </div>
                        )}

                        {/* Overlaid Direct Gallery Picker Trigger */}
                        <div className="absolute inset-0 bg-black/60 opacity-90 sm:opacity-0 sm:group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-[1px]">
                          <button
                            type="button"
                            onClick={() => openImageGalleryModal(item)}
                            className="py-2 px-3 bg-[#D97706] hover:bg-[#B45309] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
                          >
                            <Images className="w-4 h-4" />
                            <span>Open Photo Gallery</span>
                          </button>
                        </div>
                      </div>

                      {/* Explicit Gallery Button below thumbnail */}
                      <button
                        type="button"
                        onClick={() => openImageGalleryModal(item)}
                        className="w-full mb-3 py-1.5 px-3 bg-[#FAF4EB] hover:bg-[#F3E7D5] border border-[#DFCBB5] text-[#3B170B] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs active:scale-98 cursor-pointer"
                      >
                        <Images className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>🖼️ Change Photo from Gallery</span>
                      </button>

                      <p className="text-xs text-[#8B5E3C] line-clamp-2 mb-3">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-3 text-xs mb-3">
                        <span className="font-bold text-[#2B1408] font-mono text-base">₹{item.price}</span>
                        {item.originalPrice > item.price && (
                          <span className="line-through text-[#8B5E3C] text-xs font-mono">₹{item.originalPrice}</span>
                        )}
                        <span className="text-[#8B5E3C]">· {item.packSize}</span>
                      </div>

                      {/* Stock Inventory Quantity Bar */}
                      <div className="bg-[#FAF4EB] border border-[#EFE3D3] rounded-xl p-2 mb-3 flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#8B5E3C]">Inventory Units:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateStockQuantity(item.id, (stockQuantities[item.id] || 50) - 10)}
                            className="w-6 h-6 rounded bg-white border border-[#DFCBB5] text-[#3B170B] font-bold hover:bg-[#EFE3D3] transition-colors flex items-center justify-center"
                            title="Decrease inventory by 10"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={stockQuantities[item.id] ?? 50}
                            onChange={(e) => updateStockQuantity(item.id, parseInt(e.target.value, 10) || 0)}
                            className="w-14 text-center font-bold font-mono bg-white border border-[#DFCBB5] rounded py-0.5 text-xs text-[#2B1408]"
                          />
                          <button
                            onClick={() => updateStockQuantity(item.id, (stockQuantities[item.id] || 50) + 10)}
                            className="w-6 h-6 rounded bg-white border border-[#DFCBB5] text-[#3B170B] font-bold hover:bg-[#EFE3D3] transition-colors flex items-center justify-center"
                            title="Increase inventory by 10"
                          >
                            +
                          </button>
                          <span className="text-[10px] text-[#8B5E3C] font-semibold">units</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer with Interactive ON / OFF Toggle Switch */}
                    <div className="pt-3 border-t border-[#EFE3D3] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => toggleStock(item.id)}
                          type="button"
                          className={`relative inline-flex h-7 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#D97706] ${
                            isOutOfStock ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                          title={isOutOfStock ? "Click to set IN STOCK (ON)" : "Click to set OUT OF STOCK (OFF)"}
                        >
                          <span className="sr-only">Toggle Inventory Stock</span>
                          <span
                            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[9px] font-black ${
                              isOutOfStock ? 'translate-x-0 text-red-600' : 'translate-x-9 text-emerald-600'
                            }`}
                          >
                            {isOutOfStock ? 'OFF' : 'ON'}
                          </span>
                        </button>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-[#8B5E3C] uppercase tracking-wider">Inventory</span>
                          <span className={`text-xs font-extrabold ${isOutOfStock ? 'text-red-700' : 'text-emerald-700'}`}>
                            {isOutOfStock ? 'OFF (Out of Stock)' : 'ON (In Stock)'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsProductModalOpen(true);
                          }}
                          className="p-2 rounded-xl text-[#8B5E3C] hover:text-[#2B1408] hover:bg-[#FAF4EB] transition-colors"
                          title="Edit product details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(item.id)}
                          className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Delete product permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 3: ORDERS & DISPATCH */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Orders Filter Tabs */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#EFE3D3] space-y-3">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs font-extrabold text-[#3B170B] whitespace-nowrap">Order Category:</span>
                <button
                  type="button"
                  onClick={() => setOrderTypeFilter('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    orderTypeFilter === 'all' ? 'bg-[#3B170B] text-white shadow-2xs' : 'bg-[#FAF4EB] text-[#8B5E3C] hover:bg-[#EFE3D3]'
                  }`}
                >
                  All Orders ({orderList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderTypeFilter('regular')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    orderTypeFilter === 'regular' ? 'bg-[#D97706] text-white shadow-2xs' : 'bg-[#FAF4EB] text-[#8B5E3C] hover:bg-[#EFE3D3]'
                  }`}
                >
                  <span>🛒 Regular Orders</span>
                  <span className="bg-black/10 px-1.5 py-0.2 rounded text-[10px]">
                    {orderList.filter(o => o.id.startsWith('REG') || o.type === 'regular').length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderTypeFilter('subscription')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    orderTypeFilter === 'subscription' ? 'bg-purple-800 text-white shadow-2xs' : 'bg-[#FAF4EB] text-[#8B5E3C] hover:bg-[#EFE3D3]'
                  }`}
                >
                  <span>📅 Subscription Orders</span>
                  <span className="bg-black/10 px-1.5 py-0.2 rounded text-[10px]">
                    {orderList.filter(o => o.id.startsWith('SUB') || o.type === 'subscription_charge').length}
                  </span>
                </button>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#EFE3D3]">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <span className="text-xs font-bold text-[#8B5E3C] whitespace-nowrap">Status:</span>
                  {['all', 'confirmed', 'kneading_and_baking', 'thermal_packed', 'out_for_delivery', 'delivered'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setOrderStatusFilter(status)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                        orderStatusFilter === status
                          ? 'bg-[#3B170B] text-white'
                          : 'bg-[#FAF4EB] text-[#8B5E3C] hover:bg-[#EFE3D3]'
                      }`}
                    >
                      {status === 'all' ? 'All Statuses' : status.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-[#8B5E3C] font-semibold">
                  Showing {filteredOrders.length} orders
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl p-5 border border-[#EFE3D3] shadow-xs space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFE3D3] pb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`font-mono font-extrabold text-sm px-2.5 py-0.5 rounded-lg border ${
                        order.id.startsWith('SUB') || order.type === 'subscription_charge'
                          ? 'bg-purple-100 text-purple-950 border-purple-300'
                          : 'bg-amber-100 text-amber-950 border-amber-300'
                      }`}>
                        #{order.id}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        order.id.startsWith('SUB') || order.type === 'subscription_charge'
                          ? 'bg-purple-900 text-purple-100'
                          : 'bg-[#78350F] text-[#FEF3C7]'
                      }`}>
                        {order.id.startsWith('SUB') || order.type === 'subscription_charge' ? '📅 Subscription Order' : '🛒 Regular Order'}
                      </span>
                      <span className="text-xs text-[#8B5E3C]">{order.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8B5E3C]">Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="bg-[#FAF4EB] border border-[#DFCBB5] text-[#2B1408] text-xs rounded-xl px-3 py-1.5 font-bold focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="kneading_and_baking">Kneading & Baking</option>
                        <option value="thermal_packed">Thermal Packed</option>
                        <option value="out_for_delivery">Out For Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="font-bold text-[#8B5E3C] mb-1">Ordered Items:</div>
                      <ul className="space-y-1 font-medium text-[#2B1408]">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-mono text-[#8B5E3C]">₹{item.price * item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                      <div className="font-bold text-[#8B5E3C] mb-1">Delivery Address:</div>
                      <div className="font-medium text-[#2B1408]">
                        {typeof order.deliveryAddress === 'string'
                          ? order.deliveryAddress
                          : `${order.deliveryAddress.recipientName} (${order.deliveryAddress.phone})`}
                      </div>
                      {typeof order.deliveryAddress === 'object' && (
                        <div className="text-[#8B5E3C] mt-0.5">
                          {order.deliveryAddress.houseFlat}, {order.deliveryAddress.streetArea}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                        </div>
                      )}

                    <div>
                      <div className="font-bold text-[#8B5E3C] mb-1">Kitchen & Delivery Logistics:</div>
                      <div className="space-y-1 text-[#2B1408]">
                        <div>Rider: <span className="font-bold">{order.liveRiderName || 'Rameshwar Yadav'}</span></div>
                        <div>Phone: <span className="font-mono text-[#D97706]">{order.liveRiderPhone || '+91 98210 44321'}</span></div>
                        <div>Delivery OTP: <span className="font-mono font-bold bg-amber-100 px-1.5 py-0.5 rounded text-[#3B170B]">{order.otp || '4821'}</span></div>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: SUBSCRIBER DIRECTORY */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl p-5 border border-[#EFE3D3] shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#2B1408]">Active Subscriber Roster</h3>

              {activeSubscription ? (
                <div className="bg-[#FAF4EB] rounded-2xl p-4 border border-[#DFCBB5] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFE3D3] pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] bg-amber-100 px-2 py-0.5 rounded-md">
                        {activeSubscription.status.toUpperCase()}
                      </span>
                      <h4 className="font-extrabold text-base text-[#2B1408] mt-1">{activeSubscription.planName}</h4>
                      <p className="text-xs text-[#8B5E3C]">
                        Delivering to {activeSubscription.address.recipientName} ({activeSubscription.address.phone})
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-[#8B5E3C]">Plan Duration:</div>
                      <div className="font-bold text-sm text-[#2B1408]">
                        {activeSubscription.remainingDays} / {activeSubscription.totalDays} days remaining
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-[#EFE3D3]">
                      <div className="text-[#8B5E3C]">Rotis per Meal</div>
                      <div className="font-bold text-[#2B1408] text-sm font-mono">{activeSubscription.rotisPerMeal} Rotis</div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-[#EFE3D3]">
                      <div className="text-[#8B5E3C]">Default Flour</div>
                      <div className="font-bold text-[#2B1408] text-sm">MP Sharbati Wheat</div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-[#EFE3D3]">
                      <div className="text-[#8B5E3C]">Lunch Cutoff</div>
                      <div className="font-bold text-[#D97706] text-sm font-mono">{activeSubscription.lunchCutoff}</div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-[#EFE3D3]">
                      <div className="text-[#8B5E3C]">Dinner Cutoff</div>
                      <div className="font-bold text-[#D97706] text-sm font-mono">{activeSubscription.dinnerCutoff}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-[#8B5E3C]">
                  No active subscriber records found.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 5: CUTOFF & KITCHEN SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl p-5 border border-[#EFE3D3] shadow-xs space-y-4 max-w-2xl">
              <h3 className="font-bold text-base text-[#2B1408] flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#D97706]" />
                <span>Kitchen Operating Cutoffs & Capacity</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-[#2B1408] block mb-1">
                    Daily Lunch Tuning Cutoff Time
                  </label>
                  <input
                    type="text"
                    defaultValue="10:30 AM"
                    className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                  />
                  <p className="text-[11px] text-[#8B5E3C] mt-1">
                    Subscribers cannot pause or modify today's lunch quantity after this cutoff.
                  </p>
                </div>

                <div>
                  <label className="font-bold text-[#2B1408] block mb-1">
                    Daily Dinner Tuning Cutoff Time
                  </label>
                  <input
                    type="text"
                    defaultValue="06:30 PM"
                    className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                  />
                  <p className="text-[11px] text-[#8B5E3C] mt-1">
                    Subscribers cannot pause or modify today's dinner quantity after this cutoff.
                  </p>
                </div>

                <div>
                  <label className="font-bold text-[#2B1408] block mb-1">
                    Maximum Daily Baking Capacity (Rotis per day)
                  </label>
                  <input
                    type="number"
                    defaultValue={500}
                    className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                  />
                </div>

                <button
                  onClick={() => showToast('Saved kitchen cutoff settings')}
                  className="px-5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Save Settings
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Edit / Add Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#EFE3D3] space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#EFE3D3] pb-3">
              <h3 className="font-bold text-base text-[#2B1408]">
                {editingItem?.id ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-[#8B5E3C] hover:text-[#2B1408] p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#2B1408] block mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingItem?.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="e.g. MP Sharbati Phulka Basket"
                  className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#2B1408] block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingItem?.price || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    placeholder="55"
                    className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#2B1408] block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingItem?.originalPrice || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, originalPrice: Number(e.target.value) })}
                    placeholder="65"
                    className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#2B1408] block mb-1">Category</label>
                  <select
                    value={editingItem?.category || 'roti_basket'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                  >
                    <option value="phulkas">Fresh Phulkas & Rotis</option>
                    <option value="parathas">Stuffed & Flaky Parathas</option>
                    <option value="theplas">Gujarati Theplas</option>
                    <option value="rotlas">Rotlas & Millet Bhakris</option>
                    <option value="roti_basket">Roti Basket</option>
                    <option value="specialty_bread">Specialty Bread</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#2B1408] block mb-1">Pack Size</label>
                  <input
                    type="text"
                    value={editingItem?.packSize || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, packSize: e.target.value })}
                    placeholder="e.g. 5 Rotis"
                    className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2B1408] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingItem?.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Freshly prepared home-style food..."
                  className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#2B1408] block mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={editingItem?.badgeText || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, badgeText: e.target.value })}
                    placeholder="e.g. High Fiber"
                    className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#2B1408] block mb-1">Ingredients</label>
                  <input
                    type="text"
                    value={editingItem?.ingredients || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, ingredients: e.target.value })}
                    placeholder="e.g. MP Wheat, Water"
                    className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                  />
                </div>
              </div>

              {/* Add-ons Management */}
              <div>
                <label className="font-bold text-[#2B1408] block mb-2">Add-ons</label>
                <div className="space-y-2 mb-2">
                  {(editingItem?.addOns || []).map((addon, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white border border-[#DFCBB5] p-2 rounded-lg text-xs">
                      <span className="flex-1 font-semibold">{addon.name}</span>
                      <span className="font-mono-numbers">₹{addon.price}</span>
                      <button 
                        onClick={() => {
                          const newAddOns = (editingItem?.addOns || []).filter((_, i) => i !== idx);
                          setEditingItem({ ...editingItem, addOns: newAddOns });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="new-addon-name"
                    placeholder="Add-on name"
                    className="flex-1 bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                  <input
                    type="number"
                    id="new-addon-price"
                    placeholder="Price"
                    className="w-20 bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      const nameInput = document.getElementById('new-addon-name') as HTMLInputElement;
                      const priceInput = document.getElementById('new-addon-price') as HTMLInputElement;
                      if (nameInput.value && priceInput.value) {
                        const newAddOns = [...(editingItem?.addOns || []), { name: nameInput.value, price: Number(priceInput.value) }];
                        setEditingItem({ ...editingItem, addOns: newAddOns });
                        nameInput.value = '';
                        priceInput.value = '';
                      }
                    }}
                    className="bg-[#D97706] text-white px-3 py-2 rounded-xl font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Product Image & Photo Upload Section */}
              <div className="bg-[#FAF4EB] border border-[#DFCBB5] rounded-2xl p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#2B1408] text-xs flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#D97706]" />
                    <span>Product Image / Photo</span>
                  </label>
                  {editingItem?.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, imageUrl: '' })}
                      className="text-red-600 hover:text-red-800 text-[10px] font-bold underline"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Photo Preview */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-white border border-[#DFCBB5] shrink-0 flex items-center justify-center relative shadow-xs">
                    {editingItem?.imageUrl ? (
                      <img
                        src={editingItem.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-1 text-[#8B5E3C]">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                        <span className="text-[9px] font-semibold block leading-tight">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    {/* Dual Phone Upload Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <label className="py-2 px-2.5 rounded-xl bg-white border border-[#DFCBB5] hover:bg-[#FAF4EB] text-[#2B1408] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors text-center active:scale-95">
                        <ImageIcon className="w-4 h-4 text-[#D97706] shrink-0" />
                        <span>🖼️ Phone Gallery</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e)}
                          className="hidden"
                        />
                      </label>

                      <label className="py-2 px-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors text-center active:scale-95">
                        <Camera className="w-4 h-4 shrink-0" />
                        <span>📸 Camera</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleFileUpload(e)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Direct Image URL Input */}
                    <div className="flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-[#8B5E3C] shrink-0" />
                      <input
                        type="text"
                        value={editingItem?.imageUrl || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                        placeholder="Paste image web link (URL)..."
                        className="w-full bg-white border border-[#DFCBB5] rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Food Photos Picker */}
                <div>
                  <span className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-wider block mb-1">
                    Or select from Food Photo Gallery Presets:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {FOOD_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, imageUrl: preset.url })}
                        className={`aspect-square rounded-lg overflow-hidden border transition-all relative group/p ${
                          editingItem?.imageUrl === preset.url ? 'border-2 border-[#D97706] ring-2 ring-[#D97706]/30' : 'border-[#DFCBB5] hover:border-[#D97706]'
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[8px] font-bold truncate px-0.5 text-center">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="canSubscribe"
                    checked={editingItem?.canSubscribe ?? true}
                    onChange={(e) => setEditingItem({ ...editingItem, canSubscribe: e.target.checked })}
                    className="rounded accent-[#D97706]"
                  />
                  <label htmlFor="canSubscribe" className="font-semibold text-[#2B1408] text-xs">
                    Available for Daily Subscription
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isLimitedTime"
                    checked={Boolean(editingItem?.isLimitedTime || editingItem?.isSeasonal)}
                    onChange={(e) => setEditingItem({ ...editingItem, isLimitedTime: e.target.checked, isSeasonal: e.target.checked })}
                    className="rounded accent-[#EA580C]"
                  />
                  <label htmlFor="isLimitedTime" className="font-semibold text-[#EA580C] text-xs flex items-center gap-1">
                    <span>⚡ Limited Time Seasonal Special</span>
                  </label>
                </div>
              </div>

              {Boolean(editingItem?.isLimitedTime || editingItem?.isSeasonal) && (
                <div>
                  <label className="font-bold text-[#EA580C] block mb-1 text-xs">Seasonal Tag / Limited Time Label</label>
                  <input
                    type="text"
                    value={editingItem?.seasonalTag || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, seasonalTag: e.target.value })}
                    placeholder="e.g. Winter Harvest Special, Double Lasooni Tadka"
                    className="w-full bg-[#FFF7ED] border border-[#FDBA74] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                  />
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#EFE3D3] flex items-center justify-end gap-2">
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#FAF4EB] hover:bg-[#EFE3D3] text-[#2B1408] font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                className="px-5 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs transition-colors shadow-xs"
              >
                Save Product
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Image Gallery Picker Modal */}
      <ImageGalleryModal
        isOpen={isGalleryModalOpen}
        item={galleryTargetItem}
        onClose={() => {
          setIsGalleryModalOpen(false);
          setGalleryTargetItem(null);
        }}
        onSelectImage={handleGallerySelectImage}
      />

    </div>
  );
};
