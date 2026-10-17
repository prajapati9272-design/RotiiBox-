import React from 'react';
import { X, Calendar, Clock, Flame } from 'lucide-react';
import { DailyTuneSchedule } from './DailyTuneSchedule';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-stone-900 leading-tight">
                Daily Delivery Calendar & Cutoff Tuning
              </h2>
              <p className="text-[11px] text-stone-500">
                Modify counts, switch grains, or pause delivery before 10:30 AM & 6:30 PM cutoffs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: DailyTuneSchedule */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#faf9f6]">
          <DailyTuneSchedule />
        </div>

      </div>
    </div>
  );
};
