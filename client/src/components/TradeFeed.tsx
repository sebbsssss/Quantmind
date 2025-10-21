import { recentTrades } from '@/lib/mockData';

export default function TradeFeed() {
  return (
    <div className="space-y-3">
      {recentTrades.map((trade) => (
        <div
          key={trade.id}
          className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow bg-white"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: trade.modelColor }}
              />
              <span className="font-medium text-sm">{trade.modelName}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className={`text-xs px-2 py-0.5 rounded ${trade.side === 'long' ? 'bg-accent-green-light text-accent-green' : 'bg-accent-purple-light text-accent-purple'}`}>
                {trade.side.toUpperCase()}
              </span>
              <span className="text-xs font-medium">{trade.coin}</span>
            </div>
            <span className="text-xs text-muted-foreground">{trade.timestamp}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entry → Exit</span>
              <span className="text-foreground font-medium">
                ${trade.entryPrice.toLocaleString()} → ${trade.exitPrice?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity</span>
              <span className="text-foreground font-medium">{trade.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Notional</span>
              <span className="text-foreground font-medium">
                ${trade.notionalEntry.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="text-foreground font-medium">{trade.holdingTime}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Net P&L</span>
            <span
              className={`text-lg font-semibold ${trade.netPnL >= 0 ? 'text-accent-green' : 'text-accent-red'}`}
            >
              {trade.netPnL >= 0 ? '+' : ''}${trade.netPnL.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

