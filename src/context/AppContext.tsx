import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { safeSetLocalStorage } from '../utils/imageCompressor';
import { 
  onAuthStateChanged, 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  ConfirmationResult, 
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { 
  ActiveSubscription, 
  DailyMealSchedule, 
  CartItem, 
  Order, 
  DeliveryAddress, 
  RotiType, 
  SubscriptionPlan,
  RegularMenuItem,
  RotiSpreadOption,
  CustomerUser,
  RottiPointsTransaction,
  ItemReview
} from '../types';
import { 
  INITIAL_ACTIVE_SUBSCRIPTION, 
  generateScheduleForSubscription, 
  INITIAL_DELIVERY_ADDRESSES,
  REGULAR_MENU_ITEMS,
  ROTI_VARIANTS,
  ROTTI_POINTS_REWARDS
} from '../data/mockData';
import { INITIAL_ITEM_REVIEWS, getInitialReviewsForItem } from '../data/mockReviews';

interface AppContextType {
  // Time and Cutoff
  simulatedHour: number;
  simulatedMinute: number;
  setSimulatedTime: (hour: number, minute: number) => void;
  resetToRealTime: () => void;
  isRealTime: boolean;
  timeFormatted: string;
  lunchCutoffMinutesLeft: number;
  dinnerCutoffMinutesLeft: number;
  isLunchCutoffPassed: boolean;
  isDinnerCutoffPassed: boolean;

  // Subscription
  activeSubscription: ActiveSubscription | null;
  subscribeToPlan: (plan: SubscriptionPlan, address: DeliveryAddress) => void;
  pauseSubscription: () => void;
  resumeSubscription: () => void;
  cancelSubscription: () => void;
  schedule: DailyMealSchedule[];
  updateScheduleMeal: (
    date: string, 
    mealSlot: 'lunch' | 'dinner', 
    updates: Partial<DailyMealSchedule>
  ) => { success: boolean; message: string };
  skipMealForDate: (
    date: string, 
    mealSlot: 'lunch' | 'dinner'
  ) => { success: boolean; message: string };
  unskipMealForDate: (
    date: string, 
    mealSlot: 'lunch' | 'dinner'
  ) => { success: boolean; message: string };

  // Cart & Orders
  cart: CartItem[];
  addToCart: (item: RegularMenuItem, customGhee?: boolean, customSpread?: RotiSpreadOption) => void;
  updateCartItemSpread: (cartItemId: string, spread: RotiSpreadOption) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Checkout & Orders
  orders: Order[];
  placeRegularOrder: (paymentMethod: Order['paymentMethod']) => Order;
  quickReorderOrder: (targetOrder: Order) => Order;
  activeOrderToTrack: Order | null;
  setActiveOrderToTrack: (order: Order | null) => void;

  // Wallet & User
  walletBalance: number;
  rechargeWallet: (amount: number, bonusCredits: number) => void;
  addresses: DeliveryAddress[];
  selectedAddress: DeliveryAddress;
  setSelectedAddress: (addr: DeliveryAddress) => void;

  // Menu Catalog & Inventory
  menuItems: RegularMenuItem[];
  outOfStockIds: string[];
  stockQuantities: Record<string, number>;
  addProduct: (item: Omit<RegularMenuItem, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<RegularMenuItem>) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;
  updateStockQuantity: (id: string, quantity: number) => void;

  // Reviews & Ratings
  itemReviewsMap: Record<string, ItemReview[]>;
  getItemReviews: (itemId: string) => ItemReview[];
  getItemRatingStats: (itemId: string) => { averageRating: number; totalCount: number };
  addItemReview: (itemId: string, rating: number, comment: string, userName?: string) => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Customer Mobile & OTP Auth
  customerUser: CustomerUser | null;
  isCustomerAuthModalOpen: boolean;
  openCustomerAuthModal: () => void;
  closeCustomerAuthModal: () => void;
  sendCustomerOTP: (phone: string, recaptchaContainerId?: string) => Promise<{ success: boolean; otp?: string; message: string }> | { success: boolean; otp?: string; message: string };
  verifyCustomerOTP: (arg1: string, arg2?: string, arg3?: string) => Promise<{ success: boolean; message: string }> | { success: boolean; message: string };
  logoutCustomer: () => void;

  // Admin Auth
  isAdminLoggedIn: boolean;
  adminUser: { id: string; name: string; role: string } | null;
  loginAdmin: (id: string, pass: string) => { success: boolean; message: string };
  logoutAdmin: () => void;

  // Referral & Free Phulkas
  userReferralCode: string;
  freePhulkasEarned: number;
  referralHistory: { id: string; friendPhone: string; status: 'claimed' | 'pending'; freePhulkas: number; date: string }[];
  isReferralModalOpen: boolean;
  openReferralModal: () => void;
  closeReferralModal: () => void;
  redeemReferralCode: (code: string) => { success: boolean; message: string };

  // RottiPoints Loyalty System
  rottiPoints: number;
  rottiPointsHistory: RottiPointsTransaction[];
  earnRottiPoints: (points: number, description: string) => void;
  redeemRottiPoints: (rewardId: string) => { success: boolean; message: string };
}


const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Simulated or real time (default 09:15 AM so lunch cutoff of 10:30 AM is active and editable!)
  const [simulatedHour, setSimulatedHour] = useState<number>(() => {
    const saved = localStorage.getItem('gt_sim_hour');
    return saved !== null ? parseInt(saved, 10) : 9;
  });
  const [simulatedMinute, setSimulatedMinute] = useState<number>(() => {
    const saved = localStorage.getItem('gt_sim_min');
    return saved !== null ? parseInt(saved, 10) : 15;
  });
  const [isRealTime, setIsRealTime] = useState<boolean>(false);

  // Address
  const [addresses] = useState<DeliveryAddress[]>(INITIAL_DELIVERY_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress>(INITIAL_DELIVERY_ADDRESSES[0]);

  // Wallet balance
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('gt_wallet');
    return saved ? parseInt(saved, 10) : 180;
  });

  // Active subscription
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(() => {
    const saved = localStorage.getItem('gt_active_sub');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVE_SUBSCRIPTION;
  });

  // 7-day schedule
  const [schedule, setSchedule] = useState<DailyMealSchedule[]>(() => {
    const saved = localStorage.getItem('gt_schedule');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return generateScheduleForSubscription(simulatedHour, simulatedMinute);
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gt_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders history
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gt_orders');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 'REG-9421',
        type: 'regular',
        date: 'Today, 08:30 AM',
        items: [
          { name: 'Hot Phulka Basket (Pack of 5)', quantity: 1, price: 55 },
          { name: 'Gharwali Peeli Dal Tadka', quantity: 1, price: 110 }
        ],
        totalAmount: 165,
        discountAmount: 20,
        deliveryFee: 0,
        finalAmount: 145,
        paymentMethod: 'UPI',
        deliveryAddress: INITIAL_DELIVERY_ADDRESSES[0],
        status: 'kneading_and_baking',
        estimatedDeliveryTime: 'in 22 mins',
        liveRiderName: 'Rameshwar Yadav',
        liveRiderPhone: '+91 98210 44321',
        otp: '4821',
      },
      {
        id: 'SUB-3810',
        type: 'subscription_charge',
        date: 'Yesterday, 10:00 AM',
        items: [
          { name: 'Gharwali Phulka Pass (30-Day Subscription)', quantity: 1, price: 2160 }
        ],
        totalAmount: 2160,
        discountAmount: 100,
        deliveryFee: 0,
        finalAmount: 2060,
        paymentMethod: 'UPI',
        deliveryAddress: INITIAL_DELIVERY_ADDRESSES[0],
        status: 'confirmed',
        estimatedDeliveryTime: 'Daily Lunch & Dinner Active',
        liveRiderName: 'Devendra Rawat',
        liveRiderPhone: '+91 97654 11223',
        otp: '9102',
      }
    ];
  });

  // Menu Catalog & Inventory State
  const [menuItems, setMenuItems] = useState<RegularMenuItem[]>(() => {
    const saved = localStorage.getItem('gt_admin_menu_v2') || localStorage.getItem('gt_admin_menu');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as RegularMenuItem[];
        const existingIds = new Set(parsed.map((i) => i.id));
        // Ensure all items in REGULAR_MENU_ITEMS (including new rice & khichdi dishes) are present
        const missing = REGULAR_MENU_ITEMS.filter((item) => !existingIds.has(item.id));
        // Update existing items with latest price/details if matching
        const updated = parsed.map((item) => {
          const fresh = REGULAR_MENU_ITEMS.find((f) => f.id === item.id);
          return fresh
            ? {
                ...fresh,
                ...item,
                price: fresh.price,
                originalPrice: fresh.originalPrice,
                isLimitedTime: item.isLimitedTime !== undefined ? item.isLimitedTime : fresh.isLimitedTime,
                isSeasonal: item.isSeasonal !== undefined ? item.isSeasonal : fresh.isSeasonal,
                seasonalTag: item.seasonalTag || fresh.seasonalTag,
              }
            : item;
        });
        return [...updated, ...missing];
      } catch {
        /* fallback */
      }
    }
    return REGULAR_MENU_ITEMS;
  });

  const [outOfStockIds, setOutOfStockIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('gt_out_of_stock');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return [];
  });

  const [stockQuantities, setStockQuantities] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('gt_stock_qty');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        // Ensure rice and seasonal items have healthy stock
        return {
          makki_sarson_combo: 40,
          bajra_rotla_makhan_2: 45,
          surati_methi_thepla_5: 50,
          jeera_rice_350: 60,
          dal_khichdi_400: 50,
          palak_khichdi_400: 45,
          palak_garlic_khichdi_400: 40,
          steamed_basmati_rice_350: 70,
          vaghareli_khichdi_400: 45,
          veg_pulao_400: 50,
          curd_rice_350: 40,
          ...parsed,
        };
      } catch { /* fallback */ }
    }
    return {
      phulka_5p: 120,
      ghee_phulka_5p: 90,
      multigrain_4p: 60,
      bajra_rotla_2p: 45,
      dal_tadka: 50,
      paneer_bhurji: 35,
      jeera_rice_350: 60,
      dal_khichdi_400: 50,
      palak_khichdi_400: 45,
      palak_garlic_khichdi_400: 40,
      steamed_basmati_rice_350: 70,
      vaghareli_khichdi_400: 45,
      veg_pulao_400: 50,
      curd_rice_350: 40,
    };
  });

  const [activeOrderToTrack, setActiveOrderToTrack] = useState<Order | null>(orders[0] || null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to local storage safely
  useEffect(() => {
    safeSetLocalStorage('gt_admin_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    safeSetLocalStorage('gt_out_of_stock', JSON.stringify(outOfStockIds));
  }, [outOfStockIds]);

  useEffect(() => {
    safeSetLocalStorage('gt_stock_qty', JSON.stringify(stockQuantities));
  }, [stockQuantities]);

  useEffect(() => {
    safeSetLocalStorage('gt_sim_hour', simulatedHour.toString());
    safeSetLocalStorage('gt_sim_min', simulatedMinute.toString());
  }, [simulatedHour, simulatedMinute]);

  useEffect(() => {
    if (activeSubscription) {
      safeSetLocalStorage('gt_active_sub', JSON.stringify(activeSubscription));
    } else {
      try { localStorage.removeItem('gt_active_sub'); } catch {}
    }
  }, [activeSubscription]);

  useEffect(() => {
    safeSetLocalStorage('gt_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    safeSetLocalStorage('gt_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    safeSetLocalStorage('gt_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    safeSetLocalStorage('gt_wallet', walletBalance.toString());
  }, [walletBalance]);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // Time formatting
  const timeFormatted = `${(simulatedHour % 12 || 12).toString().padStart(2, '0')}:${simulatedMinute.toString().padStart(2, '0')} ${simulatedHour >= 12 ? 'PM' : 'AM'}`;

  // Cutoff checks
  // Lunch cutoff: 10:30 AM -> 10 * 60 + 30 = 630 mins
  // Dinner cutoff: 06:30 PM (18:30) -> 18 * 60 + 30 = 1110 mins
  const currentTotalMins = simulatedHour * 60 + simulatedMinute;
  const lunchCutoffMins = 10 * 60 + 30; // 630
  const dinnerCutoffMins = 18 * 60 + 30; // 1110

  const isLunchCutoffPassed = currentTotalMins >= lunchCutoffMins;
  const isDinnerCutoffPassed = currentTotalMins >= dinnerCutoffMins;

  const lunchCutoffMinutesLeft = isLunchCutoffPassed ? 0 : lunchCutoffMins - currentTotalMins;
  const dinnerCutoffMinutesLeft = isDinnerCutoffPassed ? 0 : dinnerCutoffMins - currentTotalMins;

  // Whenever time changes, re-evaluate past cutoff flags for today's meals in schedule
  useEffect(() => {
    setSchedule((prev) => {
      const todayDateStr = new Date().toISOString().split('T')[0];
      return prev.map((item) => {
        if (item.date === todayDateStr) {
          const isPast = item.mealSlot === 'lunch' ? isLunchCutoffPassed : isDinnerCutoffPassed;
          const status = isPast && item.status === 'scheduled' ? 'in_preparation' : item.status;
          return {
            ...item,
            isPastCutoff: isPast,
            status,
          };
        }
        return item;
      });
    });
  }, [isLunchCutoffPassed, isDinnerCutoffPassed]);

  const setSimulatedTime = (hour: number, minute: number) => {
    setIsRealTime(false);
    setSimulatedHour(hour);
    setSimulatedMinute(minute);
    showToast(`Time set to ${(hour % 12 || 12).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`);
  };

  const resetToRealTime = () => {
    const now = new Date();
    setIsRealTime(true);
    setSimulatedHour(now.getHours());
    setSimulatedMinute(now.getMinutes());
    showToast(`Switched to live local clock: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  };

  // Cart operations
  const addToCart = (
    item: RegularMenuItem,
    customGhee: boolean = true,
    customSpread?: RotiSpreadOption
  ) => {
    const isBread = item.category === 'roti_basket' || item.category === 'specialty_bread';
    const effectiveSpread: RotiSpreadOption | undefined = isBread
      ? customSpread || (customGhee ? 'ghee' : 'plain')
      : undefined;

    const cartItemId = `${item.id}-${effectiveSpread || 'standard'}`;
    setCart((prev) => {
      const existing = prev.find((c) => c.id === cartItemId);
      if (existing) {
        return prev.map((c) =>
          c.id === cartItemId ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          category: item.category,
          packSize: item.packSize,
          customization: {
            ghee: effectiveSpread === 'ghee',
            spread: effectiveSpread,
          },
        },
      ];
    });
    showToast(`Added ${item.name} to cart`);
  };

  const updateCartItemSpread = (cartItemId: string, newSpread: RotiSpreadOption) => {
    const spreadLabels: Record<RotiSpreadOption, string> = {
      oil: 'Oil',
      ghee: 'Ghee',
      butter: 'Butter',
      white_butter: 'White butter',
      plain: 'Plain',
    };

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const newId = `${item.itemId}-${newSpread}`;
          return {
            ...item,
            id: newId,
            customization: {
              ...item.customization,
              spread: newSpread,
              ghee: newSpread === 'ghee',
            },
          };
        }
        return item;
      })
    );
    showToast(`Customized to ${spreadLabels[newSpread]}`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Subscribe
  const subscribeToPlan = (plan: SubscriptionPlan, address: DeliveryAddress) => {
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + plan.durationDays);

    const newSub: ActiveSubscription = {
      id: `SUB-${Date.now().toString().slice(-4)}`,
      planName: plan.name,
      startDate: today.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      totalDays: plan.durationDays,
      remainingDays: plan.durationDays,
      skippedDaysCount: 0,
      creditsEarned: 0,
      rotisPerMeal: plan.rotisPerMeal,
      defaultRotiType: plan.defaultRotiType,
      deliverySlot: plan.mealSlot === 'both' ? 'Lunch & Dinner' : plan.mealSlot === 'lunch' ? 'Lunch (12:30 PM)' : 'Dinner (08:00 PM)',
      address,
      status: 'active',
      lunchCutoff: '10:30 AM',
      dinnerCutoff: '06:30 PM',
    };

    setActiveSubscription(newSub);
    const newSchedule = generateScheduleForSubscription(simulatedHour, simulatedMinute);
    setSchedule(newSchedule);

    const subPrice = plan.totalPrice || (plan.pricePerDay * plan.durationDays);
    const newSubOrder: Order = {
      id: newSub.id,
      type: 'subscription_charge',
      date: 'Just now',
      items: [
        {
          name: `${plan.name} (${plan.durationDays}-Day Pass)`,
          quantity: 1,
          price: subPrice,
        }
      ],
      totalAmount: subPrice,
      discountAmount: 0,
      deliveryFee: 0,
      finalAmount: subPrice,
      paymentMethod: 'UPI',
      deliveryAddress: address,
      status: 'confirmed',
      estimatedDeliveryTime: 'Daily Lunch & Dinner Active',
      liveRiderName: 'Devendra Rawat',
      liveRiderPhone: '+91 97654 11223',
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
    };

    // Add bonus credits if plan provides extra subscription bonus
    const extraBonus = plan.extraCreditsBonus || 0;
    if (extraBonus > 0) {
      setWalletBalance((prev) => prev + extraBonus);
    }

    // Award RottiPoints for subscription renewal/activation
    const earnedPts = 150;
    earnRottiPoints(earnedPts, `Subscription Renewal / Pass Activation (${plan.name})`);

    setOrders((prev) => [newSubOrder, ...prev]);
    showToast(`Subscribed to ${plan.name}! Earned +${earnedPts} RottiPoints 👑 ${extraBonus > 0 ? `& +₹${extraBonus} bonus credits!` : ''}`);
  };

  const pauseSubscription = () => {
    if (activeSubscription) {
      setActiveSubscription({ ...activeSubscription, status: 'paused' });
      showToast('Subscription paused.');
    }
  };

  const resumeSubscription = () => {
    if (activeSubscription) {
      setActiveSubscription({ ...activeSubscription, status: 'active' });
      showToast('Subscription resumed.');
    }
  };

  const cancelSubscription = () => {
    setActiveSubscription(null);
    showToast('Subscription cancelled.');
  };

  const updateScheduleMeal = (
    date: string,
    mealSlot: 'lunch' | 'dinner',
    updates: Partial<DailyMealSchedule>
  ) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.date === date && item.mealSlot === mealSlot ? { ...item, ...updates } : item
      )
    );
    showToast('Meal update saved!');
    return { success: true, message: 'Updated' };
  };

  const skipMealForDate = (
    date: string,
    mealSlot: 'lunch' | 'dinner'
  ): { success: boolean; message: string } => {
    const creditAmount = 36;
    setSchedule((prev) =>
      prev.map((item) => {
        if (item.date === date && item.mealSlot === mealSlot) {
          return { ...item, status: 'skipped' };
        }
        return item;
      })
    );
    setWalletBalance((prev) => prev + creditAmount);
    const msg = `Meal skipped before tuning cutoff! ₹${creditAmount} credited back to your wallet.`;
    showToast(msg);
    return { success: true, message: msg };
  };

  const unskipMealForDate = (
    date: string,
    mealSlot: 'lunch' | 'dinner'
  ): { success: boolean; message: string } => {
    const todayDateStr = new Date().toISOString().split('T')[0];
    const isToday = date === todayDateStr;
    if (isToday) {
      if (mealSlot === 'lunch' && isLunchCutoffPassed) {
        const msg = 'Cannot reactivate: Lunch cutoff (10:30 AM) passed.';
        showToast(msg);
        return { success: false, message: msg };
      }
      if (mealSlot === 'dinner' && isDinnerCutoffPassed) {
        const msg = 'Cannot reactivate: Dinner cutoff (06:30 PM) passed.';
        showToast(msg);
        return { success: false, message: msg };
      }
    }

    const creditAmount = 36;
    setWalletBalance((prev) => Math.max(0, prev - creditAmount));
    setSchedule((prev) =>
      prev.map((item) => {
        if (item.date === date && item.mealSlot === mealSlot) {
          return { ...item, status: 'scheduled' };
        }
        return item;
      })
    );
    const msg = `Meal restored for ${mealSlot}. Kitchen scheduled!`;
    showToast(msg);
    return { success: true, message: msg };
  };

  // Place Regular Order
  const placeRegularOrder = (paymentMethod: Order['paymentMethod']): Order => {
    const deliveryFee = cartTotal >= 300 || cartTotal === 0 ? 0 : 50;
    const walletDeduction = Math.min(walletBalance, cartTotal);
    const finalAmount = Math.max(0, cartTotal + deliveryFee - walletDeduction);

    if (walletDeduction > 0) {
      setWalletBalance((prev) => Math.max(0, prev - walletDeduction));
    }

    const newOrder: Order = {
      id: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'regular',
      date: 'Just now',
      items: cart.map((c) => ({
        name: c.customization?.spread && c.customization.spread !== 'plain' ? `${c.name} (${c.customization.spread.toUpperCase()})` : c.name,
        quantity: c.quantity,
        price: c.price,
      })),
      totalAmount: cartTotal,
      discountAmount: walletDeduction,
      deliveryFee,
      finalAmount,
      paymentMethod,
      deliveryAddress: selectedAddress,
      status: 'kneading_and_baking',
      estimatedDeliveryTime: 'in 28-35 mins',
      liveRiderName: 'Devendra Rawat',
      liveRiderPhone: '+91 97654 11223',
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderToTrack(newOrder);
    clearCart();
    showToast(`Order placed successfully! Fresh rotis entering the tawa.`);
    return newOrder;
  };

  const quickReorderOrder = (targetOrder: Order): Order => {
    const isSub = targetOrder.id.startsWith('SUB') || targetOrder.type === 'subscription_charge';
    const newOrderId = isSub
      ? `SUB-REORDER-${Math.floor(1000 + Math.random() * 9000)}`
      : `REG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      ...targetOrder,
      id: newOrderId,
      date: 'Just now',
      status: 'kneading_and_baking',
      estimatedDeliveryTime: 'in 28-35 mins',
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderToTrack(newOrder);
    showToast(`Quick reorder placed! ${newOrder.items.map((i) => i.name).join(', ')}`);
    return newOrder;
  };

  const rechargeWallet = (amount: number, bonusCredits: number) => {
    const totalAdded = amount + bonusCredits;
    setWalletBalance((prev) => prev + totalAdded);

    const earnedPts = Math.max(10, Math.round(amount / 10));
    earnRottiPoints(earnedPts, `Wallet Recharge Benefit (₹${amount})`);

    showToast(`₹${amount} recharged! Got ₹${totalAdded} total credits & +${earnedPts} RottiPoints 👑`);
  };



































































  // Admin Auth State & Methods
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('gt_admin_auth') === 'true';
  });

  const [adminUser, setAdminUser] = useState<{ id: string; name: string; role: string } | null>(() => {
    const saved = localStorage.getItem('gt_admin_user');
    return saved ? JSON.parse(saved) : (localStorage.getItem('gt_admin_auth') === 'true' ? { id: 'admin', name: 'Master Operations Admin', role: 'Kitchen Operations Director' } : null);
  });

  const loginAdmin = (id: string, pass: string): { success: boolean; message: string } => {
    const trimmedId = id.trim();
    const trimmedPass = pass.trim();

    if (!trimmedId) {
      return { success: false, message: 'Please enter an Admin ID.' };
    }
    if (!trimmedPass) {
      return { success: false, message: 'Please enter an Admin Password.' };
    }

    const validIds = ['admin', 'kitchen_admin', 'rotii_admin', 'master', 'manager', 'owner'];
    const validPasses = ['admin123', 'rotii2026', 'admin', 'kitchen123', 'pass123', 'rotii123'];

    const isIdOk = validIds.includes(trimmedId.toLowerCase()) || trimmedId.length >= 3;
    const isPassOk = validPasses.includes(trimmedPass.toLowerCase()) || trimmedPass === 'admin123' || trimmedPass === 'rotii2026' || trimmedPass === 'admin';

    if (isIdOk && isPassOk) {
      const user = {
        id: trimmedId,
        name: trimmedId.toLowerCase() === 'admin' ? 'Master Operations Admin' : `${trimmedId} (Kitchen Staff)`,
        role: 'Kitchen Operations Director'
      };
      setIsAdminLoggedIn(true);
      setAdminUser(user);
      localStorage.setItem('gt_admin_auth', 'true');
      localStorage.setItem('gt_admin_user', JSON.stringify(user));
      showToast(`Welcome back, ${user.name}! Admin portal unlocked.`);
      return { success: true, message: 'Admin authentication successful.' };
    } else {
      return { success: false, message: 'Invalid Admin ID or Password. Default Admin ID: admin | Password: admin123' };
    }
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem('gt_admin_auth');
    localStorage.removeItem('gt_admin_user');
    showToast('Admin logged out. Switched back to Customer Site.');
  };

  // Inventory & Catalog CRUD Handlers
  const addProduct = (itemData: Omit<RegularMenuItem, 'id'>) => {
    const newItem: RegularMenuItem = {
      ...itemData,
      id: `item_${Date.now()}`,
    };
    setMenuItems((prev) => [...prev, newItem]);
    showToast(`Added new item "${newItem.name}" to store catalog.`);
  };

  const updateProduct = (id: string, updates: Partial<RegularMenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast('Updated item details.');
  };

  const deleteProduct = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    setOutOfStockIds((prev) => prev.filter((item) => item !== id));
    showToast('Deleted item from catalog.');
  };

  const toggleStock = (id: string) => {
    setOutOfStockIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    showToast('Updated stock availability status.');
  };

  const updateStockQuantity = (id: string, quantity: number) => {
    const validQty = Math.max(0, quantity);
    setStockQuantities((prev) => ({
      ...prev,
      [id]: validQty,
    }));
    if (validQty === 0) {
      setOutOfStockIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    } else {
      setOutOfStockIds((prev) => prev.filter((item) => item !== id));
    }
    showToast(`Updated stock count to ${validQty}`);
  };

  // Item Reviews & Ratings State
  const [itemReviewsMap, setItemReviewsMap] = useState<Record<string, ItemReview[]>>(() => {
    const saved = localStorage.getItem('rotti_item_reviews_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return INITIAL_ITEM_REVIEWS;
  });

  const getItemReviews = (itemId: string): ItemReview[] => {
    return itemReviewsMap[itemId] || getInitialReviewsForItem(itemId);
  };

  const getItemRatingStats = (itemId: string): { averageRating: number; totalCount: number } => {
    const revs = getItemReviews(itemId);
    if (!revs || revs.length === 0) {
      return { averageRating: 4.8, totalCount: 12 };
    }
    const sum = revs.reduce((acc, r) => acc + r.rating, 0);
    const avg = Math.round((sum / revs.length) * 10) / 10;
    return { averageRating: avg, totalCount: revs.length };
  };

  const addItemReview = (itemId: string, rating: number, comment: string, userName?: string) => {
    const name = userName?.trim() || customerUser?.name || 'Happy Foodie';
    const newReview: ItemReview = {
      id: 'rev_' + Date.now(),
      itemId,
      userName: name,
      rating: Math.min(5, Math.max(1, rating)),
      comment,
      date: 'Just now',
      verifiedBuyer: true,
    };

    setItemReviewsMap((prev) => {
      const existing = prev[itemId] || getInitialReviewsForItem(itemId);
      const updated = [newReview, ...existing];
      const nextMap = { ...prev, [itemId]: updated };
      safeSetLocalStorage('rotti_item_reviews_v1', JSON.stringify(nextMap));
      return nextMap;
    });

    showToast(`⭐ Thank you for your review!`);
  };

  // Customer Mobile & OTP Authentication Logic (Firebase Auth + Firestore Sync + Demo Fallback)
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem('gt_customer_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isCustomerAuthModalOpen, setIsCustomerAuthModalOpen] = useState<boolean>(false);
  const [generatedOtp, setGeneratedOtp] = useState<{ phone: string; code: string }>({ phone: '', code: '' });

  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (customerUser) {
      localStorage.setItem('gt_customer_user', JSON.stringify(customerUser));
    } else {
      localStorage.removeItem('gt_customer_user');
    }
  }, [customerUser]);

  // Firebase Auth Observer to keep Firestore user profile synced
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnapshot = await getDoc(userDocRef);

          let userData: CustomerUser;

          if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            userData = {
              id: firebaseUser.uid,
              phone: firebaseUser.phoneNumber || data.phone || '',
              name: data.name || firebaseUser.displayName || 'RotiiBox Member',
              email: firebaseUser.email || data.email || undefined,
              createdAt: data.createdAt ? (data.createdAt.seconds ? new Date(data.createdAt.seconds * 1000).toISOString() : new Date(data.createdAt).toISOString()) : new Date().toISOString(),
              savedAddresses: data.savedAddresses || [],
              isLoggedIn: true,
            };
          } else {
            const newUserDoc = {
              id: firebaseUser.uid,
              phone: firebaseUser.phoneNumber || '',
              name: firebaseUser.displayName || 'RotiiBox Member',
              createdAt: serverTimestamp(),
              savedAddresses: [],
            };
            await setDoc(userDocRef, newUserDoc);
            userData = {
              id: firebaseUser.uid,
              phone: firebaseUser.phoneNumber || '',
              name: firebaseUser.displayName || 'RotiiBox Member',
              createdAt: new Date().toISOString(),
              savedAddresses: [],
              isLoggedIn: true,
            };
          }
          setCustomerUser(userData);
        } catch (err) {
          console.error('Error syncing Firestore user profile:', err);
          setCustomerUser({
            id: firebaseUser.uid,
            phone: firebaseUser.phoneNumber || '',
            name: firebaseUser.displayName || 'RotiiBox Member',
            createdAt: new Date().toISOString(),
            isLoggedIn: true,
          });
        }
      } else {
        setCustomerUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const openCustomerAuthModal = () => setIsCustomerAuthModalOpen(true);
  const closeCustomerAuthModal = () => setIsCustomerAuthModalOpen(false);

  const sendCustomerOTP = async (phone: string, recaptchaContainerId: string = 'recaptcha-container') => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number' };
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+91${cleanPhone.slice(-10)}`;

    if (isFirebaseConfigured && auth) {
      try {
        if (recaptchaVerifierRef.current) {
          try {
            recaptchaVerifierRef.current.clear();
          } catch (e) {
            console.warn('Error clearing recaptcha verifier:', e);
          }
          recaptchaVerifierRef.current = null;
        }

        const appVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
          size: 'invisible',
          callback: () => {},
          'expired-callback': () => {
            showToast('reCAPTCHA expired. Please try sending OTP again.');
          }
        });
        recaptchaVerifierRef.current = appVerifier;

        const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        confirmationResultRef.current = confirmationResult;

        showToast(`📱 Verification OTP code sent to ${formattedPhone}`);
        return { success: true, message: `OTP sent to ${formattedPhone}` };
      } catch (error: any) {
        console.warn('Firebase signInWithPhoneNumber failed, using Demo Fallback:', error);
        let errorMsg = 'Failed to send OTP code via Firebase.';
        if (error.code === 'auth/invalid-phone-number') {
          errorMsg = 'Invalid phone number format.';
        } else if (error.code === 'auth/too-many-requests') {
          errorMsg = 'Too many requests. Please try demo OTP 1234.';
        } else if (error.code === 'auth/quota-exceeded') {
          errorMsg = 'SMS quota exceeded. Please try demo OTP 1234.';
        }

        setGeneratedOtp({ phone: cleanPhone, code: '1234' });
        showToast(`⚠️ ${errorMsg} Fallback Demo OTP: 1234`);
        return { 
          success: true, 
          otp: '1234', 
          message: `Demo OTP sent to ${formattedPhone} (Demo code: 1234)` 
        };
      }
    } else {
      setGeneratedOtp({ phone: cleanPhone, code: '1234' });
      showToast(`📱 Demo Mode: OTP sent to ${formattedPhone}. Code: 1234`);
      return { success: true, otp: '1234', message: `Demo OTP sent to ${formattedPhone}` };
    }
  };

  const verifyCustomerOTP = async (arg1: string, arg2?: string, arg3?: string) => {
    let phone = '';
    let otpCode = '';
    let name = '';

    if (arg1.length >= 10 && arg2) {
      phone = arg1.replace(/\D/g, '');
      otpCode = arg2;
      name = arg3 || '';
    } else {
      otpCode = arg1;
      name = arg2 || '';
    }

    if (confirmationResultRef.current && otpCode) {
      try {
        const userCredential = await confirmationResultRef.current.confirm(otpCode);
        const fbUser = userCredential.user;

        if (name && fbUser) {
          try {
            await updateProfile(fbUser, { displayName: name });
            const userDocRef = doc(db, 'users', fbUser.uid);
            await setDoc(userDocRef, { name }, { merge: true });
          } catch (e) {
            console.warn('Error updating profile name in Firebase:', e);
          }
        }

        confirmationResultRef.current = null;

        const user: CustomerUser = {
          id: fbUser.uid,
          phone: fbUser.phoneNumber || `+91 ${phone}`,
          name: name || fbUser.displayName || 'RotiiBox Member',
          createdAt: new Date().toISOString(),
          isLoggedIn: true,
        };
        setCustomerUser(user);
        showToast(`🎉 Welcome ${user.name}! Logged in successfully.`);
        return { success: true, message: 'Login successful' };
      } catch (error: any) {
        console.warn('Firebase confirmation error:', error);
        let errorMsg = 'Invalid verification code.';
        if (error.code === 'auth/invalid-verification-code') {
          errorMsg = 'Invalid OTP verification code. Please check and try again.';
        } else if (error.code === 'auth/code-expired') {
          errorMsg = 'OTP code expired. Please request a new code.';
        }

        if (otpCode === '1234') {
          const cleanPhone = phone || '9876543210';
          const user: CustomerUser = {
            id: `CUST-${cleanPhone.slice(-4)}`,
            phone: `+91 ${cleanPhone}`,
            name: name || customerUser?.name || 'RotiiBox Member',
            createdAt: new Date().toISOString(),
            isLoggedIn: true,
          };
          setCustomerUser(user);
          showToast(`🎉 Welcome ${user.name}! (Demo Mode)`);
          return { success: true, message: 'Login successful (Demo Mode)' };
        }

        return { success: false, message: errorMsg };
      }
    }

    // Demo Mode logic if no active Firebase session
    const cleanPhone = phone || generatedOtp.phone || '9876543210';
    if (otpCode !== '1234' && (generatedOtp.phone !== cleanPhone || generatedOtp.code !== otpCode)) {
      return { success: false, message: 'Invalid OTP. Please enter demo OTP: 1234' };
    }

    const user: CustomerUser = {
      id: `CUST-${cleanPhone.slice(-4)}`,
      phone: `+91 ${cleanPhone}`,
      name: name || customerUser?.name || 'RotiiBox Member',
      createdAt: new Date().toISOString(),
      isLoggedIn: true,
    };

    setCustomerUser(user);
    showToast(`🎉 Welcome ${user.name}! Logged in as ${user.phone}`);
    return { success: true, message: 'Login successful' };
  };

  const logoutCustomer = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Error signing out of Firebase:', e);
      }
    }
    setCustomerUser(null);
    showToast('Logged out of account');
  };

  // Referral State & Methods
  const [userReferralCode] = useState<string>(() => {
    const saved = localStorage.getItem('gt_ref_code');
    if (saved) return saved;
    const newCode = `ROTTI-5FREE-${Math.floor(1000 + Math.random() * 9000)}`;
    safeSetLocalStorage('gt_ref_code', newCode);
    return newCode;
  });

  const [freePhulkasEarned, setFreePhulkasEarned] = useState<number>(() => {
    const saved = localStorage.getItem('gt_free_phulkas');
    return saved ? parseInt(saved, 10) : 5;
  });

  const [referralHistory, setReferralHistory] = useState<Array<{ id: string; friendPhone: string; status: 'claimed' | 'pending'; freePhulkas: number; date: string }>>(() => {
    const saved = localStorage.getItem('gt_ref_history');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'ref-1', friendPhone: '+91 98210 55432', status: 'claimed', freePhulkas: 5, date: 'Yesterday' },
      { id: 'ref-2', friendPhone: '+91 97654 11890', status: 'pending', freePhulkas: 5, date: '3 days ago' },
    ];
  });

  const [isReferralModalOpen, setIsReferralModalOpen] = useState<boolean>(false);

  const openReferralModal = () => setIsReferralModalOpen(true);
  const closeReferralModal = () => setIsReferralModalOpen(false);

  useEffect(() => {
    safeSetLocalStorage('gt_free_phulkas', freePhulkasEarned.toString());
  }, [freePhulkasEarned]);

  useEffect(() => {
    safeSetLocalStorage('gt_ref_history', JSON.stringify(referralHistory));
  }, [referralHistory]);

  const redeemReferralCode = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a referral code.' };
    }
    if (cleanCode === userReferralCode) {
      return { success: false, message: 'You cannot redeem your own referral code!' };
    }

    // Reward +5 Free Plain Phulkas
    setFreePhulkasEarned((prev) => prev + 5);

    // Add extra bonus item to upcoming scheduled meal in daily subscription schedule
    setSchedule((prev) => {
      let updated = false;
      return prev.map((meal) => {
        if (!updated && meal.status === 'scheduled') {
          updated = true;
          const existingExtras = meal.extraItems || [];
          return {
            ...meal,
            extraItems: [
              ...existingExtras,
              {
                id: `ref-phulka-${Date.now()}`,
                itemId: 'phulka_5p',
                name: '🎁 Referral Bonus: 5 Free Plain Phulkas',
                packSize: '5 Pcs',
                price: 0,
                quantity: 1,
              },
            ],
            specialInstructions: meal.specialInstructions 
              ? `${meal.specialInstructions} · +5 Free Plain Phulkas Added (Referral Bonus)`
              : '+5 Free Plain Phulkas Added (Referral Bonus)',
          };
        }
        return meal;
      });
    });

    const newHistoryItem = {
      id: `ref-${Date.now()}`,
      friendPhone: `Friend Code (${cleanCode})`,
      status: 'claimed' as const,
      freePhulkas: 5,
      date: 'Just now',
    };
    setReferralHistory((prev) => [newHistoryItem, ...prev]);

    const msg = `🎉 Referral Code ${cleanCode} Redeemed! 5 Free Plain Phulkas added to your next daily subscription delivery!`;
    showToast(msg);
    return { success: true, message: msg };
  };

  // RottiPoints Loyalty System State & Logic
  const [rottiPoints, setRottiPoints] = useState<number>(() => {
    const saved = localStorage.getItem('gt_rotti_points');
    return saved ? Number(saved) : 250; // Default 250 RottiPoints balance for immediate redemption!
  });

  const [rottiPointsHistory, setRottiPointsHistory] = useState<RottiPointsTransaction[]>(() => {
    const saved = localStorage.getItem('gt_rotti_history');
    return saved ? JSON.parse(saved) : [
      {
        id: 'rpt_1',
        type: 'earned',
        points: 150,
        description: 'Subscription Pass Renewal Bonus (Daily Dual Plan)',
        date: '10 Oct 2026',
      },
      {
        id: 'rpt_2',
        type: 'earned',
        points: 100,
        description: 'Wallet Recharge Loyalty Bonus',
        date: '05 Oct 2026',
      }
    ];
  });

  useEffect(() => {
    safeSetLocalStorage('gt_rotti_points', rottiPoints.toString());
  }, [rottiPoints]);

  useEffect(() => {
    safeSetLocalStorage('gt_rotti_history', JSON.stringify(rottiPointsHistory));
  }, [rottiPointsHistory]);

  const earnRottiPoints = (points: number, description: string) => {
    if (points <= 0) return;
    setRottiPoints((prev) => prev + points);
    const newTx: RottiPointsTransaction = {
      id: `rpt_${Date.now()}`,
      type: 'earned',
      points,
      description,
      date: 'Just now',
    };
    setRottiPointsHistory((prev) => [newTx, ...prev]);
  };

  const redeemRottiPoints = (rewardId: string): { success: boolean; message: string } => {
    const reward = ROTTI_POINTS_REWARDS.find((r) => r.id === rewardId);
    if (!reward) {
      return { success: false, message: 'Reward option not found.' };
    }

    if (rottiPoints < reward.pointsRequired) {
      const needed = reward.pointsRequired - rottiPoints;
      const msg = `Need ${needed} more RottiPoints to redeem ${reward.title}.`;
      showToast(msg);
      return { success: false, message: msg };
    }

    // Deduct points
    setRottiPoints((prev) => prev - reward.pointsRequired);

    // Apply wallet credit for free rotis/subscription benefit
    if (reward.walletCreditBonus > 0) {
      setWalletBalance((prev) => prev + reward.walletCreditBonus);
    }

    // Attach bonus item to schedule if reward is for free phulkas
    if (reward.id === 'reward_5_phulkas' || reward.id === 'reward_10_ghee_phulkas') {
      const count = reward.id === 'reward_5_phulkas' ? 5 : 10;
      const title = reward.id === 'reward_5_phulkas' ? '5 Free Plain Phulkas' : '10 Free Organic Ghee Phulkas';
      setSchedule((prev) => {
        let updated = false;
        return prev.map((meal) => {
          if (!updated && meal.status === 'scheduled') {
            updated = true;
            const existing = meal.extraItems || [];
            return {
              ...meal,
              extraItems: [
                ...existing,
                {
                  id: `points-${reward.id}-${Date.now()}`,
                  itemId: 'phulka_reward',
                  name: `🎁 RottiPoints Reward: ${title}`,
                  packSize: `${count} Pcs`,
                  price: 0,
                  quantity: 1,
                }
              ]
            };
          }
          return meal;
        });
      });
    }

    const newTx: RottiPointsTransaction = {
      id: `rpt_${Date.now()}`,
      type: 'redeemed',
      points: reward.pointsRequired,
      description: `Redeemed ${reward.title}`,
      date: 'Just now',
    };
    setRottiPointsHistory((prev) => [newTx, ...prev]);

    const msg = `🎉 Redeemed ${reward.pointsRequired} RottiPoints for ${reward.title}! Added ₹${reward.walletCreditBonus} credits for free rotis/subscription!`;
    showToast(msg);
    return { success: true, message: msg };
  };

  return (
    <AppContext.Provider
      value={{
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
        activeSubscription,
        subscribeToPlan,
        pauseSubscription,
        resumeSubscription,
        cancelSubscription,
        schedule,
        updateScheduleMeal,
        skipMealForDate,
        unskipMealForDate,
        cart,
        addToCart,
        updateCartItemSpread,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        orders,
        placeRegularOrder,
        quickReorderOrder,
        activeOrderToTrack,
        setActiveOrderToTrack,
        walletBalance,
        rechargeWallet,
        addresses,
        selectedAddress,
        setSelectedAddress,
        menuItems,
        outOfStockIds,
        stockQuantities,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        updateStockQuantity,
        toastMessage,
        customerUser,
        isCustomerAuthModalOpen,
        openCustomerAuthModal,
        closeCustomerAuthModal,
        sendCustomerOTP,
        verifyCustomerOTP,
        logoutCustomer,
        isAdminLoggedIn,
        adminUser,
        loginAdmin,
        logoutAdmin,
        showToast,
        userReferralCode,
        freePhulkasEarned,
        referralHistory,
        isReferralModalOpen,
        openReferralModal,
        closeReferralModal,
        redeemReferralCode,
        rottiPoints,
        rottiPointsHistory,
        earnRottiPoints,
        redeemRottiPoints,
        itemReviewsMap,
        getItemReviews,
        getItemRatingStats,
        addItemReview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
