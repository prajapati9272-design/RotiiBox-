import React from 'react';

interface RottiBoxLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'badge';
  lightBg?: boolean;
}

export const RottiBoxLogo: React.FC<RottiBoxLogoProps> = ({
  className = '',
  size = 'md',
  lightBg = false,
}) => {
  const fontSizes = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl',
  }[size];

  const mainColor = lightBg ? 'text-[#FFF8EB]' : 'text-[#2B1408]';
  const accentColor = lightBg ? 'text-[#FBBF24]' : 'text-[#C86A1D]';

  return (
    <div className={`inline-flex items-center tracking-tight font-display font-extrabold select-none transition-transform active:scale-95 ${fontSizes} ${className}`}>
      <span className={mainColor}>Rotii</span>
      <span className={accentColor}>Box</span>
    </div>
  );
};
