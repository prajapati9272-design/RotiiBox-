import React, { useState } from 'react';
import { 
  XCircle, 
  Camera, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Check, 
  Images
} from 'lucide-react';
import { RegularMenuItem } from '../types';
import { compressImageFile } from '../utils/imageCompressor';

interface ImageGalleryModalProps {
  isOpen: boolean;
  item: Partial<RegularMenuItem> | null;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  isOpen,
  item,
  onClose,
  onSelectImage,
}) => {
  const [selectedUrl, setSelectedUrl] = useState<string>(item?.imageUrl || '');
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP)');
      return;
    }

    try {
      const compressed = await compressImageFile(file, 600, 600, 0.75);
      setUploadPreview(compressed);
      setSelectedUrl(compressed);
    } catch (err) {
      console.warn('Image compression failed:', err);
    }
  };

  const handleApply = () => {
    const finalUrl = activeTab === 'url' ? customUrl : selectedUrl;
    if (!finalUrl) {
      alert('Please select or upload an image first.');
      return;
    }
    onSelectImage(finalUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFDF9] rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-[#EFE3D3] space-y-4 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EFE3D3] pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D97706]/10 text-[#D97706] flex items-center justify-center font-bold">
              <Images className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2B1408]">
                Change Photo from Gallery
              </h3>
              <p className="text-xs text-[#8B5E3C]">
                {item?.name ? `Item: ${item.name}` : 'Select a photo from device gallery or camera'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#8B5E3C] hover:text-[#2B1408] p-1.5 rounded-lg hover:bg-[#FAF4EB] transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#EFE3D3] pb-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-[#3B170B] text-[#FEF3C7] shadow-2xs'
                : 'bg-[#FAF4EB] text-[#8B5E3C] hover:bg-[#EFE3D3]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Device Gallery / Upload</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'url'
                ? 'bg-[#3B170B] text-[#FEF3C7] shadow-2xs'
                : 'bg-[#FAF4EB] text-[#8B5E3C] hover:bg-[#EFE3D3]'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Paste Web URL</span>
          </button>
        </div>

        {/* Tab 2: Upload from Device Gallery / Camera */}
        {activeTab === 'upload' && (
          <div className="flex-1 overflow-y-auto space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option A: Device Gallery / Photos */}
              <label className="border-2 border-dashed border-[#D97706]/50 bg-[#FFFDF9] hover:bg-[#FAF4EB] rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-2xs group">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#D97706] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#2B1408]">🖼️ Open Phone Gallery</div>
                  <div className="text-xs text-[#8B5E3C] mt-0.5">Select photo from device storage or Google Photos</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Option B: Capture with Camera */}
              <label className="border-2 border-dashed border-[#3B170B]/30 bg-[#FFFDF9] hover:bg-[#FAF4EB] rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-2xs group">
                <div className="w-12 h-12 rounded-2xl bg-[#3B170B]/10 text-[#3B170B] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#2B1408]">📸 Take Photo with Camera</div>
                  <div className="text-xs text-[#8B5E3C] mt-0.5">Click a live photo of cooked roti / dish</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

            </div>

            {/* Uploaded Preview Display */}
            {uploadPreview && (
              <div className="p-3 bg-[#FAF4EB] rounded-2xl border border-[#DFCBB5] flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#DFCBB5] shrink-0 bg-white">
                  <img src={uploadPreview} alt="Uploaded preview" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Photo Loaded Successfully
                  </span>
                  <p className="text-[11px] text-[#8B5E3C] mt-0.5">
                    Ready to apply as item thumbnail image.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Paste Image Web URL */}
        {activeTab === 'url' && (
          <div className="flex-1 overflow-y-auto space-y-4 py-2">
            <div>
              <label className="text-xs font-bold text-[#2B1408] block mb-1">
                Paste Web Image Address (URL)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => {
                    setCustomUrl(e.target.value);
                    setSelectedUrl(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 text-xs bg-[#FAF4EB] border border-[#DFCBB5] rounded-xl px-3 py-2.5 text-[#2B1408] focus:outline-none focus:ring-1 focus:ring-[#D97706]"
                />
              </div>
            </div>

            {customUrl && (
              <div className="p-3 bg-[#FAF4EB] rounded-2xl border border-[#DFCBB5] space-y-2">
                <span className="text-xs font-bold text-[#2B1408]">Live Web Image Preview:</span>
                <div className="aspect-16/9 w-full rounded-xl overflow-hidden bg-white border border-[#DFCBB5]">
                  <img
                    src={customUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => alert('Unable to load image from this URL. Please verify the web link.')}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#EFE3D3] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xs font-bold text-[#8B5E3C] shrink-0">Selected Photo:</span>
            {selectedUrl ? (
              <span className="text-[11px] text-[#2B1408] truncate font-mono bg-[#FAF4EB] px-2 py-0.5 rounded border border-[#DFCBB5]">
                {selectedUrl.slice(0, 45)}...
              </span>
            ) : (
              <span className="text-[11px] text-stone-400 italic">None selected</span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#FAF4EB] hover:bg-[#EFE3D3] text-[#2B1408] font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!selectedUrl && !customUrl}
              className="px-5 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] disabled:opacity-50 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply Photo to Item</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
