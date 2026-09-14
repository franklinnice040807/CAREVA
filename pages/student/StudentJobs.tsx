import { useEffect, useState } from 'react';
import { Briefcase, MapPin, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { matchingApi } from '../../services/api';
import { Card, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { levelLabel, levelBadgeClass, formatPercent } from '../../lib/utils';
import { cn } from '../../lib/utils';

export function StudentJobsPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [matchRes, appRes] = await Promise.all([
        matchingApi.getJobMatches().catch(() => ({ success: false, data: [] })),
        matchingApi.getApplications().catch(() => ({ success: false, data: [] })),
      ]);
      if (matchRes.success && matchRes.data) setMatches(matchRes.data);
      if (appRes.success && appRes.data) setApplications(appRes.data);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }

  async function runMatching() {
    setMatching(true);
    try {
      const res = await matchingApi.getJobMatches();
      if (res.success && res.data) {
        setMatches(res.data);
        toast.success(`Found ${res.data.length} job matches`);
      }
    } catch {
      toast.error('Matching failed');
    } finally {
      setMatching(false);
    }
  }

  async function handleApply(jobId: string) {
    setApplying(true);
    try {
      await matchingApi.apply(jobId);
      toast.success('Application submitted!');
      setSelected(null);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  }

  const appliedJobIds = new Set(applications.map((a) => a.jobId));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-careva-teal border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Find Jobs</h1>
          <p className="mt-1 text-slate-500">
            CAREVA matches you to roles based on verified skills and competency.
          </p>
        </div>
        <Button variant="secondary" onClick={runMatching} loading={matching}>
          <RefreshCw className={cn('h-4 w-4', matching && 'animate-spin')} />
          Refresh Matches
        </Button>
      </div>

      {matches.length === 0 ? (
        <Card className="flex flex-col items-center py-16">
          <Briefcase className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-500">No job matches yet.</p>
          <p className="mt-1 max-w-sm text-center text-sm text-slate-400">
            Verify skills via practical demonstrations, or wait for employers to post jobs matching your trade.
          </p>
          <Button className="mt-6" variant="secondary" onClick={runMatching} loading={matching}>
            Run Matching
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {matches.map((m) => {
            const alreadyApplied = appliedJobIds.has(m.jobId);
            const gaps = (m.skillGaps as any[]) || [];
            return (
              <Card key={m.jobId} className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{m.title}</h3>
                      <span className={levelBadgeClass(m.requiredCompetency)}>
                        {levelLabel(m.requiredCompetency)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {m.companyName}
                      {m.location && (
                        <span className="ml-1 inline-flex items-center gap-0.5">
                          · <MapPin className="h-3 w-3" /> {m.location}
                        </span>
                      )}
                      {m.salaryRange && ` · ${m.salaryRange}`}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.requirements?.map((r: any) => (
                        <span
                          key={r.skillId || r.id}
                          className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {r.skill?.name || r.skillName}
                        </span>
                      ))}
                    </div>

                    {/* Match breakdown mini */}
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>Skills {m.skillMatch}%</span>
                      <span>Competency {m.competencyMatch}%</span>
                      <span>Experience {m.experienceMatch}%</span>
                      <span>Location {m.locationMatch}%</span>
                    </div>

                    {gaps.length > 0 && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>
                          Skill gap: {gaps.slice(0, 2).map((g: any) => g.skillName).join(', ')}
                          {gaps.length > 2 && ` +${gaps.length - 2} more`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-2 sm:items-end">
                    <div className="text-center">
                      <p className="text-3xl font-extrabold text-careva-teal">{formatPercent(m.overallScore)}</p>
                      <p className="text-xs text-slate-400">CAREVA Match</p>
                    </div>
                    {alreadyApplied ? (
                      <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Applied
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => setSelected(m)}>
                          Details
                        </Button>
                        <Button size="sm" onClick={() => handleApply(m.jobId)} loading={applying}>
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* My applications */}
      {applications.length > 0 && (
        <Card className="p-6">
          <CardTitle>My Applications</CardTitle>
          <CardDescription className="mt-1">Track application status.</CardDescription>
          <div className="mt-4 space-y-2">
            {applications.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{a.job?.title}</p>
                  <p className="text-xs text-slate-500">{a.job?.employer?.companyName}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold dark:bg-slate-800">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Match detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10">
          <Card className="w-full max-w-lg animate-slide-up p-6">
            <div className="mb-4 flex items-center justify-between">
              <CardTitle>{selected.title}</CardTitle>
              <button onClick={() => setSelected(null)} className="text-slate-400">✕</button>
            </div>
            <p className="text-sm text-slate-500">{selected.companyName}</p>

            <div className="mt-4 text-center">
              <p className="text-4xl font-extrabold text-careva-teal">{formatPercent(selected.overallScore)}</p>
              <p className="text-sm text-slate-400">Overall Match Score</p>
            </div>

            <div className="mt-6 space-y-3">
              {[
                { label: 'Skill Match', value: selected.skillMatch, weight: '40%' },
                { label: 'Competency', value: selected.competencyMatch, weight: '30%' },
                { label: 'Experience', value: selected.experienceMatch, weight: '15%' },
                { label: 'Location', value: selected.locationMatch, weight: '10%' },
                { label: 'Education', value: selected.educationMatch, weight: '5%' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">
                      {item.label} <span className="text-xs text-slate-400">({item.weight})</span>
                    </span>
                    <span className="font-semibold">{item.value}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-careva-teal"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {(selected.skillGaps as any[])?.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold text-amber-700 dark:text-amber-400">Skill Gaps Detected</p>
                <ul className="space-y-2">
                  {(selected.skillGaps as any[]).map((g: any, i: number) => (
                    <li key={i} className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                      <strong>{g.skillName}</strong> — {g.gapType === 'MISSING' ? 'Not verified' : `Have ${g.candidateLevel}, need ${g.requiredLevel}`}
                      <p className="mt-1 text-amber-700 dark:text-amber-300">{g.recommendation}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex gap-2">
              {!appliedJobIds.has(selected.jobId) && (
                <Button className="flex-1" onClick={() => handleApply(selected.jobId)} loading={applying}>
                  Apply Now
                </Button>
              )}
              <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
