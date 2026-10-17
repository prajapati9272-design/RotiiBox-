import React, { useState } from 'react';
import { 
  Bookmark, 
  Calendar, 
  Plus, 
  Minus, 
  Info, 
  Images,
  Clock,
  Sparkles
} from 'lucide-react';
import { RegularMenuItem, RotiSpreadOption } from '../types';
import { useApp } from '../context/AppContext';
import { ItemVisual } from './ItemVisual';
import { NutritionModal } from './NutritionModal';
import { ImageGalleryModal } from './ImageGalleryModal';

interface ProductCardProps {
  item: RegularMenuItem;
  onOpenSubscribeModal: (item: RegularMenuItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onOpenSubscribeModal,
}) => {
  const { 
    cart, 
    addToCart, 
    updateCartQuantity, 
    outOfStockIds, 
    stockQuantities, 
    isAdminLoggedIn, 
    updateProduct, 
    showToast
  } = useApp();

  const [isSaved, setIsSaved] = useState(false);
  const [selectedSpread, setSelectedSpread] = useState<RotiSpreadOption>('ghee');
  const [imgError, setImgError] = useState(false);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const isLimited = Boolean(item.isLimitedTime || item.isSeasonal);
  const isOutOfStock = outOfStockIds.includes(item.id) || (stockQuantities[item.id] !== undefined && stockQuantities[item.id] <= 0);

  // Find quantity in cart
  const cartItem = cart.find((c) => c.itemId === item.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  return (
    <div className={`flex flex-col justify-between rounded-2xl p-2 sm:p-2.5 transition-all group h-full ${
      isLimited
        ? 'bg-gradient-to-b from-[#FFFDF7] via-[#FFF9EE] to-[#FFF2E2] border border-[#FDBA74] hover:border-[#EA580C] shadow-xs hover:shadow-md ring-1 ring-[#EA580C]/20'
        : 'bg-[#FFFDF9] border border-[#EFE3D3] hover:border-[#D97706]/50 hover:shadow-md'
    }`}>
      
      {/* Upper Section: Image Container */}
      <div>
        <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-linear-to-br from-[#FAF2E4] via-[#F5E7D0] to-[#EED6B5] border border-[#EAD7C0] shadow-2xs">
          
          {/* Real Photographic Food Image with subtle hover zoom */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {item.imageUrl && !imgError ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="p-2 w-full h-full flex items-center justify-center">
                <ItemVisual item={item} />
              </div>
            )}
            {/* Soft gradient scrim at bottom to ensure button legibility */}
            <div className="absolute inset-x-0 bottom-0 h-11 bg-linear-to-t from-black/50 via-black/20 to-transparent pointer-events-none"></div>
          </div>

          {/* Top-Left: Bookmark / Favorite Ribbon */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="absolute top-2.5 left-2.5 z-10 text-[#8B5E3C] hover:text-[#D97706] transition-colors bg-white/70 backdrop-blur-xs p-1 rounded-full shadow-2xs cursor-pointer"
            title="Save for later"
          >
            <Bookmark
              className={`w-3.5 h-3.5 drop-shadow-xs transition-colors ${
                isSaved ? 'fill-[#D97706] text-[#D97706]' : 'text-[#8B5E3C] fill-white/80'
              }`}
            />
          </button>

          {/* Admin Photo Change Shortcut Button */}
          {isAdminLoggedIn && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsGalleryOpen(true);
              }}
              className="absolute top-2.5 right-11 z-20 px-2 py-1 bg-[#D97706] hover:bg-[#B45309] text-white text-[10px] font-bold rounded-lg shadow-sm flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
              title="Change item photo from gallery"
            >
              <Images className="w-3 h-3" />
              <span>Photo</span>
            </button>
          )}

          {/* Top-Right: Pure Veg Icon */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border border-[#059669] bg-white rounded-xs flex items-center justify-center p-0.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
            </div>
          </div>

          {/* Limited Time Tag / Standard Badge on Photo */}
          {isLimited ? (
            <div className="absolute top-2.5 left-9.5 z-10 flex items-center gap-1">
              <span className="bg-gradient-to-r from-[#EA580C] to-[#D97706] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs tracking-wider uppercase flex items-center gap-1 border border-amber-200/40">
                <Clock className="w-2.5 h-2.5 shrink-0" />
                Limited Time
              </span>
            </div>
          ) : item.badgeText ? (
            <div className="absolute top-2.5 left-9.5 z-10">
              <span className="bg-[#2B1408]/85 backdrop-blur-xs text-[#FEF3C7] text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs tracking-wide">
                {item.badgeText}
              </span>
            </div>
          ) : null}

          {/* Bottom-Right: Calendar (Subscribe) & ADD Action Buttons */}
          <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5">
            
            {/* Calendar Subscription Icon Button */}
            {item.canSubscribe && (
              <button
                onClick={() => onOpenSubscribeModal(item)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/95 hover:bg-[#FEF3C7] border border-[#D5C2AB] hover:border-[#D97706] shadow-sm flex items-center justify-center text-[#78350F] transition-colors cursor-pointer"
                title="Subscribe Daily / Schedule Recurring Delivery"
              >
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B45309]" />
              </button>
            )}

            {/* Instant Regular ADD / Stepper / Out of stock Button */}
            {isOutOfStock ? (
              <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-800 border border-red-200 text-[11px] font-bold shadow-2xs">
                OUT OF STOCK
              </span>
            ) : quantityInCart === 0 ? (
              <button
                onClick={() => addToCart(item, true, selectedSpread)}
                className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-white/95 hover:bg-[#FEF3C7] border border-[#D97706]/70 hover:border-[#D97706] text-[#78350F] font-bold text-xs shadow-sm transition-all flex items-center justify-center active:scale-95 cursor-pointer"
              >
                ADD
              </button>
            ) : (
              <div className="flex items-center bg-[#3B170B] text-[#FEF3C7] rounded-lg shadow-sm border border-[#2B1006] px-1 py-0.5 sm:py-1">
                <button
                  onClick={() => updateCartQuantity(cartItem!.id, quantityInCart - 1)}
                  className="w-5 h-5 flex items-center justify-center hover:bg-emerald-700 rounded text-xs font-bold cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center font-mono-numbers font-bold text-xs">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => updateCartQuantity(cartItem!.id, quantityInCart + 1)}
                  className="w-5 h-5 flex items-center justify-center hover:bg-emerald-700 rounded text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Lower Section: Product Meta & Pricing */}
      <div className="pt-2 sm:pt-2.5 px-0.5 flex-1 flex flex-col justify-between space-y-1">
        
        <div>
          {/* Product Title */}
          <h3 className="font-display font-semibold text-xs sm:text-sm text-[#2B1408] line-clamp-1 leading-snug">
            {item.name}
          </h3>

          {/* Seasonal Tag Kicker if applicable */}
          {item.seasonalTag && (
            <div className="text-[10px] font-bold text-[#EA580C] flex items-center gap-1 mt-0.5">
              <Sparkles className="w-2.5 h-2.5 text-[#EA580C] shrink-0" />
              <span className="truncate">{item.seasonalTag}</span>
            </div>
          )}

          {/* Quantity / Pack Pill */}
          <div className="mt-1">
            <span className="inline-block bg-[#F4EBE0] text-[#78350F] text-[11px] font-semibold px-2 py-0.5 rounded-md border border-[#E9D8C2]">
              {item.packSize}
            </span>
          </div>
        </div>

        <div>
          {/* Discount Line in Ochre */}
          <div className="text-[11px] font-bold text-[#C86A1D] leading-none pt-1">
            {item.discountPercent}% off
          </div>

          {/* Price: Strikethrough MRP + Selling Price */}
          <div className="flex items-baseline gap-1.5 leading-none mt-1">
            <span className="text-[11px] text-[#A88871] line-through font-mono-numbers">
              ₹{item.originalPrice}
            </span>
            <span className="font-mono-numbers font-bold text-xs sm:text-sm text-[#2B1408]">
              ₹{item.price}
            </span>
          </div>

          {/* View Nutritional Info Trigger */}
          <button
            type="button"
            onClick={() => setIsNutritionOpen(true)}
            className="mt-1.5 text-[10px] sm:text-[11px] font-semibold text-[#78350F] hover:text-[#D97706] underline underline-offset-2 flex items-center gap-1 transition-colors cursor-pointer group/nutri"
          >
            <Info className="w-3 h-3 text-[#D97706] group-hover/nutri:scale-110 transition-transform shrink-0" />
            <span>View Nutritional Info</span>
          </button>

        </div>

      </div>

      {/* Nutritional Info Modal */}
      {isNutritionOpen && (
        <NutritionModal
          item={item}
          onClose={() => setIsNutritionOpen(false)}
          onSubscribe={onOpenSubscribeModal}
        />
      )}

      {/* Admin Image Gallery Modal */}
      {isAdminLoggedIn && isGalleryOpen && (
        <ImageGalleryModal
          isOpen={isGalleryOpen}
          item={item}
          onClose={() => setIsGalleryOpen(false)}
          onSelectImage={(imageUrl) => {
            updateProduct(item.id, { imageUrl });
            showToast(`📸 Updated photo for "${item.name}" from gallery!`);
            setImgError(false);
          }}
        />
      )}

    </div>
  );
};
