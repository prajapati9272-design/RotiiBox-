import React, { useState } from 'react';
import { X, Flame, Dumbbell, Activity, Sparkles, CheckCircle2, ShieldCheck, Leaf, Info, PieChart } from 'lucide-react';
import { RegularMenuItem, NutritionalInfo } from '../types';

interface NutritionModalProps {
  item: RegularMenuItem | null;
  onClose: () => void;
  onSubscribe?: (item: RegularMenuItem) => void;
}

export const NutritionModal: React.FC<NutritionModalProps> = ({ item, onClose, onSubscribe }) => {
  const [viewMode, setViewMode] = useState<'per_piece' | 'full_pack'>('per_piece');

  if (!item) return null;

  // Extract piece count from packSize (e.g. "Pack of 5 Pcs" => 5)
  const pieceMatch = item.packSize.match(/(\d+)\s*(Pcs|Pieces|Rotis)?/i);
  const piecesCount = pieceMatch ? parseInt(pieceMatch[1], 10) : 1;
  const isMultiPiece = piecesCount > 1;

  // Compute accurate macro breakdown if not explicitly defined
  const getMacros = (): NutritionalInfo => {
    if (item.nutritionalInfo) return item.nutritionalInfo;

    const lowerName = item.name.toLowerCase();
    const totalCals = item.calories || 360;

    let perPcCal = Math.round(totalCals / piecesCount);
    let perPcProtein = 2.5;
    let perPcCarbs = 15;
    let perPcFats = 1.0;
    let perPcFiber = 2.2;
    let gi: 'Low (< 55)' | 'Medium (56-69)' | 'Standard' = 'Low (< 55)';

    if (lowerName.includes('multigrain') || lowerName.includes('7-grain')) {
      perPcProtein = 3.6;
      perPcCarbs = 14;
      perPcFats = 1.2;
      perPcFiber = 3.5;
      gi = 'Low (< 55)';
    } else if (lowerName.includes('ghee') || lowerName.includes('makhan')) {
      perPcProtein = 2.5;
      perPcCarbs = 15;
      perPcFats = 4.5;
      perPcFiber = 2.0;
      gi = 'Low (< 55)';
    } else if (lowerName.includes('bajra') || lowerName.includes('rotla')) {
      perPcProtein = 3.2;
      perPcCarbs = 21;
      perPcFats = 2.0;
      perPcFiber = 3.8;
      gi = 'Low (< 55)';
    } else if (lowerName.includes('jowar') || lowerName.includes('bhakri')) {
      perPcProtein = 2.8;
      perPcCarbs = 20;
      perPcFats = 1.2;
      perPcFiber = 3.2;
      gi = 'Low (< 55)';
    } else if (lowerName.includes('thepla')) {
      perPcProtein = 3.0;
      perPcCarbs = 13;
      perPcFats = 3.2;
      perPcFiber = 2.5;
      gi = 'Low (< 55)';
    } else if (
      item.category === 'homestyle_sabzi' || 
      item.category === 'dal_accompaniment' || 
      item.category === 'combo_box' ||
      item.category === 'rice_khichdi'
    ) {
      // For non-roti items
      const totalProt = Math.round((totalCals * 0.15) / 4);
      const totalCarb = Math.round((totalCals * 0.50) / 4);
      const totalFat = Math.round((totalCals * 0.35) / 9);
      const totalFib = 6;
      return {
        calories: totalCals,
        protein: totalProt,
        carbs: totalCarb,
        fats: totalFat,
        fiber: totalFib,
        servingSize: item.packSize,
        glycemicIndex: 'Low (< 55)',
        ironMg: 2.8,
      };
    }

    const packProtein = Math.round(perPcProtein * piecesCount * 10) / 10;
    const packCarbs = Math.round(perPcCarbs * piecesCount * 10) / 10;
    const packFats = Math.round(perPcFats * piecesCount * 10) / 10;
    const packFiber = Math.round(perPcFiber * piecesCount * 10) / 10;

    return {
      calories: totalCals,
      protein: packProtein,
      carbs: packCarbs,
      fats: packFats,
      fiber: packFiber,
      perRotiCalories: perPcCal,
      perRotiProtein: perPcProtein,
      perRotiCarbs: perPcCarbs,
      perRotiFats: perPcFats,
      perRotiFiber: perPcFiber,
      servingSize: `1 Roti (~35g) / ${item.packSize}`,
      glycemicIndex: gi,
      ironMg: 1.8 * piecesCount,
    };
  };

  const macros = getMacros();

  // Active displayed macros depending on view mode
  const activeCal = viewMode === 'per_piece' && macros.perRotiCalories ? macros.perRotiCalories : macros.calories;
  const activeProtein = viewMode === 'per_piece' && macros.perRotiProtein ? macros.perRotiProtein : macros.protein;
  const activeCarbs = viewMode === 'per_piece' && macros.perRotiCarbs ? macros.perRotiCarbs : macros.carbs;
  const activeFats = viewMode === 'per_piece' && macros.perRotiFats ? macros.perRotiFats : macros.fats;
  const activeFiber = viewMode === 'per_piece' && macros.perRotiFiber ? macros.perRotiFiber : macros.fiber;

  // Calorie breakdown calculation (4 kcal/g protein, 4 kcal/g carbs, 9 kcal/g fat)
  const proteinCals = activeProtein * 4;
  const carbsCals = activeCarbs * 4;
  const fatsCals = activeFats * 9;
  const totalCalcCals = proteinCals + carbsCals + fatsCals || 1;

  const proteinPct = Math.round((proteinCals / totalCalcCals) * 100);
  const carbsPct = Math.round((carbsCals / totalCalcCals) * 100);
  const fatsPct = Math.max(0, 100 - proteinPct - carbsPct);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-[#FFFDF9] w-full max-w-md rounded-3xl border border-[#EFE3D3] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-linear-to-r from-[#3B170B] via-[#4A1E0E] to-[#2B1006] text-[#FEF3C7] p-4 sm:p-5 relative">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#FEF3C7] flex items-center justify-center transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669] border border-white"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FDE68A]">
              100% Pure Veg · Lab Verified
            </span>
          </div>

          <h2 className="font-display font-bold text-base sm:text-lg text-white leading-tight pr-6">
            {item.name}
          </h2>

          <div className="mt-1 flex items-center gap-2 text-xs text-[#EED6B5]">
            <span className="bg-white/15 px-2 py-0.5 rounded-md font-semibold text-[#FEF3C7]">
              {item.packSize}
            </span>
            <span>·</span>
            <span className="font-mono-numbers">₹{item.price}</span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">

          {/* Toggle View: Per Piece vs Full Pack */}
          {isMultiPiece && macros.perRotiCalories && (
            <div className="bg-[#F5ECE0] p-1 rounded-xl flex items-center gap-1 border border-[#E2D0B9]">
              <button
                onClick={() => setViewMode('per_piece')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'per_piece'
                    ? 'bg-[#3B170B] text-[#FEF3C7] shadow-xs'
                    : 'text-[#78350F] hover:text-[#3B170B]'
                }`}
              >
                Per Single Roti / Piece
              </button>
              <button
                onClick={() => setViewMode('full_pack')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'full_pack'
                    ? 'bg-[#3B170B] text-[#FEF3C7] shadow-xs'
                    : 'text-[#78350F] hover:text-[#3B170B]'
                }`}
              >
                Full Pack ({piecesCount} Pcs)
              </button>
            </div>
          )}

          {/* Main Macro Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3B170B] flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5 text-[#D97706]" />
                Nutritional Breakdown ({viewMode === 'per_piece' && isMultiPiece ? 'Per Roti' : 'Full Serving'})
              </span>
              <span className="text-[10px] text-[#8B5E3C]">Zero Preservatives</span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              
              {/* Calories Card */}
              <div className="bg-linear-to-br from-[#FEF3C7] to-[#FDE68A] p-3 rounded-2xl border border-[#F59E0B]/30 flex flex-col justify-between shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#78350F] uppercase">Calories</span>
                  <Flame className="w-4 h-4 text-[#D97706]" />
                </div>
                <div className="mt-2">
                  <div className="text-lg sm:text-xl font-bold font-mono-numbers text-[#2B1006] leading-none">
                    {activeCal}
                  </div>
                  <div className="text-[9px] text-[#8B5E3C] mt-0.5 font-medium">kcal</div>
                </div>
              </div>

              {/* Protein Card */}
              <div className="bg-linear-to-br from-[#ECFDF5] to-[#D1FAE5] p-3 rounded-2xl border border-[#10B981]/30 flex flex-col justify-between shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#065F46] uppercase">Protein</span>
                  <Dumbbell className="w-4 h-4 text-[#059669]" />
                </div>
                <div className="mt-2">
                  <div className="text-lg sm:text-xl font-bold font-mono-numbers text-[#064E3B] leading-none">
                    {activeProtein}g
                  </div>
                  <div className="text-[9px] text-[#047857] mt-0.5 font-medium">Builds Muscle</div>
                </div>
              </div>

              {/* Carbohydrates Card */}
              <div className="bg-linear-to-br from-[#EFF6FF] to-[#DBEAFE] p-3 rounded-2xl border border-[#3B82F6]/30 flex flex-col justify-between shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#1E40AF] uppercase">Carbs</span>
                  <Activity className="w-4 h-4 text-[#2563EB]" />
                </div>
                <div className="mt-2">
                  <div className="text-lg sm:text-xl font-bold font-mono-numbers text-[#1E3A8A] leading-none">
                    {activeCarbs}g
                  </div>
                  <div className="text-[9px] text-[#1D4ED8] mt-0.5 font-medium">Slow Energy</div>
                </div>
              </div>

            </div>

            {/* Secondary Row: Fiber & Fats */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mt-2">
              
              {/* Dietary Fiber */}
              <div className="bg-[#FAF4EB] p-2.5 rounded-xl border border-[#E9D8C2] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-[#78350F] uppercase flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-emerald-600" />
                    Dietary Fiber
                  </div>
                  <div className="text-xs font-semibold text-[#8B5E3C] mt-0.5">Aids Digestion</div>
                </div>
                <div className="text-sm font-bold font-mono-numbers text-[#3B170B]">
                  {activeFiber}g
                </div>
              </div>

              {/* Essential Fats */}
              <div className="bg-[#FAF4EB] p-2.5 rounded-xl border border-[#E9D8C2] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-[#78350F] uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#D97706]" />
                    Healthy Fats
                  </div>
                  <div className="text-xs font-semibold text-[#8B5E3C] mt-0.5">Essential Energy</div>
                </div>
                <div className="text-sm font-bold font-mono-numbers text-[#3B170B]">
                  {activeFats}g
                </div>
              </div>

            </div>
          </div>

          {/* Visual Macro Percentage Bar */}
          <div className="bg-[#FAF4EB] p-3 rounded-2xl border border-[#E9D8C2] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#3B170B]">
              <span>Macro Calorie Split:</span>
              <span className="font-mono-numbers text-[#8B5E3C]">
                {carbsPct}% Carbs · {proteinPct}% Protein · {fatsPct}% Fat
              </span>
            </div>

            <div className="h-2.5 w-full bg-[#E5D7C5] rounded-full overflow-hidden flex">
              <div style={{ width: `${carbsPct}%` }} className="bg-[#3B82F6] h-full" title="Carbs"></div>
              <div style={{ width: `${proteinPct}%` }} className="bg-[#10B981] h-full" title="Protein"></div>
              <div style={{ width: `${fatsPct}%` }} className="bg-[#F59E0B] h-full" title="Fat"></div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#8B5E3C]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span> Carbs ({carbsCals} kcal)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Protein ({proteinCals} kcal)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span> Fats ({fatsCals} kcal)</span>
            </div>
          </div>

          {/* Key Health Benefits */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3B170B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              Dietary Highlights
            </span>

            <div className="grid grid-cols-2 gap-1.5 text-xs text-[#3B170B]">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-medium text-[11px]">Glycemic Index: {macros.glycemicIndex || 'Low'}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-medium text-[11px]">100% Stone-Ground Flour</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-medium text-[11px]">Zero Refined Maida</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-medium text-[11px]">Fresh Flame Puffed</span>
              </div>
            </div>
          </div>

          {/* Ingredients list */}
          <div className="p-3 rounded-2xl bg-[#FAF4EB] border border-[#E9D8C2] space-y-1">
            <span className="text-[11px] font-bold text-[#78350F] block">Ingredients:</span>
            <p className="text-xs text-[#2B1408] leading-snug font-medium">
              {item.ingredients}
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#FAF4EB] border-t border-[#E9D8C2] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-[#3B170B] font-bold text-xs border border-[#DFCBB5] transition-colors"
          >
            Close
          </button>

          {item.canSubscribe && onSubscribe && (
            <button
              onClick={() => {
                onClose();
                onSubscribe(item);
              }}
              className="flex-1 py-2 px-4 rounded-xl bg-[#3B170B] hover:bg-[#2B1006] text-[#FEF3C7] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Subscribe This Roti Daily</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
