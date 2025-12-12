import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Shield className="h-7 w-7 text-foreground transition-transform duration-300 group-hover:rotate-12" />
            <span className="text-xl font-bold text-foreground">DefLink</span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link to="/providers" className="text-muted-foreground transition-colors hover:text-foreground">
                Dienstleister
              </Link>
              <Link to="/oem/login" className="text-muted-foreground transition-colors hover:text-foreground">
                OEM Login
              </Link>
            </nav>
            <ThemeToggle className="relative top-0 right-0" />
          </div>
        </div>
      </div>
    </header>
  );
}