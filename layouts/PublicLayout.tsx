import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-950">
        <div className="section-container">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-careva-blue to-careva-teal">
                <span className="text-xs font-bold text-white">C</span>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">CAREVA</p>
                <p className="text-xs text-slate-500">Verify Skills. Connect Talent. Build Careers.</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} CAREVA · College Innovation Project
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
