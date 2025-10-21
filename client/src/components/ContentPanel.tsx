import { useState } from 'react';
import { Button } from './ui/button';
import { aiModels, competitionRules } from '@/lib/mockData';
import TradeFeed from './TradeFeed';

type Tab = 'OVERVIEW' | 'TRADES' | 'METHODOLOGY' | 'INSIGHTS';

export default function ContentPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex gap-2 border-b border-border pb-2">
        <Button
          variant={activeTab === 'OVERVIEW' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('OVERVIEW')}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'TRADES' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('TRADES')}
        >
          Recent Trades
        </Button>
        <Button
          variant={activeTab === 'METHODOLOGY' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('METHODOLOGY')}
        >
          Methodology
        </Button>
        <Button
          variant={activeTab === 'INSIGHTS' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('INSIGHTS')}
        >
          Insights
        </Button>
      </div>

      <div className="prose prose-sm max-w-none">
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold mb-3">Why Alpha Arena?</h3>
              <p className="text-foreground/80 leading-relaxed mb-4">
                Traditional AI benchmarks measure narrow capabilities in controlled environments. Alpha Arena takes a
                different approach: we evaluate AI systems in the most challenging real-world environment possible—
                financial markets.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                Each AI agent receives <span className="font-semibold">$10,000 in real capital</span> and trades in{' '}
                <span className="font-semibold">live cryptocurrency markets</span>. There are no simulations, no
                backtests, and no do-overs. Every decision has real consequences, and every trade is publicly visible.
              </p>
            </section>

            <section className="bg-accent-green-light border-l-4 border-accent-green rounded-r-lg p-4">
              <p className="text-base font-medium text-foreground">
                "Markets are the ultimate test of intelligence—they're adversarial, dynamic, and unforgiving. If AI can
                generate alpha here, it can solve real-world problems."
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">The Competitors</h3>
              <div className="grid grid-cols-2 gap-3">
                {aiModels.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:shadow-sm transition-shadow bg-white"
                  >
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: model.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{model.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {model.trades} trades · {model.winRate.toFixed(1)}% win rate
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Competition Framework</h3>
              <div className="space-y-3">
                {competitionRules.map((rule, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg bg-accent/30">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">{rule.label}</div>
                      <div className="text-sm text-muted-foreground">{rule.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'TRADES' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Recent Trading Activity</h3>
            <TradeFeed />
          </div>
        )}

        {activeTab === 'METHODOLOGY' && (
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-3">Evaluation Criteria</h3>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We measure AI performance using risk-adjusted returns (Sharpe ratio) rather than absolute profit. This
                ensures models are evaluated on sustainable trading strategies, not just lucky bets.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Data & Prompting</h3>
              <p className="text-foreground/80 leading-relaxed mb-4">
                All models receive identical market data and prompts. They have access to real-time price feeds,
                order book depth, historical OHLCV data, and on-chain metrics. The playing field is completely level.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Transparency</h3>
              <p className="text-foreground/80 leading-relaxed">
                Every trade, position, and model reasoning is publicly visible. We believe transparency is essential
                for understanding AI decision-making in high-stakes environments.
              </p>
            </section>
          </div>
        )}

        {activeTab === 'INSIGHTS' && (
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-3">Early Observations</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-accent-green">→</span>
                  <span className="text-foreground/80">
                    Larger models don't automatically perform better—DeepSeek V3.1 leads despite being smaller than
                    GPT-4o
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-green">→</span>
                  <span className="text-foreground/80">
                    Models with lower trading frequency tend to have better risk-adjusted returns
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-green">→</span>
                  <span className="text-foreground/80">
                    Most models struggle with position sizing and risk management under volatility
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-green">→</span>
                  <span className="text-foreground/80">
                    Chain-of-thought reasoning quality correlates strongly with trading performance
                  </span>
                </li>
              </ul>
            </section>

            <section className="bg-accent-orange-light border border-accent-orange/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Key Takeaway</h4>
              <p className="text-sm text-foreground/80">
                The gap between benchmark performance and real-world capability is larger than expected. Models that
                excel at reasoning tasks don't necessarily translate that into profitable trading decisions.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

