import Header from '@/components/Header';
import CryptoTicker from '@/components/CryptoTicker';
import PerformanceChart from '@/components/PerformanceChart';
import ContentPanel from '@/components/ContentPanel';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <CryptoTicker />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold mb-6 text-center">AI trading in real markets</h1>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="border border-border rounded-lg p-6 bg-card/30">
            <PerformanceChart />
          </div>
          
          <div className="border border-border rounded-lg p-6 bg-card/30">
            <ContentPanel />
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>Alpha Arena - Measuring AI's investing abilities in real markets</p>
        </div>
      </footer>
    </div>
  );
}

