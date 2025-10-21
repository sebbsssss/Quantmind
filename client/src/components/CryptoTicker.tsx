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

  const highest = prices.reduce((max, p) => (p.change24h > max.change24h ? p : max));
  const lowest = prices.reduce((min, p) => (p.change24h < min.change24h ? p : min));

  return (
    <div className="border-b border-border bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-sm overflow-x-auto">
          <div className="flex items-center gap-4 md:gap-6 flex-nowrap">
            {prices.map((crypto) => (
              <div key={crypto.symbol} className="flex items-center gap-2">
                <span className="text-muted-foreground">{crypto.symbol}</span>
                <span className="text-foreground font-semibold">
                  ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={crypto.change24h >= 0 ? 'text-neon-green' : 'text-destructive'}>
                  {crypto.change24h >= 0 ? '+' : ''}
                  {crypto.change24h.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-4 text-xs flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">HIGHEST:</span>
              <span className="text-neon-green font-semibold">{highest.symbol}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">LOWEST:</span>
              <span className="text-destructive font-semibold">{lowest.symbol}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

