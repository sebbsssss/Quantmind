import axios from 'axios';

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: Date;
}

export class MarketDataService {
  private baseURL = 'https://api.coingecko.com/api/v3';
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async getCurrentPrices(symbols: string[] = ['bitcoin', 'ethereum', 'solana']): Promise<CryptoPrice[]> {
    try {
      const ids = symbols.join(',');
      const response = await axios.get(`${this.baseURL}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids,
          order: 'market_cap_desc',
          per_page: symbols.length,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h',
        },
        headers: this.apiKey ? { 'x-cg-pro-api-key': this.apiKey } : {},
      });

      return response.data.map((coin: any) => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        priceChange24h: coin.price_change_percentage_24h || 0,
        volume24h: coin.total_volume,
        marketCap: coin.market_cap,
        lastUpdated: new Date(coin.last_updated),
      }));
    } catch (error: any) {
      console.error('CoinGecko API Error:', error.response?.data || error.message);
      // Return mock data as fallback
      return this.getMockPrices(symbols);
    }
  }

  async getTopCryptos(limit: number = 15): Promise<CryptoPrice[]> {
    try {
      const response = await axios.get(`${this.baseURL}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h',
        },
        headers: this.apiKey ? { 'x-cg-pro-api-key': this.apiKey } : {},
      });

      return response.data.map((coin: any) => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        priceChange24h: coin.price_change_percentage_24h || 0,
        volume24h: coin.total_volume,
        marketCap: coin.market_cap,
        lastUpdated: new Date(coin.last_updated),
      }));
    } catch (error: any) {
      console.error('Failed to fetch top cryptos:', error.message);
      return this.getMockPrices(['bitcoin', 'ethereum', 'solana']);
    }
  }

  private getMockPrices(symbols: string[]): CryptoPrice[] {
    const mockData: Record<string, Partial<CryptoPrice>> = {
      bitcoin: { symbol: 'BTC', name: 'Bitcoin', price: 67500, priceChange24h: 2.5, volume24h: 28000000000, marketCap: 1320000000000 },
      ethereum: { symbol: 'ETH', name: 'Ethereum', price: 3200, priceChange24h: 1.8, volume24h: 15000000000, marketCap: 385000000000 },
      solana: { symbol: 'SOL', name: 'Solana', price: 145, priceChange24h: -1.2, volume24h: 2500000000, marketCap: 65000000000 },
      cardano: { symbol: 'ADA', name: 'Cardano', price: 0.58, priceChange24h: 0.5, volume24h: 450000000, marketCap: 20000000000 },
      dogecoin: { symbol: 'DOGE', name: 'Dogecoin', price: 0.12, priceChange24h: 3.2, volume24h: 800000000, marketCap: 17000000000 },
    };

    return symbols.map(id => {
      const mock = mockData[id.toLowerCase()] || mockData.bitcoin;
      return {
        symbol: mock.symbol!,
        name: mock.name!,
        price: mock.price! * (1 + (Math.random() - 0.5) * 0.02), // Add 1% random variation
        priceChange24h: mock.priceChange24h!,
        volume24h: mock.volume24h!,
        marketCap: mock.marketCap!,
        lastUpdated: new Date(),
      };
    });
  }

  async getPriceHistory(symbol: string, days: number = 7): Promise<Array<{ timestamp: Date; price: number }>> {
    try {
      const response = await axios.get(`${this.baseURL}/coins/${symbol.toLowerCase()}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days,
          interval: 'hourly',
        },
        headers: this.apiKey ? { 'x-cg-pro-api-key': this.apiKey } : {},
      });

      return response.data.prices.map(([timestamp, price]: [number, number]) => ({
        timestamp: new Date(timestamp),
        price,
      }));
    } catch (error: any) {
      console.error('Failed to fetch price history:', error.message);
      return [];
    }
  }
}

export default MarketDataService;

