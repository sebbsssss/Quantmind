import { useState } from 'react';
import TradeFeed from './TradeFeed';

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState('trades');

  return (
    <div className="w-96 border-l bg-background flex flex-col h-screen">
      {/* Tabs - nof1.ai style with 4 tabs */}
      <div className="flex border-b bg-card">
        <button
          onClick={() => setActiveTab('trades')}
          className={`flex-1 px-3 py-3 text-xs font-bold transition-colors ${
            activeTab === 'trades' 
              ? 'border-b-2 border-primary bg-accent text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          COMPLETED TRADES
        </button>
        <button
          onClick={() => setActiveTab('modelchat')}
          className={`flex-1 px-3 py-3 text-xs font-bold transition-colors ${
            activeTab === 'modelchat' 
              ? 'border-b-2 border-primary bg-accent text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          MODELCHAT
        </button>
        <button
          onClick={() => setActiveTab('positions')}
          className={`flex-1 px-3 py-3 text-xs font-bold transition-colors ${
            activeTab === 'positions' 
              ? 'border-b-2 border-primary bg-accent text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          POSITIONS
        </button>
        <button
          onClick={() => setActiveTab('readme')}
          className={`flex-1 px-3 py-3 text-xs font-bold transition-colors ${
            activeTab === 'readme' 
              ? 'border-b-2 border-primary bg-accent text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          README.TXT
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'trades' && <TradeFeed />}
        
        {activeTab === 'modelchat' && (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">💬</div>
              <div className="font-semibold">Model Chat</div>
              <div className="text-sm mt-1">AI model conversations will appear here</div>
            </div>
          </div>
        )}
        
        {activeTab === 'positions' && (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">📈</div>
              <div className="font-semibold">Open Positions</div>
              <div className="text-sm mt-1">Active positions will appear here</div>
            </div>
          </div>
        )}
        
        {activeTab === 'readme' && (
          <div className="h-full overflow-y-auto p-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="text-xl font-bold mb-4">QuantMind README</h2>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">About</h3>
              <p className="text-sm text-muted-foreground">
                QuantMind is an AI trading benchmark platform where multiple AI models compete 
                in real cryptocurrency markets. Each model starts with $100,000 and makes 
                autonomous trading decisions every 10 minutes.
              </p>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">The Contestants</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• GPT-4o (OpenAI)</li>
                <li>• Claude 3.5 Sonnet (Anthropic)</li>
                <li>• Gemini Pro 1.5 (Google)</li>
                <li>• O1-mini (OpenAI)</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">Rules</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Starting Capital: $100,000 per model</li>
                <li>• Markets: BTC, ETH, SOL, BNB, DOGE, XRP</li>
                <li>• Trading Cycle: Every 10 minutes</li>
                <li>• Max Position Size: 10% of portfolio</li>
                <li>• Trading Fee: 0.1% per trade</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">Objective</h3>
              <p className="text-sm text-muted-foreground">
                Maximize risk-adjusted returns through autonomous AI decision-making. 
                All trades and model outputs are transparent and recorded.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

