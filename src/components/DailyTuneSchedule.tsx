import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Flame, 
  Lock, 
  Check, 
  Plus, 
  Minus, 
  RotateCcw, 
  AlertTriangle, 
  Sliders, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
  PlusCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ROTI_VARIANTS } from '../data/mockData';
import { RotiType, DailyMealSchedule, RotiSpreadOption, ScheduleExtraItem } from '../types';

export const DailyTuneSchedule: React.FC = () => {
  const {
    activeSubscription,
    schedule,
    updateScheduleMeal,
    skipMealForDate,
    unskipMealForDate,
    timeFormatted,
    isLunchCutoffPassed,
    isDinnerCutoffPassed,
    lunchCutoffMinutesLeft,
    dinnerCutoffMinutesLeft,
    showToast,
    menuItems,
  } = useApp();

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // State to track item selection dropdown per meal slot
  const [selectedAddonMap, setSelectedAddonMap] = useState<{ [key: string]: string }>({});

  // Filter schedule for the selected day
  const todayDateStr = new Date().toISOString().split('T')[0];
  const uniqueDates = Array.from(new Set(schedule.map((item) => item.date)));
  const currentDate = uniqueDates[selectedDayIndex] || todayDateStr;
  const dayMeals = schedule.filter((item) => item.date === currentDate);
  const isSelectedDateToday = currentDate === todayDateStr;

  const getRotiVariant = (id: RotiType) => ROTI_VARIANTS.find((r) => r.id === id) || ROTI_VARIANTS[0];

  // Extra Item Handlers
  const handleAddExtraItem = (mealDate: string, mealSlot: 'lunch' | 'dinner') => {
    const key = `${mealDate}-${mealSlot}`;
    const selectedItemId = selectedAddonMap[key];
    if (!selectedItemId) {
      showToast('Please select a side dish or extra item to add');
      return;
    }

    const itemToAdd = menuItems.find((i) => i.id === selectedItemId);
    if (!itemToAdd) return;

    const currentMeal = schedule.find((s) => s.date === mealDate && s.mealSlot === mealSlot);
    if (!currentMeal) return;

    const currentExtraItems = currentMeal.extraItems || [];
    const existingIndex = currentExtraItems.findIndex((e) => e.itemId === itemToAdd.id);

    let updatedExtras: ScheduleExtraItem[];
    if (existingIndex >= 0) {
      updatedExtras = currentExtraItems.map((e, idx) =>
        idx === existingIndex ? { ...e, quantity: e.quantity + 1 } : e
      );
    } else {
      updatedExtras = [
        ...currentExtraItems,
        {
          id: `extra_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          itemId: itemToAdd.id,
          name: itemToAdd.name,
          packSize: itemToAdd.packSize,
          price: itemToAdd.price,
          quantity: 1,
        },
      ];
    }

    updateScheduleMeal(mealDate, mealSlot, { extraItems: updatedExtras });
    showToast(`Added "${itemToAdd.name}" to ${mealSlot} schedule!`);
    
    // reset selection
    setSelectedAddonMap((prev) => ({ ...prev, [key]: '' }));
  };

  const handleUpdateExtraQuantity = (
    mealDate: string, 
    mealSlot: 'lunch' | 'dinner', 
    extraId: string, 
    delta: number
  ) => {
    const currentMeal = schedule.find((s) => s.date === mealDate && s.mealSlot === mealSlot);
    if (!currentMeal) return;

    const currentExtraItems = currentMeal.extraItems || [];
    const updatedExtras = currentExtraItems
      .map((e) => (e.id === extraId ? { ...e, quantity: e.quantity + delta } : e))
      .filter((e) => e.quantity > 0);

    updateScheduleMeal(mealDate, mealSlot, { extraItems: updatedExtras });
  };

  const handleRemoveExtraItem = (mealDate: string, mealSlot: 'lunch' | 'dinner', extraId: string) => {
    const currentMeal = schedule.find((s) => s.date === mealDate && s.mealSlot === mealSlot);
    if (!currentMeal) return;

    const updatedExtras = (currentMeal.extraItems || []).filter((e) => e.id !== extraId);
    updateScheduleMeal(mealDate, mealSlot, { extraItems: updatedExtras });
    showToast('Removed item from meal schedule');
  };

  if (!activeSubscription) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center max-w-2xl mx-auto my-8">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center mb-3">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-display font-bold text-stone-900">No Active Roti Subscription</h3>
        <p className="text-stone-600 text-sm mt-1 max-w-md mx-auto">
          Subscribe to a daily plan to customize your daily meal calendar, tune delivery slots, add extra side dishes, and enjoy automatic cutoff rollovers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
              <span>Active Plan</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-stone-800">{activeSubscription.planName}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-800 font-mono-numbers">ID: {activeSubscription.id}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 mt-1">
              Daily Meal Schedule
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Select any day below to change roti quantity, choose roti variety, or pause your meal.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto bg-stone-50 border border-stone-200 px-3.5 py-2 rounded-lg">
            <div className="text-right text-xs">
              <div className="text-stone-500 font-medium">Credits Saved</div>
              <div className="font-mono-numbers font-bold text-emerald-700">₹{activeSubscription.creditsEarned}</div>
            </div>
            <div className="h-7 w-px bg-stone-200"></div>
            <div className="text-right text-xs">
              <div className="text-stone-500 font-medium">Days Left</div>
              <div className="font-mono-numbers font-bold text-stone-900">{activeSubscription.remainingDays} Days</div>
            </div>
          </div>
        </div>

        {/* 7-Day Date Selector Ribbon */}
        <div className="pt-4">
          <div className="text-xs font-semibold text-stone-700 mb-2 flex items-center justify-between">
            <span>Select a day to view or edit:</span>
            <span className="text-stone-400 font-normal">Cutoffs: 10:30 AM & 6:30 PM</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {uniqueDates.map((dateStr, index) => {
              const meals = schedule.filter((s) => s.date === dateStr);
              const isToday = dateStr === todayDateStr;
              const hasSkipped = meals.some((m) => m.status === 'skipped');
              const d = new Date(dateStr);
              const dayName = isToday ? 'Today' : index === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
              const dayDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDayIndex(index)}
                  className={`p-3 rounded-lg text-left transition-all border ${
                    selectedDayIndex === index
                      ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500 shadow-2xs'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${selectedDayIndex === index ? 'text-amber-900' : 'text-stone-800'}`}>
                      {dayName}
                    </span>
                    {hasSkipped && (
                      <span className="text-[10px] text-amber-600 font-medium bg-amber-100/60 px-1 rounded">
                        Skipped
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono-numbers mt-0.5">
                    {dayDate}
                  </div>
                  <div className="text-[11px] text-stone-600 mt-1.5 flex items-center gap-1">
                    <span>{meals.reduce((sum, m) => sum + (m.status === 'skipped' ? 0 : m.rotiCount), 0)} Rotis</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Day's Meals: Lunch & Dinner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dayMeals.map((meal) => {
          const isLunch = meal.mealSlot === 'lunch';
          const cutoffLabel = isLunch ? '10:30 AM' : '06:30 PM';
          const isCutoffPassed = isSelectedDateToday ? (isLunch ? isLunchCutoffPassed : isDinnerCutoffPassed) : false;
          const minsLeft = isLunch ? lunchCutoffMinutesLeft : dinnerCutoffMinutesLeft;
          const currentVariant = getRotiVariant(meal.rotiType);
          const isSkipped = meal.status === 'skipped';
          const extraItems = meal.extraItems || [];
          const mealKey = `${meal.date}-${meal.mealSlot}`;

          return (
            <div
              key={mealKey}
              className={`rounded-xl border transition-all overflow-hidden ${
                isSkipped
                  ? 'bg-stone-50/80 border-stone-200 opacity-80'
                  : isCutoffPassed
                  ? 'bg-white border-stone-200/90'
                  : 'bg-white border-amber-300/80 shadow-2xs'
              }`}
            >
              {/* Card Header Strip with Cutoff Status */}
              <div className={`px-5 py-3.5 border-b flex items-center justify-between ${
                isSkipped
                  ? 'bg-stone-100 border-stone-200 text-stone-600'
                  : isCutoffPassed
                  ? 'bg-stone-100/70 border-stone-200 text-stone-800'
                  : 'bg-amber-50/80 border-amber-200/80 text-amber-950'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-base capitalize">
                    {meal.dayLabel}
                  </span>
                  <span className="text-xs text-stone-500 font-normal">
                    ({meal.formattedDate})
                  </span>
                </div>

                {/* Status indicator */}
                <div className="text-xs font-semibold">
                  {isSkipped ? (
                    <span className="text-stone-500 flex items-center gap-1">
                      <span>Meal Paused — Wallet Credited</span>
                    </span>
                  ) : isCutoffPassed ? (
                    <span className="text-amber-800 flex items-center gap-1 bg-amber-100/90 px-2 py-0.5 rounded font-bold">
                      <span>In Kitchen Preparation ({cutoffLabel})</span>
                    </span>
                  ) : (
                    <span className="text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>
                        {isSelectedDateToday
                          ? `${minsLeft}m left to edit (${cutoffLabel})`
                          : `Editable until ${cutoffLabel}`}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                
                {/* Visual Primary Roti Details Banner */}
                <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900">{currentVariant.name}</span>
                      <span className="text-xs text-stone-500">{currentVariant.hindiName}</span>
                    </div>
                    <div className="text-xs text-stone-600 mt-0.5">
                      {currentVariant.flourComposition}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-2">
                      <span>{currentVariant.caloriesPerPiece * meal.rotiCount} kcal total</span>
                      <span aria-hidden="true">·</span>
                      <span>{meal.gheeApplied ? 'Brushed with Desi Ghee' : 'No Ghee (Plain)'}</span>
                    </div>
                  </div>

                  {/* Primary Count display */}
                  <div className="text-right shrink-0">
                    <div className="text-xs text-stone-500 font-medium">Roti Quantity</div>
                    <div className="text-2xl font-mono-numbers font-bold text-amber-800">
                      {isSkipped ? 0 : meal.rotiCount} <span className="text-xs font-normal text-stone-500">pcs</span>
                    </div>
                  </div>
                </div>

                {/* Additional Accompaniments / Side Dishes List */}
                {extraItems.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-bold text-stone-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700" />
                        <span>Extra Side Dishes & Added Items ({extraItems.length}):</span>
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {extraItems.map((extra) => (
                        <div key={extra.id} className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/70 text-xs">
                          <div>
                            <span className="font-bold text-stone-900">{extra.name}</span>
                            <span className="text-[#8B5E3C] text-[11px] ml-1.5">({extra.packSize})</span>
                            <div className="text-[11px] font-mono-numbers text-stone-600">₹{extra.price} x {extra.quantity} = ₹{extra.price * extra.quantity}</div>
                          </div>

                          {!isCutoffPassed && !isSkipped && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleUpdateExtraQuantity(meal.date, meal.mealSlot, extra.id, -1)}
                                className="w-6 h-6 rounded bg-white border border-stone-300 hover:bg-stone-100 flex items-center justify-center font-bold text-stone-800"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-5 text-center font-mono-numbers font-bold text-stone-900">
                                {extra.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateExtraQuantity(meal.date, meal.mealSlot, extra.id, 1)}
                                className="w-6 h-6 rounded bg-white border border-stone-300 hover:bg-stone-100 flex items-center justify-center font-bold text-stone-800"
                              >
                                <Plus className="w-3 h-3" />
                              </button>

                              <button
                                onClick={() => handleRemoveExtraItem(meal.date, meal.mealSlot, extra.id)}
                                className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors ml-1"
                                title="Remove extra item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Delivery Time Slot & Window */}
                <div className="flex items-center justify-between text-xs text-stone-700 py-1">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Delivery Slot:</span>
                  </span>
                  <span className="font-semibold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                    {meal.deliveryTimeSlot}
                  </span>
                </div>

                {/* Status Notice if Locked */}
                {isCutoffPassed && !isSkipped && (
                  <div className="p-3 rounded-lg bg-stone-100 border border-stone-200 text-xs text-stone-700 flex items-start gap-2.5">
                    <Flame className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-900">Order Confirmed for Kitchen</div>
                      <div className="text-stone-600 text-[11px] mt-0.5">
                        Cutoff time was {cutoffLabel}. Fresh dough preparation has begun for delivery.
                      </div>
                    </div>
                  </div>
                )}

                {/* Interactive Controls (Visible when NOT locked) */}
                {!isCutoffPassed && (
                  <div className="space-y-4 pt-2 border-t border-stone-100">
                    
                    {/* Quantity Control */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-800">
                          Roti Quantity:
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            disabled={meal.rotiCount <= 1 || isSkipped}
                            onClick={() =>
                              updateScheduleMeal(meal.date, meal.mealSlot, {
                                rotiCount: Math.max(1, meal.rotiCount - 1),
                              })
                            }
                            className="w-8 h-8 rounded border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-40 flex items-center justify-center text-stone-800 transition-colors shadow-2xs cursor-pointer"
                            title="Decrease 1 roti"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <input
                            type="number"
                            min={1}
                            max={100}
                            disabled={isSkipped}
                            value={meal.rotiCount}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val) && val >= 1) {
                                updateScheduleMeal(meal.date, meal.mealSlot, {
                                  rotiCount: Math.min(100, val),
                                });
                              }
                            }}
                            className="w-14 text-center font-mono-numbers font-extrabold text-sm text-stone-900 bg-amber-50/80 border border-amber-300 rounded py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
                          />

                          <button
                            disabled={isSkipped || meal.rotiCount >= 100}
                            onClick={() =>
                              updateScheduleMeal(meal.date, meal.mealSlot, {
                                rotiCount: Math.min(100, meal.rotiCount + 1),
                              })
                            }
                            className="w-8 h-8 rounded border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-40 flex items-center justify-center text-stone-800 transition-colors shadow-2xs cursor-pointer"
                            title="Increase 1 roti"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Quick Quantity Presets Buttons (+1, +2, +5, +10) */}
                      {!isSkipped && (
                        <div className="flex items-center justify-between text-[11px] gap-1.5 pt-1">
                          <span className="text-stone-500 font-medium shrink-0">Quick Add:</span>
                          <div className="flex items-center gap-1 flex-wrap">
                            {[1, 2, 5, 10].map((preset) => (
                              <button
                                key={preset}
                                onClick={() =>
                                  updateScheduleMeal(meal.date, meal.mealSlot, {
                                    rotiCount: Math.min(100, meal.rotiCount + preset),
                                  })
                                }
                                className="px-2.5 py-0.5 rounded bg-amber-100/80 hover:bg-amber-200 text-amber-900 font-bold border border-amber-300/80 transition-colors text-[11px] cursor-pointer"
                              >
                                +{preset}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Select Roti Variety */}
                    <div>
                      <div className="text-xs font-semibold text-stone-800 mb-1.5">
                        Select Roti Variety:
                      </div>
                      <select
                        disabled={isSkipped}
                        value={meal.rotiType}
                        onChange={(e) =>
                          updateScheduleMeal(meal.date, meal.mealSlot, {
                            rotiType: e.target.value as RotiType,
                          })
                        }
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        {ROTI_VARIANTS.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.flourComposition})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* ADD EXTRA ITEMS (Sabzi / Dal / Khichdi) */}
                    {!isSkipped && (
                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2">
                        <div className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                          <PlusCircle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Add Extra Sabzi, Dal or Rice to Delivery:</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={selectedAddonMap[mealKey] || ''}
                            onChange={(e) =>
                              setSelectedAddonMap((prev) => ({
                                ...prev,
                                [mealKey]: e.target.value,
                              }))
                            }
                            className="flex-1 text-xs bg-white border border-stone-300 rounded-lg p-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            <option value="">-- Select extra item to add --</option>
                            {menuItems.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name} ({item.packSize}) - ₹{item.price}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => handleAddExtraItem(meal.date, meal.mealSlot)}
                            className="px-3 py-2 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1 shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Ghee and Delivery Slot Fine Tuning */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1 font-medium">Preparation / Spread</label>
                        <select
                          disabled={isSkipped}
                          value={meal.spreadOption || (meal.gheeApplied ? 'ghee' : 'plain')}
                          onChange={(e) => {
                            const spread = e.target.value as RotiSpreadOption;
                            updateScheduleMeal(meal.date, meal.mealSlot, {
                              spreadOption: spread,
                              gheeApplied: spread === 'ghee',
                            });
                          }}
                          className="w-full bg-white border border-stone-300 rounded p-1.5 text-xs text-stone-800"
                        >
                          <option value="oil">Oil</option>
                          <option value="ghee">Ghee</option>
                          <option value="butter">Butter</option>
                          <option value="white_butter">White butter</option>
                          <option value="plain">Plain</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1 font-medium">Tune Slot</label>
                        <select
                          disabled={isSkipped}
                          value={meal.deliveryTimeSlot}
                          onChange={(e) =>
                            updateScheduleMeal(meal.date, meal.mealSlot, {
                              deliveryTimeSlot: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-stone-300 rounded p-1.5 text-xs text-stone-800"
                        >
                          {isLunch ? (
                            <>
                              <option value="12:00 PM - 12:30 PM">Early (12:00 - 12:30 PM)</option>
                              <option value="12:30 PM - 01:15 PM">Standard (12:30 - 01:15 PM)</option>
                              <option value="01:15 PM - 02:00 PM">Late (01:15 - 02:00 PM)</option>
                            </>
                          ) : (
                            <>
                              <option value="07:15 PM - 07:45 PM">Early (07:15 - 07:45 PM)</option>
                              <option value="07:45 PM - 08:30 PM">Standard (07:45 - 08:30 PM)</option>
                              <option value="08:30 PM - 09:15 PM">Late (08:30 - 09:15 PM)</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    {/* Skip or Reactivate Action */}
                    <div className="pt-2 flex items-center justify-between">
                      {isSkipped ? (
                        <button
                          onClick={() => unskipMealForDate(meal.date, meal.mealSlot)}
                          className="w-full py-2 px-3 rounded-lg bg-[#3B170B] hover:bg-[#2B1006] text-[#FEF3C7] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Resume Meal Delivery</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => skipMealForDate(meal.date, meal.mealSlot)}
                          className="w-full py-2 px-3 rounded-lg bg-stone-100 hover:bg-amber-50 text-stone-800 hover:text-amber-900 font-semibold text-xs transition-all border border-stone-300 hover:border-amber-300 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Pause Meal Today (Get ₹36 Wallet Refund)</span>
                        </button>
                      )}
                    </div>

                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* Simple Rules Callout */}
      <div className="bg-stone-100/80 rounded-xl p-4 sm:p-5 border border-stone-200 text-xs text-stone-700 space-y-2">
        <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Simple Meal Schedule Rules</span>
        </div>
        <p className="text-stone-600 text-xs leading-relaxed">
          Every roti is rolled and flame-puffed fresh right before your delivery slot.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-stone-800">
          <div className="p-3 rounded-lg bg-white border border-stone-200">
            <strong className="text-stone-900 font-bold block mb-0.5">Lunch Changes (Before 10:30 AM):</strong>
            <p className="text-stone-500 text-[11px]">Adjust lunch rotis or pause for 100% wallet credit.</p>
          </div>
          <div className="p-3 rounded-lg bg-white border border-stone-200">
            <strong className="text-stone-900 font-bold block mb-0.5">Dinner Changes (Before 06:30 PM):</strong>
            <p className="text-stone-500 text-[11px]">Adjust dinner rotis or pause before fresh baking begins.</p>
          </div>
          <div className="p-3 rounded-lg bg-white border border-stone-200">
            <strong className="text-stone-900 font-bold block mb-0.5">Instant Wallet Refund:</strong>
            <p className="text-stone-500 text-[11px]">Paused meal credits never expire and can be used anytime.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
