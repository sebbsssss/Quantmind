import Header from '@/components/Header';
import CryptoTicker from '@/components/CryptoTicker';
import PerformanceChart from '@/components/PerformanceChart';
import ContentPanel from '@/components/ContentPanel';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <CryptoTicker />
      
      <main className="flex-1 container mx-auto px-6 py-12 max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">AI Trading Arena</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The first benchmark measuring AI investment capabilities in real markets with real capital
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <PerformanceChart />
          </div>
          
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <ContentPanel />
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground bg-white">
        <div className="container mx-auto px-6">
          <p>Alpha Arena · Measuring artificial intelligence in financial markets</p>
        </div>
      </footer>
    </div>
  );
}

