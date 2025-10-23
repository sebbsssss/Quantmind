# QuantMind Backend Setup Guide

This guide will help you set up the QuantMind backend with OpenRouter AI integration and paper trading functionality.

## Prerequisites

- Node.js 22.x or higher
- pnpm (recommended) or npm
- OpenRouter API key ([Get one here](https://openrouter.ai/))
- CoinGecko API key (optional, free tier works without key)

## Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Required: OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_APP_NAME=QuantMind
OPENROUTER_APP_URL=https://quantmind.vercel.app

# AI Model Configuration
DEFAULT_AI_MODEL=anthropic/claude-3.5-sonnet
AI_MODEL_ROTATION=openai/gpt-4o,anthropic/claude-3.5-sonnet,google/gemini-2.0-flash-exp,deepseek/deepseek-chat

# Paper Trading Configuration
INITIAL_PORTFOLIO_VALUE=100000
MAX_POSITION_SIZE=0.10
TRADING_CYCLE_MINUTES=30

# Optional: Market Data API
COINGECKO_API_KEY=optional_for_free_tier

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Getting Your OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up or log in
3. Go to [API Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Add credits to your account (minimum $5 recommended)
6. Copy the API key to your `.env` file

## Installation

```bash
# Install dependencies
pnpm install

# Start development server (frontend + API)
pnpm dev
```

The server will start on `http://localhost:3000` with API available at `http://localhost:3000/api`

## API Endpoints

### Trading Bot Control

**Start Trading Bot**
```bash
POST /api/bot/start
```
Starts the trading bot with configured AI models and begins 30-minute trading cycles.

**Stop Trading Bot**
```bash
POST /api/bot/stop
```
Stops the trading bot.

**Get Bot Status**
```bash
GET /api/bot/status
```
Returns current bot status, cycle number, and portfolio state.

### Market Data

**Get Current Prices**
```bash
GET /api/market/prices?symbols=bitcoin,ethereum,solana
```
Returns current cryptocurrency prices from CoinGecko.

**Get Top Cryptocurrencies**
```bash
GET /api/market/top?limit=15
```
Returns top cryptocurrencies by market cap.

### Portfolio

**Get Portfolio Summary**
```bash
GET /api/portfolio
```
Returns current portfolio value, positions, and P&L.

### Health Check

**Health Check**
```bash
GET /api/health
```
Returns server health status.

## How It Works

### 1. Trading Cycle (Every 30 Minutes)

1. **Fetch Market Data** - Get current prices from CoinGecko
2. **Update Portfolio** - Calculate unrealized P&L for open positions
3. **Query AI Models** - Each configured AI model analyzes market data
4. **Calculate Consensus** - Aggregate decisions from all models
5. **Execute Trades** - Open or close positions based on consensus
6. **Log Results** - Record all decisions and trades

### 2. AI Decision Making

Each AI model receives:
- Current market data (price, 24h change, volume)
- Portfolio state (total value, cash, positions)

And returns:
- Action: BUY, SELL, or HOLD
- Symbol: Which cryptocurrency to trade
- Confidence: 0-100% confidence in the decision
- Reasoning: Explanation of the decision

### 3. Paper Trading Engine

- Starts with $100,000 virtual capital
- Maximum 10% of portfolio per position
- Tracks all positions with entry price, current price, and P&L
- No real money involved - all trades are simulated

### 4. Multi-Model Consensus

The system queries multiple AI models and uses majority voting:
- If 3/4 models say BUY → Execute BUY
- If 2/4 models say SELL → May execute SELL if confidence is high
- Requires >60% confidence to execute trades

## Testing the Bot

### 1. Start the Bot

```bash
curl -X POST http://localhost:3000/api/bot/start
```

### 2. Check Status

```bash
curl http://localhost:3000/api/bot/status
```

### 3. View Portfolio

```bash
curl http://localhost:3000/api/portfolio
```

### 4. Monitor Logs

Watch the server console for real-time trading activity:
```
🔄 Starting Trading Cycle #1
⏰ 2025-10-23T12:30:00.000Z

📊 Fetching market data...
Fetched 3 prices: BTC: $67500.00 (+2.50%), ETH: $3200.00 (+1.80%), SOL: $145.00 (-1.20%)

💼 Portfolio Summary:
  Total Value: $100,000.00
  Cash: $100,000.00
  Positions: $0.00
  Total P&L: $0.00 (0.00%)
  Open Positions: 0

🤖 Querying 4 AI models for trading decisions...
  openai/gpt-4o → BUY BTC (confidence: 75%)
  anthropic/claude-3.5-sonnet → BUY BTC (confidence: 68%)
  google/gemini-2.0-flash-exp → HOLD BTC (confidence: 55%)
  deepseek/deepseek-chat → BUY ETH (confidence: 72%)

🎯 Consensus Decision: BUY BTC (confidence: 71.5%)
   Reasoning: Consensus: 2/4 models voted BUY...

✅ Executed BUY: 0.15 BTC @ $67500
```

## Cost Estimates

### OpenRouter API Costs

Costs vary by model and usage:

| Model | Cost per 1M tokens | Estimated cost per cycle |
|-------|-------------------|-------------------------|
| GPT-4o | $2.50 / $10.00 | $0.01 - $0.02 |
| Claude 3.5 Sonnet | $3.00 / $15.00 | $0.01 - $0.03 |
| Gemini 2.0 Flash | $0.10 / $0.40 | $0.001 - $0.002 |
| DeepSeek Chat | $0.14 / $0.28 | $0.001 - $0.002 |

**Monthly estimates (30-minute cycles, 4 models):**
- ~48 cycles/day × 30 days = 1,440 cycles/month
- Cost: **$13-65/month** depending on models used

**Tip:** Start with cheaper models (Gemini, DeepSeek) for testing!

## Production Deployment

### Railway (Recommended)

1. Push code to GitHub
2. Connect Railway to your repository
3. Add environment variables in Railway dashboard
4. Deploy automatically

### Environment Variables for Production

```bash
NODE_ENV=production
PORT=3000
OPENROUTER_API_KEY=sk-or-v1-xxxxx
DATABASE_URL=postgresql://...
```

## Troubleshooting

### Bot won't start

**Error:** `OPENROUTER_API_KEY not configured`
- Make sure `.env` file exists with valid API key
- Restart the server after adding `.env`

### API calls failing

**Error:** `OpenRouter API failed: Insufficient credits`
- Add credits to your OpenRouter account
- Check your balance at https://openrouter.ai/credits

### No trades executing

**Possible causes:**
- AI models returning low confidence (<60%)
- Insufficient cash balance
- Position size limits reached
- Check server logs for detailed reasoning

### Market data not updating

**Error:** `CoinGecko API Error: 429 Too Many Requests`
- Free tier has rate limits (50 calls/minute)
- Add `COINGECKO_API_KEY` for higher limits
- Or reduce trading cycle frequency

## Next Steps

1. **Test with paper trading** - Run for a few days to see how models perform
2. **Analyze results** - Check which AI models make better decisions
3. **Tune parameters** - Adjust confidence thresholds, position sizes
4. **Add more models** - Experiment with different AI models from OpenRouter
5. **Build dashboard** - Create frontend to visualize trading activity

## Security Notes

- **Never commit `.env` file** - It contains your API keys
- **Use environment variables** - In production, use platform secrets
- **Monitor API usage** - Set spending limits on OpenRouter
- **This is paper trading** - No real money at risk

## Support

- OpenRouter Docs: https://openrouter.ai/docs
- CoinGecko API: https://www.coingecko.com/en/api
- GitHub Issues: https://github.com/sebbsssss/quantmind/issues

---

**Happy Trading! 🚀📈**

