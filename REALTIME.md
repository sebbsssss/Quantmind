# Real-Time Paper Trading System

## Overview

QuantMind now features a complete real-time paper trading system that streams live cryptocurrency prices from Binance and simulates AI model trading decisions with WebSocket-based real-time updates.

## Architecture

### Backend Services

#### 1. **Crypto Price Service** (`server/services/cryptoPriceService.ts`)
- Connects to Binance WebSocket API for real-time price streams
- Tracks BTC, ETH, SOL, BNB, DOGE, XRP prices and 24h changes
- Auto-reconnects on connection loss
- Emits price updates to all connected components

#### 2. **Paper Trading Engine** (`server/services/paperTradingEngine.ts`)
- Manages $10,000 starting capital per AI model
- Tracks positions, cash balance, P&L in real-time
- Calculates fees (0.1% per trade)
- Updates portfolio values as crypto prices change
- Records all trades to database

#### 3. **AI Decision Simulator** (`server/services/aiDecisionSimulator.ts`)
- Generates realistic trading decisions every 5 minutes
- Considers portfolio state, position sizes, cash availability
- Creates contextual reasoning for each decision
- Executes BUY/SELL/HOLD actions based on strategy

#### 4. **Database Service** (`server/services/database.ts`)
- SQLite database for persistence
- Stores:
  - Trade history (open and completed trades)
  - Performance snapshots (every 5 minutes)
  - AI decision logs with reasoning

### Frontend Components

#### 1. **WebSocket Hook** (`client/src/hooks/useWebSocket.ts`)
- Establishes WebSocket connection to server
- Handles reconnection automatically
- Processes real-time updates for:
  - Crypto prices
  - Model portfolio states
  - Trade executions
  - AI decisions

#### 2. **Data Context** (`client/src/contexts/DataContext.tsx`)
- Provides real-time data to all components
- Single source of truth for application state
- Connection status tracking

#### 3. **Updated Components**
- **CryptoTicker**: Live price updates
- **PerformanceChart**: Real-time portfolio values
- **AIReasoning**: Live AI decision stream
- **Header**: Connection status indicator

## How It Works

### Data Flow

```
Binance WebSocket
    ↓
Crypto Price Service → Paper Trading Engine → WebSocket Server
                             ↓                        ↓
                    AI Decision Simulator    Frontend Clients
                             ↓
                        Database
```

### Trading Logic

1. **Price Updates** (continuous):
   - Binance streams price updates
   - Paper Trading Engine recalculates all position values
   - Updated states broadcast to clients

2. **AI Decisions** (every 5 minutes):
   - Each model analyzes market conditions
   - Generates BUY/SELL/HOLD decision with reasoning
   - If BUY/SELL, executes paper trade
   - Updates saved to database
   - Decision broadcast to clients

3. **Trade Execution**:
   - Validates cash balance / position availability
   - Calculates fees and P&L
   - Updates model state
   - Records trade in database
   - Broadcasts trade event

## Running the System

### Development Mode
```bash
# Terminal 1: Start backend with real-time services
pnpm dev

# Terminal 2: If running separately
pnpm dev --host  # For client only
```

### Production Mode
```bash
# Build everything
pnpm build

# Start production server
pnpm start
```

The server will:
- ✅ Connect to Binance WebSocket
- ✅ Initialize 4 AI models with $10k each
- ✅ Start decision simulator (first decision after 30s, then every 5min)
- ✅ Accept WebSocket connections on `ws://localhost:3000/ws`
- ✅ Serve static files and API

## WebSocket Protocol

### Client → Server
No client-to-server messages currently (read-only).

### Server → Client

#### Initial Connection
```json
{
  "type": "init",
  "data": {
    "prices": [...],
    "modelStates": [...],
    "recentTrades": [...],
    "recentDecisions": [...]
  }
}
```

#### Price Update
```json
{
  "type": "price",
  "data": {
    "symbol": "BTC",
    "price": 95234.50,
    "change24h": -0.43,
    "volume24h": 12345678.90,
    "lastUpdate": "2025-01-15T12:34:56.789Z"
  }
}
```

#### Model State Update
```json
{
  "type": "modelStates",
  "data": [
    {
      "modelId": "gpt4o",
      "modelName": "GPT-4o",
      "accountValue": 10523.45,
      "cashBalance": 3200.50,
      "positions": [...],
      "totalPnL": 523.45,
      "returnPercent": 5.23,
      "winRate": 62.5,
      "tradesCount": 8
    },
    ...
  ]
}
```

#### Trade Executed
```json
{
  "type": "trade",
  "data": {
    "modelId": "gpt4o",
    "action": "BUY",
    "coin": "BTC",
    "amount": 2000,
    "price": 95234.50
  }
}
```

#### AI Decision
```json
{
  "type": "decision",
  "data": {
    "modelId": "gpt4o",
    "modelName": "GPT-4o",
    "decision": "BUY",
    "coin": "BTC",
    "confidence": 78,
    "reasoning": "Bitcoin showing strong momentum...",
    "portfolioComfort": "comfortable",
    "amount": 2000
  }
}
```

## Configuration

### Trading Parameters
Edit `server/services/paperTradingEngine.ts`:
- `STARTING_CAPITAL`: Initial capital per model (default: $10,000)
- `TRADE_FEE_PERCENT`: Fee per trade (default: 0.1%)

Edit `server/services/aiDecisionSimulator.ts`:
- `DECISION_INTERVAL`: Time between decisions (default: 5 minutes)
- `MIN_TRADE_SIZE`: Minimum trade amount (default: $500)
- `MAX_POSITION_SIZE`: Max % of portfolio per position (default: 25%)

### Cryptocurrency Symbols
Edit `server/services/cryptoPriceService.ts`:
```typescript
const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', ...];
```

## Database

SQLite database created at `quantmind.db` in project root.

### Tables

**trades**
- Trade history with entry/exit prices, P&L, fees
- Tracks open and completed positions

**performance_snapshots**
- Portfolio value snapshots every 5 minutes
- Used for historical charts and analytics

**ai_decisions**
- Complete log of AI decisions with reasoning
- Includes confidence levels and portfolio comfort

### Querying
```typescript
import { database } from './services/database';

// Get recent trades
const trades = database.getRecentTrades(50);

// Get open positions for a model
const openTrades = database.getOpenTrades('gpt4o');

// Get performance history
const history = database.getPerformanceHistory('gpt4o', 72);
```

## Connection Status

The app displays connection status in the header:
- 🟢 **Connected**: Receiving real-time updates
- 🟡 **Connecting**: Establishing connection
- 🔴 **Disconnected**: Connection lost, auto-reconnecting
- 🔴 **Error**: Connection error

Auto-reconnection happens every 3 seconds after disconnect.

## Monitoring

Server logs show:
```
[CryptoPriceService] Connecting to Binance WebSocket...
[CryptoPriceService] Connected to Binance
[Database] Initialized successfully
[PaperTradingEngine] Initialized with 4 models
[AIDecisionSimulator] Starting decision engine...
[PaperTradingEngine] GPT-4o BUY 0.0210 BTC @ $95234.50
[WebSocket] Client connected
```

## Differences from Mock Data

| Feature | Mock Data (Old) | Real-Time (New) |
|---------|----------------|-----------------|
| Crypto Prices | Hardcoded, fake fluctuation | Live from Binance |
| AI Decisions | Static array | Generated every 5min |
| Trades | Fake history | Real paper trades |
| Portfolio Values | Simulated growth | Calculated from live prices |
| Updates | Client-side fake updates | Server-side WebSocket |
| Persistence | None | SQLite database |

## Future Enhancements

Possible additions:
- Historical chart data from database snapshots
- More sophisticated AI decision algorithms
- Support for more cryptocurrencies
- Trade simulation replay
- Portfolio rebalancing strategies
- Risk management rules (stop-loss, take-profit)
- Multi-timeframe analysis
- Performance metrics (Sharpe ratio, max drawdown)

## Troubleshooting

**WebSocket won't connect**
- Check that server is running on correct port
- Verify firewall isn't blocking WebSocket connections
- Check browser console for connection errors

**No price updates**
- Binance WebSocket may be blocked/rate-limited
- Check server logs for connection errors
- Verify internet connection

**Database errors**
- Ensure write permissions in project directory
- Check `quantmind.db` file isn't locked by another process
- Delete `quantmind.db` to reset (loses all history)

**Trades not executing**
- Check AI decision simulator is running
- Verify models have sufficient cash balance
- Look for errors in server logs
