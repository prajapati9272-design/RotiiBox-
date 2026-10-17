import React, { useState } from 'react';
import { 
  X, 
  Gift, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  Flame, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReferralModal: React.FC = () => {
  const { 
    isReferralModalOpen, 
    closeReferralModal, 
    userReferralCode, 
    freePhulkasEarned, 
    referralHistory, 
    redeemReferralCode, 
    showToast 
  } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const [redeemStatus, setRedeemStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isReferralModalOpen) return null;

  const shareUrl = `${window.location.origin}?ref=${userReferralCode}`;
  const shareMessage = `🌾 Get 5 FREE Plain Phulkas on your RottiBox daily subscription! Use my referral code ${userReferralCode} when subscribing for fresh home-style rotis delivered hot to your doorstep! Order now: ${shareUrl}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userReferralCode);
    setIsCopiedCode(true);
    showToast('📋 Referral code copied to clipboard!');
    setTimeout(() => setIsCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopiedLink(true);
    showToast('🔗 Referral link copied to clipboard!');
    setTimeout(() => setIsCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RottiBox - 5 Free Plain Phulkas',
          text: shareMessage,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Native share closed or not supported:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const res = redeemReferralCode(inputCode);
    setRedeemStatus(res);
    if (res.success) {
      setInputCode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFDF9] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#EFE3D3] space-y-5 max-h-[92vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={closeReferralModal}
          className="absolute top-4 right-4 text-[#8B5E3C] hover:text-[#2B1408] p-1.5 rounded-full hover:bg-[#FAF4EB] transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-2 pt-1">
          <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706] flex items-center justify-center mx-auto shadow-xs">
            <Gift className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#D97706] uppercase tracking-wider flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Refer & Earn RottiBox Rewards
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-[#2B1408] mt-0.5">
              Gift 5 Free Phulkas to Friends
            </h2>
            <p className="text-xs text-[#8B5E3C] mt-1 max-w-sm mx-auto leading-relaxed">
              Give <span className="font-bold text-[#3B170B]">5 Free Plain Phulkas</span> on daily subscription to your friend — and get <span className="font-bold text-[#D97706]">5 Free Plain Phulkas</span> added to your next daily subscription meal!
            </p>
          </div>
        </div>

        {/* Total Earned Phulkas Banner */}
        <div className="bg-linear-to-r from-[#2B1006] via-[#4A1E0E] to-[#3B170B] text-[#FEF3C7] rounded-xl p-4 border border-[#5C2712] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                Your Free Phulka Balance
              </div>
              <div className="text-lg font-extrabold text-white font-mono-numbers">
                {freePhulkasEarned} Free Plain Phulkas
              </div>
            </div>
          </div>

          <span className="text-[10px] font-bold bg-amber-400/20 text-amber-200 px-2.5 py-1 rounded-full border border-amber-400/30">
            Active Bonus
          </span>
        </div>

        {/* Referral Code Showcase Box */}
        <div className="bg-[#FAF4EB] rounded-2xl p-4 border border-[#DFCBB5] space-y-3">
          <div className="text-center">
            <span className="text-[11px] font-bold text-[#8B5E3C] uppercase tracking-wider block">
              Your Unique Referral Code
            </span>
            <div className="mt-1 flex items-center justify-center gap-2">
              <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#3B170B] tracking-widest bg-white px-4 py-2 rounded-xl border border-[#DFCBB5] shadow-2xs">
                {userReferralCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3.5 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {isCopiedCode ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Sharing Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleWhatsAppShare}
              className="py-2.5 px-3 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white text-white" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="py-2.5 px-3 bg-[#3B170B] hover:bg-[#2B1006] text-[#FEF3C7] font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#D97706]" />
              <span>{isCopiedLink ? 'Link Copied!' : 'Share Link'}</span>
            </button>
          </div>
        </div>

        {/* Redeem Friend's Code Form */}
        <form onSubmit={handleRedeem} className="bg-white rounded-2xl p-4 border border-[#EFE3D3] space-y-2.5">
          <label className="text-xs font-bold text-[#2B1408] block">
            Have a Friend's Referral Code?
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value);
                setRedeemStatus(null);
              }}
              placeholder="e.g. ROTTI-5FREE-8492"
              className="flex-1 uppercase font-mono text-xs bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2 text-[#2B1408] focus:outline-none focus:ring-1 focus:ring-[#D97706]"
            />
            <button
              type="submit"
              disabled={!inputCode.trim()}
              className="px-4 py-2 bg-[#D97706] hover:bg-[#B45309] disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
            >
              Claim 5 Free Phulkas
            </button>
          </div>

          {redeemStatus && (
            <p className={`text-[11px] font-bold ${redeemStatus.success ? 'text-emerald-700' : 'text-red-600'}`}>
              {redeemStatus.message}
            </p>
          )}
        </form>

        {/* Referral History / Friends Invited */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#2B1408]">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Invited Friends & Claims</span>
            </span>
            <span className="text-[#8B5E3C] font-normal font-mono-numbers">
              {referralHistory.length} friends
            </span>
          </div>

          <div className="divide-y divide-[#EFE3D3] bg-white rounded-xl border border-[#EFE3D3] px-3 py-1">
            {referralHistory.map((ref) => (
              <div key={ref.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#2B1408]">{ref.friendPhone}</div>
                  <div className="text-[10px] text-[#8B5E3C]">{ref.date}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-mono-numbers font-bold text-[#D97706]">
                    +{ref.freePhulkas} Phulkas
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ref.status === 'claimed' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {ref.status === 'claimed' ? 'Claimed' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
