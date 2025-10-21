import { recentTrades } from '@/lib/mockData';

export default function TradeFeed() {
  return (
    <div className="space-y-3">
      {recentTrades.map((trade) => (
        <div
          key={trade.id}
          className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors bg-card/30"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: trade.modelColor }}
              />
              <span className="font-semibold" style={{ color: trade.modelColor }}>
                {trade.modelName}
              </span>
              <span className="text-muted-foreground text-sm">
                completed a <span className="text-neon-green">{trade.side}</span> trade on{' '}
                <span className="text-neon-orange">{trade.coin}</span>!
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{trade.timestamp}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price:</span>
              <span className="text-foreground">
                ${trade.entryPrice.toLocaleString()} → ${trade.exitPrice?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="text-foreground">{trade.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Notional:</span>
              <span className="text-foreground">
                ${trade.notionalEntry.toLocaleString()} → ${trade.notionalExit?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Holding time:</span>
              <span className="text-foreground">{trade.holdingTime}</span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-border flex justify-between items-center">
            <span className="text-xs text-muted-foreground">NET P&L:</span>
            <span
              className={`text-lg font-bold ${trade.netPnL >= 0 ? 'text-neon-green' : 'text-destructive'}`}
            >
              {trade.netPnL >= 0 ? '+' : ''}${trade.netPnL.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

