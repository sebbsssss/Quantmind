import Database from 'better-sqlite3';
import path from 'path';

export interface Trade {
  id: string;
  modelId: string;
  modelName: string;
  side: 'long' | 'short';
  coin: string;
  entryPrice: number;
  exitPrice: number | null;
  quantity: number;
  entryTime: string;
  exitTime: string | null;
  notionalEntry: number;
  notionalExit: number | null;
  totalFees: number;
  netPnL: number;
  completed: boolean;
}

export interface PerformanceSnapshot {
  id: number;
  modelId: string;
  timestamp: string;
  accountValue: number;
  totalPnL: number;
  winRate: number;
  trades: number;
}

export interface AIDecision {
  id: number;
  modelId: string;
  timestamp: string;
  decision: 'BUY' | 'SELL' | 'HOLD';
  symbol: string;
  confidence: number;
  reasoning: string;
  portfolioComfort: string;
}

class DatabaseService {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(process.cwd(), 'quantmind.db');
    this.db = new Database(dbPath);
    this.initialize();
  }

  private initialize() {
    // Create trades table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS trades (
        id TEXT PRIMARY KEY,
        modelId TEXT NOT NULL,
        modelName TEXT NOT NULL,
        side TEXT NOT NULL,
        coin TEXT NOT NULL,
        entryPrice REAL NOT NULL,
        exitPrice REAL,
        quantity REAL NOT NULL,
        entryTime TEXT NOT NULL,
        exitTime TEXT,
        notionalEntry REAL NOT NULL,
        notionalExit REAL,
        totalFees REAL NOT NULL,
        netPnL REAL NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0
      )
    `);

    // Create performance snapshots table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS performance_snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        modelId TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        accountValue REAL NOT NULL,
        totalPnL REAL NOT NULL,
        winRate REAL NOT NULL,
        trades INTEGER NOT NULL
      )
    `);

    // Create AI decisions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ai_decisions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        modelId TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        decision TEXT NOT NULL,
        symbol TEXT NOT NULL,
        confidence REAL NOT NULL,
        reasoning TEXT NOT NULL,
        portfolioComfort TEXT NOT NULL
      )
    `);

    console.log('[Database] Initialized successfully');
  }

  // Trade methods
  public insertTrade(trade: Trade) {
    const stmt = this.db.prepare(`
      INSERT INTO trades (id, modelId, modelName, side, coin, entryPrice, exitPrice, 
                         quantity, entryTime, exitTime, notionalEntry, notionalExit,
                         totalFees, netPnL, completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      trade.id,
      trade.modelId,
      trade.modelName,
      trade.side,
      trade.coin,
      trade.entryPrice,
      trade.exitPrice,
      trade.quantity,
      trade.entryTime,
      trade.exitTime,
      trade.notionalEntry,
      trade.notionalExit,
      trade.totalFees,
      trade.netPnL,
      trade.completed ? 1 : 0
    );
  }

  public updateTrade(trade: Trade) {
    const stmt = this.db.prepare(`
      UPDATE trades 
      SET exitPrice = ?, exitTime = ?, notionalExit = ?, 
          totalFees = ?, netPnL = ?, completed = ?
      WHERE id = ?
    `);
    
    stmt.run(
      trade.exitPrice,
      trade.exitTime,
      trade.notionalExit,
      trade.totalFees,
      trade.netPnL,
      trade.completed ? 1 : 0,
      trade.id
    );
  }

  public getRecentTrades(limit: number = 50): Trade[] {
    const stmt = this.db.prepare(`
      SELECT * FROM trades 
      ORDER BY entryTime DESC 
      LIMIT ?
    `);
    
    const rows = stmt.all(limit) as any[];
    return rows.map(row => ({
      ...row,
      completed: row.completed === 1,
    }));
  }

  public getOpenTrades(modelId?: string): Trade[] {
    let query = 'SELECT * FROM trades WHERE completed = 0';
    if (modelId) {
      query += ' AND modelId = ?';
    }
    query += ' ORDER BY entryTime DESC';
    
    const stmt = this.db.prepare(query);
    const rows = modelId ? stmt.all(modelId) : stmt.all();
    
    return (rows as any[]).map(row => ({
      ...row,
      completed: row.completed === 1,
    }));
  }

  // Performance snapshot methods
  public insertPerformanceSnapshot(snapshot: Omit<PerformanceSnapshot, 'id'>) {
    const stmt = this.db.prepare(`
      INSERT INTO performance_snapshots (modelId, timestamp, accountValue, totalPnL, winRate, trades)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      snapshot.modelId,
      snapshot.timestamp,
      snapshot.accountValue,
      snapshot.totalPnL,
      snapshot.winRate,
      snapshot.trades
    );
  }

  public getPerformanceHistory(modelId: string, hoursBack: number = 72): PerformanceSnapshot[] {
    const cutoffTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();
    
    const stmt = this.db.prepare(`
      SELECT * FROM performance_snapshots
      WHERE modelId = ? AND timestamp >= ?
      ORDER BY timestamp ASC
    `);
    
    return stmt.all(modelId, cutoffTime) as PerformanceSnapshot[];
  }

  // AI decision methods
  public insertAIDecision(decision: Omit<AIDecision, 'id'>) {
    const stmt = this.db.prepare(`
      INSERT INTO ai_decisions (modelId, timestamp, decision, symbol, confidence, reasoning, portfolioComfort)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      decision.modelId,
      decision.timestamp,
      decision.decision,
      decision.symbol,
      decision.confidence,
      decision.reasoning,
      decision.portfolioComfort
    );
  }

  public getRecentDecisions(limit: number = 10): AIDecision[] {
    const stmt = this.db.prepare(`
      SELECT * FROM ai_decisions 
      ORDER BY timestamp DESC 
      LIMIT ?
    `);
    
    return stmt.all(limit) as AIDecision[];
  }

  public close() {
    this.db.close();
  }
}

export const database = new DatabaseService();
