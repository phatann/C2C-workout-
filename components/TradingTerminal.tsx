
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, Activity, History } from 'lucide-react';
import { Asset, PortfolioItem } from '../types';
import { Button } from './Button';

interface TradingTerminalProps {
  balance: number;
  assets: Asset[];
  portfolio: PortfolioItem[];
  onBuy: (asset: Asset, amount: number) => void;
  onSell: (asset: Asset, qty: number) => void;
  onDepositClick: () => void;
}

export const TradingTerminal: React.FC<TradingTerminalProps> = ({ 
  balance, 
  assets, 
  portfolio, 
  onBuy, 
  onSell,
  onDepositClick
}) => {
  const [activeTab, setActiveTab] = useState<'market' | 'portfolio'>('market');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [tradeAmount, setTradeAmount] = useState<string>('500'); // Default PKR

  const handleTrade = (type: 'BUY' | 'SELL') => {
    if (!selectedAsset) return;
    
    if (type === 'BUY') {
      const amount = parseFloat(tradeAmount);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }
      onBuy(selectedAsset, amount);
    } else {
      // Sell all logic for simplicity
      const owned = portfolio.find(p => p.symbol === selectedAsset.symbol);
      if (owned) {
        onSell(selectedAsset, owned.quantity);
      }
    }
    setSelectedAsset(null);
  };

  return (
    <div className="p-4 pb-24 space-y-4 h-full flex flex-col bg-slate-900">
      {/* Header Stats */}
      <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Equity (PKR)</p>
            <h2 className="text-3xl font-bold text-white mt-1">₨ {balance.toLocaleString()}</h2>
          </div>
          <button 
            onClick={onDepositClick}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            + Deposit
          </button>
        </div>
        <div className="flex space-x-4 text-xs">
          <div className="flex items-center text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>Market Open</span>
          </div>
          <div className="flex items-center text-slate-400">
            <Activity className="w-3 h-3 mr-1" />
            <span>Leverage 1:1</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800 p-1 rounded-xl shrink-0 border border-slate-700">
        <button 
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'market' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          onClick={() => setActiveTab('market')}
        >
          Forex & Crypto
        </button>
        <button 
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'portfolio' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          onClick={() => setActiveTab('portfolio')}
        >
          My Trades
        </button>
      </div>

      {activeTab === 'market' && (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
           {assets.map(asset => (
             <div 
               key={asset.symbol} 
               onClick={() => setSelectedAsset(asset)}
               className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex justify-between items-center hover:bg-slate-700 transition-colors cursor-pointer group"
             >
               <div className="flex items-center space-x-3">
                 <div className="text-2xl filter drop-shadow-lg group-hover:scale-110 transition-transform">{asset.flag}</div>
                 <div>
                   <h3 className="font-bold text-white text-sm">{asset.symbol}</h3>
                   <p className="text-[10px] text-slate-400 uppercase font-medium">{asset.name}</p>
                 </div>
               </div>
               
               <div className="text-right">
                 <div className="text-white font-mono font-bold text-base tracking-tight">₨ {asset.price.toLocaleString()}</div>
                 <div className={`text-[10px] flex items-center justify-end font-bold ${asset.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                   {asset.changePercent >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                   {Math.abs(asset.changePercent)}%
                 </div>
               </div>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'portfolio' && (
        <div className="flex-1 overflow-y-auto space-y-3">
          {portfolio.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center opacity-50">
              <History className="w-12 h-12 mb-3" />
              <p>No active trades</p>
            </div>
          ) : (
            portfolio.map(item => {
              const currentAsset = assets.find(a => a.symbol === item.symbol);
              const currentPrice = currentAsset ? currentAsset.price : item.avgBuyPrice;
              // Value = Quantity * CurrentPrice
              const currentValue = item.quantity * currentPrice;
              const investedValue = item.quantity * item.avgBuyPrice;
              const profit = currentValue - investedValue;
              const profitPercent = (profit / investedValue) * 100;

              return (
                <div key={item.symbol} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2">
                       <span className="font-bold text-white">{item.symbol}</span>
                       <span className={`text-[10px] px-1.5 py-0.5 rounded ${profit >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                         {profitPercent.toFixed(2)}%
                       </span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="danger" 
                      className="h-7 px-3 text-xs"
                      onClick={() => {
                        if(currentAsset) {
                           setSelectedAsset(currentAsset);
                        }
                      }}
                    >
                      Close Trade
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                    <div>
                      <p>Invested</p>
                      <p className="text-white font-mono">₨ {investedValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p>Current</p>
                      <p className="text-white font-mono">₨ {currentValue.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p>P/L</p>
                      <p className={`font-mono font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {profit >= 0 ? '+' : ''}{profit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Trade Sheet */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-slate-900 w-full max-w-sm rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
             
             {/* Header */}
             <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
               <div className="flex items-center space-x-3">
                  <div className="text-3xl">{selectedAsset.flag}</div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{selectedAsset.symbol}</h3>
                    <p className="text-xs text-emerald-400 font-mono tracking-wider">Price: ₨ {selectedAsset.price}</p>
                  </div>
               </div>
               <button onClick={() => setSelectedAsset(null)} className="text-slate-400 hover:text-white p-1">
                 <ArrowDownRight className="w-6 h-6 rotate-45" />
               </button>
             </div>

             {/* Body */}
             <div className="p-6 space-y-6">
                
                {/* Balance Info */}
                <div className="flex justify-between text-xs text-slate-400 font-medium uppercase">
                  <span>Balance: ₨ {balance.toLocaleString()}</span>
                  <span>Owned: {portfolio.find(p => p.symbol === selectedAsset.symbol)?.quantity.toFixed(4) || '0.0000'}</span>
                </div>

                {/* Amount Input */}
                <div>
                   <label className="block text-sm text-slate-300 mb-2 font-medium">Investment Amount (PKR)</label>
                   <div className="relative">
                     <span className="absolute left-4 top-3.5 text-slate-500 font-bold">₨</span>
                     <input 
                       type="number" 
                       value={tradeAmount}
                       onChange={e => setTradeAmount(e.target.value)}
                       className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white text-lg font-bold focus:border-emerald-500 outline-none placeholder-slate-700"
                       placeholder="500"
                     />
                   </div>
                   {/* Quick Amounts */}
                   <div className="flex space-x-2 mt-3">
                     {[500, 1000, 5000].map(amt => (
                       <button 
                         key={amt}
                         onClick={() => setTradeAmount(amt.toString())}
                         className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 border border-slate-700"
                       >
                         ₨ {amt}
                       </button>
                     ))}
                   </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button 
                    onClick={() => handleTrade('SELL')}
                    disabled={!portfolio.find(p => p.symbol === selectedAsset.symbol)}
                    className="py-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold border border-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    SELL
                  </button>
                  <button 
                    onClick={() => handleTrade('BUY')}
                    className="py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    BUY
                  </button>
                </div>

             </div>
           </div>
        </div>
      )}
    </div>
  );
};
