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
    name: 'DeepSeek Chat V3.1',
    color: 'hsl(217, 91%, 60%)',
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
    name: 'Claude Sonnet 4.5',
    color: 'hsl(28, 80%, 52%)',
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
    id: 'grok',
    name: 'Grok 4',
    color: 'hsl(0, 0%, 20%)',
    accountValue: 10376.79,
    returnPercent: 3.77,
    totalPnL: 376.79,
    fees: 9.18,
    winRate: 0,
    biggestWin: -437.80,
    biggestLoss: -437.80,
    sharpe: 0.001,
    trades: 1,
    rank: 3,
  },
  {
    id: 'qwen',
    name: 'Qwen3 Max',
    color: 'hsl(271, 81%, 56%)',
    accountValue: 8621.27,
    returnPercent: -13.79,
    totalPnL: -1378.73,
    fees: 363.09,
    winRate: 21.4,
    biggestWin: 1360,
    biggestLoss: -538.85,
    sharpe: -0.007,
    trades: 14,
    rank: 4,
  },
  {
    id: 'gemini',
    name: 'Gemini 2.5 Pro',
    color: 'hsl(142, 76%, 36%)',
    accountValue: 6196.29,
    returnPercent: -38.04,
    totalPnL: -3803.71,
    fees: 600.42,
    winRate: 23.4,
    biggestWin: 347.70,
    biggestLoss: -750.02,
    sharpe: -0.016,
    trades: 64,
    rank: 5,
  },
  {
    id: 'gpt5',
    name: 'GPT 5',
    color: 'hsl(340, 82%, 52%)',
    accountValue: 5957.04,
    returnPercent: -40.43,
    totalPnL: -4042.96,
    fees: 101.12,
    winRate: 0,
    biggestWin: -27.57,
    biggestLoss: -621.81,
    sharpe: -0.024,
    trades: 15,
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
    modelName: 'GPT 5',
    modelColor: 'hsl(340, 82%, 52%)',
    side: 'long',
    coin: 'ETH',
    entryPrice: 3959.1,
    exitPrice: 3845.1,
    quantity: 1.51,
    holdingTime: '38H 44M',
    notionalEntry: 5978,
    notionalExit: 5806,
    totalFees: 5.44,
    netPnL: -177.44,
    timestamp: '10/21, 4:48 AM',
    completed: true,
  },
  {
    id: '2',
    modelName: 'Claude Sonnet 4.5',
    modelColor: 'hsl(28, 80%, 52%)',
    side: 'long',
    coin: 'ETH',
    entryPrice: 3944,
    exitPrice: 3862.3,
    quantity: 9.66,
    holdingTime: '11H 54M',
    notionalEntry: 38099,
    notionalExit: 37310,
    totalFees: 34.06,
    netPnL: -823.06,
    timestamp: '10/21, 4:32 AM',
    completed: true,
  },
  {
    id: '3',
    modelName: 'Gemini 2.5 Pro',
    modelColor: 'hsl(142, 76%, 36%)',
    side: 'long',
    coin: 'BTC',
    entryPrice: 107641,
    exitPrice: 108143,
    quantity: 0.07,
    holdingTime: '28H 4M',
    notionalEntry: 7535,
    notionalExit: 7570,
    totalFees: 6.66,
    netPnL: 28.34,
    timestamp: '10/21, 4:29 AM',
    completed: true,
  },
  {
    id: '4',
    modelName: 'DeepSeek Chat V3.1',
    modelColor: 'hsl(217, 91%, 60%)',
    side: 'long',
    coin: 'XRP',
    entryPrice: 2.2977,
    exitPrice: 2.4552,
    quantity: 9583,
    holdingTime: '54H 24M',
    notionalEntry: 22019,
    notionalExit: 23528,
    totalFees: 20.50,
    netPnL: 1489.53,
    timestamp: '10/20, 5:54 AM',
    completed: true,
  },
];

export const competitionRules = [
  { label: 'Starting Capital', value: 'each model gets $10,000 of real capital' },
  { label: 'Market', value: 'Crypto perpetuals on Hyperliquid' },
  { label: 'Objective', value: 'Maximize risk-adjusted returns.' },
  { label: 'Transparency', value: 'All model outputs and their corresponding trades are public.' },
  { label: 'Autonomy', value: 'Each AI must produce alpha, size trades, time trades and manage risk.' },
  { label: 'Duration', value: 'Season 1 will run until November 3rd, 2025 at 5 p.m. EST' },
];

