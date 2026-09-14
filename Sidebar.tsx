import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Search,
  Building2,
  Users,
  Award,
  BarChart3,
  Settings,
  Shield,
  BookOpen,
  Target,
  Bell,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';

const studentLinks = [
  { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/profile', icon: User, label: 'Profile' },
  { to: '/student/skills', icon: Award, label: 'Skills' },
  { to: '/student/submissions', icon: FileText, label: 'Practical Demos' },
  { to: '/student/passport', icon: Shield, label: 'Skill Passport' },
  { to: '/student/jobs', icon: Briefcase, label: 'Find Jobs' },
  { to: '/student/insights', icon: Target, label: 'Career Insights' },
  { to: '/student/notifications', icon: Bell, label: 'Notifications' },
];

const employerLinks = [
  { to: '/employer', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employer/profile', icon: Building2, label: 'Company Profile' },
  { to: '/employer/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/employer/candidates', icon: Search, label: 'Find Talent' },
  { to: '/employer/applications', icon: Users, label: 'Applications' },
  { to: '/employer/feedback', icon: Award, label: 'Feedback' },
  { to: '/employer/notifications', icon: Bell, label: 'Notifications' },
];

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/skills', icon: BookOpen, label: 'Skills' },
  { to: '/admin/submissions', icon: FileText, label: 'Submissions' },
  { to: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { user } = useAuthStore();
  const location = useLocation();

  const links =
    user?.role === 'STUDENT'
      ? studentLinks
      : user?.role === 'EMPLOYER'
        ? employerLinks
        : adminLinks;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-careva-blue to-careva-teal">
            <Shield className="h-4 w-4 text-white" />
          </div>

          <span className="font-bold text-slate-900 dark:text-white">
            CAREVA
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map((link) => {
            const active =
              location.pathname === link.to ||
              (link.to !== '/student' &&
                link.to !== '/employer' &&
                link.to !== '/admin' &&
                location.pathname.startsWith(link.to));

            const Icon = link.icon;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-careva-blue/10 text-careva-blue dark:bg-careva-teal/20 dark:text-careva-teal'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                )}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {user?.role === 'STUDENT' && user.fullName}
            {user?.role === 'EMPLOYER' && user.companyName}
            {user?.role === 'ADMIN' && 'Administrator'}
          </p>

          <p className="truncate text-xs text-slate-400">
            {user?.email}
          </p>
        </div>
      </div>
    </aside>
  );
}