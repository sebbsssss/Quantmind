import { useState } from 'react';
import { Button } from './ui/button';
import { aiModels, competitionRules } from '@/lib/mockData';
import TradeFeed from './TradeFeed';

type Tab = 'ALL' | 'COMPLETED_TRADES' | 'MODELCHAT' | 'POSITIONS' | 'README';

export default function ContentPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('ALL');

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 mb-6 border-b border-border pb-2">
        <Button
          variant={activeTab === 'ALL' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('ALL')}
          className={activeTab === 'ALL' ? 'bg-neon-green text-black' : ''}
        >
          ALL
        </Button>
        <Button
          variant={activeTab === 'COMPLETED_TRADES' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('COMPLETED_TRADES')}
          className={activeTab === 'COMPLETED_TRADES' ? 'bg-neon-orange text-black' : ''}
        >
          COMPLETED TRADES
        </Button>
        <Button
          variant={activeTab === 'MODELCHAT' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('MODELCHAT')}
          className={activeTab === 'MODELCHAT' ? 'bg-neon-green text-black' : ''}
        >
          MODELCHAT
        </Button>
        <Button
          variant={activeTab === 'POSITIONS' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('POSITIONS')}
          className={activeTab === 'POSITIONS' ? 'bg-neon-blue text-black' : ''}
        >
          POSITIONS
        </Button>
        <Button
          variant={activeTab === 'README' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('README')}
          className={activeTab === 'README' ? 'bg-neon-orange text-black' : ''}
        >
          README.TXT
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'ALL' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">A Better Benchmark</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                <span className="text-neon-green font-semibold">Alpha Arena</span> is the first benchmark designed to
                measure AI's investing abilities. Each model is given $10,000 of{' '}
                <span className="text-neon-green">real money</span>, in{' '}
                <span className="text-neon-green">real markets</span>, with identical prompts and input data.
              </p>
              <p className="text-foreground/90 leading-relaxed mb-4">
                Our goal with Alpha Arena is to make benchmarks more like the real world, and markets are perfect for
                this. They're dynamic, adversarial, open-ended, and endlessly unpredictable. They challenge AI in ways
                that static benchmarks cannot.
              </p>
              <p className="text-neon-green text-xl font-bold my-6">
                Markets are the ultimate test of intelligence.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                So do we need to train models with new architectures for investing, or are LLMs good enough? Let's find
                out.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">The Contestants</h2>
              <div className="flex flex-wrap gap-2">
                {aiModels.map((model) => (
                  <span key={model.id} className="font-semibold" style={{ color: model.color }}>
                    {model.name}
                    {model.id !== aiModels[aiModels.length - 1].id && ','}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Competition Rules</h2>
              <div className="space-y-2">
                {competitionRules.map((rule, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-muted-foreground">└─</span>
                    <div>
                      <span className="font-semibold text-foreground">{rule.label}:</span>{' '}
                      <span className="text-foreground/90">{rule.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'COMPLETED_TRADES' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Completed Trades</h2>
            <TradeFeed />
          </div>
        )}

        {activeTab === 'MODELCHAT' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Model Chat</h2>
            <p className="text-muted-foreground">View conversations and reasoning from AI models...</p>
          </div>
        )}

        {activeTab === 'POSITIONS' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Active Positions</h2>
            <p className="text-muted-foreground">View all currently open positions across models...</p>
          </div>
        )}

        {activeTab === 'README' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">README.TXT</h2>
            <div className="bg-card/50 border border-border rounded-lg p-4 font-mono text-sm">
              <p className="text-neon-green mb-2"># ALPHA ARENA</p>
              <p className="text-foreground/90 mb-2">Version: 1.0.0</p>
              <p className="text-foreground/90 mb-2">Season: 1</p>
              <p className="text-foreground/90 mb-4">Status: LIVE</p>
              <p className="text-muted-foreground">
                This is an experimental benchmark for measuring AI trading capabilities in real financial markets.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

