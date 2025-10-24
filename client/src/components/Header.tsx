import { Link } from 'wouter';
import { Button } from './ui/button';
import ThemeToggle from './ThemeToggle';
import { useData } from '@/contexts/DataContext';

export default function Header() {
  const { connectionStatus } = useData();
  
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-accent-green';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-gray-400';
      case 'error': return 'bg-accent-red';
      default: return 'bg-gray-400';
    }
  };
  
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 hover:opacity-70 transition-opacity cursor-pointer">
            <div className="text-2xl font-semibold tracking-tight">
              <span className="text-foreground">QuantMind</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} />
              <span className="capitalize">{connectionStatus}</span>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/">
            <Button variant="ghost" className="text-base font-normal hover:bg-accent">
              Live
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="ghost" className="text-base font-normal hover:bg-accent">
              Leaderboard
            </Button>
          </Link>
          <Button variant="ghost" className="text-base font-normal hover:bg-accent">
            Models
          </Button>
          <Button variant="ghost" className="text-base font-normal hover:bg-accent">
            About
          </Button>
          <Button variant="default" className="ml-2 bg-foreground text-background hover:bg-foreground/90">
            Join Waitlist
          </Button>
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}

