# Quick Start Guide - Real-Time Paper Trading

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start Development Server
```bash
pnpm dev
```

The server will start on `http://localhost:3000` with:
- ✅ Real-time crypto prices from Binance
- ✅ 4 AI models with $10,000 starting capital each
- ✅ Live paper trading every 5 minutes
- ✅ WebSocket connection for instant updates

### 3. Open Browser
Navigate to `http://localhost:3000` and watch:
- 📊 Live crypto prices in the ticker
- 💹 Real-time portfolio updates
- 🤖 AI trading decisions as they happen
- 🔵 Connection status indicator in header

## 🎯 What You'll See

### First 30 Seconds
- Connection indicator turns **green** (connected)
- Crypto prices start updating in real-time
- All 4 AI models initialized with $10k each

### After 30 Seconds
- First AI trading decisions appear
- Models start executing paper trades
- Portfolio values update based on live prices

### Every 5 Minutes
- New trading decisions generated
- AI reasoning displayed for each decision
- Trades executed and recorded to database

## 📊 Key Features

**Real-Time Price Streaming**
- Live BTC, ETH, SOL, BNB, DOGE, XRP prices from Binance
- Updates multiple times per second
- Automatic reconnection on disconnect

**Paper Trading**
- 4 AI models: GPT-4o, Claude Sonnet, Gemini Pro, o1-mini
- $10,000 starting capital per model
- 0.1% trading fees (realistic simulation)
- Position tracking and P&L calculation

**AI Decision Engine**
- Realistic trading strategies
- Contextual reasoning for each decision
- Portfolio risk management
- BUY/SELL/HOLD signals with confidence levels

**Data Persistence**
- SQLite database (`quantmind.db`)
- Complete trade history
- Performance snapshots every 5 minutes
- AI decision logs

## 🛠️ Commands

```bash
# Development (hot reload)
pnpm dev

# Type checking
pnpm check

# Format code
pnpm format

# Production build
pnpm build

# Run production server
pnpm start

# Preview production build locally
pnpm preview
```

## 📱 Connection Status

Watch the status indicator in the header:

| Indicator | Meaning |
|-----------|---------|
| 🟢 Connected | Live data streaming |
| 🟡 Connecting | Establishing connection |
| 🔴 Disconnected | Auto-reconnecting... |
| 🔴 Error | Connection failed |

## 🎮 What to Try

1. **Watch Live Prices**: See real Binance prices update in the ticker
2. **Monitor Portfolios**: Track AI model performance in real-time
3. **Read AI Reasoning**: Click through different models to see their decision logic
4. **Check Trades**: Open browser DevTools and watch WebSocket messages
5. **Test Reconnection**: Stop the server and restart - frontend auto-reconnects

## 📖 Learn More

- **[REALTIME.md](./REALTIME.md)** - Complete technical documentation
- **[WARP.md](./WARP.md)** - Project structure and architecture
- **[README.md](./README.md)** - General project information

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Connection won't establish?**
- Check browser console (F12) for errors
- Ensure server is running (`pnpm dev`)
- Try refreshing the page

**No trades happening?**
- Wait at least 30 seconds for first decision
- Check server logs for errors
- Verify Binance connection in server output

**Database errors?**
```bash
# Reset database (loses history)
rm quantmind.db
```

## 💡 Tips

- **Faster Decisions**: Edit `DECISION_INTERVAL` in `server/services/aiDecisionSimulator.ts` (default: 5 minutes)
- **More Coins**: Add symbols in `server/services/cryptoPriceService.ts`
- **Higher Capital**: Change `STARTING_CAPITAL` in `server/services/paperTradingEngine.ts`
- **View Database**: Use SQLite browser to explore `quantmind.db`

## 🎉 You're All Set!

Your real-time paper trading platform is now running. The AI models are actively trading with live crypto prices, and you can monitor everything in real-time through the dashboard.

Enjoy watching the AI models compete! 🚀
