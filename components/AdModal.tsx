import React, { useEffect, useState } from 'react';
import { X, Play } from 'lucide-react';
import { Button } from './Button';
import { GoogleAd } from './GoogleAd';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  duration?: number;
}

export const AdModal: React.FC<AdModalProps> = ({ isOpen, onClose, onComplete, duration = 10 }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(duration);
      setIsActive(true);
      setCanClose(false);
    }
  }, [isOpen, duration]);

  useEffect(() => {
    let interval: number;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setCanClose(true);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden relative">
        {/* Ad Content Area */}
        <div className="bg-slate-800 p-4 min-h-[300px] flex flex-col items-center justify-center relative">
          
          {/* This is where the Google Ad goes */}
          <div className="w-full h-full flex items-center justify-center mb-4">
            <GoogleAd className="h-64 bg-slate-900/50" slotId="TASK-AD-SLOT" />
          </div>
          
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-700">
            <div 
              className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
              style={{ width: `${((duration - timeLeft) / duration) * 100}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-slate-900 border-t border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <div>
               {timeLeft > 0 ? (
                 <span className="text-sm font-medium text-slate-400">Reward in {timeLeft}s</span>
               ) : (
                 <span className="text-sm font-bold text-emerald-400">Reward Unlocked!</span>
               )}
            </div>
            {canClose && (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => {
                  onComplete();
                  onClose();
                }}
              >
                Claim 50 Points
              </Button>
            )}
          </div>
          
          <div className="text-center">
             {!canClose && (
               <p className="text-xs text-slate-500">Watching sponsored content...</p>
             )}
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};