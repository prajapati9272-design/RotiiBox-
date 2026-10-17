export type RotiType = 
  | 'phulka_wheat' 
  | 'ghee_phulka' 
  | 'multigrain' 
  | 'bajra_bhakri' 
  | 'jowar_bhakri' 
  | 'methi_thepla';

export type MealSlot = 'lunch' | 'dinner' | 'both';

export interface RotiVariant {
  id: RotiType;
  name: string;
  hindiName: string;
  description: string;
  flourComposition: string;
  caloriesPerPiece: number;
  pricePerPiece: number;
  badge?: string;
  gheeOption: boolean;
  isGlutenFree?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tagline: string;
  rotisPerMeal: number;
  mealSlot: MealSlot;
  defaultRotiType: RotiType;
  durationDays: number; // e.g. 7, 15, 30
  pricePerDay: number;
  totalPrice: number;
  originalPrice: number;
  savingsPercentage: number;
  rotiUnitPrice: number; // e.g., ₹8 per chapati vs ₹10 regular
  totalRotisCount: number; // e.g., 240 chapatis total
  extraCreditsBonus: number; // e.g., ₹300 bonus credits on subscription activation/recharge
  features: string[];
  recommended?: boolean;
}

export interface RechargePackage {
  id: string;
  amount: number;
  extraCredits: number;
  totalBenefit: number;
  bonusPercent: number;
  tagline: string;
  popular?: boolean;
}

export interface ScheduleExtraItem {
  id: string;
  itemId: string;
  name: string;
  packSize: string;
  price: number;
  quantity: number;
}

export interface DailyMealSchedule {
  date: string; // YYYY-MM-DD
  dayLabel: string; // "Monday", "Tuesday", etc.
  formattedDate: string; // "14 Oct"
  mealSlot: 'lunch' | 'dinner';
  rotiCount: number;
  rotiType: RotiType;
  gheeApplied: boolean;
  spreadOption?: RotiSpreadOption;
  deliveryTimeSlot: string; // e.g., "12:30 PM - 01:00 PM"
  status: 'scheduled' | 'in_preparation' | 'out_for_delivery' | 'delivered' | 'skipped' | 'cancelled';
  cutoffTime: string; // "10:30 AM" or "06:30 PM"
  isPastCutoff: boolean;
  specialInstructions?: string;
  extraItems?: ScheduleExtraItem[];
}

export interface ActiveSubscription {
  id: string;
  planName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  remainingDays: number;
  skippedDaysCount: number;
  creditsEarned: number;
  rotisPerMeal: number;
  defaultRotiType: RotiType;
  deliverySlot: string;
  address: DeliveryAddress;
  status: 'active' | 'paused' | 'completed';
  lunchCutoff: string; // "10:30 AM"
  dinnerCutoff: string; // "06:30 PM"
}

export interface NutritionalInfo {
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fats: number;    // in grams
  fiber: number;   // in grams
  servingSize?: string;
  perRotiCalories?: number;
  perRotiProtein?: number;
  perRotiCarbs?: number;
  perRotiFats?: number;
  perRotiFiber?: number;
  glycemicIndex?: 'Low (< 55)' | 'Medium (56-69)' | 'Standard';
  ironMg?: number;
}

export interface ItemReview {
  id: string;
  itemId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string; // e.g. "14 Oct 2026"
  verifiedBuyer?: boolean;
}

export interface RegularMenuItem {
  id: string;
  name: string;
  category: 'roti_basket' | 'specialty_bread' | 'phulkas' | 'parathas' | 'theplas' | 'rotlas' | 'homestyle_sabzi' | 'dal_accompaniment' | 'combo_box' | 'rice_khichdi';
  subCategory?: string;
  description: string;
  packSize: string; // e.g., "5 Pcs", "300ml container"
  price: number;
  originalPrice: number;
  discountPercent: number;
  vegType: 'pure_veg' | 'jain_available';
  serves: string;
  preparationTimeMins: number;
  calories: number;
  ingredients: string;
  popular?: boolean;
  canSubscribe: boolean;
  badgeText?: string;
  isLimitedTime?: boolean;
  isSeasonal?: boolean;
  seasonalTag?: string;
  visualTone?: string;
  imageUrl?: string;
  nutritionalInfo?: NutritionalInfo;
  addOns?: { name: string; price: number }[];
  rating?: number;
  reviewCount?: number;
  reviews?: ItemReview[];
}

export interface CustomSubscriptionSchedule {
  itemId: string;
  frequency: 'daily' | 'alternate' | 'weekdays' | 'custom';
  selectedDays?: string[]; // ['Mon', 'Wed', 'Fri']
  mealSlot: 'lunch' | 'dinner' | 'both';
  quantityPerDay: number;
  startDate: string;
}

export type RotiSpreadOption = 'oil' | 'ghee' | 'butter' | 'white_butter' | 'plain';

export interface CartItem {
  id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  packSize: string;
  customization?: {
    ghee?: boolean;
    rotiType?: string;
    spread?: RotiSpreadOption;
  };
}

export interface DeliveryAddress {
  id: string;
  label: 'Home' | 'Office' | 'Other';
  recipientName: string;
  phone: string;
  houseFlat: string;
  streetArea: string;
  city: string;
  pincode: string;
  deliveryNotes?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  variant?: string;
  price: number;
}

export interface Order {
  id: string;
  orderId?: string;
  type?: 'regular' | 'subscription_charge' | 'scheduled';
  date: string;
  scheduledDate?: string;
  mealSlot?: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  totalRotis?: number;
  totalAmount: number;
  discountAmount: number;
  deliveryFee: number;
  finalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'COD' | 'Wallet';
  deliveryAddress: DeliveryAddress | string;
  status: 'Scheduled' | 'In Baking' | 'confirmed' | 'kneading_and_baking' | 'thermal_packed' | 'out_for_delivery' | 'delivered';
  createdAt?: any;
  estimatedDeliveryTime?: string;
  liveRiderName?: string;
  liveRiderPhone?: string;
  otp?: string;
}

export interface CustomerUser {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  createdAt: string;
  savedAddresses?: DeliveryAddress[];
  isLoggedIn: boolean;
}

export interface RottiPointsReward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  rewardValue: string;
  walletCreditBonus: number;
  badge?: string;
}

export interface RottiPointsTransaction {
  id: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  date: string;
}

