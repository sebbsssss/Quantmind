import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import apiRoutes from './routes/api';
import { cryptoPriceService } from './services/cryptoPriceService';
import { paperTradingEngine } from './services/paperTradingEngine';
import { aiDecisionSimulator } from './services/aiDecisionSimulator';
import { database } from './services/database';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Initialize WebSocket server
  const wss = new WebSocketServer({ server, path: '/ws' });
  
  console.log('[Server] Initializing services...');
  
  // Start services
  cryptoPriceService.start();
  aiDecisionSimulator.start();
  
  // Save performance snapshots every 5 minutes
  setInterval(() => {
    paperTradingEngine.saveSnapshot();
  }, 5 * 60 * 1000);
  
  // WebSocket connection handler
  wss.on('connection', (ws) => {
    console.log('[WebSocket] Client connected');
    
    // Send initial state
    ws.send(JSON.stringify({
      type: 'init',
      data: {
        prices: cryptoPriceService.getAllPrices(),
        modelStates: paperTradingEngine.getAllModelStates(),
        recentTrades: database.getRecentTrades(20),
        recentDecisions: database.getRecentDecisions(4),
      }
    }));
    
    // Listen for price updates
    const priceHandler = (price: any) => {
      if (ws.readyState === 1) { // OPEN
        ws.send(JSON.stringify({ type: 'price', data: price }));
      }
    };
    
    // Listen for state updates
    const stateHandler = (states: any) => {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({ type: 'modelStates', data: states }));
      }
    };
    
    // Listen for trade executions
    const tradeHandler = (trade: any) => {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({ type: 'trade', data: trade }));
      }
    };
    
    // Listen for AI decisions
    const decisionHandler = (decision: any) => {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({ type: 'decision', data: decision }));
      }
    };
    
    cryptoPriceService.on('price', priceHandler);
    paperTradingEngine.on('stateUpdate', stateHandler);
    paperTradingEngine.on('tradeExecuted', tradeHandler);
    aiDecisionSimulator.on('decision', decisionHandler);
    
    ws.on('close', () => {
      console.log('[WebSocket] Client disconnected');
      cryptoPriceService.off('price', priceHandler);
      paperTradingEngine.off('stateUpdate', stateHandler);
      paperTradingEngine.off('tradeExecuted', tradeHandler);
      aiDecisionSimulator.off('decision', decisionHandler);
    });
    
    ws.on('error', (error) => {
      console.error('[WebSocket] Error:', error);
    });
  });

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.use('/api', apiRoutes);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`🚀 QuantMind server running on http://localhost:${port}/`);
    console.log(`📊 API available at http://localhost:${port}/api`);
    console.log(`🔌 WebSocket available at ws://localhost:${port}/ws`);
    console.log('✅ Real-time crypto prices streaming from Binance');
    console.log('🤖 AI trading simulator active');
  });
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n[Server] Shutting down gracefully...');
    cryptoPriceService.stop();
    aiDecisionSimulator.stop();
    database.close();
    wss.close();
    server.close(() => {
      console.log('[Server] Shutdown complete');
      process.exit(0);
    });
  });
}

startServer().catch(console.error);

