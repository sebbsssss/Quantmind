import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { database, type Trade } from './database';
import { cryptoPriceService, type CryptoPrice } from './cryptoPriceService';

const AI_MODELS = [
  { id: 'gpt4o', name: 'GPT-4o', color: 'hsl(280, 60%, 60%)', logo: '🟣' },
  { id: 'claude-sonnet', name: 'Claude 3.5 Sonnet', color: 'hsl(28, 60%, 55%)', logo: '🟠' },
  { id: 'gemini-pro', name: 'Gemini Pro 1.5', color: 'hsl(142, 65%, 55%)', logo: '🟢' },
  { id: 'o1-mini', name: 'o1-mini', color: 'hsl(200, 70%, 60%)', logo: '🔵' },
];

const STARTING_CAPITAL = 10000;
const TRADE_FEE_PERCENT = 0.001; // 0.1% per trade

export interface Position {
  coin: string;
  quantity: number;
  avgEntryPrice: number;
  currentValue: number;
  unrealizedPnL: number;
}

export interface ModelState {
  modelId: string;
  modelName: string;
  accountValue: number;
  cashBalance: number;
  positions: Position[];
  totalPnL: number;
  returnPercent: number;
  winRate: number;
  tradesCount: number;
  openTrades: Trade[];
}

class PaperTradingEngine extends EventEmitter {
  private modelStates: Map<string, ModelState> = new Map();
  private prices: Map<string, number> = new Map();

  constructor() {
    super();
    this.initializeModels();
    this.setupPriceListener();
  }

  private initializeModels() {
    AI_MODELS.forEach(model => {
      this.modelStates.set(model.id, {
        modelId: model.id,
        modelName: model.name,
        accountValue: STARTING_CAPITAL,
        cashBalance: STARTING_CAPITAL,
        positions: [],
        totalPnL: 0,
        returnPercent: 0,
        winRate: 0,
        tradesCount: 0,
        openTrades: [],
      });
    });

    console.log('[PaperTradingEngine] Initialized with', AI_MODELS.length, 'models');
  }

  private setupPriceListener() {
    cryptoPriceService.on('price', (priceData: CryptoPrice) => {
      this.prices.set(priceData.symbol, priceData.price);
      this.updatePositions();
    });
  }

  private updatePositions() {
    this.modelStates.forEach((state, modelId) => {
      let totalValue = state.cashBalance;

      state.positions = state.positions.map(pos => {
        const currentPrice = this.prices.get(pos.coin) || pos.avgEntryPrice;
        const currentValue = pos.quantity * currentPrice;
        const unrealizedPnL = currentValue - (pos.quantity * pos.avgEntryPrice);

        totalValue += currentValue;

        return {
          ...pos,
          currentValue,
          unrealizedPnL,
        };
      });

      state.accountValue = totalValue;
      state.totalPnL = totalValue - STARTING_CAPITAL;
      state.returnPercent = ((totalValue - STARTING_CAPITAL) / STARTING_CAPITAL) * 100;

      this.modelStates.set(modelId, state);
    });

    this.emit('stateUpdate', this.getAllModelStates());
  }

  public executeTrade(modelId: string, action: 'BUY' | 'SELL', coin: string, amount: number) {
    const state = this.modelStates.get(modelId);
    if (!state) {
      console.error('[PaperTradingEngine] Model not found:', modelId);
      return;
    }

    const currentPrice = this.prices.get(coin);
    if (!currentPrice) {
      console.error('[PaperTradingEngine] Price not available for', coin);
      return;
    }

    if (action === 'BUY') {
      this.executeBuy(state, coin, amount, currentPrice);
    } else {
      this.executeSell(state, coin, amount, currentPrice);
    }

    this.modelStates.set(modelId, state);
    this.emit('tradeExecuted', { modelId, action, coin, amount, price: currentPrice });
  }

  private executeBuy(state: ModelState, coin: string, amountUSD: number, price: number) {
    const fee = amountUSD * TRADE_FEE_PERCENT;
    const totalCost = amountUSD + fee;

    if (totalCost > state.cashBalance) {
      console.warn('[PaperTradingEngine] Insufficient cash for buy:', state.modelName);
      return;
    }

    const quantity = amountUSD / price;
    state.cashBalance -= totalCost;

    // Check if position exists
    const existingPos = state.positions.find(p => p.coin === coin);
    if (existingPos) {
      const totalQuantity = existingPos.quantity + quantity;
      const totalCost = (existingPos.avgEntryPrice * existingPos.quantity) + (price * quantity);
      existingPos.avgEntryPrice = totalCost / totalQuantity;
      existingPos.quantity = totalQuantity;
    } else {
      state.positions.push({
        coin,
        quantity,
        avgEntryPrice: price,
        currentValue: amountUSD,
        unrealizedPnL: 0,
      });
    }

    // Create trade record
    const trade: Trade = {
      id: uuidv4(),
      modelId: state.modelId,
      modelName: state.modelName,
      side: 'long',
      coin,
      entryPrice: price,
      exitPrice: null,
      quantity,
      entryTime: new Date().toISOString(),
      exitTime: null,
      notionalEntry: amountUSD,
      notionalExit: null,
      totalFees: fee,
      netPnL: -fee,
      completed: false,
    };

    state.openTrades.push(trade);
    database.insertTrade(trade);
    state.tradesCount++;

    console.log(`[PaperTradingEngine] ${state.modelName} BUY ${quantity.toFixed(4)} ${coin} @ $${price.toFixed(2)}`);
  }

  private executeSell(state: ModelState, coin: string, amountUSD: number, price: number) {
    const position = state.positions.find(p => p.coin === coin);
    if (!position) {
      console.warn('[PaperTradingEngine] No position to sell:', coin);
      return;
    }

    const quantity = Math.min(amountUSD / price, position.quantity);
    const proceeds = quantity * price;
    const fee = proceeds * TRADE_FEE_PERCENT;
    const netProceeds = proceeds - fee;

    state.cashBalance += netProceeds;

    const pnl = (price - position.avgEntryPrice) * quantity - fee;

    // Update or remove position
    position.quantity -= quantity;
    if (position.quantity < 0.0001) {
      state.positions = state.positions.filter(p => p.coin !== coin);
    }

    // Close the oldest open trade for this coin
    const openTrade = state.openTrades.find(t => t.coin === coin && !t.completed);
    if (openTrade) {
      openTrade.exitPrice = price;
      openTrade.exitTime = new Date().toISOString();
      openTrade.notionalExit = proceeds;
      openTrade.totalFees += fee;
      openTrade.netPnL = pnl;
      openTrade.completed = true;

      database.updateTrade(openTrade);
      state.openTrades = state.openTrades.filter(t => t.id !== openTrade.id);

      // Update win rate
      const completedTrades = database.getRecentTrades(1000).filter(t => t.modelId === state.modelId && t.completed);
      const wins = completedTrades.filter(t => t.netPnL > 0).length;
      state.winRate = completedTrades.length > 0 ? (wins / completedTrades.length) * 100 : 0;
    }

    console.log(`[PaperTradingEngine] ${state.modelName} SELL ${quantity.toFixed(4)} ${coin} @ $${price.toFixed(2)} | PnL: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`);
  }

  public getModelState(modelId: string): ModelState | undefined {
    return this.modelStates.get(modelId);
  }

  public getAllModelStates(): ModelState[] {
    return Array.from(this.modelStates.values());
  }

  public saveSnapshot() {
    this.modelStates.forEach(state => {
      database.insertPerformanceSnapshot({
        modelId: state.modelId,
        timestamp: new Date().toISOString(),
        accountValue: state.accountValue,
        totalPnL: state.totalPnL,
        winRate: state.winRate,
        trades: state.tradesCount,
      });
    });
  }
}

export const paperTradingEngine = new PaperTradingEngine();
