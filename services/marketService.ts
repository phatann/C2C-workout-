
import { Asset } from "../types";

// Base rates in PKR
const INITIAL_ASSETS = [
  { symbol: "USD", name: "US Dollar", type: "FOREX", price: 278.50, flag: "🇺🇸" },
  { symbol: "EUR", name: "Euro", type: "FOREX", price: 301.20, flag: "🇪🇺" },
  { symbol: "GBP", name: "British Pound", type: "FOREX", price: 352.80, flag: "🇬🇧" },
  { symbol: "AED", name: "UAE Dirham", type: "FOREX", price: 75.85, flag: "🇦🇪" },
  { symbol: "SAR", name: "Saudi Riyal", type: "FOREX", price: 74.20, flag: "🇸🇦" },
  { symbol: "CNY", name: "Chinese Yuan", type: "FOREX", price: 38.50, flag: "🇨🇳" },
  { symbol: "BTC", name: "Bitcoin", type: "CRYPTO", price: 17800000.00, flag: "₿" }, // Approx PKR
  { symbol: "ETH", name: "Ethereum", type: "CRYPTO", price: 950000.00, flag: "Ξ" },
  { symbol: "GOLD", name: "Gold (1 Tola)", type: "COMMODITY", price: 242000.00, flag: "🪙" },
];

export const generateMarketData = (): Asset[] => {
  return INITIAL_ASSETS.map(asset => ({
    ...asset,
    previousPrice: asset.price,
    changePercent: 0,
    trend: 'NEUTRAL'
  })) as Asset[];
};

export const updateMarketPrices = (assets: Asset[]): Asset[] => {
  return assets.map(asset => {
    // 50% chance an asset moves in this tick
    if (Math.random() > 0.5) return asset;

    // Volatility
    const volatility = asset.type === 'CRYPTO' ? 0.008 : 0.001; 
    
    const changeFactor = 1 + (Math.random() * volatility * 2 - volatility); 
    let newPrice = asset.price * changeFactor;

    // Formatting precision
    // If price is large (like BTC/Gold), round to whole numbers
    if (newPrice > 1000) newPrice = Math.round(newPrice);
    else newPrice = Math.round(newPrice * 100) / 100;

    const changePercent = ((newPrice - asset.previousPrice) / asset.previousPrice) * 100;

    return {
      ...asset,
      price: newPrice,
      changePercent: parseFloat(changePercent.toFixed(2)),
      trend: newPrice > asset.price ? 'UP' : newPrice < asset.price ? 'DOWN' : 'NEUTRAL'
    };
  });
};
