import React, { useState } from 'react';
import { Plus, Check, Clock, Flame, Users, Sparkles, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RegularMenuItem } from '../types';

export const RegularOrderMenu: React.FC = () => {
  const { addToCart, cart, menuItems } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGheePreference, setSelectedGheePreference] = useState<{ [id: string]: boolean }>({});

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'roti_basket', label: 'Hot Roti Baskets' },
    { id: 'specialty_bread', label: 'Specialty & Millets' },
    { id: 'rice_khichdi', label: 'Rice & Khichdi' },
    { id: 'homestyle_sabzi', label: 'Homestyle Sabzi' },
    { id: 'dal_accompaniment', label: 'Dal & Accompaniments' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  const getItemCountInCart = (itemId: string) => {
    return cart
      .filter((c) => c.itemId === itemId)
      .reduce((sum, c) => sum + c.quantity, 0);
  };

  const toggleGhee = (itemId: string) => {
    setSelectedGheePreference((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === undefined ? false : !prev[itemId],
    }));
  };

  return (
    <div className="space-y-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
            Instant & Regular Orders · Hot in 30 Minutes
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900 tracking-tight mt-0.5">
            Regular On-Demand Roti & Meal Menu
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Craving fresh phulkas right now without a recurring subscription? Order single baskets, weekend parathas, and homestyle dal sabzi straight off the tawa.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-xl overflow-x-auto shrink-0 border border-stone-200/80">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const inCartCount = getItemCountInCart(item.id);
          const withGhee = selectedGheePreference[item.id] ?? true;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between hover:border-amber-300 transition-all shadow-2xs hover:shadow-xs group"
            >
              
              {/* Card Upper Info */}
              <div className="p-5 space-y-3">
                
                {/* Meta Bar */}
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full border border-emerald-600 flex items-center justify-center p-0.5" title="Pure Veg">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    </span>
                    <span className="capitalize">{item.category.replace('_', ' ')}</span>
                  </div>
                  {item.popular && (
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Popular
                    </span>
                  )}
                </div>

                {/* Title & Price */}
                <div>
                  <h3 className="font-display font-bold text-lg text-stone-900 group-hover:text-amber-900 transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-mono-numbers font-extrabold text-stone-900">
                      ₹{item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-stone-400 line-through font-mono-numbers">
                        ₹{item.originalPrice}
                      </span>
                    )}
                    <span className="text-xs text-stone-500 font-medium">
                      / {item.packSize}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed min-h-[40px]">
                  {item.description}
                </p>

                {/* Ingredients & Prep Specs */}
                <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Prep: {item.preparationTimeMins} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span>Serves: {item.serves}</span>
                  </div>
                </div>

                {/* Roti Baskets Ghee Customizer */}
                {item.category.includes('roti') && (
                  <div className="pt-1 flex items-center justify-between text-xs bg-stone-50 p-2 rounded-lg border border-stone-100">
                    <span className="text-stone-600">Pure Ghee Application:</span>
                    <button
                      type="button"
                      onClick={() => toggleGhee(item.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        withGhee
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                          : 'bg-white text-stone-600 border border-stone-200'
                      }`}
                    >
                      {withGhee ? 'With Ghee' : 'Dry / No Ghee'}
                    </button>
                  </div>
                )}

              </div>

              {/* Card Footer Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => addToCart(item, withGhee)}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-2xs ${
                    inCartCount > 0
                      ? 'bg-amber-800 hover:bg-amber-900 text-white'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  {inCartCount > 0 ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>In Cart ({inCartCount}) · Add Another</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add to Cart · ₹{item.price}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Fresh Packaging Promise */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
            Freshness Retention Technology
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold">
            Delivered Fresh in Multi-Layer Food Grade Insulation
          </h3>
          <p className="text-xs sm:text-sm text-stone-300">
            Standard rotis turn rubbery or soggy inside plastic tiffin boxes. We use breathable butter paper lining inside heat-sealed thermal foil pouches to release excess moisture while retaining authentic tawa heat for 90 minutes.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-4 bg-stone-800/80 p-4 rounded-xl border border-stone-700">
          <div className="text-center">
            <div className="text-2xl font-mono-numbers font-bold text-amber-400">90 Min</div>
            <div className="text-[11px] text-stone-400">Heat Retention</div>
          </div>
          <div className="w-px h-8 bg-stone-700"></div>
          <div className="text-center">
            <div className="text-2xl font-mono-numbers font-bold text-emerald-400">0% Soggy</div>
            <div className="text-[11px] text-stone-400">Breathable Lining</div>
          </div>
        </div>
      </div>

    </div>
  );
};
