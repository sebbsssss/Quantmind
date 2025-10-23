import { Router } from 'express';
import TradingBot from '../services/tradingBot';
import MarketDataService from '../services/marketData';

const router = Router();

// Global trading bot instance (in production, use proper state management)
let tradingBot: TradingBot | null = null;

// Initialize trading bot
router.post('/bot/start', async (req, res) => {
  try {
    if (tradingBot && tradingBot.getStatus().isRunning) {
      return res.status(400).json({ error: 'Trading bot is already running' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' });
    }

    tradingBot = new TradingBot({
      openrouterApiKey: apiKey,
      coingeckoApiKey: process.env.COINGECKO_API_KEY,
      initialPortfolioValue: Number(process.env.INITIAL_PORTFOLIO_VALUE) || 100000,
      maxPositionSize: Number(process.env.MAX_POSITION_SIZE) || 0.10,
      tradingCycleMinutes: Number(process.env.TRADING_CYCLE_MINUTES) || 30,
      aiModels: (process.env.AI_MODEL_ROTATION || 'anthropic/claude-3.5-sonnet').split(','),
      tradingSymbols: ['bitcoin', 'ethereum', 'solana'],
    });

    await tradingBot.start();

    res.json({ success: true, message: 'Trading bot started' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Stop trading bot
router.post('/bot/stop', (req, res) => {
  if (!tradingBot) {
    return res.status(400).json({ error: 'Trading bot is not running' });
  }

  tradingBot.stop();
  res.json({ success: true, message: 'Trading bot stopped' });
});

// Get bot status
router.get('/bot/status', (req, res) => {
  if (!tradingBot) {
    return res.json({ isRunning: false, portfolio: null });
  }

  const status = tradingBot.getStatus();
  res.json(status);
});

// Get current market prices
router.get('/market/prices', async (req, res) => {
  try {
    const marketData = new MarketDataService(process.env.COINGECKO_API_KEY);
    const symbols = req.query.symbols 
      ? (req.query.symbols as string).split(',')
      : ['bitcoin', 'ethereum', 'solana'];
    
    const prices = await marketData.getCurrentPrices(symbols);
    res.json(prices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get top cryptocurrencies
router.get('/market/top', async (req, res) => {
  try {
    const marketData = new MarketDataService(process.env.COINGECKO_API_KEY);
    const limit = Number(req.query.limit) || 15;
    const top = await marketData.getTopCryptos(limit);
    res.json(top);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get portfolio summary
router.get('/portfolio', (req, res) => {
  if (!tradingBot) {
    return res.json({ 
      totalValue: 100000,
      cashBalance: 100000,
      positionsValue: 0,
      positions: [],
      totalPnl: 0,
      dailyPnl: 0,
    });
  }

  const portfolio = tradingBot.getStatus().portfolio;
  res.json(portfolio);
});

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    botRunning: tradingBot?.getStatus().isRunning || false,
  });
});

export default router;

