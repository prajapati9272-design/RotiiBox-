import React from 'react';
import { Flame, Clock, Sparkles, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';

interface HeroSectionProps {
  onExplorePlans: () => void;
  onExploreRegular: () => void;
  onOpenSchedule: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplorePlans,
  onExploreRegular,
  onOpenSchedule,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-stone-50/60 to-stone-100/40 border-b border-stone-200/80 pt-8 pb-12 sm:pt-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Value Propositions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
            {/* Unboxed clean metadata kicker (Zero-pill discipline) */}
            <div className="flex items-center gap-2 text-xs font-medium text-amber-800 tracking-wide uppercase">
              <span>Fresh Tawa Delivery</span>
              <span aria-hidden="true" className="text-amber-400">·</span>
              <span>100% Sharbati Whole Wheat</span>
              <span aria-hidden="true" className="text-amber-400">·</span>
              <span>Zero Maida</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-900 tracking-tight leading-[1.12]" style={{ textWrap: 'balance' }}>
              Piping-hot handcrafted rotis. Delivered fresh daily on your schedule.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl font-normal leading-relaxed">
              Subscribe to daily lunch and dinner boxes with flexible cutoff times. Change roti counts, swap to multigrain, or skip today before 10:30 AM with instant wallet rollovers. Also available for on-demand regular orders.
            </p>

            {/* Value Highlights in Clean Unboxed Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-stone-700 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white/80 border border-stone-200 shadow-2xs">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-900">Flexible Daily Tuning</div>
                  <div className="text-stone-500 text-[11px] mt-0.5">Edit counts or pause before 10:30 AM & 6:30 PM</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white/80 border border-stone-200 shadow-2xs">
                <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-900">Baked to Order</div>
                  <div className="text-stone-500 text-[11px] mt-0.5">Rolled & flame puffed 25 mins before delivery</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white/80 border border-stone-200 shadow-2xs">
                <RotateCcw className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-900">100% Skip Rollover</div>
                  <div className="text-stone-500 text-[11px] mt-0.5">Skipped meals converted to reusable wallet balance</div>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onExplorePlans}
                className="px-6 py-3 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <span>View Subscription Plans</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenSchedule}
                className="px-5 py-3 rounded-lg bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 font-semibold text-sm transition-colors flex items-center gap-2 whitespace-nowrap shadow-2xs"
              >
                <span>Tune Today's Order</span>
              </button>

              <button
                onClick={onExploreRegular}
                className="px-4 py-3 rounded-lg text-amber-900 hover:text-amber-800 font-medium text-sm transition-colors whitespace-nowrap"
              >
                Order Regular Phulkas Now →
              </button>
            </div>

          </div>

          {/* Right Column: Artisanal Tawa & Roti Showcase Visual Container */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-stone-900 p-6 text-white overflow-hidden shadow-xl border border-stone-800">
              {/* Background ambient warm glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-600/30 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-8 -left-8 w-44 h-44 bg-orange-700/20 rounded-full blur-2xl pointer-events-none"></div>

              {/* Artisanal Cast Iron Tawa & Fresh Roti Graphic */}
              <div className="relative flex flex-col items-center justify-center py-6 text-center">
                
                {/* SVG Cast Iron Tawa with Puffed Phulka */}
                <div className="relative w-56 h-56 flex items-center justify-center">
                  {/* Cast iron tawa plate rim */}
                  <div className="w-52 h-52 rounded-full bg-stone-800 border-4 border-stone-700 flex items-center justify-center shadow-inner relative">
                    {/* Tawa inner heat surface */}
                    <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-stone-800 via-stone-850 to-amber-950/60 flex items-center justify-center relative overflow-hidden">
                      {/* Subtle steam particles */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <div className="w-32 h-32 rounded-full border border-dashed border-amber-300/40 animate-spin" style={{ animationDuration: '30s' }}></div>
                      </div>

                      {/* Golden flame puffed Phulka */}
                      <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-amber-100 via-amber-200 to-amber-50 shadow-md flex items-center justify-center relative p-3 border border-amber-300/60">
                        {/* Characteristic charred spots on authentic roti */}
                        <div className="absolute top-6 left-10 w-3 h-2 rounded-full bg-amber-900/60 blur-[0.5px]"></div>
                        <div className="absolute bottom-8 right-8 w-4 h-2.5 rounded-full bg-stone-800/50 blur-[0.5px]"></div>
                        <div className="absolute top-14 right-7 w-2 h-2 rounded-full bg-amber-800/60 blur-[0.5px]"></div>
                        <div className="absolute bottom-11 left-11 w-3 h-2 rounded-full bg-amber-950/50 blur-[0.5px]"></div>
                        <div className="absolute inset-x-8 top-1/2 h-1 bg-amber-350/50 rounded-full filter blur-[1px]"></div>
                        
                        {/* Center ghee sheen indication */}
                        <div className="w-12 h-12 rounded-full bg-amber-300/40 blur-xs"></div>
                      </div>
                    </div>
                  </div>

                  {/* Cast iron handle representation */}
                  <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-8 h-4 rounded-l-md bg-stone-700 border border-stone-600"></div>
                </div>

                {/* Live baking indicator text */}
                <div className="mt-4 flex items-center gap-2 text-xs font-mono-numbers text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <span>Oven & Tawa Fresh · Insulated Hot Pack</span>
                </div>

                <div className="mt-2 text-sm font-semibold text-stone-200">
                  Desi Gir Cow Ghee Phulka
                </div>
                <div className="text-xs text-stone-400 max-w-xs mt-1">
                  100% stone-ground MP Sharbati wheat puffed over live flame, packaged in moisture-controlled foil casing.
                </div>
              </div>

              {/* Bottom Quick Specs Strip */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-800 text-center">
                <div>
                  <div className="text-xs font-mono-numbers text-amber-400 font-bold">10:30 AM</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">Lunch Cutoff</div>
                </div>
                <div>
                  <div className="text-xs font-mono-numbers text-amber-400 font-bold">06:30 PM</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">Dinner Cutoff</div>
                </div>
                <div>
                  <div className="text-xs font-mono-numbers text-emerald-400 font-bold">₹0 Fee</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">Sub Delivery</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
