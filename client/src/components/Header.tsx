import { Link } from 'wouter';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <img src="/logo.svg" alt="Alpha Arena" className="w-8 h-8" />
            <div className="text-lg font-bold">
              <span className="text-foreground">Alpha Arena</span>
              <span className="text-muted-foreground text-sm ml-2">by nof1</span>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" className="border border-neon-orange text-neon-orange hover:bg-neon-orange/10">
              LIVE
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="ghost" className="border border-neon-pink text-neon-pink hover:bg-neon-pink/10">
              LEADERBOARD
            </Button>
          </Link>
          <Button variant="ghost" className="border border-neon-green text-neon-green hover:bg-neon-green/10">
            MODELS
          </Button>
          <Button variant="default" className="bg-neon-pink hover:bg-neon-pink/80 text-white border-0 hidden lg:inline-flex">
            JOIN THE PLATFORM WAITLIST
          </Button>
          <Button variant="ghost" className="border border-neon-purple text-neon-purple hover:bg-neon-purple/10">
            ABOUT NOF1
          </Button>
        </nav>
      </div>
    </header>
  );
}

