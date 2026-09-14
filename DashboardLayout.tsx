import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { useState } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';
import {
  LayoutDashboard, User, Award, Briefcase, FileText, Search,
  Building2, Users, BarChart3, Settings, BookOpen, Target, Bell,
} from 'lucide-react';

const studentLinks = [
  { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/profile', icon: User, label: 'Profile' },
  { to: '/student/skills', icon: Award, label: 'Skills' },
  { to: '/student/submissions', icon: FileText, label: 'Practical Demos' },
  { to: '/student/passport', icon: Shield, label: 'Skill Passport' },
  { to: '/student/jobs', icon: Briefcase, label: 'Find Jobs' },
  { to: '/student/insights', icon: Target, label: 'Career Insights' },
];

const employerLinks = [
  { to: '/employer', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employer/profile', icon: Building2, label: 'Company' },
  { to: '/employer/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/employer/candidates', icon: Search, label: 'Find Talent' },
  { to: '/employer/applications', icon: Users, label: 'Applications' },
  { to: '/employer/feedback', icon: Award, label: 'Feedback' },
];

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/skills', icon: BookOpen, label: 'Skills' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function DashboardLayout() {
  const [mobileNav, setMobileNav] = useState(false);
  const { user } = useAuthStore();
  const location = useLocation();

  const links =
    user?.role === 'STUDENT' ? studentLinks : user?.role === 'EMPLOYER' ? employerLinks : adminLinks;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Top bar for mobile */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-careva-blue to-careva-teal">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold">CAREVA</span>
        </Link>
        <button onClick={() => setMobileNav(!mobileNav)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileNav && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileNav(false)}>
          <div className="absolute left-0 top-14 h-[calc(100%-3.5rem)] w-64 bg-white p-3 dark:bg-slate-950" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-1">
              {links.map((link) => {
                const active = location.pathname === link.to;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileNav(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                      active ? 'bg-careva-blue/10 text-careva-blue' : 'text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          <div className="hidden lg:block">
            <Navbar />
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
