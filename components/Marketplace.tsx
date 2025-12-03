import React, { useState } from 'react';
import { ShoppingBag, DollarSign, Mail, CheckCircle, Copy, X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { GmailAccount } from '../types';

interface MarketplaceProps {
  balance: number;
  marketAccounts: GmailAccount[];
  onSellAccount: (email: string, pass: string) => void;
  onBuyAccount: (account: GmailAccount) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ 
  balance, 
  marketAccounts, 
  onSellAccount, 
  onBuyAccount 
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [sellEmail, setSellEmail] = useState('');
  const [sellPass, setSellPass] = useState('');
  const [purchasedAccount, setPurchasedAccount] = useState<GmailAccount | null>(null);

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellEmail.includes('@gmail.com')) {
      alert("Please enter a valid Gmail address.");
      return;
    }
    if (sellPass.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    onSellAccount(sellEmail, sellPass);
    setSellEmail('');
    setSellPass('');
    alert("Account listed successfully! +20 Points added.");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const availableAccounts = marketAccounts.filter(acc => !acc.isSold);

  return (
    <div className="p-6 pb-24 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white mb-2">Account Market</h1>
        <p className="text-slate-400 text-sm">Buy and Sell verified Gmail accounts.</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-800 p-1 rounded-xl">
        <button 
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'buy' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          onClick={() => setActiveTab('buy')}
        >
          Buy Accounts
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'sell' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          onClick={() => setActiveTab('sell')}
        >
          Sell Account
        </button>
      </div>

      {activeTab === 'sell' && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white">Sell Gmail Account</h3>
              <p className="text-xs text-slate-400">Get 20 Points instantly</p>
            </div>
          </div>

          <form onSubmit={handleSellSubmit} className="space-y-4">
            <Input 
              label="Gmail Address" 
              type="email" 
              placeholder="example@gmail.com"
              value={sellEmail}
              onChange={e => setSellEmail(e.target.value)}
              required
            />
            <Input 
              label="Password" 
              type="text" 
              placeholder="Enter password"
              value={sellPass}
              onChange={e => setSellPass(e.target.value)}
              required
            />
            
            <div className="bg-yellow-900/20 border border-yellow-700/50 p-3 rounded-lg text-xs text-yellow-200 mb-4">
              <strong>Disclaimer:</strong> Only list accounts you own. False information will lead to a ban.
            </div>

            <Button fullWidth type="submit" variant="primary">
              List Account (+20 Pts)
            </Button>
          </form>
        </div>
      )}

      {activeTab === 'buy' && (
        <div className="space-y-4">
          {availableAccounts.length === 0 ? (
            <div className="text-center py-10 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No accounts available right now.</p>
              <button onClick={() => setActiveTab('sell')} className="text-emerald-400 text-sm font-bold mt-2 hover:underline">
                Be the first to sell!
              </button>
            </div>
          ) : (
            availableAccounts.map(acc => (
              <div key={acc.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Gmail Account</h4>
                    <p className="text-xs text-slate-500">ID: ****{acc.id.slice(-4)}</p>
                  </div>
                </div>
                
                <div className="text-right">
                   <div className="text-emerald-400 font-bold mb-1">{acc.price} Pts</div>
                   <Button 
                     size="sm" 
                     className="px-3 py-1 h-8 text-xs"
                     onClick={() => {
                        if (balance >= acc.price) {
                          onBuyAccount(acc);
                          setPurchasedAccount(acc);
                        } else {
                          alert("Insufficient balance!");
                        }
                     }}
                   >
                     Buy Now
                   </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Purchase Success Modal */}
      {purchasedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
           <div className="bg-slate-900 w-full max-w-sm rounded-2xl border border-emerald-500/50 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-emerald-600 p-4 text-center relative">
                 <button 
                    onClick={() => setPurchasedAccount(null)}
                    className="absolute top-4 right-4 text-emerald-100 hover:text-white"
                 >
                    <X className="w-5 h-5" />
                 </button>
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                 </div>
                 <h3 className="text-white font-bold text-lg">Purchase Successful!</h3>
              </div>
              
              <div className="p-6 space-y-4">
                 <p className="text-center text-slate-400 text-sm">Save these credentials immediately.</p>
                 
                 <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Email</p>
                    <div className="flex justify-between items-center">
                       <code className="text-white text-sm break-all">{purchasedAccount.email}</code>
                       <button onClick={() => copyToClipboard(purchasedAccount.email)} className="text-emerald-500 hover:text-emerald-400 ml-2 p-1">
                          <Copy className="w-4 h-4" />
                       </button>
                    </div>
                 </div>

                 <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Password</p>
                    <div className="flex justify-between items-center">
                       <code className="text-white text-sm">{purchasedAccount.password}</code>
                       <button onClick={() => copyToClipboard(purchasedAccount.password)} className="text-emerald-500 hover:text-emerald-400 ml-2 p-1">
                          <Copy className="w-4 h-4" />
                       </button>
                    </div>
                 </div>

                 <Button fullWidth onClick={() => setPurchasedAccount(null)}>
                   Close
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};