import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, Minus, Brain, Wallet, AlertTriangle } from 'lucide-react';

export default function AIReasoningPanel() {
  const { recentDecisions, modelStates } = useData();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  
  // Auto-select first model if none selected
  const activeModel = selectedModel || recentDecisions[0]?.modelId;
  
  const currentReasoning = recentDecisions.find(r => r.modelId === activeModel);
  const model = modelStates.find(m => m.id === activeModel);

  if (!currentReasoning || !model) return null;

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'BUY':
        return <TrendingUp className="w-5 h-5 text-accent-green" />;
      case 'SELL':
        return <TrendingDown className="w-5 h-5 text-accent-red" />;
      default:
        return <Minus className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getComfortColor = (comfort: string) => {
    switch (comfort) {
      case 'comfortable':
        return 'text-accent-green bg-accent-green/10 border-accent-green/20';
      case 'neutral':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'concerned':
        return 'text-accent-red bg-accent-red/10 border-accent-red/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getComfortLabel = (comfort: string) => {
    switch (comfort) {
      case 'comfortable':
        return '✓ Comfortable';
      case 'neutral':
        return '~ Neutral';
      case 'concerned':
        return '⚠ Concerned';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold mb-2">AI Decision Analysis</h2>
        <p className="text-base text-muted-foreground">
          Real-time insights into each AI model's trading decisions and portfolio management
        </p>
      </div>

      {/* Model Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {modelStates.map((m) => {
          const hasDecision = recentDecisions.some(r => r.modelId === m.id);
          if (!hasDecision) return null;
          
          return (
            <Button
              key={m.id}
              variant={activeModel === m.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedModel(m.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <span className="text-lg">{m.logo}</span>
              <span>{m.name}</span>
            </Button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Decision */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{model.logo}</div>
                <div>
                  <h3 className="text-xl font-semibold">{currentReasoning.modelName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(currentReasoning.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg border ${getComfortColor(currentReasoning.portfolioComfort)}`}>
                <div className="text-sm font-medium">
                  {getComfortLabel(currentReasoning.portfolioComfort)}
                </div>
              </div>
            </div>

            {/* Decision Summary */}
            <div className="flex items-center gap-4 p-4 bg-accent/30 rounded-lg mb-6">
              {getDecisionIcon(currentReasoning.decision)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-semibold">{currentReasoning.decision}</span>
                  <span className="text-lg font-semibold text-muted-foreground">{currentReasoning.symbol}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Confidence: {currentReasoning.confidence}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Decision Strength</div>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-2 rounded-full ${
                        i < Math.floor(currentReasoning.confidence / 20)
                          ? 'bg-accent-green'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Reasoning */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-foreground">
                <Brain className="w-5 h-5" />
                <h4 className="font-semibold text-lg">Decision Reasoning</h4>
              </div>
              <p className="text-base leading-relaxed text-foreground/90 pl-7">
                {currentReasoning.reasoning}
              </p>
            </div>

            {/* Risk Assessment */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-foreground mb-2">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="font-semibold">Risk Assessment</h4>
              </div>
              <p className="text-sm text-foreground/80 pl-7">
                {currentReasoning.riskAssessment}
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Status */}
        <div className="space-y-6">
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-foreground" />
              <h4 className="font-semibold text-lg">Portfolio Status</h4>
            </div>
            
            <p className="text-sm text-foreground/80 mb-6 leading-relaxed">
              {currentReasoning.portfolioSummary}
            </p>

            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground mb-2">Current Holdings</div>
              {currentReasoning.currentHoldings.map((holding) => (
                <div key={holding.symbol} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{holding.symbol}</span>
                    <span className="text-muted-foreground">{holding.allocation}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-blue transition-all"
                        style={{ width: `${holding.allocation}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-20 text-right">
                      ${holding.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Total Portfolio Value</span>
                <span className="font-semibold text-lg">
                  ${model.accountValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total P&L</span>
                <span className={`font-semibold ${model.totalPnL >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                  {model.totalPnL >= 0 ? '+' : ''}${model.totalPnL.toFixed(2)}
                  <span className="text-xs ml-1">
                    ({model.returnPercent >= 0 ? '+' : ''}{model.returnPercent.toFixed(2)}%)
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

