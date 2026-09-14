import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, UserCheck, Award, Plus, Search, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { employerApi } from '../../services/api';
import { Card, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { levelLabel, levelBadgeClass } from '../../lib/utils';

export function EmployerDashboard() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employerApi
      .getDashboard()
      .then((res) => {
        if (res.success && res.data) setStats(res.data);
      })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Active Jobs', value: stats?.activeJobs ?? 0, icon: Briefcase, color: 'text-careva-blue' },
    { label: 'Candidates Matched', value: stats?.candidatesMatched ?? 0, icon: Users, color: 'text-careva-teal' },
    { label: 'Applications', value: stats?.applications ?? 0, icon: UserCheck, color: 'text-amber-600' },
    { label: 'Shortlisted', value: stats?.shortlisted ?? 0, icon: Award, color: 'text-emerald-600' },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            {user?.companyName || 'Employer Dashboard'}
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Find verified vocational talent with CAREVA matching.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/employer/jobs">
            <Button variant="primary" size="sm">
              <Plus className="h-4 w-4" />
              Post Job
            </Button>
          </Link>
          <Link to="/employer/candidates">
            <Button variant="secondary" size="sm">
              <Search className="h-4 w-4" />
              Find Talent
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((s) => {
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Recommended Candidates</CardTitle>
          <CardDescription className="mt-1">Top matched talent for your active jobs.</CardDescription>
          {!stats?.topMatches?.length ? (
            <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-slate-200 py-10 dark:border-slate-700">
              <Users className="h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">Post a job to receive candidate matches.</p>
              <Link to="/employer/jobs" className="mt-3">
                <Button variant="secondary" size="sm">Create Job</Button>
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {stats.topMatches.map((m: any) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{m.student?.fullName}</p>
                    <p className="text-xs text-slate-500">
                      {m.student?.trade}
                      {m.student?.location && ` · ${m.student.location}`}
                      {' · '}
                      {m.job?.title}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-careva-teal">
                    {Math.round(m.overallScore)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription className="mt-1">Latest candidate applications.</CardDescription>
            </div>
            <Link to="/employer/applications" className="text-sm font-medium text-careva-blue dark:text-careva-teal">
              View all
            </Link>
          </div>
          {!stats?.recentApplications?.length ? (
            <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-slate-200 py-10 dark:border-slate-700">
              <UserCheck className="h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No applications yet.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {stats.recentApplications.slice(0, 5).map((a: any) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{a.student?.fullName}</p>
                    <p className="text-xs text-slate-500">{a.job?.title}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium dark:bg-slate-800">
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
