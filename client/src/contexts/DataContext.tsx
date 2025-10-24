import { createContext, useContext, type ReactNode } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import type { CryptoPrice, AIModel, Trade, AIReasoning } from '@/lib/mockData';

interface DataContextValue {
  prices: CryptoPrice[];
  modelStates: AIModel[];
  recentTrades: Trade[];
  recentDecisions: AIReasoning[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const data = useWebSocket();

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
