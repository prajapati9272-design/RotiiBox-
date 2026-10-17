import React, { useState } from 'react';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  MapPin, 
  Wallet, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Truck,
  PackageCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, RotiSpreadOption } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

const SPREAD_OPTIONS: { id: RotiSpreadOption; label: string }[] = [
  { id: 'oil', label: 'Oil' },
  { id: 'ghee', label: 'Ghee' },
  { id: 'butter', label: 'Butter' },
  { id: 'white_butter', label: 'White butter' },
  { id: 'plain', label: 'Plain' },
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const {
    cart,
    updateCartQuantity,
    updateCartItemSpread,
    removeFromCart,
    cartTotal,
    cartItemCount,
    addresses,
    selectedAddress,
    setSelectedAddress,
    walletBalance,
    placeRegularOrder,
    customerUser,
    openCustomerAuthModal,
    menuItems,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('UPI');
  const [useWalletCredits, setUseWalletCredits] = useState<boolean>(true);

  if (!isOpen) return null;

  const freeDeliveryThreshold = 300;
  const deliveryFee = cartTotal >= freeDeliveryThreshold || cartTotal === 0 ? 0 : 50;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartTotal);
  const deliveryProgressPercent = Math.min(100, Math.round((cartTotal / freeDeliveryThreshold) * 100));

  const walletDeduction = useWalletCredits ? Math.min(walletBalance, cartTotal) : 0;
  const finalAmount = Math.max(0, cartTotal + deliveryFee - walletDeduction);

  const handleCheckout = () => {
    if (!customerUser?.isLoggedIn) {
      openCustomerAuthModal();
      return;
    }
    const order = placeRegularOrder(paymentMethod);
    onOrderSuccess(order);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
              <h2 className="font-display font-bold text-lg text-stone-900">
                Your Order Bag
              </h2>
              {cartItemCount > 0 && (
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="font-display font-bold text-stone-800 text-base">
                  Your cart is empty
                </div>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Add some fresh flame-puffed rotis, multigrain bhakris or homestyle dal from the Regular Menu!
                </p>
              </div>
            ) : (
              <>
                {/* Free Delivery Goal Tracker Banner */}
                <div className="bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl p-3 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#2B1408] flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#D97706] shrink-0" />
                      {cartTotal >= 300 ? (
                        <span className="text-emerald-800 font-extrabold">🎉 FREE Delivery Unlocked!</span>
                      ) : (
                        <span>Add ₹{amountNeededForFreeDelivery} more for FREE Delivery</span>
                      )}
                    </span>
                    <span className="font-mono-numbers text-[#78350F]">{deliveryProgressPercent}%</span>
                  </div>

                  <div className="w-full h-2 bg-[#E2D2BD] rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full ${
                        cartTotal >= 300 ? 'bg-emerald-600' : 'bg-[#D97706]'
                      }`}
                      style={{ width: `${deliveryProgressPercent}%` }}
                    />
                  </div>

                  <div className="text-[10px] text-[#8B5E3C] flex items-center justify-between font-medium">
                    <span>Regular Orders: Free above ₹300 (Flat ₹50 below ₹300)</span>
                    <span className="text-emerald-800 font-bold">Subscriptions: Always Free</span>
                  </div>
                </div>

                {/* Detailed Item List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <PackageCheck className="w-4 h-4 text-amber-700" />
                      Selected Items ({cartItemCount} total)
                    </span>
                  </div>
                  {cart.map((item) => {
                    const isRotiItem = 
                      item.category === 'roti_basket' || 
                      item.category === 'specialty_bread' || 
                      item.name.toLowerCase().includes('roti') || 
                      item.name.toLowerCase().includes('phulka') || 
                      item.name.toLowerCase().includes('thepla') || 
                      item.name.toLowerCase().includes('paratha') || 
                      item.name.toLowerCase().includes('rotla') || 
                      item.name.toLowerCase().includes('bhakri');

                    const currentSpread: RotiSpreadOption = 
                      item.customization?.spread || (item.customization?.ghee ? 'ghee' : 'plain');

                    const spreadDisplayMap: Record<RotiSpreadOption, string> = {
                      oil: 'With Oil',
                      ghee: 'With Ghee',
                      butter: 'With Butter',
                      white_butter: 'With White butter',
                      plain: 'Plain (Dry)',
                    };

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-stone-200 bg-white shadow-2xs space-y-2.5 transition-all hover:border-amber-400"
                      >
                        {/* Upper card info: thumbnail, title, pack size, price, stepper */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            {(() => {
                              const menuItem = menuItems.find((m) => m.id === item.itemId);
                              return menuItem?.imageUrl ? (
                                <img
                                  src={menuItem.imageUrl}
                                  alt={item.name}
                                  referrerPolicy="no-referrer"
                                  className="w-12 h-12 rounded-lg object-cover border border-[#E2D2BD] shrink-0"
                                />
                              ) : null;
                            })()}
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#2B1408] leading-tight">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#8B5E3C] flex items-center gap-1.5 mt-0.5">
                                <span>{item.packSize}</span>
                                {isRotiItem && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="font-semibold text-[#78350F]">
                                      {spreadDisplayMap[currentSpread]}
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="font-mono-numbers font-bold text-xs text-[#2B1408] mt-1 flex items-center gap-2">
                                <span>₹{item.price * item.quantity}</span>
                                <span className="text-[10px] text-stone-500 font-normal">
                                  (₹{item.price} × {item.quantity})
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg border border-stone-300 bg-stone-50 hover:bg-amber-100 hover:border-amber-400 flex items-center justify-center text-stone-700 transition-colors"
                              title="Decrease quantity"
                            >
                              {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-600" /> : <Minus className="w-3.5 h-3.5" />}
                            </button>
                            <span className="w-6 text-center font-mono-numbers text-xs font-bold text-stone-900 bg-stone-100 py-1 rounded">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg border border-stone-300 bg-stone-50 hover:bg-amber-100 hover:border-amber-400 flex items-center justify-center text-stone-700 transition-colors"
                              title="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Customization Options Under This Card */}
                        {isRotiItem && (
                          <div className="pt-2 border-t border-stone-100">
                            <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                              <span>Spread Option:</span>
                              <span className="text-amber-800 font-bold capitalize">
                                {SPREAD_OPTIONS.find((s) => s.id === currentSpread)?.label}
                              </span>
                            </div>

                            <div className="grid grid-cols-5 gap-1 text-center">
                              {SPREAD_OPTIONS.map((opt) => {
                                const isSelected = currentSpread === opt.id;
                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => updateCartItemSpread(item.id, opt.id)}
                                    className={`py-1 px-1 rounded-md text-[10px] font-medium transition-all ${
                                      isSelected
                                        ? 'bg-amber-800 text-white font-bold shadow-2xs ring-1 ring-amber-950'
                                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Delivery Address Selector */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>Deliver To:</span>
                    </span>
                    <span className="text-amber-800 font-semibold">{selectedAddress.label}</span>
                  </div>

                  <div className="p-3 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-700 space-y-1">
                    <div className="font-bold text-stone-900">{selectedAddress.recipientName} ({selectedAddress.phone})</div>
                    <div className="text-stone-600">
                      {selectedAddress.houseFlat}, {selectedAddress.streetArea}, {selectedAddress.city} - {selectedAddress.pincode}
                    </div>
                    {addresses.length > 1 && (
                      <div className="pt-2 flex gap-2">
                        {addresses.map((a) => (
                          <button
                            key={a.id}
                            onClick={() => setSelectedAddress(a)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                              selectedAddress.id === a.id
                                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                                : 'bg-white text-stone-600 border-stone-200'
                            }`}
                          >
                            Switch to {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Wallet Balance Usage Checkbox */}
                {walletBalance > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-amber-700" />
                      <div>
                        <div className="font-bold text-stone-900">Apply Rollover Wallet Credits</div>
                        <div className="text-[11px] text-stone-600">Available balance: ₹{walletBalance}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={useWalletCredits}
                      onChange={(e) => setUseWalletCredits(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                    />
                  </div>
                )}

                {/* Payment Option */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="text-xs font-semibold text-stone-700">Payment Option:</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['UPI', 'Card', 'COD'] as Order['paymentMethod'][]).map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-2.5 rounded-lg border font-medium transition-colors text-center ${
                          paymentMethod === method
                            ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                            : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50/90 space-y-3">
              {/* Itemized Quick Summary before Total */}
              <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 text-xs space-y-1">
                <div className="font-bold text-[#2B1408] text-[11px] border-b border-amber-200/60 pb-1 mb-1">
                  Item Summary ({cart.length} unique {cart.length === 1 ? 'item' : 'items'}):
                </div>
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-[11px] text-stone-700">
                    <span className="truncate max-w-[200px] font-medium">
                      {item.quantity}× {item.name} {item.customization?.spread && item.customization.spread !== 'plain' ? `(${item.customization.spread})` : ''}
                    </span>
                    <span className="font-mono-numbers font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-mono-numbers text-stone-900 font-semibold">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Doorstep Delivery:</span>
                  <span className="font-mono-numbers text-stone-900">
                    {deliveryFee === 0 ? <span className="text-[#C86A1D] font-bold">FREE</span> : <span className="font-semibold text-stone-900">₹{deliveryFee}</span>}
                  </span>
                </div>
                {walletDeduction > 0 && (
                  <div className="flex justify-between text-[#78350F] font-semibold">
                    <span>Rollover Wallet Applied:</span>
                    <span className="font-mono-numbers">-₹{walletDeduction}</span>
                  </div>
                )}
                <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-base text-[#2B1408]">
                  <span>To Pay:</span>
                  <span className="font-mono-numbers text-[#C86A1D]">₹{finalAmount}</span>
                </div>
              </div>

              {/* Customer Mobile Identity Info */}
              <div className="bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl p-2.5 flex items-center justify-between text-xs">
                {customerUser?.isLoggedIn ? (
                  <div className="flex items-center gap-1.5 text-[#2B1408]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium truncate">Ordering as <strong>{customerUser.phone}</strong></span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[#78350F]">
                    <ShieldCheck className="w-4 h-4 text-[#D97706] shrink-0" />
                    <span>Mobile OTP Login required</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={openCustomerAuthModal}
                  className="text-[10px] font-bold text-[#D97706] hover:underline shrink-0 ml-1"
                >
                  {customerUser?.isLoggedIn ? 'Change' : 'Login Now'}
                </button>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 px-4 rounded-xl bg-[#3B170B] hover:bg-[#2B1006] text-[#FEF3C7] font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 border border-[#2B1006]"
              >
                <span>Place Order · Hot Roti Box</span>
                <ArrowRight className="w-4 h-4 text-[#D97706]" />
              </button>

              <div className="text-[11px] text-center text-[#8B5E3C]">
                Freshly kneaded and baked to order · Rotiibox moisture-controlled thermal pack
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
