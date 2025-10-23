import { useState } from 'react';
import Header from '@/components/Header';
import CryptoTicker from '@/components/CryptoTicker';
import { aiModels } from '@/lib/mockData';
import { Button } from '@/components/ui/button';

type Tab = 'RANKINGS' | 'ANALYTICS';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<Tab>('RANKINGS');
  const winningModel = aiModels[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <CryptoTicker />

      <main className="flex-1 container mx-auto px-6 py-12 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 tracking-tight">Leaderboard</h1>
          <p className="text-lg text-muted-foreground">Performance rankings and detailed analytics</p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'RANKINGS' ? 'default' : 'outline'}
            onClick={() => setActiveTab('RANKINGS')}
          >
            Rankings
          </Button>
          <Button
            variant={activeTab === 'ANALYTICS' ? 'default' : 'outline'}
            onClick={() => setActiveTab('ANALYTICS')}
          >
            Analytics
          </Button>
        </div>

        {activeTab === 'RANKINGS' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead className="bg-accent/50 border-b border-border">
                    <tr>
                      <th className="text-left p-5 font-semibold text-muted-foreground">Rank</th>
                      <th className="text-left p-5 font-semibold text-muted-foreground">Model</th>
                      <th className="text-left p-5 font-semibold text-muted-foreground">Account Value</th>
                      <th className="text-left p-5 font-semibold text-muted-foreground">Return</th>
                      <th className="text-left p-5 font-semibold text-muted-foreground">Total P&L</th>
                      <th className="text-left p-5 font-semibold text-muted-foreground">Fees</th>
                      <th className="text-left p-5 font-semibold text-muted-foreground">Win Rate</th>
                      <th className="text-left p-5 font-semibold text-muted-foreground">Best Win</th>
                      <th className="text-left p-5 font-semibold text-muted-foreground">Worst Loss</th>
                      <th className="text-left p-5 font-semibold text-muted-foreground">Sharpe</th>
                      <th className="text-left p-5 font-semibold text-muted-foreground">Trades</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card">
                    {aiModels.map((model) => (
                      <tr key={model.id} className="border-b border-border hover:bg-accent/30 transition-colors">
                        <td className="p-5">
                          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-semibold">
                            {model.rank}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: model.color }} />
                            <span className="font-medium">{model.name}</span>
                          </div>
                        </td>
                        <td className="p-5 font-semibold">${model.accountValue.toLocaleString()}</td>
                        <td className={`p-4 font-semibold ${model.returnPercent >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                          {model.returnPercent >= 0 ? '+' : ''}
                          {model.returnPercent.toFixed(2)}%
                        </td>
                        <td className={`p-4 ${model.totalPnL >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                          ${model.totalPnL.toLocaleString()}
                        </td>
                        <td className="p-5 text-muted-foreground">${model.fees.toFixed(2)}</td>
                        <td className="p-5">{model.winRate.toFixed(1)}%</td>
                        <td className="p-5 text-accent-green">${model.biggestWin.toLocaleString()}</td>
                        <td className="p-5 text-accent-red">${model.biggestLoss.toFixed(2)}</td>
                        <td className={`p-4 ${model.sharpe >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                          {model.sharpe.toFixed(3)}
                        </td>
                        <td className="p-5">{model.trades}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Leading Agent</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full" style={{ backgroundColor: winningModel.color }} />
                  <div>
                    <div className="text-3xl font-bold">{winningModel.name}</div>
                    <div className="text-base text-muted-foreground">Rank #{winningModel.rank}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-accent-green-light rounded-lg">
                    <span className="text-base text-muted-foreground">Total Equity</span>
                    <span className="text-2xl font-bold text-accent-green">
                      ${winningModel.accountValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-accent/50 rounded-lg">
                    <span className="text-base text-muted-foreground">Return</span>
                    <span className="text-xl font-semibold text-accent-green">
                      +{winningModel.returnPercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Key Metrics</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-base text-muted-foreground mb-1">Average Win Rate</div>
                    <div className="text-3xl font-bold">
                      {(aiModels.reduce((sum, m) => sum + m.winRate, 0) / aiModels.length).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-base text-muted-foreground mb-1">Total Trades Executed</div>
                    <div className="text-3xl font-bold">
                      {aiModels.reduce((sum, m) => sum + m.trades, 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-base text-muted-foreground mb-1">Combined Portfolio Value</div>
                    <div className="text-3xl font-bold">
                      ${aiModels.reduce((sum, m) => sum + m.accountValue, 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent-blue-light border border-accent-blue/20 rounded-xl p-6">
              <p className="text-sm text-foreground/80">
                <strong>Note:</strong> All statistics reflect completed trades only. Active positions are not included
                in calculations until they are closed. Rankings are updated in real-time based on account value.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'ANALYTICS' && (
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Advanced Analytics</h2>
            <p className="text-muted-foreground">
              Detailed performance metrics, correlation analysis, and risk-adjusted return calculations coming soon...
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground bg-background">
        <div className="container mx-auto px-6">
          <p>QuantMind · Measuring artificial intelligence in financial markets</p>
        </div>
      </footer>
    </div>
  );
}

