import React from 'react';

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
  const filterPills = [
    { id: 'all', category: 'all', subFilter: 'all', label: 'All Rotis 🫓' },
    { id: 'phulkas', category: 'phulkas', subFilter: 'all', label: '🌾 Fresh Phulkas & Rotis' },
    { id: 'parathas', category: 'parathas', subFilter: 'all', label: '🥞 Stuffed Parathas' },
    { id: 'theplas', category: 'theplas', subFilter: 'all', label: '🍃 Gujarati Theplas' },
    { id: 'rotlas', category: 'rotlas', subFilter: 'all', label: '🌽 Rotlas & Bhakris' },
    { id: 'subscribable', category: 'all', subFilter: 'subscribable', label: 'Daily Subscriptions 📅' },
  ];

  const handlePillClick = (pill: typeof filterPills[0]) => {
    onSelectCategory(pill.category);
    onSelectSubFilter(pill.subFilter);
  };

  const isPillActive = (pill: typeof filterPills[0]) => {
    if (pill.id === 'all') {
      return selectedCategory === 'all' && selectedSubFilter === 'all';
    }
    if (pill.category !== 'all') {
      return selectedCategory === pill.category;
    }
    return selectedSubFilter === pill.subFilter;
  };

  return (
    <div className="bg-[#FFFDF9] border-b border-[#EFE3D3] py-2 shadow-2xs sticky top-[57px] sm:top-[65px] z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Sleek Horizontal Filter Pills Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none no-scrollbar touch-pan-x w-full snap-x">
          {filterPills.map((pill) => {
            const active = isPillActive(pill);

            return (
              <button
                key={pill.id}
                onClick={() => handlePillClick(pill)}
                className={`snap-start px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer shrink-0 ${
                  active
                    ? 'bg-[#3B170B] text-[#FEF3C7] border-[#2B1006] shadow-xs font-bold'
                    : 'bg-white text-[#78350F] border-[#DFCBB5] hover:border-[#D97706] hover:bg-[#FAF4EB]'
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
