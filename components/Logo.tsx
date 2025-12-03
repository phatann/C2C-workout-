import React from 'react';
import { Dumbbell, TrendingUp, Zap } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', animated = false, showText = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative flex items-center justify-center bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl shadow-lg shadow-emerald-500/30 ${sizeClasses[size]} ${animated ? 'animate-pulse' : ''}`}>
        <Dumbbell className="text-white w-2/3 h-2/3 absolute transform -rotate-45" />
        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 border-2 border-slate-900">
          <Zap className="w-1/3 h-1/3 text-slate-900" size={12} fill="currentColor" />
        </div>
      </div>
      
      {showText && (
        <div className={`mt-3 font-extrabold tracking-tight text-white ${textSizes[size]}`}>
          <span className="text-emerald-400">C2C</span> WORKOUT
        </div>
      )}
    </div>
  );
};