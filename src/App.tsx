import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
export function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  return (
    <div className="min-h-screen bg-background text-foreground">
      {!isHomePage && <Navbar />}
      <main>
        <Outlet />
      </main>
    </div>
  );
}