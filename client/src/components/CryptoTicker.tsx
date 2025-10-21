import { useEffect, useState } from 'react';
import { cryptoPrices, type CryptoPrice } from '@/lib/mockData';

export default function CryptoTicker() {
  const [prices, setPrices] = useState<CryptoPrice[]>(cryptoPrices);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((crypto) => ({
          ...crypto,
          price: crypto.price * (1 + (Math.random() - 0.5) * 0.001),
          change24h: crypto.change24h + (Math.random() - 0.5) * 0.1,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-b border-border bg-accent/30">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center gap-6 overflow-x-auto text-sm">
          {prices.map((crypto) => (
            <div key={crypto.symbol} className="flex items-center gap-3 flex-shrink-0">
              <span className="font-medium text-foreground">{crypto.symbol}</span>
              <span className="text-foreground/80">
                ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${crypto.change24h >= 0 ? 'bg-accent-green-light text-accent-green' : 'bg-red-50 text-accent-red'}`}>
                {crypto.change24h >= 0 ? '+' : ''}
                {crypto.change24h.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

