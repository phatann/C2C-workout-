import React from 'react';

interface GoogleAdProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'vertical';
  className?: string;
}

export const GoogleAd: React.FC<GoogleAdProps> = ({ slotId, format = 'auto', className = '' }) => {
  return (
    <div className={`w-full bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg p-2 flex flex-col items-center justify-center text-center overflow-hidden relative ${className}`}>
      <span className="text-xs text-slate-500 font-mono absolute top-1 left-1">ADVERTISEMENT</span>
      <div className="p-4">
        <p className="text-slate-400 text-sm font-medium">Google Ad Space</p>
        <p className="text-slate-600 text-xs mt-1">Slot ID: {slotId || 'PENDING'}</p>
      </div>
      {/* 
        PLACEHOLDER FOR GOOGLE ADS CODE 
        When you have the code, you would typically inject the <ins> tag here
      */}
    </div>
  );
};