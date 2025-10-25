import Header from '@/components/Header';
import CryptoTicker from '@/components/CryptoTicker';
import PerformanceChart from '@/components/PerformanceChart';
import RightSidebar from '@/components/RightSidebar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <CryptoTicker />
      
      {/* Main Layout - nof1.ai style with sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8 max-w-6xl">
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
              <PerformanceChart />
            </div>
          </div>
        </main>
        
        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}

