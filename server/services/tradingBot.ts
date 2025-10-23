import OpenRouterClient, { TradingDecision } from './openrouter';
import MarketDataService, { CryptoPrice } from './marketData';
import PaperTradingEngine from './paperTrading';

export interface TradingBotConfig {
  openrouterApiKey: string;
  coingeckoApiKey?: string;
  initialPortfolioValue: number;
  maxPositionSize: number;
  tradingCycleMinutes: number;
  aiModels: string[];
  tradingSymbols: string[];
}

export class TradingBot {
  private openrouter: OpenRouterClient;
  private marketData: MarketDataService;
  private paperTrading: PaperTradingEngine;
  private config: TradingBotConfig;
  private cycleNumber: number = 0;
  private isRunning: boolean = false;

  constructor(config: TradingBotConfig) {
    this.config = config;
    this.openrouter = new OpenRouterClient(config.openrouterApiKey);
    this.marketData = new MarketDataService(config.coingeckoApiKey);
    this.paperTrading = new PaperTradingEngine(config.initialPortfolioValue, config.maxPositionSize);
  }

  async runTradingCycle(): Promise<void> {
    this.cycleNumber++;
    console.log(`\n🔄 Starting Trading Cycle #${this.cycleNumber}`);
    console.log(`⏰ ${new Date().toISOString()}`);

    try {
      // 1. Fetch current market data
      console.log('\n📊 Fetching market data...');
      const prices = await this.marketData.getCurrentPrices(this.config.tradingSymbols);
      console.log(`Fetched ${prices.length} prices:`, prices.map(p => `${p.symbol}: $${p.price.toFixed(2)} (${p.priceChange24h > 0 ? '+' : ''}${p.priceChange24h.toFixed(2)}%)`).join(', '));

      // 2. Update portfolio with current prices
      const priceMap = prices.reduce((acc, p) => {
        acc[p.symbol] = p.price;
        return acc;
      }, {} as Record<string, number>);
      this.paperTrading.updatePrices(priceMap);

      // 3. Get portfolio state
      const portfolio = this.paperTrading.getPortfolio();
      console.log(`\n💼 ${this.paperTrading.getSummary()}`);

      // 4. Get AI trading decisions
      console.log(`\n🤖 Querying ${this.config.aiModels.length} AI models for trading decisions...`);
      
      const decisions: Array<TradingDecision & { model: string }> = [];
      
      for (const model of this.config.aiModels) {
        try {
          // For each symbol, get a decision
          for (const price of prices) {
            const decision = await this.openrouter.getTradingDecision(
              { symbol: price.symbol, price: price.price, priceChange24h: price.priceChange24h, volume24h: price.volume24h },
              { totalValue: portfolio.totalValue, cashBalance: portfolio.cashBalance, positions: portfolio.positions },
              model
            );
            decisions.push({ ...decision, model });
            console.log(`  ${model} → ${decision.action} ${decision.symbol} (confidence: ${decision.confidence}%)`);
          }
        } catch (error: any) {
          console.error(`  ❌ ${model} failed:`, error.message);
        }
      }

      // 5. Calculate consensus decision
      if (decisions.length > 0) {
        const consensus = this.openrouter.calculateConsensus(decisions);
        console.log(`\n🎯 Consensus Decision: ${consensus.action} ${consensus.symbol} (confidence: ${consensus.confidence.toFixed(1)}%)`);
        console.log(`   Reasoning: ${consensus.reasoning.substring(0, 200)}...`);

        // 6. Execute trades based on consensus
        await this.executeTrade(consensus, priceMap);
      }

      // 7. Log cycle summary
      console.log(`\n✅ Cycle #${this.cycleNumber} completed`);
      console.log(this.paperTrading.getSummary());

    } catch (error: any) {
      console.error(`\n❌ Error in trading cycle #${this.cycleNumber}:`, error.message);
    }
  }

  private async executeTrade(decision: TradingDecision, prices: Record<string, number>): Promise<void> {
    const price = prices[decision.symbol];
    if (!price) {
      console.log(`⚠️  Price not available for ${decision.symbol}, skipping trade`);
      return;
    }

    const portfolio = this.paperTrading.getPortfolio();
    const existingPosition = this.paperTrading.getPositionBySymbol(decision.symbol);

    if (decision.action === 'BUY' && decision.confidence > 60) {
      if (existingPosition) {
        console.log(`⚠️  Already have position in ${decision.symbol}, skipping BUY`);
        return;
      }

      // Calculate quantity based on max position size
      const maxInvestment = portfolio.totalValue * this.config.maxPositionSize;
      const quantity = Math.floor(maxInvestment / price * 100) / 100; // Round to 2 decimals

      const result = this.paperTrading.openPosition(decision.symbol, 'LONG', price, quantity, 'consensus');
      if (result.success) {
        console.log(`✅ Executed BUY: ${quantity} ${decision.symbol} @ $${price}`);
      } else {
        console.log(`❌ Failed to BUY: ${result.error}`);
      }
    } else if (decision.action === 'SELL' && decision.confidence > 60) {
      if (!existingPosition) {
        console.log(`⚠️  No position in ${decision.symbol}, skipping SELL`);
        return;
      }

      const result = this.paperTrading.closePosition(existingPosition.id, price);
      if (result.success) {
        console.log(`✅ Executed SELL: ${existingPosition.quantity} ${decision.symbol} @ $${price}, P&L: $${result.pnl?.toFixed(2)}`);
      } else {
        console.log(`❌ Failed to SELL: ${result.error}`);
      }
    } else {
      console.log(`⏸️  HOLD ${decision.symbol} (confidence: ${decision.confidence}%)`);
    }
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️  Trading bot is already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 QuantMind Trading Bot Started');
    console.log(`📊 Trading ${this.config.tradingSymbols.length} symbols: ${this.config.tradingSymbols.join(', ')}`);
    console.log(`🤖 Using ${this.config.aiModels.length} AI models: ${this.config.aiModels.join(', ')}`);
    console.log(`💰 Initial portfolio: $${this.config.initialPortfolioValue.toLocaleString()}`);
    console.log(`⏱️  Cycle interval: ${this.config.tradingCycleMinutes} minutes`);

    // Run first cycle immediately
    await this.runTradingCycle();

    // Schedule subsequent cycles
    setInterval(async () => {
      if (this.isRunning) {
        await this.runTradingCycle();
      }
    }, this.config.tradingCycleMinutes * 60 * 1000);
  }

  stop(): void {
    this.isRunning = false;
    console.log('🛑 Trading bot stopped');
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      cycleNumber: this.cycleNumber,
      portfolio: this.paperTrading.getPortfolio(),
      config: this.config,
    };
  }
}

export default TradingBot;

