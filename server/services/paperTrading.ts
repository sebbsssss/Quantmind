export interface Position {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  modelId: string;
  openedAt: Date;
}

export interface Portfolio {
  totalValue: number;
  cashBalance: number;
  positionsValue: number;
  positions: Position[];
  totalPnl: number;
  dailyPnl: number;
}

export class PaperTradingEngine {
  private portfolio: Portfolio;
  private maxPositionSize: number;
  private initialValue: number;

  constructor(initialValue: number = 100000, maxPositionSize: number = 0.10) {
    this.initialValue = initialValue;
    this.maxPositionSize = maxPositionSize;
    this.portfolio = {
      totalValue: initialValue,
      cashBalance: initialValue,
      positionsValue: 0,
      positions: [],
      totalPnl: 0,
      dailyPnl: 0,
    };
  }

  getPortfolio(): Portfolio {
    return { ...this.portfolio };
  }

  updatePrices(prices: Record<string, number>): void {
    let positionsValue = 0;

    this.portfolio.positions = this.portfolio.positions.map(position => {
      const currentPrice = prices[position.symbol] || position.currentPrice;
      const priceDiff = currentPrice - position.entryPrice;
      const unrealizedPnl = position.side === 'LONG' 
        ? priceDiff * position.quantity 
        : -priceDiff * position.quantity;
      
      const positionValue = currentPrice * position.quantity;
      positionsValue += positionValue;

      return {
        ...position,
        currentPrice,
        unrealizedPnl,
      };
    });

    this.portfolio.positionsValue = positionsValue;
    this.portfolio.totalValue = this.portfolio.cashBalance + positionsValue;
    this.portfolio.totalPnl = this.portfolio.totalValue - this.initialValue;
  }

  canOpenPosition(symbol: string, price: number, quantity: number): { canOpen: boolean; reason?: string } {
    const positionValue = price * quantity;
    const maxAllowed = this.portfolio.totalValue * this.maxPositionSize;

    if (positionValue > maxAllowed) {
      return {
        canOpen: false,
        reason: `Position size ${positionValue.toFixed(2)} exceeds max allowed ${maxAllowed.toFixed(2)} (${this.maxPositionSize * 100}% of portfolio)`,
      };
    }

    if (positionValue > this.portfolio.cashBalance) {
      return {
        canOpen: false,
        reason: `Insufficient cash balance. Need ${positionValue.toFixed(2)}, have ${this.portfolio.cashBalance.toFixed(2)}`,
      };
    }

    return { canOpen: true };
  }

  openPosition(
    symbol: string,
    side: 'LONG' | 'SHORT',
    price: number,
    quantity: number,
    modelId: string
  ): { success: boolean; position?: Position; error?: string } {
    const check = this.canOpenPosition(symbol, price, quantity);
    if (!check.canOpen) {
      return { success: false, error: check.reason };
    }

    const positionValue = price * quantity;
    const position: Position = {
      id: `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      symbol,
      side,
      quantity,
      entryPrice: price,
      currentPrice: price,
      unrealizedPnl: 0,
      modelId,
      openedAt: new Date(),
    };

    this.portfolio.positions.push(position);
    this.portfolio.cashBalance -= positionValue;

    console.log(`✅ Opened ${side} position: ${quantity} ${symbol} @ $${price} (${modelId})`);

    return { success: true, position };
  }

  closePosition(positionId: string, currentPrice: number): { success: boolean; pnl?: number; error?: string } {
    const index = this.portfolio.positions.findIndex(p => p.id === positionId);
    if (index === -1) {
      return { success: false, error: 'Position not found' };
    }

    const position = this.portfolio.positions[index];
    const positionValue = currentPrice * position.quantity;
    const pnl = position.side === 'LONG'
      ? (currentPrice - position.entryPrice) * position.quantity
      : (position.entryPrice - currentPrice) * position.quantity;

    this.portfolio.cashBalance += positionValue;
    this.portfolio.positions.splice(index, 1);

    console.log(`✅ Closed ${position.side} position: ${position.quantity} ${position.symbol} @ $${currentPrice}, PnL: $${pnl.toFixed(2)}`);

    return { success: true, pnl };
  }

  closeAllPositions(prices: Record<string, number>): void {
    const positionsToClose = [...this.portfolio.positions];
    positionsToClose.forEach(position => {
      const price = prices[position.symbol] || position.currentPrice;
      this.closePosition(position.id, price);
    });
  }

  getPositionBySymbol(symbol: string): Position | undefined {
    return this.portfolio.positions.find(p => p.symbol === symbol);
  }

  getSummary(): string {
    const { totalValue, cashBalance, positionsValue, positions, totalPnl } = this.portfolio;
    const pnlPercent = (totalPnl / this.initialValue) * 100;

    return `
Portfolio Summary:
  Total Value: $${totalValue.toFixed(2)}
  Cash: $${cashBalance.toFixed(2)}
  Positions: $${positionsValue.toFixed(2)}
  Total P&L: $${totalPnl.toFixed(2)} (${pnlPercent.toFixed(2)}%)
  Open Positions: ${positions.length}
${positions.map(p => `    - ${p.side} ${p.quantity} ${p.symbol} @ $${p.entryPrice} (Current: $${p.currentPrice}, P&L: $${p.unrealizedPnl.toFixed(2)})`).join('\n')}
    `.trim();
  }
}

export default PaperTradingEngine;

