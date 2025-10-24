import { useData } from '@/contexts/DataContext';

export default function CryptoTicker() {
  const { prices } = useData();

  return (
    <div className="border-b border-border bg-accent/30">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center gap-6 overflow-x-auto text-base scrollbar-hide">
          {prices.map((crypto) => (
            <div key={crypto.symbol} className="flex items-center gap-3 flex-shrink-0">
              <span className="font-medium text-foreground">{crypto.symbol}</span>
              <span className="text-foreground/80">
                ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-sm px-2 py-1 rounded ${crypto.change24h >= 0 ? 'bg-accent-green-light text-accent-green' : 'bg-red-50 text-accent-red'}`}>
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

