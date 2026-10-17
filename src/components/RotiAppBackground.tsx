import React from 'react';

/**
 * Full App Background Component
 * Renders an authentic mosaic of freshly roasted whole-wheat rotis,
 * with golden puffed textures, toasted patches, and charred flame blister spots
 * matching the user's uploaded photographic image.
 */
export const RotiAppBackground: React.FC = () => {
  return (
    <div 
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full overflow-hidden select-none"
    >
      {/* 
        High-performance tiling background referencing the high-resolution vector SVG.
        Uses background-attachment: fixed so that scrolling feels smooth and solid.
      */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundColor: '#DFC18E',
          backgroundImage: 'url(/roti-app-background.svg)',
          backgroundSize: '720px 560px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center top',
        }}
      />

      {/* 
        Soft warm daylight veil & vignette:
        Ensures high contrast, clarity, and readability for all storefront cards,
        product typography, and interactive buttons while letting the delicious 
        roti background shine through vividly.
      */}
      <div className="absolute inset-0 bg-stone-900/10 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/30 via-transparent to-amber-100/40" />
    </div>
  );
};
