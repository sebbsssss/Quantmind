import { EventEmitter } from 'events';
import { paperTradingEngine } from './paperTradingEngine';
import { cryptoPriceService } from './cryptoPriceService';
import { database } from './database';

const COINS = ['BTC', 'ETH', 'SOL', 'BNB', 'DOGE', 'XRP'];
const DECISION_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MIN_TRADE_SIZE = 500; // Minimum $500 per trade
const MAX_POSITION_SIZE = 0.25; // Max 25% of portfolio per position

interface AIDecisionData {
  modelId: string;
  modelName: string;
  decision: 'BUY' | 'SELL' | 'HOLD';
  coin: string;
  confidence: number;
  reasoning: string;
  portfolioComfort: 'comfortable' | 'neutral' | 'concerned';
  amount?: number;
}

const REASONING_TEMPLATES = {
  BUY: [
    '{coin} showing strong bullish momentum with increasing volume. Technical indicators suggest continued upward movement. Risk/reward ratio favorable at current levels.',
    '{coin} breaking key resistance at ${price}. Market structure indicates potential for further gains. Accumulating position with tight stop loss.',
    'Strong fundamentals for {coin} combined with positive market sentiment. Price action suggests institutional accumulation. Entry at current levels justified.',
    '{coin} oversold on recent pullback, now bouncing from support. Volume profile indicates buying interest. Accumulating here with medium-term outlook.',
  ],
  SELL: [
    '{coin} approaching overbought territory. Taking profits after ${gainPercent}% gain. Will look to re-enter on pullback to support.',
    '{coin} showing signs of exhaustion at ${price}. Volume declining on upward moves. Reducing exposure to lock in gains.',
    'Risk/reward no longer favorable for {coin} at current levels. Previous resistance becoming new support is questionable. Taking partial profits.',
    '{coin} technical indicators suggesting reversal. Trailing stop triggered. Exiting position with ${gainPercent}% return.',
  ],
  HOLD: [
    '{coin} consolidating in healthy range. No clear directional bias. Maintaining current position while monitoring for breakout.',
    'Waiting for clearer setup on {coin}. Current price action indecisive. Preserving capital for better opportunities.',
    '{coin} showing mixed signals. Volume insufficient for conviction move. Holding current allocation unchanged.',
    'Market conditions volatile. {coin} respecting key levels. Maintaining position with protective stops in place.',
  ],
};

class AIDecisionSimulator extends EventEmitter {
  private intervalId: NodeJS.Timeout | null = null;
  private lastDecisionTime: Map<string, number> = new Map();

  public start() {
    console.log('[AIDecisionSimulator] Starting decision engine...');
    
    // Make initial decisions after 30 seconds (let prices stabilize)
    setTimeout(() => {
      this.makeDecisions();
    }, 30000);

    // Then make decisions periodically
    this.intervalId = setInterval(() => {
      this.makeDecisions();
    }, DECISION_INTERVAL);
  }

  private makeDecisions() {
    const modelStates = paperTradingEngine.getAllModelStates();

    modelStates.forEach(state => {
      // Random chance to make a decision (not every model every time)
      if (Math.random() > 0.6) return;

      const decision = this.generateDecision(state);
      
      if (decision.decision === 'BUY' && decision.amount) {
        paperTradingEngine.executeTrade(decision.modelId, 'BUY', decision.coin, decision.amount);
      } else if (decision.decision === 'SELL' && decision.amount) {
        paperTradingEngine.executeTrade(decision.modelId, 'SELL', decision.coin, decision.amount);
      }

      // Save decision to database
      database.insertAIDecision({
        modelId: decision.modelId,
        timestamp: new Date().toISOString(),
        decision: decision.decision,
        symbol: decision.coin,
        confidence: decision.confidence,
        reasoning: decision.reasoning,
        portfolioComfort: decision.portfolioComfort,
      });

      this.emit('decision', decision);
      this.lastDecisionTime.set(decision.modelId, Date.now());
    });
  }

  private generateDecision(state: any): AIDecisionData {
    const coin = COINS[Math.floor(Math.random() * COINS.length)];
    const price = cryptoPriceService.getPrice(coin)?.price || 0;
    
    // Determine decision type based on portfolio state
    const hasPosition = state.positions.some((p: any) => p.coin === coin);
    const cashPercent = (state.cashBalance / state.accountValue) * 100;
    const positionCount = state.positions.length;

    let decision: 'BUY' | 'SELL' | 'HOLD';
    let amount = 0;

    // Decision logic
    if (hasPosition && Math.random() > 0.65) {
      // 35% chance to sell if we have a position
      decision = 'SELL';
      const position = state.positions.find((p: any) => p.coin === coin);
      amount = Math.min(position.currentValue, state.accountValue * MAX_POSITION_SIZE);
    } else if (!hasPosition && cashPercent > 20 && positionCount < 4 && Math.random() > 0.4) {
      // 60% chance to buy if we have cash and not too many positions
      decision = 'BUY';
      const maxAmount = state.accountValue * MAX_POSITION_SIZE;
      const availableCash = state.cashBalance;
      amount = Math.max(MIN_TRADE_SIZE, Math.min(maxAmount, availableCash * 0.3));
    } else {
      decision = 'HOLD';
    }

    // Generate reasoning
    const templates = REASONING_TEMPLATES[decision];
    let reasoning = templates[Math.floor(Math.random() * templates.length)];
    
    const position = state.positions.find((p: any) => p.coin === coin);
    const gainPercent = position 
      ? ((position.unrealizedPnL / (position.avgEntryPrice * position.quantity)) * 100).toFixed(1)
      : '0';

    reasoning = reasoning
      .replace(/{coin}/g, coin)
      .replace(/{price}/g, price.toFixed(2))
      .replace(/{gainPercent}/g, gainPercent);

    // Determine portfolio comfort
    let portfolioComfort: 'comfortable' | 'neutral' | 'concerned';
    if (state.returnPercent > 5) {
      portfolioComfort = 'comfortable';
    } else if (state.returnPercent < -5) {
      portfolioComfort = 'concerned';
    } else {
      portfolioComfort = 'neutral';
    }

    // Confidence based on decision type and portfolio state
    const confidence = Math.floor(55 + Math.random() * 35); // 55-90%

    return {
      modelId: state.modelId,
      modelName: state.modelName,
      decision,
      coin,
      confidence,
      reasoning,
      portfolioComfort,
      amount: decision !== 'HOLD' ? amount : undefined,
    };
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

export const aiDecisionSimulator = new AIDecisionSimulator();
