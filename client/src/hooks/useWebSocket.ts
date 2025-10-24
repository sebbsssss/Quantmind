import { useEffect, useState, useCallback, useRef } from 'react';
import type { CryptoPrice, AIModel, Trade, AIReasoning } from '@/lib/mockData';

interface ModelState {
  modelId: string;
  modelName: string;
  accountValue: number;
  cashBalance: number;
  positions: Array<{
    coin: string;
    quantity: number;
    avgEntryPrice: number;
    currentValue: number;
    unrealizedPnL: number;
  }>;
  totalPnL: number;
  returnPercent: number;
  winRate: number;
  tradesCount: number;
}

interface WebSocketData {
  prices: CryptoPrice[];
  modelStates: AIModel[];
  recentTrades: Trade[];
  recentDecisions: AIReasoning[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

const WS_URL = `ws://${window.location.hostname}:${window.location.port || 3000}/ws`;
const RECONNECT_INTERVAL = 3000;

export function useWebSocket() {
  const [data, setData] = useState<WebSocketData>({
    prices: [],
    modelStates: [],
    recentTrades: [],
    recentDecisions: [],
    connectionStatus: 'connecting',
  });

  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnect = useRef(true);

  const connect = useCallback(() => {
    try {
      console.log('[WebSocket] Connecting to', WS_URL);
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        console.log('[WebSocket] Connected');
        setData(prev => ({ ...prev, connectionStatus: 'connected' }));
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          switch (message.type) {
            case 'init':
              // Initial data load
              setData(prev => ({
                ...prev,
                prices: message.data.prices,
                modelStates: convertModelStates(message.data.modelStates),
                recentTrades: message.data.recentTrades,
                recentDecisions: message.data.recentDecisions,
              }));
              break;

            case 'price':
              // Update single price
              setData(prev => ({
                ...prev,
                prices: updatePrice(prev.prices, message.data),
              }));
              break;

            case 'modelStates':
              // Update all model states
              setData(prev => ({
                ...prev,
                modelStates: convertModelStates(message.data),
              }));
              break;

            case 'trade':
              // Add new trade
              setData(prev => ({
                ...prev,
                recentTrades: [message.data, ...prev.recentTrades].slice(0, 50),
              }));
              break;

            case 'decision':
              // Add new AI decision
              const decision = convertDecision(message.data);
              setData(prev => ({
                ...prev,
                recentDecisions: [decision, ...prev.recentDecisions].slice(0, 4),
              }));
              break;
          }
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      };

      ws.current.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        setData(prev => ({ ...prev, connectionStatus: 'error' }));
      };

      ws.current.onclose = () => {
        console.log('[WebSocket] Disconnected');
        setData(prev => ({ ...prev, connectionStatus: 'disconnected' }));

        // Attempt to reconnect
        if (shouldReconnect.current) {
          reconnectTimeout.current = setTimeout(() => {
            connect();
          }, RECONNECT_INTERVAL);
        }
      };
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      setData(prev => ({ ...prev, connectionStatus: 'error' }));
    }
  }, []);

  useEffect(() => {
    shouldReconnect.current = true;
    connect();

    return () => {
      shouldReconnect.current = false;
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  return data;
}

// Helper functions to convert backend data to frontend format
function updatePrice(prices: CryptoPrice[], newPrice: CryptoPrice): CryptoPrice[] {
  const index = prices.findIndex(p => p.symbol === newPrice.symbol);
  if (index >= 0) {
    const updated = [...prices];
    updated[index] = newPrice;
    return updated;
  }
  return [...prices, newPrice];
}

function convertModelStates(states: ModelState[]): AIModel[] {
  const logos: Record<string, string> = {
    'gpt4o': '🟣',
    'claude-sonnet': '🟠',
    'gemini-pro': '🟢',
    'o1-mini': '🔵',
  };

  const colors: Record<string, string> = {
    'gpt4o': 'hsl(280, 60%, 60%)',
    'claude-sonnet': 'hsl(28, 60%, 55%)',
    'gemini-pro': 'hsl(142, 65%, 55%)',
    'o1-mini': 'hsl(200, 70%, 60%)',
  };

  return states.map((state, index) => ({
    id: state.modelId,
    name: state.modelName,
    color: colors[state.modelId] || 'hsl(0, 0%, 50%)',
    logo: logos[state.modelId] || '⚪',
    accountValue: state.accountValue,
    returnPercent: state.returnPercent,
    totalPnL: state.totalPnL,
    fees: state.tradesCount * 10, // Estimate
    winRate: state.winRate,
    biggestWin: 0, // TODO: Track this
    biggestLoss: 0, // TODO: Track this
    sharpe: 0, // TODO: Calculate this
    trades: state.tradesCount,
    rank: index + 1,
  }));
}

function convertDecision(decision: any): AIReasoning {
  const logos: Record<string, string> = {
    'gpt4o': '🟣',
    'claude-sonnet': '🟠',
    'gemini-pro': '🟢',
    'o1-mini': '🔵',
  };

  return {
    modelId: decision.modelId,
    modelName: decision.modelName,
    timestamp: new Date().toISOString(),
    decision: decision.decision,
    symbol: decision.coin,
    confidence: decision.confidence,
    reasoning: decision.reasoning,
    portfolioComfort: decision.portfolioComfort,
    portfolioSummary: '',
    currentHoldings: [],
    riskAssessment: '',
  };
}
