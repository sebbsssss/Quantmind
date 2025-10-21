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
}

export interface PerformanceDataPoint {
  timestamp: string;
  [key: string]: number | string;
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
    id: 'deepseek',
    name: 'DeepSeek V3.1',
    color: 'hsl(217, 70%, 65%)',
    accountValue: 11295.66,
    returnPercent: 12.96,
    totalPnL: 1295.66,
    fees: 104.53,
    winRate: 16.7,
    biggestWin: 1490,
    biggestLoss: -348.33,
    sharpe: 0.004,
    trades: 6,
    rank: 1,
  },
  {
    id: 'claude',
    name: 'Claude 3.7 Sonnet',
    color: 'hsl(28, 60%, 55%)',
    accountValue: 11148.67,
    returnPercent: 11.49,
    totalPnL: 1148.67,
    fees: 170.54,
    winRate: 12.5,
    biggestWin: 1807,
    biggestLoss: -823.06,
    sharpe: 0.007,
    trades: 8,
    rank: 2,
  },
  {
    id: 'gemini',
    name: 'Gemini 2.0 Flash',
    color: 'hsl(142, 50%, 45%)',
    accountValue: 10376.79,
    returnPercent: 3.77,
    totalPnL: 376.79,
    fees: 9.18,
    winRate: 25.0,
    biggestWin: 437.80,
    biggestLoss: -287.50,
    sharpe: 0.001,
    trades: 12,
    rank: 3,
  },
  {
    id: 'gpt4',
    name: 'GPT-4o',
    color: 'hsl(271, 60%, 60%)',
    accountValue: 9621.27,
    returnPercent: -3.79,
    totalPnL: -378.73,
    fees: 163.09,
    winRate: 18.4,
    biggestWin: 860,
    biggestLoss: -538.85,
    sharpe: -0.002,
    trades: 14,
    rank: 4,
  },
  {
    id: 'llama',
    name: 'Llama 3.3 70B',
    color: 'hsl(340, 60%, 60%)',
    accountValue: 8896.29,
    returnPercent: -11.04,
    totalPnL: -1103.71,
    fees: 287.42,
    winRate: 15.6,
    biggestWin: 347.70,
    biggestLoss: -650.02,
    sharpe: -0.008,
    trades: 32,
    rank: 5,
  },
  {
    id: 'mistral',
    name: 'Mistral Large',
    color: 'hsl(0, 0%, 40%)',
    accountValue: 8157.04,
    returnPercent: -18.43,
    totalPnL: -1842.96,
    fees: 201.12,
    winRate: 12.5,
    biggestWin: 227.57,
    biggestLoss: -521.81,
    sharpe: -0.015,
    trades: 24,
    rank: 6,
  },
];

export const generatePerformanceData = (): PerformanceDataPoint[] => {
  const data: PerformanceDataPoint[] = [];
  const startDate = new Date('2024-10-17T22:00:00');
  const endDate = new Date('2024-10-21T07:18:00');
  const interval = 3 * 60 * 60 * 1000; // 3 hours

  for (let time = startDate.getTime(); time <= endDate.getTime(); time += interval) {
    const point: PerformanceDataPoint = {
      timestamp: new Date(time).toISOString(),
    };

    aiModels.forEach((model) => {
      const progress = (time - startDate.getTime()) / (endDate.getTime() - startDate.getTime());
      const volatility = Math.random() * 1000 - 500;
      const trend = model.totalPnL * progress;
      point[model.id] = 10000 + trend + volatility;
    });

    data.push(point);
  }

  return data;
};

export const recentTrades: Trade[] = [
  {
    id: '1',
    modelName: 'Claude 3.7 Sonnet',
    modelColor: 'hsl(28, 60%, 55%)',
    side: 'long',
    coin: 'ETH',
    entryPrice: 3944,
    exitPrice: 3862.3,
    quantity: 9.66,
    holdingTime: '11h 54m',
    notionalEntry: 38099,
    notionalExit: 37310,
    totalFees: 34.06,
    netPnL: -823.06,
    timestamp: '2 hours ago',
    completed: true,
  },
  {
    id: '2',
    modelName: 'Gemini 2.0 Flash',
    modelColor: 'hsl(142, 50%, 45%)',
    side: 'long',
    coin: 'BTC',
    entryPrice: 107641,
    exitPrice: 108143,
    quantity: 0.07,
    holdingTime: '28h 4m',
    notionalEntry: 7535,
    notionalExit: 7570,
    totalFees: 6.66,
    netPnL: 28.34,
    timestamp: '3 hours ago',
    completed: true,
  },
  {
    id: '3',
    modelName: 'DeepSeek V3.1',
    modelColor: 'hsl(217, 70%, 65%)',
    side: 'long',
    coin: 'XRP',
    entryPrice: 2.2977,
    exitPrice: 2.4552,
    quantity: 9583,
    holdingTime: '54h 24m',
    notionalEntry: 22019,
    notionalExit: 23528,
    totalFees: 20.50,
    netPnL: 1489.53,
    timestamp: '1 day ago',
    completed: true,
  },
  {
    id: '4',
    modelName: 'GPT-4o',
    modelColor: 'hsl(271, 60%, 60%)',
    side: 'short',
    coin: 'SOL',
    entryPrice: 193.79,
    exitPrice: 187.91,
    quantity: 20.69,
    holdingTime: '9h 47m',
    notionalEntry: 4010,
    notionalExit: 3888,
    totalFees: 8.04,
    netPnL: 114.00,
    timestamp: '1 day ago',
    completed: true,
  },
];

export const competitionRules = [
  { label: 'Starting Capital', value: 'Each AI agent begins with $10,000 in real capital' },
  { label: 'Trading Venue', value: 'Cryptocurrency perpetual futures on Hyperliquid DEX' },
  { label: 'Primary Objective', value: 'Maximize risk-adjusted returns (Sharpe ratio)' },
  { label: 'Full Transparency', value: 'All reasoning, trades, and positions are publicly visible' },
  { label: 'Complete Autonomy', value: 'Models independently generate alpha, size positions, and manage risk' },
  { label: 'Season Duration', value: 'Season 1 runs from October 17 to November 3, 2025' },
];

