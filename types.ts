
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'CREDIT' | 'DEBIT';
}

export interface PortfolioItem {
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number; // Stored in PKR
  password?: string;
  referralCode: string;
  transactions?: Transaction[];
  portfolio?: PortfolioItem[];
  lastRewardClaimDate?: string; // ISO Date string YYYY-MM-DD
  rewardStreak?: number; // Current day in cycle (1-15)
}

// Renamed from Stock to Asset for broader trading context
export interface Asset {
  symbol: string;
  name: string;
  type: 'FOREX' | 'CRYPTO' | 'COMMODITY';
  price: number;
  previousPrice: number;
  changePercent: number;
  trend: 'UP' | 'DOWN' | 'NEUTRAL';
  flag?: string; // Emoji flag
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  previousPrice: number;
  changePercent: number;
  trend: 'UP' | 'DOWN' | 'NEUTRAL';
}

export enum TaskType {
  WATCH_AD = 'WATCH_AD',
  SOCIAL = 'SOCIAL'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number; // Reward in PKR
  type: TaskType;
  durationSeconds?: number;
  isCompleted: boolean;
  actionUrl?: string; 
}

export interface GmailAccount {
  id: string;
  email: string;
  password?: string;
  price: number;
  isSold: boolean;
}
