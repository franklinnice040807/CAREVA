import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, LogOut, User, Shield, Building2 } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const dashboardPath =
    user?.role === 'STUDENT' ? '/student' : user?.role === 'EMPLOYER' ? '/employer' : '/admin';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="section-container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-careva-blue to-careva-teal">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">CAREVA</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-careva-blue dark:text-slate-300 dark:hover:text-careva-teal">
            How it Works
          </Link>
          <Link to="/#features" className="text-sm font-medium text-slate-600 hover:text-careva-blue dark:text-slate-300 dark:hover:text-careva-teal">
            Features
          </Link>
          <Link to="/#sdg" className="text-sm font-medium text-slate-600 hover:text-careva-blue dark:text-slate-300 dark:hover:text-careva-teal">
            SDG Impact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {isAuthenticated && user ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link to={dashboardPath}>
                <Button variant="ghost" size="sm">
                  {user.role === 'STUDENT' && <User className="h-4 w-4" />}
                  {user.role === 'EMPLOYER' && <Building2 className="h-4 w-4" />}
                  {user.role === 'ADMIN' && <Shield className="h-4 w-4" />}
                  {user.fullName || user.companyName || 'Dashboard'}
                </Button>
              </Link>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          )}

          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden dark:hover:bg-slate-800"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn('border-t border-slate-200 dark:border-slate-800 md:hidden', mobileOpen ? 'block' : 'hidden')}>
        <div className="section-container space-y-2 py-4">
          <Link to="/#how-it-works" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMobileOpen(false)}>
            How it Works
          </Link>
          <Link to="/#features" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMobileOpen(false)}>
            Features
          </Link>
          {isAuthenticated && user ? (
            <>
              <Link to={dashboardPath} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMobileOpen(false)}>
                Log in
              </Link>
              <Link to="/register" className="block rounded-lg px-3 py-2 text-sm font-medium text-careva-blue hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
