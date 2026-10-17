import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Sun, 
  Moon, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Flame, 
  Check, 
  Info, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RegularMenuItem, Order } from '../types';
import { QuickCheckoutModal } from './QuickCheckoutModal';

interface StepByStepOrderBuilderProps {
  onOrderSuccess: (newOrder: Order) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const StepByStepOrderBuilder: React.FC<StepByStepOrderBuilderProps> = ({ 
  onOrderSuccess,
  selectedCategory,
  onSelectCategory,
}) => {
  const { 
    menuItems, 
    simulatedHour, 
    simulatedMinute, 
    isLunchCutoffPassed, 
    isDinnerCutoffPassed,
    showToast 
  } = useApp();

  // Generate Next 7 Days for Date Selector
  const dateOptions = useMemo(() => {
    const today = new Date();
    const options = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const isoDate = d.toISOString().split('T')[0];
      const weekdayShort = daysOfWeek[d.getDay()];
      const monthDay = `${monthNames[d.getMonth()]} ${d.getDate()}`;
      
      let displayTitle = `${weekdayShort} (${monthDay})`;
      if (i === 0) displayTitle = `Today (${monthDay})`;
      if (i === 1) displayTitle = `Tomorrow (${monthDay})`;

      options.push({
        isoDate,
        weekdayShort,
        relativeLabel: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : null,
        monthDay,
        displayTitle,
        label: displayTitle,
        isToday: i === 0,
      });
    }
    return options;
  }, []);

  // Selected Date State (Defaults to Today)
  const [selectedDateObj, setSelectedDateObj] = useState(dateOptions[0]);

  // Custom Date selection handler from calendar input
  const handleCustomDateSelect = (isoString: string) => {
    if (!isoString) return;
    const parts = isoString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const weekdayShort = daysOfWeek[d.getDay()];
    const monthDay = `${monthNames[d.getMonth()]} ${d.getDate()}`;
    
    const todayIso = new Date().toISOString().split('T')[0];
    const isToday = isoString === todayIso;
    
    let displayTitle = `${weekdayShort} (${monthDay})`;
    if (isToday) displayTitle = `Today (${monthDay})`;

    const customDateObj = {
      isoDate: isoString,
      weekdayShort,
      relativeLabel: isToday ? 'Today' : null,
      monthDay,
      displayTitle,
      label: displayTitle,
      isToday,
    };

    setSelectedDateObj(customDateObj);
    if (isToday && isLunchCutoffPassed && selectedSlot === 'lunch') {
      setSelectedSlot('dinner');
    }
  };

  // Selected Slot State ('lunch' | 'dinner')
  const [selectedSlot, setSelectedSlot] = useState<'lunch' | 'dinner'>(() => {
    // If today and lunch cutoff passed, default to dinner
    if (isLunchCutoffPassed && !isDinnerCutoffPassed) return 'dinner';
    return 'lunch';
  });

  // Category Filter in Step 3
  const [internalCategory, setInternalCategory] = useState<string>('all');
  const activeCategory = selectedCategory !== undefined ? selectedCategory : internalCategory;

  const handleCategoryChange = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    setInternalCategory(cat);
  };

  // Quantities map: { [itemId]: { qty: number; addOn?: string } }
  const [quantities, setQuantities] = useState<Record<string, { qty: number; addOn?: string }>>({
    sharbati_phulka_5: { qty: 2 }, // Default 2 packs (10 rotis)
  });

  // Modal States
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isCalendarPickerOpen, setIsCalendarPickerOpen] = useState(false);

  // Generate 30 Days for Extended Calendar Picker Modal
  const extendedDateOptions = useMemo(() => {
    const today = new Date();
    const options = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const isoDate = d.toISOString().split('T')[0];
      const weekdayShort = daysOfWeek[d.getDay()];
      const dayNum = d.getDate();
      const monthShort = monthNames[d.getMonth()];
      const monthDay = `${monthShort} ${dayNum}`;
      
      let displayTitle = `${weekdayShort} (${monthDay})`;
      if (i === 0) displayTitle = `Today (${monthDay})`;
      if (i === 1) displayTitle = `Tomorrow (${monthDay})`;

      options.push({
        isoDate,
        weekdayShort,
        dayNum,
        monthShort,
        relativeLabel: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : null,
        monthDay,
        displayTitle,
        label: displayTitle,
        isToday: i === 0,
      });
    }
    return options;
  }, []);

  // Cutoff checks for selected date
  const isSelectedDateToday = selectedDateObj.isToday;
  const isLunchDisabledForToday = isSelectedDateToday && isLunchCutoffPassed;
  const isDinnerDisabledForToday = isSelectedDateToday && isDinnerCutoffPassed;

  // Handle Stepper Button Clicks
  const handleQuantityChange = (itemId: string, delta: number, addOn?: string) => {
    setQuantities((prev) => {
      const current = prev[itemId] || { qty: 0 };
      const updated = Math.max(0, current.qty + delta);
      if (updated === 0) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return { ...prev, [itemId]: { qty: updated, addOn: addOn || current.addOn } };
    });
  };

  // Menu items list
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (activeCategory === 'all') return true;
      const catLower = activeCategory.toLowerCase();
      const nameLower = item.name.toLowerCase();
      const subLower = (item.subCategory || '').toLowerCase();
      const itemCat = (item.category || '').toLowerCase();

      if (catLower === 'phulkas') return itemCat === 'phulkas' || itemCat === 'roti_basket' || nameLower.includes('phulka') || nameLower.includes('roti');
      if (catLower === 'parathas') return itemCat === 'parathas' || nameLower.includes('paratha') || subLower.includes('paratha');
      if (catLower === 'theplas') return itemCat === 'theplas' || nameLower.includes('thepla') || subLower.includes('thepla');
      if (catLower === 'rotlas') return itemCat === 'rotlas' || nameLower.includes('rotla') || nameLower.includes('bhakri') || nameLower.includes('millet');
      return true;
    });
  }, [menuItems, activeCategory]);

  // Total rotis and amount calculation
  const { totalRotis, totalAmount, selectedItemsBreakdown } = useMemo(() => {
    let rotis = 0;
    let amount = 0;
    const items: { name: string; quantity: number; variant?: string; price: number }[] = [];

    menuItems.forEach((item) => {
      const qtyData = quantities[item.id];
      if (qtyData && qtyData.qty > 0) {
        // Parse pack size (e.g. "Pack of 5 Pcs" -> 5)
        let countPerPack = 1;
        if (item.packSize.toLowerCase().includes('5')) countPerPack = 5;
        else if (item.packSize.toLowerCase().includes('10')) countPerPack = 10;
        else if (item.packSize.toLowerCase().includes('3')) countPerPack = 3;
        else if (item.packSize.toLowerCase().includes('2')) countPerPack = 2;

        rotis += qtyData.qty * countPerPack;
        
        let itemPrice = qtyData.qty * item.price;
        let addOnPrice = 0;
        if (qtyData.addOn && item.addOns) {
          const selectedAddOn = item.addOns.find(a => a.name === qtyData.addOn);
          if (selectedAddOn) addOnPrice = qtyData.qty * selectedAddOn.price;
        }
        amount += itemPrice + addOnPrice;

        items.push({
          name: `${item.name} ${qtyData.addOn ? `(${qtyData.addOn})` : ''}`,
          quantity: qtyData.qty,
          variant: item.packSize,
          price: item.price + (addOnPrice / qtyData.qty),
        });
      }
    });

    return { totalRotis: rotis, totalAmount: amount, selectedItemsBreakdown: items };
  }, [quantities, menuItems]);

  const slotLabel = selectedSlot === 'lunch' ? 'Lunch (12:00 PM - 2:00 PM)' : 'Dinner (7:00 PM - 9:00 PM)';

  const handleProceedToCheckout = () => {
    if (selectedItemsBreakdown.length === 0) {
      showToast('Please select at least 1 item to proceed with your order');
      return;
    }
    if (selectedSlot === 'lunch' && isLunchDisabledForToday) {
      showToast('Lunch cutoff (10:30 AM) passed for Today. Please select Dinner or Tomorrow!');
      return;
    }
    if (selectedSlot === 'dinner' && isDinnerDisabledForToday) {
      showToast('Dinner cutoff (6:30 PM) passed for Today. Please select Tomorrow!');
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      
      {/* Top Direct Section Title */}
      <div className="bg-[#FFFDF9] border border-[#EFE3D3] rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#D97706] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              3-Step Fast Order
            </span>
            <span className="text-xs font-bold text-[#8B5E3C]">• Live Tawa Baking</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#3B170B] mt-1">
            Build Your Fresh RotiiBox
          </h1>
          <p className="text-xs text-[#8B5E3C] mt-0.5">
            Select date, meal slot, and roti quantities below for instant scheduling.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FAF4EB] border border-[#DFCBB5] px-3 py-2 rounded-2xl shrink-0">
          <Flame className="w-5 h-5 text-[#D97706]" />
          <div className="text-left">
            <div className="text-[10px] font-bold text-[#8B5E3C] uppercase">Kitchen Status</div>
            <div className="text-xs font-extrabold text-[#3B170B]">Hot Tawa Ready 🔥</div>
          </div>
        </div>
      </div>

      {/* =========================================
          STEP 1: SELECT DELIVERY DATE
         ========================================= */}
      <div className="bg-[#FFFDF9] border border-[#EFE3D3] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#3B170B]">
            <div className="w-6 h-6 rounded-full bg-[#3B170B] text-[#FEF3C7] flex items-center justify-center font-extrabold text-xs">
              1
            </div>
            <span className="text-sm font-extrabold">Select Delivery Date</span>
          </div>

          {/* Interactive Calendar Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsCalendarPickerOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#FAF4EB] hover:bg-[#FEF3C7] border border-[#DFCBB5] hover:border-[#D97706] text-[#78350F] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:scale-95"
            title="Click to pick any date from calendar modal"
          >
            <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Calendar 📅</span>
          </button>
        </div>

        {/* Clean Horizontal Date Picker Slider Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-none no-scrollbar touch-pan-x w-full snap-x">
          {dateOptions.map((opt) => {
            const isSelected = selectedDateObj.isoDate === opt.isoDate;

            return (
              <button
                key={opt.isoDate}
                type="button"
                onClick={() => {
                  setSelectedDateObj(opt);
                  // If switching to today and current slot is disabled, auto switch slot
                  if (opt.isToday && isLunchCutoffPassed && selectedSlot === 'lunch') {
                    setSelectedSlot('dinner');
                  }
                }}
                className={`snap-start px-4 py-2.5 rounded-2xl border text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#3B170B] text-[#FEF3C7] border-[#2B1006] shadow-md ring-2 ring-[#D97706]/30'
                    : 'bg-white text-[#3B170B] border-[#DFCBB5] hover:border-[#D97706] hover:bg-[#FAF4EB]'
                }`}
              >
                <Calendar className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#D97706]' : 'text-[#8B5E3C]'}`} />
                <span className="text-xs sm:text-sm font-extrabold">{opt.displayTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================
          STEP 2: SELECT MEAL SLOT
         ========================================= */}
      <div className="bg-[#FFFDF9] border border-[#EFE3D3] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#3B170B]">
            <div className="w-6 h-6 rounded-full bg-[#3B170B] text-[#FEF3C7] flex items-center justify-center font-extrabold text-xs">
              2
            </div>
            <span className="text-sm font-extrabold">Select Meal Slot</span>
          </div>

          <span className="text-[11px] text-[#8B5E3C] font-semibold">
            Cutoffs: Lunch 10:30 AM · Dinner 6:30 PM
          </span>
        </div>

        {/* Two Big Tap-Friendly Slot Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Lunch Slot */}
          <button
            type="button"
            disabled={isLunchDisabledForToday}
            onClick={() => setSelectedSlot('lunch')}
            className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
              isLunchDisabledForToday
                ? 'opacity-50 bg-stone-100 border-stone-200 cursor-not-allowed'
                : selectedSlot === 'lunch'
                  ? 'bg-[#FEF3C7] border-[#D97706] text-[#3B170B] shadow-md ring-2 ring-[#D97706]/30'
                  : 'bg-white border-[#DFCBB5] text-[#2B1408] hover:border-[#D97706] hover:bg-[#FAF4EB]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${selectedSlot === 'lunch' && !isLunchDisabledForToday ? 'bg-[#D97706] text-white' : 'bg-amber-100 text-amber-800'}`}>
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#3B170B]">☀️ Lunch Slot</h3>
                  <p className="text-xs text-[#8B5E3C] font-medium mt-0.5">12:00 PM – 2:00 PM</p>
                </div>
              </div>

              {selectedSlot === 'lunch' && !isLunchDisabledForToday && (
                <div className="w-5 h-5 rounded-full bg-[#D97706] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            {isLunchDisabledForToday && (
              <div className="mt-2.5 inline-flex items-center gap-1 bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                <ShieldAlert className="w-3 h-3 text-amber-800 shrink-0" />
                <span>10:30 AM Cutoff Passed for Today</span>
              </div>
            )}
          </button>

          {/* Dinner Slot */}
          <button
            type="button"
            disabled={isDinnerDisabledForToday}
            onClick={() => setSelectedSlot('dinner')}
            className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
              isDinnerDisabledForToday
                ? 'opacity-50 bg-stone-100 border-stone-200 cursor-not-allowed'
                : selectedSlot === 'dinner'
                  ? 'bg-[#FEF3C7] border-[#D97706] text-[#3B170B] shadow-md ring-2 ring-[#D97706]/30'
                  : 'bg-white border-[#DFCBB5] text-[#2B1408] hover:border-[#D97706] hover:bg-[#FAF4EB]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${selectedSlot === 'dinner' && !isDinnerDisabledForToday ? 'bg-[#3B170B] text-[#FEF3C7]' : 'bg-stone-200 text-stone-800'}`}>
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#3B170B]">🌙 Dinner Slot</h3>
                  <p className="text-xs text-[#8B5E3C] font-medium mt-0.5">7:00 PM – 9:00 PM</p>
                </div>
              </div>

              {selectedSlot === 'dinner' && !isDinnerDisabledForToday && (
                <div className="w-5 h-5 rounded-full bg-[#D97706] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            {isDinnerDisabledForToday && (
              <div className="mt-2.5 inline-flex items-center gap-1 bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                <ShieldAlert className="w-3 h-3 text-amber-800 shrink-0" />
                <span>6:30 PM Cutoff Passed for Today</span>
              </div>
            )}
          </button>

        </div>
      </div>

      {/* =========================================
          STEP 3: SELECT ITEMS & QUANTITY
         ========================================= */}
      <div className="bg-[#FFFDF9] border border-[#EFE3D3] rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#3B170B]">
            <div className="w-6 h-6 rounded-full bg-[#3B170B] text-[#FEF3C7] flex items-center justify-center font-extrabold text-xs">
              3
            </div>
            <span className="text-sm font-extrabold">Select Items & Quantity</span>
          </div>

          {/* Real-time Counter Badge */}
          <div className="flex items-center gap-2 bg-[#FEF3C7] border border-[#FDE68A] px-3 py-1 rounded-xl text-xs font-bold text-[#78350F]">
            <span>Selected Rotis: <span className="text-[#3B170B] font-extrabold font-mono-numbers">{totalRotis} Pcs</span></span>
            <span>•</span>
            <span>Total: <span className="text-[#3B170B] font-extrabold font-mono-numbers">₹{totalAmount}</span></span>
          </div>
        </div>

        {/* Clean Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar border-b border-[#E2D2BD] pt-1">
          {[
            { id: 'all', label: 'All Menu Items 🫓' },
            { id: 'phulkas', label: 'Fresh Phulkas 🌾' },
            { id: 'parathas', label: 'Stuffed Parathas 🥞' },
            { id: 'theplas', label: 'Gujarati Theplas 🍃' },
            { id: 'rotlas', label: 'Millet Rotlas 🌽' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleCategoryChange(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-[#3B170B] text-[#FEF3C7] font-bold shadow-xs'
                  : 'bg-[#FAF4EB] text-[#8B5E3C] hover:text-[#2B1408]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Direct Item Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {filteredMenuItems.map((item) => {
              const itemQtyData = quantities[item.id] || { qty: 0 };
              const qty = itemQtyData.qty;

              return (
                <div 
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2 ${
                    qty > 0 
                      ? 'bg-[#FEF3C7]/40 border-[#D97706] shadow-xs' 
                      : 'bg-[#FAF4EB] border-[#DFCBB5] hover:border-[#D97706]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Item Thumbnail & Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-[#DFCBB5]">
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-amber-100 text-[#3B170B] font-bold text-xs">
                            {item.name.slice(0, 2)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-xs sm:text-sm text-[#3B170B] leading-snug break-words">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-[#8B5E3C] mt-0.5 font-medium">
                          {item.packSize} • <span className="font-bold text-[#D97706]">₹{item.price}</span>
                        </p>
                        {item.badgeText && (
                          <span className="inline-block text-[9px] font-bold text-[#78350F] bg-[#FEF3C7] px-1.5 py-0.2 rounded-md mt-1 border border-[#FDE68A]">
                            {item.badgeText}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Direct Stepper Controls */}
                    <div className="flex items-center gap-1.5 shrink-0 bg-white border border-[#DFCBB5] rounded-xl p-1 shadow-2xs">
                      {qty > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="w-7 h-7 rounded-lg bg-[#FAF4EB] hover:bg-[#FEF3C7] text-[#3B170B] flex items-center justify-center transition-colors cursor-pointer"
                            title="Decrease"
                          >
                            <Minus className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                          <span className="w-6 text-center font-extrabold text-xs text-[#3B170B] font-mono-numbers">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="w-7 h-7 rounded-lg bg-[#3B170B] hover:bg-[#2B1006] text-[#FEF3C7] flex items-center justify-center transition-colors cursor-pointer"
                            title="Increase"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="px-3 py-1.5 rounded-lg bg-[#3B170B] hover:bg-[#2B1006] text-[#FEF3C7] font-extrabold text-xs flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Add-ons Dropdown */}
                  {item.addOns && qty > 0 && (
                    <div className="flex items-center gap-2 mt-1 pt-2 border-t border-[#E2D2BD]">
                      <span className="text-[10px] font-bold text-[#8B5E3C]">Add-on:</span>
                      <select
                        value={itemQtyData.addOn || item.addOns[0].name}
                        onChange={(e) => handleQuantityChange(item.id, 0, e.target.value)}
                        className="text-[10px] bg-white border border-[#DFCBB5] rounded-lg px-2 py-1 text-[#3B170B] font-semibold flex-1"
                      >
                        {item.addOns.map(a => (
                          <option key={a.name} value={a.name}>{a.name} {a.price > 0 ? `(+₹${a.price})` : ''}</option>
                        ))}
                      </select>
                    </div>
                  )}

                </div>
              );
            })}
        </div>

      </div>

      {/* =========================================
          STEP 4: QUICK STICKY ORDER BAR
         ========================================= */}
      <div className="fixed bottom-[52px] md:bottom-0 left-0 right-0 z-30 bg-[#3B170B] text-[#FEF3C7] border-t border-[#5C2712] px-3.5 py-2.5 sm:p-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          {/* Order Summary Summary Label */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-white truncate">
              <Calendar className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
              <span>{selectedDateObj.label}</span>
              <span>•</span>
              <span className="text-[#FDE68A]">{selectedSlot === 'lunch' ? 'Lunch' : 'Dinner'}</span>
            </div>
            <div className="text-[11px] text-[#FDE68A] flex items-center gap-2 mt-0.5">
              <span>{totalRotis} Rotis Selected</span>
              <span>•</span>
              <span className="font-extrabold text-white font-mono-numbers text-xs">Total ₹{totalAmount}</span>
            </div>
          </div>

          {/* Proceed to Order Button */}
          <button
            type="button"
            onClick={handleProceedToCheckout}
            className="px-5 py-3 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-[#2B1006] font-extrabold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <span>Proceed to Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Quick Checkout Modal Trigger */}
      <QuickCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        scheduledDate={selectedDateObj.isoDate}
        scheduledDateFormatted={selectedDateObj.label}
        mealSlot={slotLabel}
        itemsSummary={selectedItemsBreakdown}
        totalRotis={totalRotis}
        totalAmount={totalAmount}
        onOrderSuccess={(newOrder) => {
          onOrderSuccess(newOrder);
        }}
      />

      {/* Calendar Date Selection Modal */}
      {isCalendarPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#FFFDF9] border border-[#EFE3D3] rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E2D2BD] bg-[#3B170B] text-[#FEF3C7] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#D97706] text-white">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">Select Delivery Date</h3>
                  <p className="text-[11px] text-[#FDE68A]">Pick any date for fresh tawa baked rotis</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCalendarPickerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Date Grid Body */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 bg-[#FAF4EB]">
              
              {/* Native Calendar Picker Input fallback */}
              <div className="bg-white border border-[#DFCBB5] p-3 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                <div>
                  <label className="text-xs font-extrabold text-[#3B170B] block">Custom Specific Date</label>
                  <span className="text-[10px] text-[#8B5E3C]">Choose year & month from system calendar</span>
                </div>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDateObj.isoDate}
                  onChange={(e) => {
                    handleCustomDateSelect(e.target.value);
                    setIsCalendarPickerOpen(false);
                    showToast(`📅 Delivery scheduled for ${e.target.value}`);
                  }}
                  className="bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-2.5 py-1.5 text-xs text-[#2B1408] font-bold focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                />
              </div>

              {/* 30-Day Quick Selection Grid */}
              <div>
                <h4 className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-2">
                  Upcoming 30 Days
                </h4>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {extendedDateOptions.map((opt) => {
                    const isSelected = selectedDateObj.isoDate === opt.isoDate;

                    return (
                      <button
                        key={opt.isoDate}
                        type="button"
                        onClick={() => {
                          handleCustomDateSelect(opt.isoDate);
                          setIsCalendarPickerOpen(false);
                          showToast(`📅 Scheduled for ${opt.displayTitle}`);
                        }}
                        className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-[#3B170B] text-[#FEF3C7] border-[#2B1006] ring-2 ring-[#D97706] shadow-md'
                            : 'bg-white text-[#2B1408] border-[#DFCBB5] hover:border-[#D97706] hover:bg-[#FEF3C7]/50'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-[#8B5E3C] uppercase">{opt.weekdayShort}</span>
                          {opt.relativeLabel && (
                            <span className={`text-[8px] font-extrabold px-1 rounded-sm uppercase ${
                              isSelected ? 'bg-[#D97706] text-white' : 'bg-[#FEF3C7] text-[#78350F]'
                            }`}>
                              {opt.relativeLabel}
                            </span>
                          )}
                        </div>
                        <span className="text-base font-black mt-0.5">{opt.dayNum}</span>
                        <span className="text-[10px] font-semibold text-[#8B5E3C]">{opt.monthShort}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
