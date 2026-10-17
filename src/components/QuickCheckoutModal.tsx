import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  User, 
  Phone, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Calendar, 
  Clock, 
  Flame, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

interface QuickCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduledDate: string;
  scheduledDateFormatted: string;
  mealSlot: string;
  itemsSummary: { name: string; quantity: number; variant?: string; price: number }[];
  totalRotis: number;
  totalAmount: number;
  onOrderSuccess: (newOrder: Order) => void;
}

export const QuickCheckoutModal: React.FC<QuickCheckoutModalProps> = ({
  isOpen,
  onClose,
  scheduledDate,
  scheduledDateFormatted,
  mealSlot,
  itemsSummary,
  totalRotis,
  totalAmount,
  onOrderSuccess,
}) => {
  const { 
    customerUser, 
    selectedAddress, 
    placeScheduledOrder, 
    showToast 
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [houseFlat, setHouseFlat] = useState('');
  const [streetArea, setStreetArea] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('400076');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-populate from logged-in customer profile or default address
  useEffect(() => {
    if (customerUser) {
      if (customerUser.name) setCustomerName(customerUser.name);
      if (customerUser.phone) setCustomerPhone(customerUser.phone);
    } else {
      setCustomerName('Aarav Sharma');
      setCustomerPhone('+91 98765 43210');
    }

    if (selectedAddress) {
      setHouseFlat(selectedAddress.houseFlat || 'Flat 402, Nilgiri Heights');
      setStreetArea(selectedAddress.streetArea || 'Sector 14, Hiranandani Estate, Powai');
      setCity(selectedAddress.city || 'Mumbai');
      setPincode(selectedAddress.pincode || '400076');
    } else {
      setHouseFlat('Flat 402, Nilgiri Heights');
      setStreetArea('Sector 14, Hiranandani Estate, Powai');
      setCity('Mumbai');
      setPincode('400076');
    }
  }, [customerUser, selectedAddress, isOpen]);

  if (!isOpen) return null;

  const fullDeliveryAddress = `${houseFlat}, ${streetArea}, ${city} - ${pincode}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showToast('Please enter your full name');
      return;
    }
    if (!customerPhone.trim()) {
      showToast('Please enter your mobile phone number');
      return;
    }
    if (!houseFlat.trim() || !streetArea.trim()) {
      showToast('Please enter complete delivery address');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderObj = await placeScheduledOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: fullDeliveryAddress,
        scheduledDate,
        mealSlot,
        items: itemsSummary,
        totalRotis,
        totalAmount,
        paymentMethod,
      });

      setIsSubmitting(false);
      onClose();
      onOrderSuccess(orderObj);
    } catch (err) {
      setIsSubmitting(false);
      showToast('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FFFDF9] border border-[#EFE3D3] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#3B170B] text-[#FEF3C7] px-5 py-4 flex items-center justify-between border-b border-[#5C2712] rounded-t-3xl shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center">
              <Flame className="w-4.5 h-4.5 text-[#F59E0B]" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-white leading-tight">Confirm & Schedule Order</h2>
              <p className="text-[11px] text-[#FDE68A]">RotiiBox Fresh Tawa Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Schedule Summary Card */}
        <div className="p-4 sm:p-5 space-y-4">
          
          <div className="bg-[#FAF4EB] border border-[#DFCBB5] rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs border-b border-[#E2D2BD] pb-2">
              <div className="flex items-center gap-1.5 font-bold text-[#3B170B]">
                <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{scheduledDateFormatted}</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-[#78350F]">
                <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{mealSlot}</span>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-1.5 pt-0.5">
              {itemsSummary.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-[#2B1408]">
                  <span>
                    <span className="font-bold text-[#3B170B]">{item.quantity}x</span> {item.name}
                    {item.variant ? <span className="text-[10px] text-[#8B5E3C] ml-1">({item.variant})</span> : null}
                  </span>
                  <span className="font-mono-numbers font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E2D2BD] pt-2 flex items-center justify-between text-xs font-bold text-[#3B170B]">
              <span>Total Rotis: <span className="text-[#D97706] font-mono-numbers">{totalRotis} Pcs</span></span>
              <span className="text-sm font-mono-numbers text-[#2B1006]">To Pay: ₹{totalAmount}</span>
            </div>
          </div>

          {/* Form inputs */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Customer Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#2B1408] mb-1">
                  Full Name <span className="text-amber-800">*</span>
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-[#8B5E3C] absolute left-3" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2B1408] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B1408] mb-1">
                  Mobile Number <span className="text-amber-800">*</span>
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-[#8B5E3C] absolute left-3" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2B1408] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-bold text-[#2B1408] mb-1">
                Delivery Address <span className="text-amber-800">*</span>
              </label>
              <div className="space-y-2">
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-[#8B5E3C] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={houseFlat}
                    onChange={(e) => setHouseFlat(e.target.value)}
                    placeholder="Flat / House No., Building Name"
                    className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2B1408] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                  />
                </div>
                <input
                  type="text"
                  required
                  value={streetArea}
                  onChange={(e) => setStreetArea(e.target.value)}
                  placeholder="Street, Landmark, Area / Sector"
                  className="w-full bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs text-[#2B1408] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs text-[#2B1408] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                  />
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Pincode"
                    className="bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs text-[#2B1408] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-xs font-bold text-[#2B1408] mb-1.5">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'bg-[#FEF3C7] border-[#D97706] text-[#3B170B] shadow-xs'
                      : 'bg-[#FAF4EB] border-[#DFCBB5] text-[#8B5E3C] hover:border-[#D97706]'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#D97706]" />
                  <div>
                    <div className="text-xs font-bold">Instant UPI</div>
                    <div className="text-[10px] text-[#8B5E3C]">GPay / PhonePe / Paytm</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'COD'
                      ? 'bg-[#FEF3C7] border-[#D97706] text-[#3B170B] shadow-xs'
                      : 'bg-[#FAF4EB] border-[#DFCBB5] text-[#8B5E3C] hover:border-[#D97706]'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-[#D97706]" />
                  <div>
                    <div className="text-xs font-bold">Cash on Delivery</div>
                    <div className="text-[10px] text-[#8B5E3C]">Pay on delivery</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Confirm & Place Order Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#3B170B] hover:bg-[#2B1006] text-[#FEF3C7] font-bold text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#F59E0B]" />
                    <span>Scheduling Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Schedule Order (₹{totalAmount})</span>
                    <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
