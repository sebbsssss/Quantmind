import { pgTable, serial, varchar, decimal, timestamp, integer, text, boolean } from 'drizzle-orm/pg-core';

// AI Models table - track performance of each AI model
export const aiModels = pgTable('ai_models', {
  id: serial('id').primaryKey(),
  modelId: varchar('model_id', { length: 100 }).unique().notNull(),
  provider: varchar('provider', { length: 50 }).notNull(),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  isActive: boolean('is_active').default(true),
  totalDecisions: integer('total_decisions').default(0),
  successfulTrades: integer('successful_trades').default(0),
  failedTrades: integer('failed_trades').default(0),
  totalPnl: decimal('total_pnl', { precision: 15, scale: 2 }).default('0'),
  winRate: decimal('win_rate', { precision: 5, scale: 2 }).default('0'),
  avgReturn: decimal('avg_return', { precision: 5, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Portfolio snapshots - track portfolio value over time
export const portfolioSnapshots = pgTable('portfolio_snapshots', {
  id: serial('id').primaryKey(),
  totalValue: decimal('total_value', { precision: 15, scale: 2 }).notNull(),
  cashBalance: decimal('cash_balance', { precision: 15, scale: 2 }).notNull(),
  positionsValue: decimal('positions_value', { precision: 15, scale: 2 }).notNull(),
  totalPnl: decimal('total_pnl', { precision: 15, scale: 2 }).notNull(),
  dailyPnl: decimal('daily_pnl', { precision: 15, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Positions - track individual trading positions
export const positions = pgTable('positions', {
  id: serial('id').primaryKey(),
  symbol: varchar('symbol', { length: 20 }).notNull(),
  side: varchar('side', { length: 10 }).notNull(), // LONG or SHORT
  quantity: decimal('quantity', { precision: 15, scale: 8 }).notNull(),
  entryPrice: decimal('entry_price', { precision: 15, scale: 2 }).notNull(),
  currentPrice: decimal('current_price', { precision: 15, scale: 2 }).notNull(),
  unrealizedPnl: decimal('unrealized_pnl', { precision: 15, scale: 2 }).default('0'),
  realizedPnl: decimal('realized_pnl', { precision: 15, scale: 2 }).default('0'),
  status: varchar('status', { length: 20 }).default('OPEN'), // OPEN or CLOSED
  modelId: varchar('model_id', { length: 100 }).notNull(),
  openedAt: timestamp('opened_at').defaultNow(),
  closedAt: timestamp('closed_at'),
});

// Trading decisions - log all AI decisions
export const tradingDecisions = pgTable('trading_decisions', {
  id: serial('id').primaryKey(),
  modelId: varchar('model_id', { length: 100 }).notNull(),
  decision: varchar('decision', { length: 20 }).notNull(), // BUY, SELL, HOLD
  symbol: varchar('symbol', { length: 20 }).notNull(),
  confidence: decimal('confidence', { precision: 5, scale: 2 }),
  reasoning: text('reasoning'),
  suggestedQuantity: decimal('suggested_quantity', { precision: 15, scale: 8 }),
  suggestedPrice: decimal('suggested_price', { precision: 15, scale: 2 }),
  executed: boolean('executed').default(false),
  executionPrice: decimal('execution_price', { precision: 15, scale: 2 }),
  executionTime: timestamp('execution_time'),
  apiCost: decimal('api_cost', { precision: 10, scale: 6 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Market data - store price history
export const marketData = pgTable('market_data', {
  id: serial('id').primaryKey(),
  symbol: varchar('symbol', { length: 20 }).notNull(),
  price: decimal('price', { precision: 15, scale: 2 }).notNull(),
  volume24h: decimal('volume_24h', { precision: 20, scale: 2 }),
  marketCap: decimal('market_cap', { precision: 20, scale: 2 }),
  priceChange24h: decimal('price_change_24h', { precision: 5, scale: 2 }),
  timestamp: timestamp('timestamp').defaultNow(),
});

// Trading cycles - track each 30-minute cycle
export const tradingCycles = pgTable('trading_cycles', {
  id: serial('id').primaryKey(),
  cycleNumber: integer('cycle_number').notNull(),
  portfolioValue: decimal('portfolio_value', { precision: 15, scale: 2 }).notNull(),
  decisionsCount: integer('decisions_count').default(0),
  tradesExecuted: integer('trades_executed').default(0),
  cyclePnl: decimal('cycle_pnl', { precision: 15, scale: 2 }).default('0'),
  status: varchar('status', { length: 20 }).default('COMPLETED'),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

// System logs
export const systemLogs = pgTable('system_logs', {
  id: serial('id').primaryKey(),
  level: varchar('level', { length: 20 }).notNull(), // INFO, WARN, ERROR
  message: text('message').notNull(),
  context: text('context'),
  createdAt: timestamp('created_at').defaultNow(),
});

