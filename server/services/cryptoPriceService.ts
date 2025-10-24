import WebSocket from 'ws';
import { EventEmitter } from 'events';

export interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  lastUpdate: string;
}

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'DOGEUSDT', 'XRPUSDT'];

class CryptoPriceService extends EventEmitter {
  private ws: WebSocket | null = null;
  private prices: Map<string, CryptoPrice> = new Map();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private priceHistory: Map<string, number[]> = new Map();

  constructor() {
    super();
    this.initializePrices();
  }

  private initializePrices() {
    // Initialize with default values
    SYMBOLS.forEach(symbol => {
      const shortSymbol = symbol.replace('USDT', '');
      this.prices.set(shortSymbol, {
        symbol: shortSymbol,
        price: 0,
        change24h: 0,
        volume24h: 0,
        lastUpdate: new Date().toISOString(),
      });
      this.priceHistory.set(symbol, []);
    });
  }

  public start() {
    this.connect();
  }

  private connect() {
    const streams = SYMBOLS.map(s => `${s.toLowerCase()}@ticker`).join('/');
    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

    console.log('[CryptoPriceService] Connecting to Binance WebSocket...');
    this.ws = new WebSocket(url);

    this.ws.on('open', () => {
      console.log('[CryptoPriceService] Connected to Binance');
    });

    this.ws.on('message', (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.data) {
          this.handlePriceUpdate(message.data);
        }
      } catch (error) {
        console.error('[CryptoPriceService] Error parsing message:', error);
      }
    });

    this.ws.on('error', (error) => {
      console.error('[CryptoPriceService] WebSocket error:', error);
    });

    this.ws.on('close', () => {
      console.log('[CryptoPriceService] Disconnected, reconnecting in 5s...');
      this.reconnectTimeout = setTimeout(() => this.connect(), 5000);
    });
  }

  private handlePriceUpdate(data: any) {
    const symbol = data.s.replace('USDT', ''); // BTCUSDT -> BTC
    const price = parseFloat(data.c);
    const change24h = parseFloat(data.P);
    const volume24h = parseFloat(data.v);

    // Store price history for 24h change calculation
    const history = this.priceHistory.get(data.s) || [];
    history.push(price);
    if (history.length > 100) history.shift(); // Keep last 100 prices
    this.priceHistory.set(data.s, history);

    const priceData: CryptoPrice = {
      symbol,
      price,
      change24h,
      volume24h,
      lastUpdate: new Date().toISOString(),
    };

    this.prices.set(symbol, priceData);
    this.emit('price', priceData);
  }

  public getAllPrices(): CryptoPrice[] {
    return Array.from(this.prices.values());
  }

  public getPrice(symbol: string): CryptoPrice | undefined {
    return this.prices.get(symbol);
  }

  public stop() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const cryptoPriceService = new CryptoPriceService();
