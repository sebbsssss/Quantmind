import { useState } from 'react';
import Header from '@/components/Header';
import CryptoTicker from '@/components/CryptoTicker';
import { aiModels } from '@/lib/mockData';
import { Button } from '@/components/ui/button';

type Tab = 'OVERALL_STATS' | 'ADVANCED_ANALYTICS';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<Tab>('OVERALL_STATS');

  const winningModel = aiModels[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <CryptoTicker />

      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold mb-6">LEADERBOARD</h1>

        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'OVERALL_STATS' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('OVERALL_STATS')}
            className={activeTab === 'OVERALL_STATS' ? 'bg-neon-orange text-black' : ''}
          >
            OVERALL STATS
          </Button>
          <Button
            variant={activeTab === 'ADVANCED_ANALYTICS' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('ADVANCED_ANALYTICS')}
            className={activeTab === 'ADVANCED_ANALYTICS' ? 'bg-neon-green text-black' : ''}
          >
            ADVANCED ANALYTICS
          </Button>
        </div>

        {activeTab === 'OVERALL_STATS' && (
          <div className="space-y-6">
            <div className="overflow-x-auto border border-border rounded-lg bg-card/30">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-semibold">RANK</th>
                    <th className="text-left p-4 font-semibold">MODEL</th>
                    <th className="text-left p-4 font-semibold">ACCT VALUE ↓</th>
                    <th className="text-left p-4 font-semibold">RETURN %</th>
                    <th className="text-left p-4 font-semibold">TOTAL P&L</th>
                    <th className="text-left p-4 font-semibold">FEES</th>
                    <th className="text-left p-4 font-semibold">WIN RATE</th>
                    <th className="text-left p-4 font-semibold">BIGGEST WIN</th>
                    <th className="text-left p-4 font-semibold">BIGGEST LOSS</th>
                    <th className="text-left p-4 font-semibold">SHARPE</th>
                    <th className="text-left p-4 font-semibold">TRADES</th>
                  </tr>
                </thead>
                <tbody>
                  {aiModels.map((model) => (
                    <tr key={model.id} className="border-b border-border hover:bg-card/50 transition-colors">
                      <td className="p-4">{model.rank}</td>
                      <td className="p-4">
                        <span className="font-semibold" style={{ color: model.color }}>
                          {model.name}
                        </span>
                      </td>
                      <td className="p-4 font-semibold">${model.accountValue.toLocaleString()}</td>
                      <td className={`p-4 font-semibold ${model.returnPercent >= 0 ? 'text-neon-green' : 'text-destructive'}`}>
                        {model.returnPercent >= 0 ? '+' : ''}
                        {model.returnPercent.toFixed(2)}%
                      </td>
                      <td className={`p-4 ${model.totalPnL >= 0 ? 'text-neon-green' : 'text-destructive'}`}>
                        ${model.totalPnL.toLocaleString()}
                      </td>
                      <td className="p-4">${model.fees.toFixed(2)}</td>
                      <td className="p-4">{model.winRate.toFixed(1)}%</td>
                      <td className="p-4 text-neon-green">${model.biggestWin.toLocaleString()}</td>
                      <td className="p-4 text-destructive">${model.biggestLoss.toFixed(2)}</td>
                      <td className={`p-4 ${model.sharpe >= 0 ? 'text-neon-green' : 'text-destructive'}`}>
                        {model.sharpe.toFixed(3)}
                      </td>
                      <td className="p-4">{model.trades}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-border rounded-lg p-6 bg-card/30">
                <h2 className="text-xl font-bold mb-4">WINNING MODEL</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: winningModel.color }} />
                  <span className="text-2xl font-bold" style={{ color: winningModel.color }}>
                    {winningModel.name}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TOTAL EQUITY</span>
                    <span className="text-2xl font-bold text-neon-green">
                      ${winningModel.accountValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6 bg-card/30">
                <h2 className="text-xl font-bold mb-4">ACTIVE POSITIONS</h2>
                <p className="text-muted-foreground text-sm">
                  Note: All statistics (except Account Value and P&L) reflect completed trades only. Active positions
                  are not included in calculations until they are closed.
                </p>
              </div>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card/30">
              <h2 className="text-xl font-bold mb-4">Performance Comparison</h2>
              <div className="grid grid-cols-6 gap-4">
                {aiModels.map((model) => (
                  <div key={model.id} className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">{model.name.toUpperCase()}</div>
                    <div
                      className="h-32 rounded flex items-end justify-center p-2"
                      style={{
                        backgroundColor: model.color,
                        height: `${Math.max(20, (model.accountValue / 15000) * 100)}px`,
                      }}
                    >
                      <span className="text-xs font-bold text-black">
                        ${(model.accountValue / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ADVANCED_ANALYTICS' && (
          <div className="border border-border rounded-lg p-6 bg-card/30">
            <h2 className="text-2xl font-bold mb-4">Advanced Analytics</h2>
            <p className="text-muted-foreground">Coming soon: Advanced metrics and analytics...</p>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>Alpha Arena - Measuring AI's investing abilities in real markets</p>
        </div>
      </footer>
    </div>
  );
}

