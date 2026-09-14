import { useEffect, useState } from 'react';
import { Users, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { employerApi } from '../../services/api';
import { Card, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';

const PIPELINE = ['APPLIED', 'REVIEWED', 'SHORTLISTED', 'ASSESSMENT', 'SELECTED', 'HIRED', 'REJECTED'] as const;

const statusColors: Record<string, string> = {
  APPLIED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  REVIEWED: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  SHORTLISTED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  ASSESSMENT: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  SELECTED: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  HIRED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

export function EmployerApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await employerApi.getApplications();
      if (res.success && res.data) setApplications(res.data);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await employerApi.updateApplication(id, status);
      toast.success(`Status updated to ${status}`);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Update failed');
    }
  }

  const filtered = filter
    ? applications.filter((a) => a.status === filter)
    : applications;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-careva-teal border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Applications</h1>
        <p className="mt-1 text-slate-500">Manage candidate applications through the hiring pipeline.</p>
      </div>

      {/* Pipeline filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('')}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold',
            !filter ? 'bg-careva-blue text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          )}
        >
          All ({applications.length})
        </button>
        {PIPELINE.map((s) => {
          const count = applications.filter((a) => a.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold',
                filter === s ? 'bg-careva-blue text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              )}
            >
              {s.replace('_', ' ')} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center py-16">
          <Users className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-500">No applications yet.</p>
          <p className="mt-1 text-sm text-slate-400">Candidates will appear here when they apply to your jobs.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <Card key={app.id} className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {app.student?.fullName}
                    </h3>
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', statusColors[app.status])}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Applied for <strong>{app.job?.title}</strong>
                    {app.student?.trade && ` · ${app.student.trade}`}
                    {app.student?.location && ` · ${app.student.location}`}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {app.student?.skills?.slice(0, 4).map((s: any) => (
                      <span
                        key={s.id}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800"
                      >
                        {s.skill.name}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {app.status === 'APPLIED' && (
                    <>
                      <Button size="sm" variant="secondary" onClick={() => updateStatus(app.id, 'REVIEWED')}>
                        Mark Reviewed
                      </Button>
                      <Button size="sm" variant="accent" onClick={() => updateStatus(app.id, 'SHORTLISTED')}>
                        Shortlist
                      </Button>
                    </>
                  )}
                  {app.status === 'REVIEWED' && (
                    <Button size="sm" variant="accent" onClick={() => updateStatus(app.id, 'SHORTLISTED')}>
                      Shortlist
                    </Button>
                  )}
                  {app.status === 'SHORTLISTED' && (
                    <Button size="sm" variant="primary" onClick={() => updateStatus(app.id, 'ASSESSMENT')}>
                      Invite Assessment
                    </Button>
                  )}
                  {app.status === 'ASSESSMENT' && (
                    <Button size="sm" variant="accent" onClick={() => updateStatus(app.id, 'SELECTED')}>
                      Select
                    </Button>
                  )}
                  {app.status === 'SELECTED' && (
                    <Button size="sm" variant="accent" onClick={() => updateStatus(app.id, 'HIRED')}>
                      Mark Hired
                    </Button>
                  )}
                  {!['HIRED', 'REJECTED'].includes(app.status) && (
                    <Button size="sm" variant="ghost" onClick={() => updateStatus(app.id, 'REJECTED')}>
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
