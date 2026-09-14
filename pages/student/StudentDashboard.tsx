import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award, Briefcase, FileText, Shield, Plus, TrendingUp, Target, ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { studentApi } from '../../services/api';
import type { DashboardStats } from '../../types';
import { Card, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { levelLabel, levelBadgeClass, formatPercent } from '../../lib/utils';

export function StudentDashboard() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await studentApi.getDashboard();
      if (res.success && res.data) setStats(res.data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      label: 'Profile Completion',
      value: `${stats?.profileCompletion ?? user?.profileCompletion ?? 0}%`,
      icon: Target,
      color: 'text-careva-blue',
    },
    {
      label: 'Verified Skills',
      value: String(stats?.verifiedSkillsCount ?? 0),
      icon: Award,
      color: 'text-careva-teal',
    },
    {
      label: 'Overall Competency',
      value: stats?.overallCompetencyScore ? `${stats.overallCompetencyScore}%` : '—',
      icon: TrendingUp,
      color: 'text-emerald-600',
    },
    {
      label: 'Job Matches',
      value: String(stats?.jobMatchesCount ?? 0),
      icon: Briefcase,
      color: 'text-amber-600',
    },
  ];

  const quickActions = [
    { to: '/student/skills', label: 'Add Skill', icon: Plus },
    { to: '/student/submissions', label: 'Submit Practical Demo', icon: FileText },
    { to: '/student/passport', label: 'View Skill Passport', icon: Shield },
    { to: '/student/jobs', label: 'Find Jobs', icon: Briefcase },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Welcome back, {user?.fullName || 'Student'}
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Your CAREVA journey to verified skills and career opportunities.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                    {loading ? '…' : s.value}
                  </p>
                </div>
                <div className={`rounded-lg bg-slate-100 p-2.5 dark:bg-slate-800 ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.to} to={a.to}>
                <Card className="flex items-center gap-3 p-4 transition-shadow hover:shadow-soft">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-careva-blue/10 text-careva-blue dark:bg-careva-teal/20 dark:text-careva-teal">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{a.label}</span>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {(stats?.pendingSubmissions ?? 0) > 0 && (
        <Card className="flex items-center justify-between border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              You have <strong>{stats!.pendingSubmissions}</strong> practical demonstration(s) awaiting evaluation.
            </p>
          </div>
          <Link to="/student/submissions">
            <Button variant="secondary" size="sm">View</Button>
          </Link>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recommended Jobs</CardTitle>
            <CardDescription className="mt-1">Jobs matched to your verified skills.</CardDescription>
          </div>
          <Link to="/student/jobs" className="text-sm font-medium text-careva-blue hover:underline dark:text-careva-teal">
            View all
          </Link>
        </div>

        {!stats?.recentMatches?.length ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-12 dark:border-slate-700">
            <Briefcase className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="mt-3 text-sm text-slate-500">
              Complete your profile and get skills verified to see matches.
            </p>
            <Link to="/student/skills" className="mt-4">
              <Button variant="secondary" size="sm">Add Skills</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {stats.recentMatches.map((m) => (
              <div
                key={m.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700"
              >
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{m.job.title}</h3>
                  <p className="text-sm text-slate-500">
                    {m.job.employer.companyName}
                    {m.job.location && ` · ${m.job.location}`}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.job.requirements.slice(0, 3).map((r) => (
                      <span key={r.skill.id} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {r.skill.name}
                      </span>
                    ))}
                    <span className={levelBadgeClass(m.job.requiredCompetency)}>
                      {levelLabel(m.job.requiredCompetency)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-careva-teal">{formatPercent(m.overallScore)}</p>
                    <p className="text-xs text-slate-400">Match</p>
                  </div>
                  <Button size="sm" variant="primary">
                    Apply
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
