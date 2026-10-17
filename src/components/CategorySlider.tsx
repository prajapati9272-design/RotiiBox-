import React from 'react';
import { Flame, Sparkles, Wheat, Heart, UtensilsCrossed, Soup, Box } from 'lucide-react';

export interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
}

interface CategorySliderProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  selectedSubFilter: string;
  onSelectSubFilter: (filter: string) => void;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedSubFilter,
  onSelectSubFilter,
}) => {
  const categories: CategoryItem[] = [
    {
      id: 'all',
      name: 'All Rotis',
      subtitle: '& Baskets',
      icon: (
        <div className="w-10 h-10 rounded-full bg-[#FAF0DC] text-[#3B170B] flex items-center justify-center font-bold text-sm shadow-2xs border border-[#E8D4BE]">
          <Flame className="w-5 h-5 text-[#D97706]" />
        </div>
      ),
    },
    {
      id: 'Phulkas',
      name: 'Fresh Hot',
      subtitle: 'Phulkas',
      icon: (
        <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#78350F] flex items-center justify-center font-bold text-sm shadow-2xs border border-[#FDE68A]">
          <Wheat className="w-5 h-5 text-[#B45309]" />
        </div>
      ),
    },
    {
      id: 'Desi Ghee',
      name: 'Desi A2',
      subtitle: 'Ghee Rotis',
      icon: (
        <div className="w-10 h-10 rounded-full bg-[#FDF6E2] text-[#78350F] flex items-center justify-center font-bold text-sm shadow-2xs border border-[#FDE047]">
          <Sparkles className="w-5 h-5 text-[#D97706]" />
        </div>
      ),
    },
    {
      id: 'Millets',
      name: 'Bajra, Jowar',
      subtitle: '& Millets',
      icon: (
        <div className="w-10 h-10 rounded-full bg-[#F5EBE0] text-[#3B170B] flex items-center justify-center font-bold text-sm shadow-2xs border border-[#DFCBB5]">
          <Heart className="w-5 h-5 text-[#8B5E3C]" />
        </div>
      ),
    },
    {
      id: 'Thepla',
      name: 'Theplas &',
      subtitle: 'Parathas',
      icon: (
        <div className="w-10 h-10 rounded-full bg-[#FEF9C3] text-[#78350F] flex items-center justify-center font-bold text-sm shadow-2xs border border-[#FEF08A]">
          <UtensilsCrossed className="w-5 h-5 text-[#CA8A04]" />
        </div>
      ),
    },
    {
      id: 'Sabzi',
      name: 'Homestyle',
      subtitle: 'Sabzi',
      icon: (
        <div className="w-10 h-10 rounded-full bg-[#FBE7D6] text-[#78350F] flex items-center justify-center font-bold text-sm shadow-2xs border border-[#F3C49F]">
          <UtensilsCrossed className="w-5 h-5 text-[#C2410C]" />
        </div>
      ),
    },
    {
      id: 'Dal',
      name: 'Peeli Dal &',
      subtitle: 'Curries',
      icon: (
        <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#78350F] flex items-center justify-center font-bold text-sm shadow-2xs border border-[#FCD34D]">
          <Soup className="w-5 h-5 text-[#D97706]" />
        </div>
      ),
    },
    {
      id: 'Rice',
      name: 'Rice &',
      subtitle: 'Khichdi',
      icon: (
        <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#78350F] flex items-center justify-center font-bold text-sm shadow-2xs border border-[#FDE68A]">
          <Soup className="w-5 h-5 text-[#B45309]" />
        </div>
      ),
    },
    {
      id: 'Combos',
      name: 'Executive',
      subtitle: 'Thali Boxes',
      icon: (
        <div className="w-10 h-10 rounded-full bg-[#EDE0D4] text-[#3B170B] flex items-center justify-center font-bold text-sm shadow-2xs border border-[#D5C2AB]">
          <Box className="w-5 h-5 text-[#78350F]" />
        </div>
      ),
    },
  ];

  const subFilters = [
    { id: 'all', label: 'All Items' },
    { id: 'seasonal', label: '🍁 Seasonal Specials' },
    { id: 'subscribable', label: 'Daily Subscriptions 📅' },
    { id: 'pure_wheat', label: '100% Chakki Atta' },
    { id: 'protein', label: 'High Protein' },
    { id: 'gluten_free', label: 'Gluten Free' },
  ];

  return (
    <div className="bg-[#FFFDF9] border-b border-[#EFE3D3] pt-3 pb-2.5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Horizontal Category Carousel */}
        <div className="flex items-start gap-3 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center shrink-0 p-2 rounded-xl text-center transition-all min-w-[76px] ${
                  isActive
                    ? 'bg-[#FAF0DC] border border-[#D97706] ring-1 ring-[#D97706]/30 shadow-2xs'
                    : 'hover:bg-[#FAF4EB] border border-transparent'
                }`}
              >
                <div className="mb-1.5 transform transition-transform hover:scale-105">
                  {cat.icon}
                </div>
                <div className={`text-[11px] font-semibold leading-tight ${isActive ? 'text-[#2B1408] font-bold' : 'text-[#78350F]'}`}>
                  {cat.name}
                </div>
                <div className={`text-[10px] leading-tight mt-0.2 ${isActive ? 'text-[#C86A1D]' : 'text-[#8B5E3C]'}`}>
                  {cat.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sub-Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none no-scrollbar">
          {subFilters.map((pill) => {
            const isSelected = selectedSubFilter === pill.id;

            return (
              <button
                key={pill.id}
                onClick={() => onSelectSubFilter(pill.id)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-[#3B170B] text-[#FEF3C7] border-[#2B1006] font-bold shadow-2xs'
                    : 'bg-white text-[#78350F] border-[#DFCBB5] hover:border-[#D97706]'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
