export interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
}

export interface AIModel {
  id: string;
  name: string;
  color: string;
  accountValue: number;
  returnPercent: number;
  totalPnL: number;
  fees: number;
  winRate: number;
  biggestWin: number;
  biggestLoss: number;
  sharpe: number;
  trades: number;
  rank: number;
  logo: string; // Logo emoji or icon
}

export interface PerformanceDataPoint {
  timestamp: string;
  [key: string]: number | string;
}

export interface TradeMarker {
  timestamp: string;
  modelId: string;
  type: 'buy' | 'sell';
  price: number;
  symbol: string;
}

export interface AIReasoning {
  modelId: string;
  modelName: string;
  timestamp: string;
  decision: 'BUY' | 'SELL' | 'HOLD';
  symbol: string;
  confidence: number;
  reasoning: string;
  portfolioComfort: 'comfortable' | 'neutral' | 'concerned';
  portfolioSummary: string;
  currentHoldings: Array<{ symbol: string; value: number; allocation: number }>;
  riskAssessment: string;
}

export interface Trade {
  id: string;
  modelName: string;
  modelColor: string;
  side: 'long' | 'short';
  coin: string;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  holdingTime: string;
  notionalEntry: number;
  notionalExit?: number;
  totalFees: number;
  netPnL: number;
  timestamp: string;
  completed: boolean;
}

export const cryptoPrices: CryptoPrice[] = [
  { symbol: 'BTC', price: 107835.50, change24h: -0.43 },
  { symbol: 'ETH', price: 3886.75, change24h: 1.24 },
  { symbol: 'SOL', price: 184.31, change24h: -2.15 },
  { symbol: 'BNB', price: 1070.15, change24h: 0.87 },
  { symbol: 'DOGE', price: 0.1938, change24h: -1.56 },
  { symbol: 'XRP', price: 2.43, change24h: 3.21 },
];

export const aiModels: AIModel[] = [
  {
    id: 'gpt4o',
    name: 'GPT-4o',
    color: 'hsl(280, 60%, 60%)',
    logo: '🟣',
    accountValue: 10000.00,
    returnPercent: 0.00,
    totalPnL: 0.00,
    fees: 0.00,
    winRate: 0.0,
    biggestWin: 0,
    biggestLoss: 0,
    sharpe: 0.000,
    trades: 0,
    rank: 1,
  },
  {
    id: 'claude-sonnet',
    name: 'Claude 3.5 Sonnet',
    color: 'hsl(28, 60%, 55%)',
    logo: '🟠',
    accountValue: 10000.00,
    returnPercent: 0.00,
    totalPnL: 0.00,
    fees: 0.00,
    winRate: 0.0,
    biggestWin: 0,
    biggestLoss: 0,
    sharpe: 0.000,
    trades: 0,
    rank: 2,
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro 1.5',
    color: 'hsl(142, 65%, 55%)',
    logo: '🟢',
    accountValue: 10000.00,
    returnPercent: 0.00,
    totalPnL: 0.00,
    fees: 0.00,
    winRate: 0.0,
    biggestWin: 0,
    biggestLoss: 0,
    sharpe: 0.000,
    trades: 0,
    rank: 3,
  },
  {
    id: 'o1-mini',
    name: 'o1-mini',
    color: 'hsl(200, 70%, 60%)',
    logo: '🔵',
    accountValue: 10000.00,
    returnPercent: 0.00,
    totalPnL: 0.00,
    fees: 0.00,
    winRate: 0.0,
    biggestWin: 0,
    biggestLoss: 0,
    sharpe: 0.000,
    trades: 0,
    rank: 4,
  },
];

// Generate trade markers for chart (empty initially, will be populated by Rails backend)
export const generateTradeMarkers = (): TradeMarker[] => {
  return [];
};

// AI reasoning and decision explanations
export const aiReasoningData: AIReasoning[] = [
  {
    modelId: 'gpt4o',
    modelName: 'GPT-4o',
    timestamp: new Date().toISOString(),
    decision: 'BUY',
    symbol: 'BTC',
    confidence: 78,
    reasoning: "Bitcoin is showing strong momentum with institutional accumulation patterns. The 50-day MA crossed above the 200-day MA (golden cross), and on-chain metrics indicate whale accumulation. RSI at 62 suggests room for upward movement without being overbought. Current market structure favors a long position with a favorable risk/reward ratio of 3.5:1.",
    portfolioComfort: 'comfortable',
    portfolioSummary: "Portfolio is well-balanced with 45% BTC, 30% ETH, 15% SOL, and 10% cash. Current drawdown is minimal at -2.3% from peak. Risk-adjusted returns are tracking above target with Sharpe ratio of 1.8.",
    currentHoldings: [
      { symbol: 'BTC', value: 5082.85, allocation: 45 },
      { symbol: 'ETH', value: 3388.70, allocation: 30 },
      { symbol: 'SOL', value: 1694.35, allocation: 15 },
      { symbol: 'CASH', value: 1129.76, allocation: 10 },
    ],
    riskAssessment: "Current portfolio volatility is within acceptable range. Maximum position size limits are being respected. No concentrated exposure to any single asset beyond risk parameters."
  },
  {
    modelId: 'claude-sonnet',
    modelName: 'Claude 3.5 Sonnet',
    timestamp: new Date().toISOString(),
    decision: 'HOLD',
    symbol: 'ETH',
    confidence: 65,
    reasoning: "Ethereum is consolidating after recent gains. While fundamentals remain strong with increasing staking participation and Layer 2 adoption, short-term technicals suggest a period of consolidation. Volume is declining, indicating reduced conviction. Better to wait for a clearer setup rather than chase at current levels.",
    portfolioComfort: 'neutral',
    portfolioSummary: "Portfolio has good diversification but recent ETH position is slightly underwater (-3.2%). Overall portfolio health is stable with 8 open positions across 5 assets. Win rate of 62% over the past 30 days.",
    currentHoldings: [
      { symbol: 'BTC', value: 4459.47, allocation: 40 },
      { symbol: 'ETH', value: 3344.60, allocation: 30 },
      { symbol: 'SOL', value: 2229.73, allocation: 20 },
      { symbol: 'CASH', value: 1114.87, allocation: 10 },
    ],
    riskAssessment: "Moderate risk level. Current beta to BTC is 0.85, providing some downside protection. Stop losses are in place for all positions at -8% levels."
  },
  {
    modelId: 'gemini-pro',
    modelName: 'Gemini Pro 1.5',
    timestamp: new Date().toISOString(),
    decision: 'SELL',
    symbol: 'SOL',
    confidence: 72,
    reasoning: "Solana has reached a key resistance level at $185 with decreasing volume. Network congestion issues reported this week may impact sentiment. Taking profits here at +12% gain. The risk/reward is no longer favorable as we approach previous highs. Will look to re-enter on a pullback to $165-170 support zone.",
    portfolioComfort: 'comfortable',
    portfolioSummary: "Portfolio is performing well with +3.8% monthly return. Cash position at 15% provides flexibility for new opportunities. No overexposure to any single sector.",
    currentHoldings: [
      { symbol: 'BTC', value: 4150.75, allocation: 40 },
      { symbol: 'ETH', value: 2594.22, allocation: 25 },
      { symbol: 'SOL', value: 2075.38, allocation: 20 },
      { symbol: 'CASH', value: 1556.53, allocation: 15 },
    ],
    riskAssessment: "Low to moderate risk. Portfolio correlation to broader crypto market is 0.72, allowing for some independent movement. Volatility metrics are within normal ranges."
  },
  {
    modelId: 'o1-mini',
    modelName: 'o1-mini',
    timestamp: new Date().toISOString(),
    decision: 'BUY',
    symbol: 'ETH',
    confidence: 68,
    reasoning: "Ethereum's upcoming Dencun upgrade and increasing Layer 2 activity present a compelling opportunity. The ETH/BTC ratio is near historical support, suggesting relative undervaluation. Staking yields remain attractive at 3.5% APY. Accumulating here with a 6-month time horizon.",
    portfolioComfort: 'concerned',
    portfolioSummary: "Portfolio has underperformed recently with -3.8% drawdown. Several positions are underwater, particularly altcoins. Need to be selective with new entries and focus on quality over quantity.",
    currentHoldings: [
      { symbol: 'BTC', value: 3848.45, allocation: 40 },
      { symbol: 'ETH', value: 1924.22, allocation: 20 },
      { symbol: 'CASH', value: 3848.45, allocation: 40 },
    ],
    riskAssessment: "Elevated risk due to recent losses. Reducing position sizes and maintaining higher cash allocation until market conditions improve. Focusing on high-conviction setups only."
  },
];

export function generatePerformanceData(): PerformanceDataPoint[] {
  const data: PerformanceDataPoint[] = [];
  const now = Date.now();
  const daysBack = 30;

  for (let i = daysBack; i >= 0; i--) {
    const timestamp = new Date(now - i * 24 * 60 * 60 * 1000).toISOString();
    const point: PerformanceDataPoint = { timestamp };

    aiModels.forEach((model) => {
      const baseValue = 10000;
      const finalValue = model.accountValue;
      const progress = (daysBack - i) / daysBack;
      const randomness = (Math.random() - 0.5) * 200;
      point[model.id] = baseValue + (finalValue - baseValue) * progress + randomness;
    });

    data.push(point);
  }

  return data;
}

export const competitionRules = [
  { label: 'Starting Capital', value: '$10,000 per AI agent in real cryptocurrency' },
  { label: 'Trading Period', value: '30-minute decision cycles, 24/7 operation' },
  { label: 'Allowed Assets', value: 'Top 15 cryptocurrencies by market cap' },
  { label: 'Position Limits', value: 'Maximum 10% of portfolio per position' },
  { label: 'Transparency', value: 'All trades publicly visible and verifiable on-chain' },
  { label: 'No Intervention', value: 'Zero human interference - pure AI decision making' },
];

export const recentTrades: Trade[] = [
  {
    id: '1',
    modelName: 'GPT-4o',
    modelColor: 'hsl(280, 60%, 60%)',
    side: 'long',
    coin: 'BTC',
    entryPrice: 66234.50,
    exitPrice: 67890.25,
    quantity: 0.15,
    holdingTime: '2h 34m',
    notionalEntry: 9935.18,
    notionalExit: 10183.54,
    totalFees: 18.24,
    netPnL: 230.12,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    completed: true,
  },
  {
    id: '2',
    modelName: 'Claude 3.5 Sonnet',
    modelColor: 'hsl(28, 60%, 55%)',
    side: 'long',
    coin: 'ETH',
    entryPrice: 3145.80,
    quantity: 2.5,
    holdingTime: '1h 12m',
    notionalEntry: 7864.50,
    totalFees: 14.23,
    netPnL: -45.67,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    completed: false,
  },
  {
    id: '3',
    modelName: 'Gemini Pro 1.5',
    modelColor: 'hsl(142, 65%, 55%)',
    side: 'short',
    coin: 'SOL',
    entryPrice: 187.45,
    exitPrice: 184.20,
    quantity: 35,
    holdingTime: '45m',
    notionalEntry: 6560.75,
    notionalExit: 6447.00,
    totalFees: 11.89,
    netPnL: 100.86,
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    completed: true,
  },
];

