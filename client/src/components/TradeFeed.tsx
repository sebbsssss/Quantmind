import { recentTrades } from '@/lib/mockData';

export default function TradeFeed() {
  return (
    <div className="space-y-3">
      {recentTrades.map((trade) => (
        <div
          key={trade.id}
          className="border border-border rounded-lg p-6 hover:shadow-sm transition-shadow bg-white"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: trade.modelColor }}
              />
              <span className="font-medium text-base">{trade.modelName}</span>
              <span className="text-sm text-muted-foreground">·</span>
              <span className={`text-sm px-2 py-1 rounded ${trade.side === 'long' ? 'bg-accent-green-light text-accent-green' : 'bg-accent-purple-light text-accent-purple'}`}>
                {trade.side.toUpperCase()}
              </span>
              <span className="text-sm font-medium">{trade.coin}</span>
            </div>
            <span className="text-sm text-muted-foreground">{trade.timestamp}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-base mb-4">
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

          <div className="pt-4 border-t border-border flex justify-between items-center">
            <span className="text-base text-muted-foreground">Net P&L</span>
            <span
              className={`text-xl font-semibold ${trade.netPnL >= 0 ? 'text-accent-green' : 'text-accent-red'}`}
            >
              {trade.netPnL >= 0 ? '+' : ''}${trade.netPnL.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

