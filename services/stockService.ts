
import { Stock } from "../types";

// Enhanced list with Islamic and corporate terms
const COMPANY_PREFIXES = [
  "Meezan", "Al-Falah", "Takaful", "Barakah", "Ehsan", "Modaraba", "Shariah", "Halal", "Tayyab", "Unity", 
  "Pioneer", "Summit", "Falcon", "Oasis", "Crescent", "Alpha", "Beta", "Omega", "Global", "Tech", 
  "Future", "Smart", "Green", "Prime", "Star", "Cyber", "Quantum", "Hyper", "Mega", "Ultra",
  "Al-Habib", "Askari", "Faysal", "Dubai", "Emirates", "Gulf", "Saudi", "Pak", "Indus", "Mehran"
];

const COMPANY_SUFFIXES = [
  "Bank", "Textiles", "Cement", "Foods", "Energy", "Petroleum", "Motors", "Chemicals", "Pharma", 
  "Sugar", "Holdings", "Group", "Ltd", "Corp", "Systems", "Solutions", "Enterprises", "Industries", 
  "Mills", "Engineering", "Power", "Gas", "Fertilizer", "Glass", "Papers", "Cables", "Network"
];

const generateRandomPrice = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateMarketData = (): Stock[] => {
  const stocks: Stock[] = [];
  
  // Generate 5000 stocks
  // We use a deterministic loop to ensure we get enough items
  let count = 0;
  
  // Outer loops to mix prefixes and suffixes
  for (let p = 0; p < COMPANY_PREFIXES.length; p++) {
    for (let s = 0; s < COMPANY_SUFFIXES.length; s++) {
      // Add variations with numbers to reach 5000+
      for(let v = 1; v <= 5; v++) { 
         if (count >= 5000) break;

         const prefix = COMPANY_PREFIXES[p];
         const suffix = COMPANY_SUFFIXES[s];
         
         // Create a unique symbol
         const randomNum = Math.floor(Math.random() * 999);
         const name = `${prefix} ${suffix} ${v > 1 ? v : ''}`;
         
         // Generate symbol like MZN, AFL, etc.
         const symBase = prefix.substring(0, 3).toUpperCase();
         const symSuffix = suffix.substring(0, 1).toUpperCase();
         const symbol = `${symBase}${symSuffix}-${randomNum}`;
         
         const price = generateRandomPrice(20, 5000); // 20 to 5000 PKR

         stocks.push({
           symbol: symbol,
           name: name,
           price: price,
           previousPrice: price,
           changePercent: 0,
           trend: 'NEUTRAL'
         });
         count++;
      }
    }
  }
  
  // If we still need more, fill with generic Tech stocks
  while(count < 5000) {
      const id = count + 1;
      const price = generateRandomPrice(10, 1000);
      stocks.push({
          symbol: `TECH-${id}`,
          name: `Islamic Tech Ventures ${id}`,
          price,
          previousPrice: price,
          changePercent: 0,
          trend: 'NEUTRAL'
      });
      count++;
  }

  return stocks;
};

export const updateStockPrices = (stocks: Stock[]): Stock[] => {
  return stocks.map(stock => {
    // 20% chance a stock moves in this tick to reduce lag with 5000 items
    if (Math.random() > 0.2) return stock;

    const volatility = 0.03; // 3% max change
    const changeFactor = 1 + (Math.random() * volatility * 2 - volatility); 
    let newPrice = Math.floor(stock.price * changeFactor);

    // Keep within bounds
    if (newPrice < 5) newPrice = 5;
    if (newPrice > 15000) newPrice = 15000;

    const changePercent = ((newPrice - stock.previousPrice) / stock.previousPrice) * 100;

    return {
      ...stock,
      price: newPrice,
      changePercent: parseFloat(changePercent.toFixed(2)),
      trend: newPrice > stock.price ? 'UP' : newPrice < stock.price ? 'DOWN' : 'NEUTRAL'
    };
  });
};
