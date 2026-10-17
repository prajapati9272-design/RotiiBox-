import React from 'react';
import { RegularMenuItem } from '../types';
import { Flame, Sparkles } from 'lucide-react';

interface ItemVisualProps {
  item: RegularMenuItem;
  className?: string;
}

export const ItemVisual: React.FC<ItemVisualProps> = ({ item, className = '' }) => {
  const itemId = item.id;

  // Render specific dish illustration based on item ID and recipe
  const renderDishArtwork = () => {
    switch (itemId) {
      // 1. MP Sharbati Phulka: Balloon-puffed live flame roti with steam
      case 'sharbati_phulka_5':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Ambient hot tawa glow */}
            <div className="absolute w-24 h-24 rounded-full bg-amber-400/25 blur-md animate-pulse"></div>
            
            {/* Steam wisps */}
            <div className="absolute -top-1 flex gap-1.5 z-10 opacity-75">
              <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="text-amber-700/60">
                <path d="M6 18C4 12 7 8 5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M14 16C12 9 15 5 13 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M22 18C20 11 23 7 21 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Brass Thali Rim subtle accent */}
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-tr from-amber-200/60 via-amber-100 to-amber-50 p-1 shadow-md border border-amber-300/80 flex items-center justify-center">
              {/* Balloon puffed golden roti */}
              <div className="relative w-full h-full rounded-full bg-radial from-amber-100 via-amber-200 to-amber-300/90 shadow-inner overflow-hidden border border-amber-400/50 flex items-center justify-center">
                {/* 3D Balloon puff highlight */}
                <div className="absolute top-2 left-3 w-8 h-8 rounded-full bg-white/40 blur-xs"></div>
                {/* Authentic roasted flame char spots */}
                <span className="absolute top-3 left-6 w-3 h-2 rounded-full bg-amber-950/70 rotate-12"></span>
                <span className="absolute top-6 left-3 w-2 h-2 rounded-full bg-amber-900/60"></span>
                <span className="absolute top-4 right-5 w-3.5 h-2 rounded-full bg-stone-900/65 -rotate-6"></span>
                <span className="absolute bottom-5 right-4 w-3 h-2.5 rounded-full bg-amber-950/75"></span>
                <span className="absolute bottom-3 left-7 w-4 h-2 rounded-full bg-stone-900/60"></span>
                <span className="absolute top-10 right-8 w-2 h-1.5 rounded-full bg-amber-800/70"></span>
                <span className="absolute bottom-7 left-4 w-2.5 h-2 rounded-full bg-amber-900/70"></span>
                {/* Center golden soft belly */}
                <div className="w-10 h-10 rounded-full bg-amber-300/30 blur-xs"></div>
              </div>
            </div>
          </div>
        );

      // 2. Desi Gir Cow A2 Ghee Phulka: Glistening with melting ghee droplet
      case 'desi_ghee_phulka_5':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Rich golden ghee radiance */}
            <div className="absolute w-26 h-26 rounded-full bg-amber-400/30 blur-md"></div>
            
            {/* Sparkle badge */}
            <div className="absolute top-1 right-3 z-10 text-amber-500">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400 drop-shadow-xs" />
            </div>

            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-amber-300 via-amber-200 to-amber-400 p-1 shadow-md border border-amber-400/80 flex items-center justify-center">
              <div className="relative w-full h-full rounded-full bg-radial from-amber-50 via-amber-100 to-amber-300 shadow-inner overflow-hidden border border-amber-300 flex items-center justify-center">
                {/* Golden Ghee Gloss Glaze */}
                <div className="absolute inset-1 rounded-full bg-linear-to-tr from-amber-400/20 via-transparent to-amber-200/50"></div>
                {/* Char spots */}
                <span className="absolute top-4 left-5 w-3 h-2 rounded-full bg-amber-950/60"></span>
                <span className="absolute bottom-4 right-5 w-3 h-2 rounded-full bg-stone-900/60"></span>
                <span className="absolute top-5 right-5 w-2 h-2 rounded-full bg-amber-900/60"></span>
                <span className="absolute bottom-5 left-6 w-2.5 h-1.5 rounded-full bg-amber-950/60"></span>
                {/* Center Melting A2 Ghee Droplet */}
                <div className="relative w-6 h-6 rounded-full bg-linear-to-br from-amber-300 via-amber-400 to-yellow-500 shadow-sm border border-amber-300/80 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/70 blur-2xs -mt-1 -ml-1"></div>
                </div>
              </div>
            </div>
          </div>
        );

      // 3. High Protein 7-Grain Roti: Multi-seed, flaxseed & ragi texture
      case 'high_protein_multigrain_5':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-tr from-stone-400 via-stone-300 to-amber-200 p-1 shadow-md border border-stone-400/70 flex items-center justify-center">
              <div className="relative w-full h-full rounded-full bg-radial from-amber-100 via-stone-200 to-stone-300 shadow-inner overflow-hidden border border-stone-400/50 flex items-center justify-center">
                {/* Visible multigrain specks & flaxseeds */}
                <span className="absolute top-3 left-4 w-1.5 h-1.5 rounded-full bg-amber-900"></span>
                <span className="absolute top-7 left-3 w-2 h-1 rounded-full bg-stone-800 rotate-45"></span>
                <span className="absolute top-4 right-5 w-1.5 h-1.5 rounded-full bg-stone-700"></span>
                <span className="absolute bottom-4 right-4 w-2 h-1 rounded-full bg-amber-950 -rotate-30"></span>
                <span className="absolute bottom-5 left-5 w-1.5 h-1.5 rounded-full bg-stone-900"></span>
                <span className="absolute top-6 right-8 w-2 h-1 rounded-full bg-amber-900 rotate-12"></span>
                <span className="absolute bottom-7 right-7 w-1.5 h-1.5 rounded-full bg-stone-800"></span>
                {/* Sprouted grains dusting */}
                <div className="w-12 h-12 rounded-full border border-dashed border-stone-400/40 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-emerald-800 bg-white/80 px-1 rounded-xs">7-Grain</span>
                </div>
              </div>
            </div>
          </div>
        );

      // 4. Solapuri Jowar Bhakri: Chalky white sorghum flatbread
      case 'low_gluten_jowar_3':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-tr from-stone-300 via-stone-200 to-stone-100 p-1 shadow-md border border-stone-300 flex items-center justify-center">
              <div className="relative w-full h-full rounded-full bg-radial from-stone-50 via-stone-100 to-stone-200 shadow-inner overflow-hidden border border-stone-200 flex items-center justify-center">
                {/* Chalky rustic surface & soft earthen char marks */}
                <span className="absolute top-4 left-5 w-2.5 h-1.5 rounded-full bg-stone-700/50"></span>
                <span className="absolute bottom-5 right-5 w-3 h-2 rounded-full bg-stone-800/40"></span>
                <span className="absolute top-6 right-6 w-2 h-1.5 rounded-full bg-stone-600/40"></span>
                <span className="absolute bottom-4 left-6 w-2 h-1.5 rounded-full bg-stone-700/40"></span>
                <span className="absolute top-3 right-4 w-1.5 h-1 rounded-full bg-amber-900/40"></span>
                {/* Clay plate flour ring */}
                <div className="w-12 h-12 rounded-full border border-stone-300/60 bg-white/40 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-stone-600 uppercase tracking-wider">Jowar</span>
                </div>
              </div>
            </div>
          </div>
        );

      // 5. Kathiyawadi Bajra Rotla: Thick dark millet rotla with white butter (makhan) & gud
      case 'bajra_rotla_makhan_2':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Clay tawa ring */}
            <div className="relative w-23 h-23 sm:w-25 sm:h-25 rounded-full bg-linear-to-tr from-stone-600 via-stone-500 to-amber-900/60 p-1 shadow-md border border-stone-600 flex items-center justify-center">
              <div className="relative w-full h-full rounded-full bg-radial from-stone-400 via-stone-500 to-stone-600 shadow-inner overflow-hidden border border-stone-500 flex items-center justify-center">
                {/* Rustic clay roast blisters */}
                <span className="absolute top-3 left-4 w-3.5 h-2 rounded-full bg-stone-900/70"></span>
                <span className="absolute bottom-3 right-4 w-4 h-2.5 rounded-full bg-stone-900/70"></span>
                <span className="absolute top-5 right-5 w-2.5 h-2 rounded-full bg-stone-800/60"></span>
                
                {/* Central Dollop of Fresh White Butter (Safed Makhan) */}
                <div className="relative w-7 h-7 rounded-full bg-white shadow-md border border-stone-200 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-amber-50/80"></div>
                </div>

                {/* Desi Gud (Jaggery) Cube Accent */}
                <div className="absolute bottom-2 left-3 w-3 h-3 bg-amber-800 rounded-xs shadow-xs border border-amber-900/40 rotate-12"></div>
              </div>
            </div>
          </div>
        );

      // 6. Surati Methi Thepla: Studded with fresh fenugreek greens & sesame
      case 'surati_methi_thepla_5':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-tr from-amber-300 via-amber-200 to-emerald-200 p-1 shadow-md border border-emerald-300 flex items-center justify-center">
              <div className="relative w-full h-full rounded-full bg-radial from-amber-100 via-amber-200 to-amber-300 shadow-inner overflow-hidden border border-amber-300 flex items-center justify-center">
                {/* Chopped fresh fenugreek (methi) greens */}
                <span className="absolute top-2 left-5 w-2 h-1 rounded-full bg-emerald-800/80 rotate-45"></span>
                <span className="absolute top-4 left-2 w-2.5 h-1.5 rounded-full bg-emerald-900/70 -rotate-12"></span>
                <span className="absolute top-5 right-4 w-2 h-1 rounded-full bg-emerald-800/80 rotate-30"></span>
                <span className="absolute bottom-3 right-4 w-2.5 h-1 rounded-full bg-emerald-900/80"></span>
                <span className="absolute bottom-4 left-4 w-2 h-1 rounded-full bg-emerald-800/70 -rotate-45"></span>
                <span className="absolute top-8 left-6 w-2 h-1 rounded-full bg-emerald-900/80"></span>
                <span className="absolute bottom-7 right-6 w-2.5 h-1 rounded-full bg-emerald-800/80 rotate-20"></span>
                {/* White sesame seeds & ajwain dots */}
                <span className="absolute top-3 left-8 w-1 h-1 rounded-full bg-white shadow-2xs"></span>
                <span className="absolute top-7 right-3 w-1 h-1 rounded-full bg-white shadow-2xs"></span>
                <span className="absolute bottom-5 left-8 w-1 h-1 rounded-full bg-white shadow-2xs"></span>
                <span className="absolute bottom-6 right-3 w-1 h-1 rounded-full bg-white shadow-2xs"></span>
                {/* Mild golden toast marks */}
                <span className="absolute top-4 right-7 w-2 h-1 rounded-full bg-amber-800/40"></span>
                <span className="absolute bottom-3 left-6 w-2.5 h-1 rounded-full bg-amber-800/40"></span>
              </div>
            </div>
          </div>
        );

      // 7. Family Mega Phulka Basket: Woven basket holding 10 stacked phulkas
      case 'family_phulka_10':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Woven basket container */}
            <div className="relative w-23 h-23 sm:w-25 sm:h-25 rounded-2xl bg-linear-to-br from-amber-700 via-amber-800 to-amber-900 p-1 shadow-md border border-amber-600 flex items-center justify-center">
              {/* Cloth lining */}
              <div className="relative w-full h-full rounded-xl bg-amber-50 p-1 flex items-center justify-center overflow-hidden border border-amber-200">
                {/* Stack of multiple overlapping hot phulkas */}
                <div className="absolute top-1 left-2 w-16 h-16 rounded-full bg-amber-200/60 border border-amber-300"></div>
                <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-amber-200/80 border border-amber-300"></div>
                <div className="relative w-16 h-16 rounded-full bg-radial from-amber-100 via-amber-200 to-amber-300 border border-amber-400 shadow-sm flex items-center justify-center">
                  <span className="absolute top-2 left-4 w-2 h-1.5 rounded-full bg-amber-950/60"></span>
                  <span className="absolute bottom-3 right-3 w-2.5 h-1 rounded-full bg-stone-900/60"></span>
                  <span className="text-[10px] font-black text-amber-950 bg-white/90 px-1.5 py-0.5 rounded-full shadow-xs">
                    10 Pcs
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      // 8. Homestyle Tri-Fold Flaky Paratha: Triangle folded with flaky crisp layers
      case 'trifold_ghee_paratha_3':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-22 h-20 sm:w-24 sm:h-22 flex items-center justify-center">
              {/* Triangular paratha SVG */}
              <svg viewBox="0 0 100 90" className="w-full h-full drop-shadow-md">
                <defs>
                  <linearGradient id="parathaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FEF3C7" />
                    <stop offset="50%" stopColor="#FDE68A" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
                {/* Base Triangle */}
                <polygon
                  points="50,8 92,80 8,80"
                  fill="url(#parathaGrad)"
                  stroke="#D97706"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {/* Fold lines showing flaky layers */}
                <path d="M50 8L71 44M50 8L29 44" stroke="#B45309" strokeWidth="1.5" strokeDasharray="3 2" />
                <path d="M29 44L71 44" stroke="#B45309" strokeWidth="1.8" />
                {/* Crisp ghee blisters */}
                <circle cx="50" cy="55" r="3.5" fill="#78350F" opacity="0.75" />
                <circle cx="38" cy="65" r="3" fill="#92400E" opacity="0.7" />
                <circle cx="62" cy="63" r="3.2" fill="#78350F" opacity="0.75" />
                <circle cx="48" cy="30" r="2.5" fill="#92400E" opacity="0.7" />
                <circle cx="50" cy="55" r="1.5" fill="#FEF08A" />
              </svg>
            </div>
          </div>
        );

      // 9. Gharwali Peeli Dal Tadka: Copper handi with yellow lentils, red chili & ghee tadka
      case 'dal_tadka_350':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Copper/Brass handi bowl */}
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-b from-amber-700 via-amber-800 to-amber-950 p-1.5 shadow-md border-2 border-amber-600 flex items-center justify-center">
              {/* Yellow Dal surface */}
              <div className="relative w-full h-full rounded-full bg-radial from-yellow-300 via-yellow-400 to-amber-500 shadow-inner overflow-hidden border border-amber-400 flex items-center justify-center">
                {/* Red Chili & Cumin Tadka Swirl */}
                <div className="absolute w-12 h-6 rounded-full bg-red-600/30 blur-2xs"></div>
                {/* Whole dried red chili */}
                <div className="absolute w-7 h-2 rounded-full bg-red-700 shadow-xs rotate-12 border border-red-900/50"></div>
                {/* Fried cumin seeds & mustard */}
                <span className="absolute top-3 left-4 w-1 h-0.5 rounded-full bg-amber-950"></span>
                <span className="absolute top-4 right-5 w-1 h-0.5 rounded-full bg-amber-950"></span>
                <span className="absolute bottom-4 left-6 w-1 h-0.5 rounded-full bg-amber-950"></span>
                {/* Fresh chopped coriander garnish */}
                <span className="absolute bottom-3 right-5 w-2.5 h-1.5 rounded-full bg-emerald-700"></span>
                <span className="absolute top-3 right-3 w-2 h-1 rounded-full bg-emerald-700"></span>
                {/* Ghee swirl */}
                <div className="w-5 h-5 rounded-full border border-amber-200/80 bg-amber-300/40"></div>
              </div>
            </div>
          </div>
        );

      // 10. Dhabe Wali Paneer Bhurji: Sautéed crumbled paneer with tomatoes, onions & herbs
      case 'paneer_bhurji_300':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Black iron kadhai bowl */}
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-b from-stone-800 via-stone-900 to-black p-1.5 shadow-md border-2 border-stone-700 flex items-center justify-center">
              {/* Sautéed Bhurji surface */}
              <div className="relative w-full h-full rounded-full bg-radial from-amber-200 via-amber-300 to-orange-400 shadow-inner overflow-hidden border border-amber-400 flex items-center justify-center">
                {/* Crumbled paneer cubes */}
                <span className="absolute top-3 left-4 w-3 h-2.5 rounded-xs bg-white shadow-2xs"></span>
                <span className="absolute top-5 right-4 w-3.5 h-3 rounded-xs bg-white shadow-2xs"></span>
                <span className="absolute bottom-4 left-5 w-3 h-2.5 rounded-xs bg-white shadow-2xs"></span>
                <span className="absolute bottom-3 right-5 w-3 h-2 rounded-xs bg-white shadow-2xs"></span>
                <span className="absolute top-7 left-7 w-2.5 h-2 rounded-xs bg-white shadow-2xs"></span>
                {/* Diced red tomatoes */}
                <span className="absolute top-4 left-8 w-2 h-1.5 rounded-xs bg-red-600"></span>
                <span className="absolute bottom-5 right-8 w-2 h-2 rounded-xs bg-red-600"></span>
                {/* Green chillies & coriander */}
                <span className="absolute top-7 right-4 w-2 h-1 rounded-full bg-emerald-700"></span>
                <span className="absolute bottom-6 left-4 w-2.5 h-1 rounded-full bg-emerald-700"></span>
              </div>
            </div>
          </div>
        );

      // 11. Kathiyawadi Sev Tameta Sabzi: Tangy tomato gravy topped with golden crispy sev
      case 'sev_tameta_300':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Earthen bowl */}
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-b from-amber-800 via-amber-900 to-stone-900 p-1.5 shadow-md border-2 border-amber-700 flex items-center justify-center">
              {/* Tangy Red-Orange Tomato Gravy */}
              <div className="relative w-full h-full rounded-full bg-radial from-red-500 via-orange-500 to-amber-700 shadow-inner overflow-hidden border border-red-400 flex items-center justify-center">
                {/* Golden crisp Ratlami Sev strands */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <span className="absolute w-10 h-0.5 bg-yellow-300 shadow-xs rotate-12"></span>
                  <span className="absolute w-9 h-0.5 bg-yellow-300 shadow-xs -rotate-25"></span>
                  <span className="absolute w-8 h-0.5 bg-yellow-300 shadow-xs rotate-45"></span>
                  <span className="absolute w-10 h-0.5 bg-yellow-300 shadow-xs -rotate-60"></span>
                  <span className="absolute w-7 h-0.5 bg-yellow-300 shadow-xs rotate-80"></span>
                </div>
                {/* Fresh coriander sprig */}
                <span className="absolute bottom-2 right-4 w-2.5 h-1.5 rounded-full bg-emerald-600"></span>
              </div>
            </div>
          </div>
        );

      // 12. RottiBox Executive Lunch Combo: 4-compartment meal box
      case 'combo_thali_box':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Bento eco meal tray */}
            <div className="relative w-24 h-22 sm:w-26 sm:h-24 rounded-xl bg-linear-to-br from-stone-800 via-stone-900 to-black p-1 shadow-md border border-stone-700 flex flex-col justify-between">
              {/* Top row: Rotis (left) + Dal (right) */}
              <div className="flex gap-1 h-1/2">
                {/* Roti pouch */}
                <div className="w-1/2 h-full rounded-md bg-radial from-amber-100 to-amber-300 border border-amber-400 p-0.5 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-amber-950">4 Rotis</span>
                </div>
                {/* Dal Tadka bowl */}
                <div className="w-1/2 h-full rounded-md bg-radial from-yellow-300 to-amber-500 border border-amber-400 p-0.5 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-amber-950">Dal Tadka</span>
                </div>
              </div>
              {/* Bottom row: Sabzi (left) + Salad/Chutney (right) */}
              <div className="flex gap-1 h-1/2 mt-1">
                {/* Paneer Sabzi */}
                <div className="w-1/2 h-full rounded-md bg-radial from-orange-400 to-red-500 border border-orange-400 p-0.5 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-white">Sabzi</span>
                </div>
                {/* Salad & Mint Chutney */}
                <div className="w-1/2 h-full rounded-md bg-radial from-emerald-400 to-emerald-600 border border-emerald-400 p-0.5 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-white">Salad</span>
                </div>
              </div>
            </div>
          </div>
        );

      // Seasonal Harvest Special: Amritsari Makki Roti & Sarson Saag Combo
      case 'makki_sarson_combo':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-b from-amber-700 via-stone-800 to-amber-950 p-1.5 shadow-md border-2 border-amber-500 flex items-center justify-center">
              {/* Sarson ka Saag Bowl (Dark Green with Ghee & White Butter) */}
              <div className="relative w-full h-full rounded-full bg-radial from-emerald-800 via-emerald-950 to-stone-900 shadow-inner overflow-hidden border border-emerald-700 flex items-center justify-center">
                {/* Yellow golden corn Makki Roti leaning over */}
                <div className="absolute -top-1 -left-1 w-14 h-14 rounded-full bg-linear-to-br from-yellow-300 via-amber-400 to-yellow-600 border border-amber-300 shadow-sm flex items-center justify-center rotate-12">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-800/40"></span>
                </div>
                {/* Second Makki Roti */}
                <div className="absolute -top-2 -right-1 w-13 h-13 rounded-full bg-linear-to-br from-yellow-200 via-yellow-400 to-amber-500 border border-yellow-200 shadow-sm flex items-center justify-center -rotate-12 opacity-90">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-800/40"></span>
                </div>
                {/* Dollop of Safed Makhan (White Butter) */}
                <div className="relative z-10 w-6 h-6 rounded-full bg-white shadow-md border border-amber-100 flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 rounded-full bg-amber-50"></div>
                </div>
                {/* Golden Ghee Sizzle */}
                <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-amber-400/80 blur-2xs"></div>
              </div>
            </div>
          </div>
        );

      // 13. Fragrant Basmati Jeera Rice: Aromatic basmati with roasted cumin seeds & ghee
      case 'jeera_rice_350':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-b from-[#FAF4EB] via-[#FFFDF9] to-[#EFE3D3] p-1.5 shadow-md border-2 border-amber-300 flex items-center justify-center">
              <div className="relative w-full h-full rounded-full bg-radial from-white via-amber-50 to-amber-100/90 shadow-inner overflow-hidden border border-amber-200 flex items-center justify-center">
                {/* Ghee gloss */}
                <div className="absolute inset-1 rounded-full bg-linear-to-tr from-amber-400/20 via-transparent to-amber-200/40"></div>
                {/* Long grains & roasted cumin */}
                <span className="absolute top-4 left-5 w-3.5 h-1 rounded-full bg-amber-950 rotate-45 shadow-xs"></span>
                <span className="absolute top-7 right-6 w-3 h-1 rounded-full bg-stone-900 -rotate-30 shadow-xs"></span>
                <span className="absolute bottom-5 left-6 w-3 h-0.8 rounded-full bg-amber-900 rotate-12"></span>
                <span className="absolute bottom-6 right-5 w-2.5 h-1 rounded-full bg-stone-900 45"></span>
                <span className="absolute top-5 right-9 w-2 h-0.8 rounded-full bg-amber-950 -rotate-45"></span>
                {/* Green coriander garnish */}
                <span className="w-2.5 h-2 rounded-full bg-emerald-600 shadow-xs"></span>
                <span className="absolute top-7 left-9 w-2 h-1 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          </div>
        );

      // 14. Homestyle Peeli Dal Khichdi (Ghee Tadka): Yellow comfort bowl with ghee tadka
      case 'dal_khichdi_400':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-b from-amber-600 via-amber-700 to-amber-900 p-1.5 shadow-md border-2 border-amber-500 flex items-center justify-center">
              <div className="relative w-full h-full rounded-full bg-radial from-yellow-300 via-yellow-400 to-amber-500 shadow-inner overflow-hidden border border-amber-400 flex items-center justify-center">
                {/* Ghee swirl & chili tadka */}
                <div className="absolute w-10 h-5 rounded-full bg-amber-300/50 blur-2xs"></div>
                <div className="w-5 h-1.5 rounded-full bg-red-600 rotate-12 shadow-xs"></div>
                <span className="absolute top-4 left-5 w-1.5 h-1 rounded-full bg-amber-950"></span>
                <span className="absolute bottom-4 right-5 w-1.5 h-1 rounded-full bg-amber-950"></span>
                <span className="absolute top-6 right-5 w-2 h-1 rounded-full bg-emerald-600"></span>
              </div>
            </div>
          </div>
        );

      // 15. Nutritious Green Palak Khichdi: Emerald green spinach infused comfort bowl
      case 'palak_khichdi_400':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-b from-stone-700 via-stone-800 to-stone-900 p-1.5 shadow-md border-2 border-emerald-600 flex items-center justify-center">
              <div className="relative w-full h-full rounded-full bg-radial from-emerald-500 via-emerald-600 to-emerald-800 shadow-inner overflow-hidden border border-emerald-500 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-emerald-400/30 blur-xs"></div>
                {/* Golden Ghee droplet */}
                <div className="relative w-4 h-4 rounded-full bg-amber-300 border border-amber-400 flex items-center justify-center shadow-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
                </div>
                <span className="absolute bottom-4 left-6 w-2 h-1 rounded-full bg-yellow-300"></span>
              </div>
            </div>
          </div>
        );

      // 16. Lasooni Palak Garlic Khichdi: Green bowl with roasted garlic slices & red chili
      case 'palak_garlic_khichdi_400':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-b from-stone-700 via-stone-800 to-stone-900 p-1.5 shadow-md border-2 border-emerald-600 flex items-center justify-center">
              <div className="relative w-full h-full rounded-full bg-radial from-emerald-600 via-emerald-700 to-emerald-900 shadow-inner overflow-hidden border border-emerald-500 flex items-center justify-center">
                {/* Sliced golden roasted garlic cloves */}
                <span className="absolute top-4 left-5 w-3 h-2 rounded-full bg-amber-200 border border-amber-400 rotate-12 shadow-xs"></span>
                <span className="absolute bottom-5 right-5 w-3 h-2 rounded-full bg-amber-200 border border-amber-400 -rotate-20 shadow-xs"></span>
                <span className="absolute top-6 right-6 w-2.5 h-1.5 rounded-full bg-amber-300 border border-amber-400 rotate-45 shadow-xs"></span>
                {/* Sizzling red chili */}
                <div className="w-6 h-1.5 rounded-full bg-red-600 rotate-12 shadow-xs"></div>
              </div>
            </div>
          </div>
        );

      // 17. Soft Steamed Long-Grain Rice: Pearly fluffy white rice
      case 'steamed_basmati_rice_350':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-b from-stone-200 via-stone-300 to-stone-400 p-1.5 shadow-md border-2 border-stone-300 flex items-center justify-center">
              <div className="relative w-full h-full rounded-full bg-radial from-white via-stone-50 to-stone-200 shadow-inner overflow-hidden border border-stone-200 flex items-center justify-center">
                <span className="absolute top-4 left-5 w-3 h-1 rounded-full bg-stone-300 rotate-12"></span>
                <span className="absolute top-6 right-6 w-3 h-1 rounded-full bg-stone-300 -rotate-30"></span>
                <span className="absolute bottom-5 left-7 w-3.5 h-1 rounded-full bg-stone-300 rotate-45"></span>
                <span className="text-[9px] font-bold text-stone-700 bg-white/80 px-1.5 py-0.5 rounded-md shadow-2xs">Steamed</span>
              </div>
            </div>
          </div>
        );

      // 18. Kathiyawadi Vaghareli Masala Khichdi: Spiced traditional khichdi with mustard vaghar
      case 'vaghareli_khichdi_400':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-b from-amber-700 via-amber-800 to-stone-900 p-1.5 shadow-md border-2 border-amber-500 flex items-center justify-center">
              <div className="relative w-full h-full rounded-full bg-radial from-amber-400 via-amber-500 to-amber-700 shadow-inner overflow-hidden border border-amber-400 flex items-center justify-center">
                <span className="absolute top-3 left-4 w-1.5 h-1.5 rounded-full bg-stone-900"></span>
                <span className="absolute top-5 right-5 w-1.5 h-1.5 rounded-full bg-stone-900"></span>
                <span className="absolute bottom-4 left-6 w-1.5 h-1.5 rounded-full bg-stone-900"></span>
                {/* Curry leaf & veggie bits */}
                <span className="w-3.5 h-2 rounded-full bg-emerald-700 rotate-45 shadow-xs"></span>
                <span className="absolute bottom-5 right-5 w-2 h-2 rounded-sm bg-orange-600"></span>
                <span className="absolute top-6 left-7 w-2 h-2 rounded-sm bg-emerald-600"></span>
              </div>
            </div>
          </div>
        );

      // 19. Desi Ghee Vegetable Tawa Pulao: Loaded with paneer, peas & carrot
      case 'veg_pulao_400':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-b from-amber-600 via-amber-700 to-stone-900 p-1.5 shadow-md border-2 border-amber-400 flex items-center justify-center">
              <div className="relative w-full h-full rounded-full bg-radial from-yellow-200 via-amber-300 to-amber-500 shadow-inner overflow-hidden border border-amber-300 flex items-center justify-center">
                {/* Fresh soft paneer cubes */}
                <span className="absolute top-4 left-5 w-3 h-3 rounded-xs bg-white border border-amber-200 shadow-xs"></span>
                <span className="absolute bottom-5 right-5 w-3 h-3 rounded-xs bg-white border border-amber-200 shadow-xs"></span>
                {/* Sweet green peas */}
                <span className="absolute top-7 right-6 w-2 h-2 rounded-full bg-emerald-600 shadow-xs"></span>
                <span className="absolute bottom-4 left-7 w-2 h-2 rounded-full bg-emerald-600 shadow-xs"></span>
                {/* Orange carrots */}
                <span className="w-3 h-1.5 rounded-xs bg-orange-500 rotate-12 shadow-xs"></span>
              </div>
            </div>
          </div>
        );

      // 20. Southern Tempered Ghee Curd Rice: Creamy white curd rice with pomegranate pearls
      case 'curd_rice_350':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-linear-to-b from-emerald-700 via-emerald-800 to-stone-900 p-1.5 shadow-md border-2 border-emerald-400 flex items-center justify-center">
              <div className="relative w-full h-full rounded-full bg-radial from-white via-stone-50 to-emerald-50 shadow-inner overflow-hidden border border-emerald-200 flex items-center justify-center">
                {/* Ruby red pomegranate pearls */}
                <span className="absolute top-4 left-5 w-2 h-2 rounded-full bg-red-600 shadow-xs"></span>
                <span className="absolute bottom-4 right-5 w-2 h-2 rounded-full bg-red-600 shadow-xs"></span>
                <span className="absolute top-6 right-6 w-2 h-2 rounded-full bg-red-500 shadow-xs"></span>
                <span className="absolute bottom-5 left-6 w-2 h-2 rounded-full bg-red-600 shadow-xs"></span>
                {/* Tempering curry leaves & mustard */}
                <span className="w-3.5 h-1.5 rounded-full bg-emerald-800 rotate-45 shadow-xs"></span>
                <span className="absolute top-8 left-8 w-1 h-1 rounded-full bg-stone-900"></span>
              </div>
            </div>
          </div>
        );

      // Default fallback for any newly added items
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-22 h-22 rounded-full bg-linear-to-tr from-amber-200 via-amber-100 to-amber-50 border border-amber-300 shadow-md flex items-center justify-center">
              <span className="text-xs font-bold text-amber-900">{item.name.slice(0, 15)}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      {renderDishArtwork()}
    </div>
  );
};
