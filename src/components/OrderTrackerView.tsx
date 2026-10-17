import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Flame, 
  PackageCheck, 
  Bike, 
  MapPin, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Calendar,
  AlertCircle,
  RotateCcw,
  Zap,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

export const OrderTrackerView: React.FC = () => {
  const { orders, activeOrderToTrack, setActiveOrderToTrack, quickReorderOrder } = useApp();
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const currentOrder = activeOrderToTrack || orders[0];
  const lastSuccessfulOrder = orders.find(o => o.type === 'regular' || o.status === 'delivered' || o.status === 'kneading_and_baking' || o.status === 'confirmed') || orders[0];

  const handleReorder = (orderToReorder: Order, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReorderingId(orderToReorder.id);
    setTimeout(() => {
      quickReorderOrder(orderToReorder);
      setReorderingId(null);
    }, 400);
  };

  const steps = [
    {
      id: 'confirmed',
      title: 'Order Confirmed',
      desc: 'Recipe & flour grain queued with chef',
      icon: CheckCircle2,
    },
    {
      id: 'kneading_and_baking',
      title: 'Kneading & Tawa Flame Puffing',
      desc: '100% whole wheat dough rolled & puffed on live flame',
      icon: Flame,
    },
    {
      id: 'thermal_packed',
      title: 'Insulated Foil Packaging',
      desc: 'Breathable butter paper in double heat-seal pouch',
      icon: PackageCheck,
    },
    {
      id: 'out_for_delivery',
      title: 'Rider on the Way',
      desc: 'Hot box delivery bag maintaining optimal warmth',
      icon: Bike,
    },
    {
      id: 'delivered',
      title: 'Delivered at Doorstep',
      desc: 'Ready to serve piping hot',
      icon: MapPin,
    },
  ];

  const getStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'confirmed': return 0;
      case 'kneading_and_baking': return 1;
      case 'thermal_packed': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const activeStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 1;

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
            Real-Time Kitchen & Dispatch Status
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900 tracking-tight mt-0.5">
            Live Order Tracking
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Monitor your tawa puffing stage, insulation packing, and delivery partner in real time.
          </p>
        </div>

        {/* Header Reorder Shortcut */}
        {lastSuccessfulOrder && (
          <button
            onClick={(e) => handleReorder(lastSuccessfulOrder, e)}
            disabled={reorderingId === lastSuccessfulOrder.id}
            className="px-4 py-2 bg-gradient-to-r from-[#3B170B] to-[#542111] hover:from-[#2A1008] hover:to-[#3B170B] text-[#FEF3C7] text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 border border-amber-600/30 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
            <span>{reorderingId === lastSuccessfulOrder.id ? 'Placing Reorder...' : 'Quick Reorder Last Purchase'}</span>
          </button>
        )}
      </div>

      {/* Quick Reorder Spotlight Banner */}
      {lastSuccessfulOrder && (
        <div className="bg-gradient-to-r from-[#2F1309] via-[#4A1E10] to-[#1F0C06] text-[#FEF3C7] rounded-2xl p-4 sm:p-5 shadow-sm border border-amber-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300">
              <RotateCcw className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Quick Reorder Ready
                </span>
                <span className="text-[10px] bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/30 font-medium">
                  Order #{lastSuccessfulOrder.id}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mt-1">
                {lastSuccessfulOrder.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
              </div>
              <div className="text-[11px] text-amber-200/80 mt-0.5 flex items-center gap-2 font-mono-numbers">
                <span>Total Amount: ₹{lastSuccessfulOrder.finalAmount}</span>
                <span>•</span>
                <span>Address: {typeof lastSuccessfulOrder.deliveryAddress === 'object' ? lastSuccessfulOrder.deliveryAddress.label : 'Delivery Address'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={(e) => handleReorder(lastSuccessfulOrder, e)}
              disabled={reorderingId === lastSuccessfulOrder.id}
              className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw className={`w-4 h-4 ${reorderingId === lastSuccessfulOrder.id ? 'animate-spin' : ''}`} />
              <span>{reorderingId === lastSuccessfulOrder.id ? 'Reordering...' : `Quick Reorder (₹${lastSuccessfulOrder.finalAmount})`}</span>
            </button>
          </div>
        </div>
      )}

      {currentOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Active Tracking Card */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-2xs">
            
            {/* Order Meta Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                    currentOrder.id.startsWith('SUB') || currentOrder.type === 'subscription_charge'
                      ? 'bg-purple-100 text-purple-900 border border-purple-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    #{currentOrder.id}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    currentOrder.id.startsWith('SUB') || currentOrder.type === 'subscription_charge'
                      ? 'bg-purple-900 text-purple-100'
                      : 'bg-[#3B170B] text-[#FEF3C7]'
                  }`}>
                    {currentOrder.id.startsWith('SUB') || currentOrder.type === 'subscription_charge' ? '📅 Subscription Order' : '🛒 Regular Order'}
                  </span>
                  <span className="text-xs text-stone-400">·</span>
                  <span className="text-xs text-stone-500">{currentOrder.date}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-stone-900 mt-1">
                  Estimated Delivery: {currentOrder.estimatedDeliveryTime}
                </h3>
              </div>

              {/* Reorder Button for current active order */}
              <button
                onClick={(e) => handleReorder(currentOrder, e)}
                disabled={reorderingId === currentOrder.id}
                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer self-start sm:self-center"
              >
                <RotateCcw className={`w-3.5 h-3.5 text-amber-700 ${reorderingId === currentOrder.id ? 'animate-spin' : ''}`} />
                <span>{reorderingId === currentOrder.id ? 'Reordering...' : 'Reorder This Meal'}</span>
              </button>
            </div>

            {/* Stepper Progression */}
            <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
              {steps.map((step, idx) => {
                const isComplete = idx < activeStepIdx;
                const isCurrent = idx === activeStepIdx;
                const StepIcon = step.icon;

                return (
                  <div key={step.id} className="relative flex items-start gap-4">
                    {/* Step Circle */}
                    <div
                      className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isComplete
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <StepIcon className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="pl-3 sm:pl-4">
                      <div className={`text-sm font-bold ${isCurrent ? 'text-amber-900' : isComplete ? 'text-stone-900' : 'text-stone-400'}`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rider & Delivery OTP Details */}
            <div className="pt-6 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-stone-500 uppercase font-semibold">Delivery Partner</div>
                  <div className="font-bold text-stone-900 mt-0.5">{currentOrder.liveRiderName || 'Rameshwar Yadav'}</div>
                  <div className="text-stone-600 font-mono-numbers mt-0.5">{currentOrder.liveRiderPhone || '+91 98210 44321'}</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center text-stone-700 font-bold text-sm">
                  <Phone className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-amber-800 uppercase font-semibold">Delivery Security OTP</div>
                  <div className="text-2xl font-mono-numbers font-extrabold text-amber-950 tracking-wider mt-0.5">
                    {currentOrder.otp || '4821'}
                  </div>
                  <div className="text-[10px] text-stone-500">Share with rider upon arrival</div>
                </div>
                <ShieldCheck className="w-6 h-6 text-amber-700" />
              </div>
            </div>

            {/* Ordered Items Summary */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <div className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                <span>Order Items:</span>
                <span className="text-[11px] text-stone-500 font-normal">{currentOrder.items.length} items</span>
              </div>
              <div className="space-y-1.5 text-xs text-stone-600">
                {currentOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{it.quantity}x {it.name}</span>
                    <span className="font-mono-numbers text-stone-900">₹{it.price * it.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-stone-100 pt-2 flex justify-between font-bold text-stone-900">
                  <span>Paid Total:</span>
                  <span className="font-mono-numbers text-amber-900">₹{currentOrder.finalAmount} via {currentOrder.paymentMethod}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Past Orders List Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-display font-bold text-base text-stone-900 flex items-center justify-between">
              <span>Recent Orders & Deliveries</span>
              <span className="text-xs font-normal text-stone-500">({orders.length})</span>
            </h4>
            
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setActiveOrderToTrack(ord)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    currentOrder.id === ord.id
                      ? 'border-amber-500 bg-amber-50/40 shadow-2xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono font-bold px-1.5 py-0.2 rounded text-[11px] ${
                        ord.id.startsWith('SUB') || ord.type === 'subscription_charge'
                          ? 'bg-purple-100 text-purple-900 border border-purple-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        #{ord.id}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        ord.id.startsWith('SUB') || ord.type === 'subscription_charge'
                          ? 'bg-purple-800 text-white'
                          : 'bg-[#78350F] text-[#FEF3C7]'
                      }`}>
                        {ord.id.startsWith('SUB') || ord.type === 'subscription_charge' ? 'Subscription' : 'Regular'}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 font-mono-numbers">
                      ₹{ord.finalAmount}
                    </span>
                  </div>

                  <div className="text-xs text-stone-600 mt-1 line-clamp-1">
                    {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                    <span className="capitalize text-amber-800 font-medium">
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={(e) => handleReorder(ord, e)}
                      disabled={reorderingId === ord.id}
                      className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-[10px] rounded-md transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <RotateCcw className={`w-2.5 h-2.5 text-amber-800 ${reorderingId === ord.id ? 'animate-spin' : ''}`} />
                      <span>{reorderingId === ord.id ? '...' : 'Quick Reorder'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8">
          <Clock className="w-10 h-10 text-stone-400 mx-auto mb-2" />
          <h4 className="font-display font-bold text-stone-900">No Orders Placed Yet</h4>
          <p className="text-xs text-stone-500 mt-1">Place an order from the Regular Menu or check your Daily Subscription Calendar.</p>
        </div>
      )}

    </div>
  );
};

