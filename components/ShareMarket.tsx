
import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Search, Wallet, Briefcase, RefreshCw } from 'lucide-react';
import { Stock, PortfolioItem } from '../types';
import { Button } from './Button';

interface ShareMarketProps {
  balance: number;
  stocks: Stock[];
  portfolio: PortfolioItem[];
  onBuy: (stock: Stock, qty: number) => void;
  onSell: (stock: Stock, qty: number) => void;
  onDepositClick: () => void;
}

export const ShareMarket: React.FC<ShareMarketProps> = ({ 
  balance, 
  stocks, 
  portfolio, 
  onBuy, 
  onSell,
  onDepositClick
}) => {
  const [activeTab, setActiveTab] = useState<'market' | 'portfolio'>('market');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [tradeQty, setTradeQty] = useState(1);

  // Filter stocks for performance with 5000 items
  const filteredStocks = useMemo(() => {
    if (!searchTerm) return stocks;
    const lower = searchTerm.toLowerCase();
    return stocks.filter(s => 
      s.name.toLowerCase().includes(lower) || 
      s.symbol.toLowerCase().includes(lower)
    );
  }, [stocks, searchTerm]);

  // Pagination for performance (display 20 at a time)
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  const displayedStocks = filteredStocks.slice(0, page * itemsPerPage);

  const handleTrade = (type: 'BUY' | 'SELL') => {
    if (!selectedStock) return;
    if (type === 'BUY') onBuy(selectedStock, tradeQty);
    else onSell(selectedStock, tradeQty);
    setSelectedStock(null);
    setTradeQty(1);
  };

  return (
    <div className="p-6 pb-24 space-y-6 h-full flex flex-col">
      <header className="flex justify-between items-start">
        <div>
           <h1 className="text-2xl font-bold text-white mb-1">Islamic Stocks</h1>
           <p className="text-slate-400 text-sm">Shariah Compliant Trading</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-xs text-slate-400">Balance</p>
          <span className="text-emerald-400 font-bold text-lg mb-1">₨ {balance.toLocaleString()}</span>
          <button 
            onClick={onDepositClick}
            className="flex items-center space-x-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold px-2 py-1.5 rounded-lg transition-colors border border-emerald-500/20"
          >
            <Wallet className="w-3 h-3" />
            <span>Deposit</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-800 p-1 rounded-xl shrink-0">
        <button 
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center ${activeTab === 'market' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          onClick={() => setActiveTab('market')}
        >
          <TrendingUp className="w-4 h-4 mr-2" /> Live Market
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center ${activeTab === 'portfolio' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          onClick={() => setActiveTab('portfolio')}
        >
          <Briefcase className="w-4 h-4 mr-2" /> My Portfolio
        </button>
      </div>

      {activeTab === 'market' && (
        <>
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search 5000+ companies..." 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset page on search
              }}
            />
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
             <div className="grid grid-cols-12 text-xs text-slate-500 px-2 font-bold uppercase">
               <div className="col-span-6">Company</div>
               <div className="col-span-3 text-right">Price (PKR)</div>
               <div className="col-span-3 text-right">Action</div>
             </div>
             
             {displayedStocks.map(stock => (
               <div key={stock.symbol} className="bg-slate-800 border border-slate-700 rounded-xl p-3 grid grid-cols-12 items-center hover:bg-slate-700/50 transition-colors">
                 <div className="col-span-6">
                   <h3 className="font-bold text-white text-sm">{stock.symbol}</h3>
                   <p className="text-xs text-slate-400 truncate pr-2">{stock.name}</p>
                 </div>
                 <div className="col-span-3 text-right">
                   <div className="text-white font-mono font-bold">₨ {stock.price}</div>
                   <div className={`text-[10px] flex items-center justify-end ${stock.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                     {stock.changePercent >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                     {stock.changePercent}%
                   </div>
                 </div>
                 <div className="col-span-3 text-right">
                   <Button size="sm" className="py-1 px-3 text-xs h-8" onClick={() => setSelectedStock(stock)}>
                     Trade
                   </Button>
                 </div>
               </div>
             ))}
             
             {filteredStocks.length > displayedStocks.length && (
               <button 
                 onClick={() => setPage(p => p + 1)}
                 className="w-full py-3 text-slate-400 text-sm font-medium hover:text-white"
               >
                 Load More Companies...
               </button>
             )}
          </div>
        </>
      )}

      {activeTab === 'portfolio' && (
        <div className="flex-1 overflow-y-auto min-h-0 space-y-4">
          {portfolio.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-2xl">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Your portfolio is empty.</p>
              <button onClick={() => setActiveTab('market')} className="text-emerald-400 text-sm font-bold mt-2 hover:underline">Start Investing</button>
            </div>
          ) : (
            portfolio.map(item => {
              const currentStock = stocks.find(s => s.symbol === item.symbol);
              const currentPrice = currentStock ? currentStock.price : item.avgBuyPrice;
              const profit = (currentPrice - item.avgBuyPrice) * item.quantity;
              
              return (
                <div key={item.symbol} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                   <div className="flex justify-between items-start mb-3">
                     <div>
                       <h3 className="font-bold text-white text-lg">{item.symbol}</h3>
                       <p className="text-xs text-slate-400">{item.name}</p>
                     </div>
                     <div className={`text-right ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        <div className="text-sm font-bold">{profit >= 0 ? '+' : ''}₨ {profit.toLocaleString()}</div>
                        <div className="text-[10px]">Total Return</div>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-2 text-center bg-slate-900/50 rounded-lg p-2 mb-3">
                     <div>
                       <p className="text-[10px] text-slate-500">Qty</p>
                       <p className="text-white font-bold">{item.quantity}</p>
                     </div>
                     <div>
                       <p className="text-[10px] text-slate-500">Avg Cost</p>
                       <p className="text-white font-bold">{item.avgBuyPrice.toFixed(0)}</p>
                     </div>
                     <div>
                       <p className="text-[10px] text-slate-500">Current</p>
                       <p className="text-white font-bold">{currentPrice}</p>
                     </div>
                   </div>

                   <div className="flex space-x-2">
                     <Button 
                       variant="danger" 
                       fullWidth 
                       className="py-1 text-sm"
                       onClick={() => {
                         if (currentStock) setSelectedStock(currentStock);
                       }}
                     >
                       Sell / Buy More
                     </Button>
                   </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Trade Modal */}
      {selectedStock && (
         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
           <div className="bg-slate-900 w-full max-w-md rounded-t-2xl sm:rounded-2xl border-t sm:border border-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
             <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
               <div>
                  <h3 className="font-bold text-white">{selectedStock.name}</h3>
                  <p className="text-xs text-emerald-400 font-mono">Current: ₨ {selectedStock.price}</p>
               </div>
               <button onClick={() => setSelectedStock(null)} className="p-2 text-slate-400 hover:text-white"><RefreshCw className="w-4 h-4" /></button>
             </div>
             
             <div className="p-6 space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  <button 
                    onClick={() => setTradeQty(Math.max(1, tradeQty - 1))}
                    className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-white hover:bg-slate-700"
                  >
                    -
                  </button>
                  <div className="text-center w-24">
                    <p className="text-2xl font-bold text-white">{tradeQty}</p>
                    <p className="text-xs text-slate-500">Shares</p>
                  </div>
                  <button 
                     onClick={() => setTradeQty(tradeQty + 1)}
                     className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-white hover:bg-slate-700"
                  >
                    +
                  </button>
                </div>

                <div className="bg-slate-800 p-3 rounded-xl flex justify-between items-center">
                  <span className="text-slate-400">Total Cost/Value</span>
                  <span className="text-white font-bold text-xl">₨ {(selectedStock.price * tradeQty).toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="danger" 
                    disabled={!portfolio.find(p => p.symbol === selectedStock.symbol) || (portfolio.find(p => p.symbol === selectedStock.symbol)?.quantity || 0) < tradeQty}
                    onClick={() => handleTrade('SELL')}
                  >
                    Sell
                  </Button>
                  <Button 
                    variant="primary"
                    disabled={balance < selectedStock.price * tradeQty}
                    onClick={() => handleTrade('BUY')}
                  >
                    Buy
                  </Button>
                </div>
                
                <div className="text-center text-xs text-slate-500">
                  <p>Wallet Balance: ₨ {balance.toLocaleString()}</p>
                  <p>Owned: {portfolio.find(p => p.symbol === selectedStock.symbol)?.quantity || 0} Shares</p>
                </div>

                <Button variant="secondary" fullWidth onClick={() => setSelectedStock(null)}>Cancel</Button>
             </div>
           </div>
         </div>
      )}
    </div>
  );
};
