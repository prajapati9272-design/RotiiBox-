import React, { useState } from 'react';
import { Clock, CheckCircle2, Sliders, Info, Flame, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CutoffSimulatorBar: React.FC = () => {
  const {
    timeFormatted,
    simulatedHour,
    simulatedMinute,
    setSimulatedTime,
    resetToRealTime,
    isRealTime,
    lunchCutoffMinutesLeft,
    dinnerCutoffMinutesLeft,
    isLunchCutoffPassed,
    isDinnerCutoffPassed,
  } = useApp();

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const formatMins = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="bg-[#FAF3E6] border-b border-[#E8D8C2] text-[11px] sm:text-xs text-[#3B170B] select-none">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
        
        {/* Left: Cutoff Timers & Clock perfectly aligned in one line */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0 whitespace-nowrap leading-none">
          
          {/* Current clock indicator */}
          <div className="flex items-center gap-1 text-[#2B1408] font-semibold shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
            <span className="font-mono-numbers text-[#3B170B] bg-white px-1.5 py-0.5 rounded border border-[#DFCBB5] font-bold text-[11px] sm:text-xs shadow-2xs">
              {timeFormatted}
            </span>
          </div>

          <div className="h-3 w-px bg-[#DFCBB5] shrink-0"></div>

          {/* Lunch Cutoff status */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[#8B5E3C] font-semibold hidden xs:inline">Lunch:</span>
            <span className="text-[#8B5E3C] font-semibold xs:hidden">L:</span>
            {!isLunchCutoffPassed ? (
              <span className="inline-flex items-center gap-1 text-[#78350F] font-bold bg-[#FEF3C7] px-1.5 py-0.5 rounded border border-[#FCD34D] text-[10px] sm:text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-[#D97706] shrink-0" />
                <span>Open ({formatMins(lunchCutoffMinutesLeft)})</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#3B170B] font-bold bg-[#FDE68A] px-1.5 py-0.5 rounded border border-[#F59E0B] text-[10px] sm:text-[11px]">
                <Flame className="w-3 h-3 text-[#B45309] animate-pulse shrink-0" />
                <span>Locked</span>
              </span>
            )}
          </div>

          <div className="h-3 w-px bg-[#DFCBB5] shrink-0"></div>

          {/* Dinner Cutoff status */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[#8B5E3C] font-semibold hidden xs:inline">Dinner:</span>
            <span className="text-[#8B5E3C] font-semibold xs:hidden">D:</span>
            {!isDinnerCutoffPassed ? (
              <span className="inline-flex items-center gap-1 text-[#78350F] font-bold bg-[#FEF3C7] px-1.5 py-0.5 rounded border border-[#FCD34D] text-[10px] sm:text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-[#D97706] shrink-0" />
                <span>Open ({formatMins(dinnerCutoffMinutesLeft)})</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#3B170B] font-bold bg-[#FDE68A] px-1.5 py-0.5 rounded border border-[#F59E0B] text-[10px] sm:text-[11px]">
                <Flame className="w-3 h-3 text-[#B45309] animate-pulse shrink-0" />
                <span>Locked</span>
              </span>
            )}
          </div>

        </div>

        {/* Right: Compact Simulator Toggle Button in One Line */}
        <div className="shrink-0 flex items-center leading-none">
          <button
            onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#FAF0DC] hover:bg-[#F6E6C9] border border-[#DFCBB5] text-[#3B170B] font-semibold transition-colors shadow-2xs text-[10px] sm:text-[11px] whitespace-nowrap"
            title="Simulate day hours to test cutoff locks"
          >
            <Sliders className="w-3 h-3 text-[#D97706] shrink-0" />
            <span>Simulate</span>
            {isSimulatorOpen ? (
              <ChevronUp className="w-3 h-3 text-[#8B5E3C] shrink-0" />
            ) : (
              <ChevronDown className="w-3 h-3 text-[#8B5E3C] shrink-0" />
            )}
          </button>
        </div>

      </div>

      {/* Simulator Dropdown Panel */}
      {isSimulatorOpen && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-3 pt-1 border-t border-amber-200/60 animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-stone-600 mb-1.5">
            <Info className="w-3 h-3 text-amber-700 shrink-0" />
            <span>
              Simulate day hours to see how RottiBox allows changes before 10:30 AM / 6:30 PM cutoffs and locks once baking starts:
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setSimulatedTime(9, 15)}
              className={`p-2 rounded-lg text-left border transition-all text-xs ${
                simulatedHour === 9 && simulatedMinute === 15
                  ? 'bg-amber-100 border-amber-400 font-semibold text-amber-950 shadow-2xs'
                  : 'bg-white border-stone-200 hover:border-amber-300'
              }`}
            >
              <div className="font-bold text-stone-900">09:15 AM (Morning)</div>
              <div className="text-[10px] text-emerald-800">Lunch & Dinner Open</div>
            </button>

            <button
              onClick={() => setSimulatedTime(11, 0)}
              className={`p-2 rounded-lg text-left border transition-all text-xs ${
                simulatedHour === 11 && simulatedMinute === 0
                  ? 'bg-amber-100 border-amber-400 font-semibold text-amber-950 shadow-2xs'
                  : 'bg-white border-stone-200 hover:border-amber-300'
              }`}
            >
              <div className="font-bold text-stone-900">11:00 AM (Midday)</div>
              <div className="text-[10px] text-amber-800">Lunch Locked (Baking)</div>
            </button>

            <button
              onClick={() => setSimulatedTime(17, 45)}
              className={`p-2 rounded-lg text-left border transition-all text-xs ${
                simulatedHour === 17 && simulatedMinute === 45
                  ? 'bg-amber-100 border-amber-400 font-semibold text-amber-950 shadow-2xs'
                  : 'bg-white border-stone-200 hover:border-amber-300'
              }`}
            >
              <div className="font-bold text-stone-900">05:45 PM (Evening)</div>
              <div className="text-[10px] text-emerald-800">Dinner Open (45m left)</div>
            </button>

            <button
              onClick={resetToRealTime}
              className={`p-2 rounded-lg text-left border transition-all text-xs ${
                isRealTime
                  ? 'bg-amber-100 border-amber-400 font-semibold text-amber-950 shadow-2xs'
                  : 'bg-white border-stone-200 hover:border-amber-300'
              }`}
            >
              <div className="font-bold text-stone-900">Live Device Time</div>
              <div className="text-[10px] text-stone-500">Sync actual clock</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
