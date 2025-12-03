
import React, { useState } from 'react';
import { X, Copy, CheckCircle, CreditCard } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number, tid: string) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDeposit }) => {
  const [amountPKR, setAmountPKR] = useState('');
  const [tid, setTid] = useState('');
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const ADMIN_IBAN = "PK08JCMA2710923195702823";

  const handleCopy = () => {
    navigator.clipboard.writeText(ADMIN_IBAN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountPKR || !tid) return;

    setIsVerifying(true);
    
    // Direct PKR deposit
    const amount = parseFloat(amountPKR);

    setTimeout(() => {
      onDeposit(amount, tid);
      setIsVerifying(false);
      setAmountPKR('');
      setTid('');
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden relative">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-white">Deposit Funds (PKR)</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4">
            <p className="text-emerald-400 text-xs font-bold uppercase mb-1">Method: JazzCash / EasyPaisa</p>
            <p className="text-slate-300 text-sm mb-3">Send PKR to the IBAN below.</p>
            
            <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <code className="flex-1 text-emerald-400 font-mono text-sm break-all">{ADMIN_IBAN}</code>
              <button onClick={handleCopy} className="text-slate-400 hover:text-white">
                {copied ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Amount (PKR)" 
              type="number" 
              placeholder="e.g. 1000"
              value={amountPKR}
              onChange={e => setAmountPKR(e.target.value)}
              required
            />
            <Input 
              label="Transaction ID (TID)" 
              type="text" 
              placeholder="e.g. 03425678912"
              value={tid}
              onChange={e => setTid(e.target.value)}
              required
            />
            
            <Button fullWidth isLoading={isVerifying} variant="primary">
              Verify & Add Balance
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
