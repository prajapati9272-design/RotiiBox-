import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  Plus, 
  Minus, 
  Info, 
  Flame, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { RegularMenuItem, RotiSpreadOption } from '../types';
import { useApp } from '../context/AppContext';
import { ItemVisual } from './ItemVisual';
import { NutritionModal } from './NutritionModal';

interface SeasonalSpecialsBannerProps {
  onOpenSubscribeModal: (item: RegularMenuItem) => void;
  onExploreCategory?: (category: string) => void;
}

export const SeasonalSpecialsBanner: React.FC<SeasonalSpecialsBannerProps> = ({
  onOpenSubscribeModal,
  onExploreCategory,
}) => {
  const { 
    menuItems, 
    cart, 
    addToCart, 
    updateCartQuantity, 
    outOfStockIds, 
    stockQuantities 
  } = useApp();

  const [selectedNutritionItem, setSelectedNutritionItem] = useState<RegularMenuItem | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Filter items that are seasonal or limited-time
  const seasonalItems = menuItems.filter((item) => item.isLimitedTime || item.isSeasonal);

  if (seasonalItems.length === 0) {
    return null;
  }

  return (
    <section 
      aria-label="Seasonal Specials"
      className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-3"
    >
      {/* Outer Banner Container with Distinct Spiced Harvest Background Color */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-br from-[#FFF5EB] via-[#FEECD6] to-[#FEE2E2] border-2 border-[#FDBA74] shadow-md p-3.5 sm:p-5 transition-all">
        
        {/* Subtle decorative background accents */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-linear-to-bl from-[#EA580C]/15 to-[#F59E0B]/5 pointer-events-none blur-xl"></div>
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-linear-to-tr from-[#D97706]/15 to-transparent pointer-events-none blur-2xl"></div>

        {/* Banner Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-2.5 pb-3.5 border-b border-[#FDBA74]/50">
          <div>
            {/* Limited Time Tag & Season Kicker */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EA580C] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
                <Clock className="w-3 h-3 animate-pulse" />
                Limited Time
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9A3412] uppercase tracking-wide">
                <Sparkles className="w-3 h-3 text-[#D97706]" />
                Harvest Kitchen Specials
              </span>
              <span className="hidden sm:inline-block text-[#C2410C]/60 text-xs">·</span>
              <span className="hidden sm:inline-block text-[11px] font-medium text-[#7C2D12]">
                Small-Batch Clay Tawa & Farm Fresh Greens
              </span>
            </div>

            {/* Banner Main Title */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-display font-extrabold text-[#3B170B] tracking-tight flex items-center gap-2">
              <span>Seasonal Specials</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EA580C]/10 text-[#C2410C] border border-[#F97316]/30">
                {seasonalItems.length} Handcrafted Delicacies
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-xs sm:text-sm text-[#78350F] max-w-2xl mt-0.5 leading-relaxed">
              Limited-edition winter rotis, fragrant farm greens, and traditional clay-tawa millets prepared fresh daily with desi cow ghee. Available for direct order and daily subscriptions while seasonal supplies last!
            </p>
          </div>

          {/* Quick action / banner counter badge */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-[#FDBA74] text-[11px] font-bold text-[#9A3412] shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Available Fresh Today</span>
            </div>
          </div>
        </div>

        {/* Limited-Time Menu Items Showcase */}
        <div className="relative z-10 pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {seasonalItems.map((item) => {
              const isOutOfStock = outOfStockIds.includes(item.id) || (stockQuantities[item.id] !== undefined && stockQuantities[item.id] <= 0);
              const cartItem = cart.find((c) => c.itemId === item.id);
              const quantityInCart = cartItem ? cartItem.quantity : 0;
              const hasImgErr = imgErrors[item.id];

              return (
                <div 
                  key={item.id}
                  className="group flex flex-col justify-between bg-white rounded-2xl p-2.5 sm:p-3 border-2 border-[#FED7AA] hover:border-[#EA580C] hover:shadow-lg transition-all duration-300 relative shadow-xs"
                >
                  {/* Card Visual / Thumbnail Section */}
                  <div>
                    <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-linear-to-br from-[#FFF7ED] via-[#FDE68A]/30 to-[#FED7AA] border border-[#FDBA74]/60 shadow-2xs">
                      
                      {/* Image / Fallback illustration */}
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        {item.imageUrl && !hasImgErr ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            onError={() => setImgErrors((prev) => ({ ...prev, [item.id]: true }))}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="p-2 w-full h-full flex items-center justify-center">
                            <ItemVisual item={item} />
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black/50 via-black/20 to-transparent pointer-events-none"></div>
                      </div>

                      {/* Prominent Limited Time Tag */}
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-[#EA580C] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs uppercase tracking-wider flex items-center gap-1 border border-white/20">
                          <Clock className="w-2.5 h-2.5" />
                          Limited Time
                        </span>
                      </div>

                      {/* Pure Veg Tag */}
                      <div className="absolute top-2 right-2 z-10">
                        <div className="w-3.5 h-3.5 border border-[#059669] bg-white rounded-xs flex items-center justify-center p-0.5 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                        </div>
                      </div>

                      {/* Action buttons on image bottom: Subscribe & ADD */}
                      <div className="absolute bottom-1.5 right-1.5 z-10 flex items-center gap-1">
                        {item.canSubscribe && (
                          <button
                            type="button"
                            onClick={() => onOpenSubscribeModal(item)}
                            className="w-7 h-7 rounded-lg bg-white/95 hover:bg-[#FEF3C7] border border-[#FDBA74] shadow-sm flex items-center justify-center text-[#9A3412] transition-colors cursor-pointer"
                            title="Subscribe Daily"
                          >
                            <Calendar className="w-3.5 h-3.5 text-[#EA580C]" />
                          </button>
                        )}

                        {isOutOfStock ? (
                          <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-200 text-[10px] font-bold">
                            SOLD OUT
                          </span>
                        ) : quantityInCart === 0 ? (
                          <button
                            type="button"
                            onClick={() => addToCart(item, true, 'ghee')}
                            className="px-2.5 sm:px-3 py-1 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold text-[11px] shadow-sm transition-all active:scale-95 cursor-pointer"
                          >
                            ADD
                          </button>
                        ) : (
                          <div className="flex items-center bg-[#3B170B] text-[#FEF3C7] rounded-lg shadow-sm border border-[#2B1006] px-1 py-0.5">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(cartItem!.id, quantityInCart - 1)}
                              className="w-4.5 h-4.5 flex items-center justify-center hover:bg-orange-700 rounded text-xs font-bold cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-4.5 text-center font-mono-numbers font-bold text-xs">
                              {quantityInCart}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(cartItem!.id, quantityInCart + 1)}
                              className="w-4.5 h-4.5 flex items-center justify-center hover:bg-orange-700 rounded text-xs font-bold cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="pt-2 px-0.5 flex-1 flex flex-col justify-between space-y-1">
                    <div>
                      {/* Item Name */}
                      <h3 className="font-display font-bold text-xs sm:text-sm text-[#2B1408] line-clamp-1 leading-snug group-hover:text-[#EA580C] transition-colors">
                        {item.name}
                      </h3>

                      {/* Seasonal Tag Kicker */}
                      {item.seasonalTag && (
                        <div className="text-[10px] font-extrabold text-[#C2410C] flex items-center gap-1 mt-0.5">
                          <Sparkles className="w-2.5 h-2.5 text-[#EA580C] shrink-0" />
                          <span className="truncate">{item.seasonalTag}</span>
                        </div>
                      )}

                      {/* Pack Size Pill */}
                      <div className="mt-1">
                        <span className="inline-block bg-[#FFF4E8] text-[#9A3412] text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md border border-[#FED7AA]">
                          {item.packSize}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1">
                      {/* Discount & Price */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#EA580C]">
                          {item.discountPercent}% OFF
                        </span>
                        <div className="flex items-baseline gap-1.5 leading-none">
                          <span className="text-[10px] text-[#A88871] line-through font-mono-numbers">
                            ₹{item.originalPrice}
                          </span>
                          <span className="font-mono-numbers font-extrabold text-xs sm:text-sm text-[#2B1408]">
                            ₹{item.price}
                          </span>
                        </div>
                      </div>

                      {/* Nutrition Info Link */}
                      <button
                        type="button"
                        onClick={() => setSelectedNutritionItem(item)}
                        className="mt-1.5 text-[10px] font-semibold text-[#9A3412] hover:text-[#EA580C] underline underline-offset-2 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Info className="w-3 h-3 text-[#EA580C] shrink-0" />
                        <span>Nutrition Details</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Nutritional Info Modal for seasonal items */}
      {selectedNutritionItem && (
        <NutritionModal
          item={selectedNutritionItem}
          onClose={() => setSelectedNutritionItem(null)}
          onSubscribe={onOpenSubscribeModal}
        />
      )}
    </section>
  );
};
