
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  Wallet, 
  Home, 
  User as UserIcon, 
  LogOut, 
  PlayCircle,
  TrendingUp,
  History,
  CheckCircle,
  Lock,
  Mail,
  ShieldCheck,
  Briefcase,
  Gift,
  Calendar
} from 'lucide-react';
import { User, Task, Transaction, Asset, PortfolioItem, Stock } from './types';
import { generateDailyTasks } from './services/geminiService';
import { generateMarketData, updateMarketPrices } from './services/marketService';
import { generateMarketData as generateStockData, updateStockPrices } from './services/stockService';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { AdModal } from './components/AdModal';
import { GoogleAd } from './components/GoogleAd';
import { TradingTerminal } from './components/TradingTerminal';
import { ShareMarket } from './components/ShareMarket';
import { DepositModal } from './components/DepositModal';
import { Logo } from './components/Logo';

// --- COMPONENTS ---

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequence (Fast 0.2s intervals):
    // 0ms - 200ms: Bismillah
    // 200ms - 400ms: Salato Salam
    // 400ms - 1000ms: Logo (Extended slightly so it is visible)
    // 1000ms: Finish

    const t1 = setTimeout(() => setStep(1), 200);
    const t2 = setTimeout(() => setStep(2), 400);
    const t3 = setTimeout(() => onFinish(), 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50">
      
      {step === 0 && (
        <div className="animate-in fade-in zoom-in duration-200 fill-mode-forwards text-center p-4">
          <h1 className="text-4xl sm:text-6xl font-bold text-emerald-400 drop-shadow-2xl leading-relaxed" style={{ fontFamily: '"Amiri", serif' }}>
            بسم اللّٰہ الرحمٰن الرحیم
          </h1>
        </div>
      )}

      {step === 1 && (
        <div className="animate-in fade-in zoom-in duration-200 fill-mode-forwards text-center p-4">
          <h2 className="text-3xl sm:text-5xl font-medium text-emerald-200" style={{ fontFamily: '"Amiri", serif' }}>
            الصلاۃ والسلام علیٰ رسولہ اللہ
          </h2>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-200">
          <Logo size="xl" animated showText />
          <p className="mt-4 text-slate-500 text-sm tracking-widest uppercase">Islamic Trading App</p>
        </div>
      )}
      
    </div>
  );
};

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { icon: Home, label: 'Overview', path: '/dashboard' },
    { icon: TrendingUp, label: 'Forex', path: '/trade' },
    { icon: Briefcase, label: 'Stocks', path: '/stocks' },
    { icon: PlayCircle, label: 'Rewards', path: '/earn' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-safe z-40">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-1">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${isActive(item.path) ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <div className={`relative p-1 rounded-xl transition-all duration-200 ${isActive(item.path) ? 'bg-emerald-500/10 -translate-y-1' : ''}`}>
              <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive(item.path) ? 'fill-current' : ''}`} strokeWidth={isActive(item.path) ? 2.5 : 2} />
            </div>
            <span className={`text-[9px] sm:text-[10px] font-medium transition-opacity ${isActive(item.path) ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

// --- PAGES ---

const LoginPage = ({ onLogin }: { onLogin: (u: User, remember: boolean) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const users: User[] = JSON.parse(localStorage.getItem('c2c_users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (foundUser) {
        onLogin(foundUser, rememberMe);
      } else {
        setError('Invalid credentials');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 bg-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <Logo size="lg" />
        <p className="mt-4 text-center text-sm text-slate-400">
          Islamic Trading Platform
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/50 py-8 px-4 shadow-xl border border-slate-700 rounded-2xl sm:px-10 backdrop-blur-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input 
              label="Email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <Input 
              label="Password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-700 rounded bg-slate-800 focus:ring-offset-slate-900"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300 select-none">
                Remember me
              </label>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" fullWidth isLoading={isLoading}>
              Secure Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
              Create Trading Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const RegisterPage = ({ onLogin }: { onLogin: (u: User, remember: boolean) => void }) => {
  const [step, setStep] = useState<'DETAILS' | 'VERIFY'>('DETAILS');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', referralCode: '' });
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateReferralCode = (name: string) => {
    const cleanName = name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${cleanName}${randomNum}`;
  };

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setStep('VERIFY');
      alert(`Verification Code sent to ${formData.email} (Mock: 123456)`);
    }, 1500);
  };

  const handleVerifyAndRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456') {
      alert("Invalid Verification Code");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const users: User[] = JSON.parse(localStorage.getItem('c2c_users') || '[]');
      
      if (users.find(u => u.email === formData.email)) {
        alert("Email already exists!");
        setIsLoading(false);
        setStep('DETAILS');
        return;
      }

      // Referral Bonus in PKR
      if (formData.referralCode) {
        const referrerIndex = users.findIndex(u => u.referralCode === formData.referralCode);
        if (referrerIndex !== -1) {
          const referrer = users[referrerIndex];
          referrer.balance += 200; // 200 PKR Bonus
          if (!referrer.transactions) referrer.transactions = [];
          referrer.transactions.unshift({
            id: Date.now().toString() + '-ref',
            amount: 200,
            description: `Ref Bonus: ${formData.name}`,
            date: new Date().toLocaleDateString(),
            type: 'CREDIT'
          });
          users[referrerIndex] = referrer;
        }
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        balance: 100, // 100 PKR Start Bonus
        referralCode: generateReferralCode(formData.name),
        transactions: [],
        portfolio: [],
        lastRewardClaimDate: '',
        rewardStreak: 0
      };

      users.push(newUser);
      localStorage.setItem('c2c_users', JSON.stringify(users));
      
      onLogin(newUser, true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 bg-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <Logo size="md" />
        <p className="mt-2 text-center text-sm text-slate-400">
          Join the Islamic Trading Network
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/50 py-8 px-4 shadow-xl border border-slate-700 rounded-2xl sm:px-10 backdrop-blur-sm">
          
          {step === 'DETAILS' ? (
            <form className="space-y-6" onSubmit={handleSendCode}>
              <Input 
                label="Legal Name" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required 
              />
              <Input 
                label="Email Address" 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required 
              />
              <Input 
                label="Password" 
                type="password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required 
              />
              <Input 
                label="Referral ID (Optional)" 
                placeholder="Ex: ALI7890"
                value={formData.referralCode}
                onChange={e => setFormData({...formData, referralCode: e.target.value})}
              />
              
              <Button type="submit" fullWidth isLoading={isLoading}>
                Next: Verify Email
              </Button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyAndRegister}>
              <div className="text-center mb-6">
                <div className="bg-emerald-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-white font-bold">Verification</h3>
                <p className="text-slate-400 text-sm">Enter the code sent to {formData.email}</p>
              </div>

              <Input 
                label="6-Digit Code" 
                placeholder="123456"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="text-center tracking-widest text-xl"
                required 
              />
              
              <Button type="submit" fullWidth isLoading={isLoading}>
                Verify & Register
              </Button>
              <button 
                type="button" 
                onClick={() => setStep('DETAILS')}
                className="w-full text-sm text-slate-500 hover:text-white mt-4"
              >
                Back to details
              </button>
            </form>
          )}

           <div className="mt-6 text-center">
              <Link to="/login" className="text-sm font-medium text-emerald-500 hover:text-emerald-400">
                Already have an account? Login
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ user, onDepositClick }: { user: User, onDepositClick: () => void }) => {
  return (
    <div className="p-6 pb-24 space-y-6">
      <header className="flex justify-between items-center bg-slate-800/50 -mx-6 -mt-6 p-6 border-b border-slate-700/50">
        <div>
          <h1 className="text-xl font-bold text-white">Portfolio Overview</h1>
          <p className="text-slate-400 text-xs mt-1">Real-time Market Data</p>
        </div>
        <Link to="/profile">
           <div className="h-10 w-10 bg-slate-700 rounded-full flex items-center justify-center border border-slate-600">
             <UserIcon className="w-5 h-5 text-emerald-400" />
           </div>
        </Link>
      </header>

      {/* Main Balance Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-700">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-slate-400 text-sm font-medium">Total Balance (PKR)</p>
            <h2 className="text-4xl font-bold text-white mt-2">₨ {user.balance.toLocaleString()}</h2>
          </div>
          <div className="bg-emerald-500/10 p-2 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
           <button onClick={onDepositClick} className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all">
              Deposit
           </button>
           <Link to="/trade">
            <button className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-bold transition-all">
              Forex Trade
            </button>
           </Link>
           <Link to="/stocks" className="col-span-2">
             <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center">
               <Briefcase className="w-4 h-4 mr-2" /> Islamic Stock Market (5000+)
             </button>
           </Link>
        </div>
      </div>

      {/* Market Ticker */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-white text-sm">Market Movers</h3>
          <span className="text-xs text-emerald-400 animate-pulse">● Live</span>
        </div>
        <div className="space-y-3">
           <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                 <span className="text-xl">🇺🇸</span>
                 <span className="text-sm text-white font-medium">USD/PKR</span>
              </div>
              <span className="text-emerald-400 text-sm font-mono font-bold">278.50 <span className="text-[10px] ml-1">▲ 0.4%</span></span>
           </div>
           <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                 <span className="text-xl">🪙</span>
                 <span className="text-sm text-white font-medium">Gold</span>
              </div>
              <span className="text-red-400 text-sm font-mono font-bold">242,000 <span className="text-[10px] ml-1">▼ 0.1%</span></span>
           </div>
           <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                 <span className="text-xl">₿</span>
                 <span className="text-sm text-white font-medium">Bitcoin</span>
              </div>
              <span className="text-emerald-400 text-sm font-mono font-bold">1.78M <span className="text-[10px] ml-1">▲ 1.2%</span></span>
           </div>
        </div>
      </div>

      {/* Ad Space */}
      <GoogleAd slotId="DASH-BANNER" />

    </div>
  );
};

const EarnPage = ({ 
  tasks, 
  user,
  onCompleteTask, 
  onWatchAd,
  onClaimDaily
}: { 
  tasks: Task[], 
  user: User,
  onCompleteTask: (task: Task) => void,
  onWatchAd: () => void,
  onClaimDaily: (amount: number, day: number) => void
}) => {
  const currentDay = user.rewardStreak ? (user.rewardStreak % 15) + 1 : 1;
  const todayStr = new Date().toISOString().split('T')[0];
  const canClaim = user.lastRewardClaimDate !== todayStr;

  // Daily Reward Grid logic
  const days = Array.from({ length: 15 }, (_, i) => {
     const dayNum = i + 1;
     const rewardAmount = dayNum * 10; // 10, 20, 30 ... 150
     const isCompleted = user.rewardStreak ? (user.rewardStreak % 15 >= dayNum || (user.rewardStreak % 15 === 0 && user.rewardStreak > 0)) : false;
     // Fix: if streak is 3, days 1,2,3 are done? No, streak implies completed count.
     // Simplified: Streak represents how many days claimed in current cycle.
     // If streak is 3, user has claimed day 1, 2, 3. Next is 4.
     const streak = user.rewardStreak || 0;
     const isClaimed = dayNum <= streak;
     const isToday = dayNum === streak + 1;

     return { dayNum, rewardAmount, isClaimed, isToday };
  });

  return (
    <div className="p-6 pb-24 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white mb-2">Rewards Center</h1>
        <p className="text-slate-400 text-sm">Complete tasks & login daily to earn.</p>
      </header>

      {/* Daily Login Reward */}
      <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
        <div className="flex items-center space-x-2 mb-4">
           <Calendar className="text-emerald-400 w-5 h-5" />
           <h3 className="font-bold text-white">Daily Login Bonus</h3>
        </div>
        
        <div className="grid grid-cols-5 gap-2 mb-4">
           {days.map((d) => (
             <div 
               key={d.dayNum} 
               className={`rounded-lg p-2 text-center border text-xs flex flex-col justify-center items-center h-16
                 ${d.isClaimed ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 
                   d.isToday && canClaim ? 'bg-white text-slate-900 border-white font-bold animate-pulse' : 
                   'bg-slate-900 border-slate-700 text-slate-500 opacity-50'}
               `}
             >
               <span className="block mb-1">Day {d.dayNum}</span>
               <span className="font-bold">₨{d.rewardAmount}</span>
             </div>
           ))}
        </div>

        <Button 
          fullWidth 
          variant={canClaim ? 'primary' : 'secondary'}
          disabled={!canClaim}
          onClick={() => {
            if (canClaim) {
               const day = (user.rewardStreak || 0) + 1;
               const amount = day * 10;
               onClaimDaily(amount, day);
            }
          }}
        >
          {canClaim ? 'Claim Daily Reward' : 'Come back tomorrow'}
        </Button>
      </div>

      {/* Watch Ad */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center">
           <div>
             <h3 className="font-bold text-lg">Watch & Earn</h3>
             <p className="text-purple-100 text-sm mt-1">Get ₨ 25 per video ad.</p>
           </div>
           <Button onClick={onWatchAd} size="sm" className="bg-white text-purple-700 hover:bg-purple-50 border-none font-bold">
             Watch
           </Button>
        </div>
      </div>

      <GoogleAd slotId="REWARD-MID" className="my-2" />

      {/* Social Tasks */}
      <h3 className="font-bold text-white mt-4">Social Tasks</h3>
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex justify-between items-center">
            <div>
              <h4 className="text-white font-medium">{task.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{task.description}</p>
            </div>
            {task.isCompleted ? (
              <span className="text-emerald-500 text-xs font-bold flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" /> Done
              </span>
            ) : (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  if(task.actionUrl) window.open(task.actionUrl, '_blank');
                  setTimeout(() => onCompleteTask(task), 5000);
                }}
              >
                +₨ {task.reward}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const WalletPage = ({ 
  user, 
  transactions, 
  onWithdraw,
  onDepositClick 
}: { 
  user: User, 
  transactions: Transaction[], 
  onWithdraw: (amount: number, method: string, account: string) => void,
  onDepositClick: () => void
}) => {
  const [account, setAccount] = useState('');
  const [method, setMethod] = useState('jazzcash');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if(user.balance < 800) {
      alert("Minimum withdrawal is ₨ 800");
      return;
    }
    setIsWithdrawing(true);
    setTimeout(() => {
      onWithdraw(user.balance, method, account);
      setIsWithdrawing(false);
      alert("Withdrawal Request Processed");
    }, 2000);
  };

  return (
    <div className="p-6 pb-24 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
      </header>

      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
         <p className="text-slate-400 text-sm">Available Balance</p>
         <h2 className="text-3xl font-bold text-white mt-2 mb-4">₨ {user.balance.toLocaleString()}</h2>
         <Button fullWidth onClick={onDepositClick}>Deposit Funds</Button>
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h3 className="font-bold text-white mb-4">Withdraw Funds</h3>
        <form onSubmit={handleWithdraw} className="space-y-4">
           <select 
             className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3 text-white"
             value={method}
             onChange={e => setMethod(e.target.value)}
           >
             <option value="jazzcash">JazzCash</option>
             <option value="easypaisa">Easypaisa</option>
             <option value="bank">Bank Transfer</option>
           </select>
           <Input 
             label="Account / IBAN" 
             value={account} 
             onChange={e => setAccount(e.target.value)} 
             required 
           />
           <Button variant="secondary" fullWidth disabled={user.balance < 800} isLoading={isWithdrawing}>
             Withdraw All
           </Button>
           {user.balance < 800 && <p className="text-xs text-center text-red-400">Min withdrawal: ₨ 800</p>}
        </form>
      </div>

      <div>
        <h3 className="font-bold text-white mb-3">History</h3>
        <div className="space-y-3">
          {transactions.map(tx => (
            <div key={tx.id} className="bg-slate-800/50 p-3 rounded-lg flex justify-between items-center text-sm">
               <div>
                 <p className="text-white font-medium">{tx.description}</p>
                 <p className="text-xs text-slate-500">{tx.date}</p>
               </div>
               <span className={tx.type === 'CREDIT' ? 'text-emerald-400' : 'text-red-400'}>
                 {tx.type === 'CREDIT' ? '+' : '-'}₨ {tx.amount.toLocaleString()}
               </span>
            </div>
          ))}
          {transactions.length === 0 && <p className="text-slate-500 text-sm text-center">No transactions.</p>}
        </div>
      </div>
    </div>
  );
};

const ProfilePage = ({ user, onLogout }: { user: User, onLogout: () => void }) => (
  <div className="p-6">
    <div className="text-center mb-8">
      <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto flex items-center justify-center border-2 border-emerald-500 mb-4">
        <UserIcon className="w-10 h-10 text-slate-300" />
      </div>
      <h2 className="text-xl font-bold text-white">{user.name}</h2>
      <p className="text-slate-500 text-sm">{user.email}</p>
      <div className="mt-4 bg-slate-800 inline-block px-4 py-2 rounded-lg border border-slate-700">
        <span className="text-xs text-slate-400 block">Referral ID</span>
        <span className="font-mono text-emerald-400 font-bold tracking-widest">{user.referralCode}</span>
      </div>
    </div>
    <Button variant="danger" fullWidth onClick={onLogout}>
      <LogOut className="w-4 h-4 mr-2" /> Log Out
    </Button>
    <BottomNav />
  </div>
);

// --- MAIN ---

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  
  // Modals
  const [showAdModal, setShowAdModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  // 1. Load Data
  useEffect(() => {
    setAssets(generateMarketData());
    setStocks(generateStockData());

    const sessionUser = sessionStorage.getItem('c2c_currentUser');
    const localUser = localStorage.getItem('c2c_currentUser');
    const storedUser = sessionUser || localUser;

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setTransactions(parsedUser.transactions || []);
      setIsAuthenticated(true);
    }
  }, []);

  // 2. Market Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => updateMarketPrices(prev));
      setStocks(prev => updateStockPrices(prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // 3. User Persistence
  useEffect(() => {
    if (user) {
      const updatedUser = { ...user, transactions };
      if (localStorage.getItem('c2c_currentUser')) {
          localStorage.setItem('c2c_currentUser', JSON.stringify(updatedUser));
      } else if (sessionStorage.getItem('c2c_currentUser')) {
          sessionStorage.setItem('c2c_currentUser', JSON.stringify(updatedUser));
      }

      // Update global DB
      const allUsers: User[] = JSON.parse(localStorage.getItem('c2c_users') || '[]');
      const index = allUsers.findIndex(u => u.email === user.email);
      if (index !== -1) {
        allUsers[index] = updatedUser;
        localStorage.setItem('c2c_users', JSON.stringify(allUsers));
      }
    }
  }, [user, transactions]);

  // Load Tasks
  useEffect(() => {
    if (isAuthenticated) {
      generateDailyTasks().then(setTasks);
    }
  }, [isAuthenticated]);

  const handleLogin = (u: User, remember: boolean) => {
    setUser(u);
    setTransactions(u.transactions || []);
    setIsAuthenticated(true);
    if (remember) {
      localStorage.setItem('c2c_currentUser', JSON.stringify(u));
    } else {
      sessionStorage.setItem('c2c_currentUser', JSON.stringify(u));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('c2c_currentUser');
    sessionStorage.removeItem('c2c_currentUser');
  };

  const addTransaction = (amount: number, description: string, type: 'CREDIT' | 'DEBIT') => {
    if (!user) return;
    const newTx: Transaction = {
      id: Date.now().toString(),
      amount,
      description,
      date: new Date().toLocaleDateString(),
      type
    };
    setTransactions(prev => [newTx, ...prev]);
    setUser(prev => prev ? { ...prev, balance: prev.balance + (type === 'CREDIT' ? amount : -amount) } : null);
  };

  // Trade Logic (Forex)
  const handleBuyAsset = (asset: Asset, amount: number) => {
    if (!user) return;
    if (user.balance < amount) {
      alert("Insufficient Balance");
      return;
    }

    const qty = amount / asset.price;
    addTransaction(amount, `Buy ${asset.symbol}`, 'DEBIT');

    // Update Portfolio
    const currentPortfolio = user.portfolio || [];
    const existingIndex = currentPortfolio.findIndex(p => p.symbol === asset.symbol);
    const newPortfolio = [...currentPortfolio];

    if (existingIndex !== -1) {
      const item = newPortfolio[existingIndex];
      // Weighted average calculation
      const totalCost = (item.quantity * item.avgBuyPrice) + amount;
      const newQty = item.quantity + qty;
      newPortfolio[existingIndex] = { ...item, quantity: newQty, avgBuyPrice: totalCost / newQty };
    } else {
      newPortfolio.push({ symbol: asset.symbol, name: asset.name, quantity: qty, avgBuyPrice: asset.price });
    }
    
    setUser(prev => prev ? { ...prev, portfolio: newPortfolio } : null);
  };

  const handleSellAsset = (asset: Asset, qty: number) => {
    if (!user) return;
    const revenue = qty * asset.price;
    
    addTransaction(revenue, `Sell ${asset.symbol}`, 'CREDIT');
    
    // Remove from portfolio
    const currentPortfolio = user.portfolio || [];
    const newPortfolio = currentPortfolio.filter(p => p.symbol !== asset.symbol);
    
    setUser(prev => prev ? { ...prev, portfolio: newPortfolio } : null);
  };

  // Share Market Logic
  const handleBuyStock = (stock: Stock, qty: number) => {
    if (!user) return;
    const cost = stock.price * qty;
    if (user.balance < cost) {
      alert("Insufficient Balance");
      return;
    }

    addTransaction(cost, `Buy Stock ${stock.symbol}`, 'DEBIT');

    const currentPortfolio = user.portfolio || [];
    const existingIndex = currentPortfolio.findIndex(p => p.symbol === stock.symbol);
    const newPortfolio = [...currentPortfolio];

    if (existingIndex !== -1) {
      const item = newPortfolio[existingIndex];
      const totalCost = (item.quantity * item.avgBuyPrice) + cost;
      const newQty = item.quantity + qty;
      newPortfolio[existingIndex] = { ...item, quantity: newQty, avgBuyPrice: totalCost / newQty };
    } else {
      newPortfolio.push({ symbol: stock.symbol, name: stock.name, quantity: qty, avgBuyPrice: stock.price });
    }
    
    setUser(prev => prev ? { ...prev, portfolio: newPortfolio } : null);
  };

  const handleSellStock = (stock: Stock, qty: number) => {
    if (!user) return;
    const revenue = qty * stock.price;

    addTransaction(revenue, `Sell Stock ${stock.symbol}`, 'CREDIT');
    
    const currentPortfolio = user.portfolio || [];
    const existingIndex = currentPortfolio.findIndex(p => p.symbol === stock.symbol);
    if (existingIndex === -1) return;

    const item = currentPortfolio[existingIndex];
    let newPortfolio = [...currentPortfolio];

    if (item.quantity <= qty) {
      // Sold all
      newPortfolio = currentPortfolio.filter(p => p.symbol !== stock.symbol);
    } else {
      // Sold partial
      newPortfolio[existingIndex] = { ...item, quantity: item.quantity - qty };
    }
    
    setUser(prev => prev ? { ...prev, portfolio: newPortfolio } : null);
  };

  const handleDeposit = (amount: number, tid: string) => {
    addTransaction(amount, `Deposit (TID: ${tid})`, 'CREDIT');
  };

  const handleClaimDailyReward = (amount: number, day: number) => {
     if (!user) return;
     const todayStr = new Date().toISOString().split('T')[0];
     
     // Update user directly with reward info
     const updatedUser = {
        ...user,
        balance: user.balance + amount,
        lastRewardClaimDate: todayStr,
        rewardStreak: (user.rewardStreak || 0) + 1
     };
     
     setUser(updatedUser);
     addTransaction(amount, `Daily Reward (Day ${day})`, 'CREDIT');
     alert(`Claimed Day ${day} Reward: ₨ ${amount}`);
  };

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  return (
    <Router>
      <div className="max-w-md mx-auto min-h-screen bg-slate-900 shadow-2xl overflow-hidden relative font-sans text-slate-100">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
          
          <Route path="/dashboard" element={isAuthenticated && user ? (
            <>
              <Dashboard user={user} onDepositClick={() => setShowDepositModal(true)} />
              <BottomNav />
            </>
          ) : <Navigate to="/login" />} />

          <Route path="/trade" element={isAuthenticated && user ? (
             <>
               <TradingTerminal 
                 balance={user.balance} 
                 assets={assets} 
                 portfolio={user.portfolio || []} 
                 onBuy={handleBuyAsset}
                 onSell={handleSellAsset}
                 onDepositClick={() => setShowDepositModal(true)}
               />
               <BottomNav />
             </>
          ) : <Navigate to="/login" />} />

          <Route path="/stocks" element={isAuthenticated && user ? (
             <>
               <ShareMarket
                 balance={user.balance}
                 stocks={stocks}
                 portfolio={user.portfolio || []}
                 onBuy={handleBuyStock}
                 onSell={handleSellStock}
                 onDepositClick={() => setShowDepositModal(true)}
               />
               <BottomNav />
             </>
          ) : <Navigate to="/login" />} />

          <Route path="/earn" element={isAuthenticated && user ? (
             <>
               <EarnPage 
                 tasks={tasks} 
                 user={user}
                 onCompleteTask={(t) => {
                    addTransaction(t.reward, `Task: ${t.title}`, 'CREDIT');
                    setTasks(prev => prev.map(pt => pt.id === t.id ? {...pt, isCompleted: true} : pt));
                 }} 
                 onWatchAd={() => setShowAdModal(true)} 
                 onClaimDaily={handleClaimDailyReward}
               />
               <BottomNav />
             </>
          ) : <Navigate to="/login" />} />

          <Route path="/wallet" element={isAuthenticated && user ? (
             <>
               <WalletPage 
                 user={user} 
                 transactions={transactions} 
                 onWithdraw={(amt, m, acc) => addTransaction(amt, `Withdraw: ${m}`, 'DEBIT')} 
                 onDepositClick={() => setShowDepositModal(true)}
               />
               <BottomNav />
             </>
          ) : <Navigate to="/login" />} />

          <Route path="/profile" element={isAuthenticated && user ? <ProfilePage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>

        <AdModal 
          isOpen={showAdModal} 
          onClose={() => setShowAdModal(false)} 
          onComplete={() => addTransaction(25, 'Ad Reward', 'CREDIT')} 
        />

        <DepositModal 
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          onDeposit={handleDeposit}
        />
      </div>
    </Router>
  );
};

export default App;
