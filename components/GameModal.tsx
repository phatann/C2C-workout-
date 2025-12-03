import React, { useState, useEffect } from 'react';
import { X, Target } from 'lucide-react';
import { Button } from './Button';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  difficulty?: 'easy' | 'hard';
}

export const GameModal: React.FC<GameModalProps> = ({ isOpen, onClose, onComplete, difficulty = 'easy' }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'WON' | 'LOST'>('IDLE');
  const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });

  // Config based on difficulty
  const TARGET_SCORE = difficulty === 'hard' ? 15 : 10;
  const TIME_LIMIT = difficulty === 'hard' ? 10 : 15;
  const REWARD = difficulty === 'hard' ? 25 : 10;

  useEffect(() => {
    if (isOpen) {
      resetGame();
    }
  }, [isOpen, difficulty]);

  useEffect(() => {
    let interval: number;
    if (gameState === 'PLAYING' && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'PLAYING') {
      setGameState('LOST');
    }
    return () => clearInterval(interval);
  }, [timeLeft, gameState]);

  const resetGame = () => {
    setScore(0);
    setTimeLeft(TIME_LIMIT);
    setGameState('IDLE');
    moveTarget();
  };

  const startGame = () => {
    setGameState('PLAYING');
  };

  const moveTarget = () => {
    const top = Math.floor(Math.random() * 80) + 10;
    const left = Math.floor(Math.random() * 80) + 10;
    setTargetPos({ top: `${top}%`, left: `${left}%` });
  };

  const handleTargetClick = () => {
    if (gameState !== 'PLAYING') return;
    
    const newScore = score + 1;
    setScore(newScore);
    
    if (newScore >= TARGET_SCORE) {
      setGameState('WON');
    } else {
      moveTarget();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden relative min-h-[400px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <div>
             <h3 className="font-bold text-white">Reflex Game ({difficulty.toUpperCase()})</h3>
             <p className="text-xs text-slate-400">Click {TARGET_SCORE} targets in {TIME_LIMIT}s</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Area */}
        <div className="flex-1 relative bg-slate-900 select-none overflow-hidden">
          {gameState === 'IDLE' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-slate-900/80">
              <Target className="w-16 h-16 text-emerald-500 mb-4" />
              <Button onClick={startGame}>Start Level 1</Button>
            </div>
          )}

          {gameState === 'LOST' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-red-900/20">
              <h3 className="text-2xl font-bold text-red-500 mb-2">Time Up!</h3>
              <p className="text-slate-300 mb-4">You scored {score}/{TARGET_SCORE}</p>
              <Button onClick={resetGame} variant="secondary">Try Again</Button>
            </div>
          )}

          {gameState === 'WON' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-emerald-900/20">
              <h3 className="text-2xl font-bold text-emerald-500 mb-2">Level Complete!</h3>
              <p className="text-slate-300 mb-4">You earned {REWARD} Points!</p>
              <Button onClick={() => { onClose(); onComplete(); }}>Collect Reward</Button>
            </div>
          )}

          {(gameState === 'PLAYING') && (
            <div 
              className={`absolute rounded-full cursor-pointer shadow-lg shadow-emerald-500/50 flex items-center justify-center transition-all duration-75 active:scale-90 ${difficulty === 'hard' ? 'w-10 h-10 bg-red-500' : 'w-12 h-12 bg-emerald-500'}`}
              style={{ top: targetPos.top, left: targetPos.left }}
              onMouseDown={handleTargetClick}
            >
              <div className="w-6 h-6 bg-white/20 rounded-full" />
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="p-4 bg-slate-800 flex justify-between font-mono text-lg font-bold">
           <span className="text-emerald-400">Score: {score}</span>
           <span className={`${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
             00:{timeLeft.toString().padStart(2, '0')}
           </span>
        </div>
      </div>
    </div>
  );
};