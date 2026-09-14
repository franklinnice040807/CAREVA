import { useEffect, useState } from 'react';
import { Search, MapPin, Award, Eye, UserPlus, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { employerApi } from '../../services/api';
import type { CompetencyLevel } from '../../types';
import { Card, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { levelLabel, levelBadgeClass } from '../../lib/utils';
import { cn } from '../../lib/utils';

const TRADES = ['Electrical', 'Mechanical', 'Welding', 'Automobile', 'Electronics', 'Civil', 'Computer/IT'];
const LEVELS: CompetencyLevel[] = ['BEGINNER', 'INTERMEDIATE', 'JOB_READY'];

export function EmployerCandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    trade: '',
    competency: '',
    location: '',
    sort: 'score',
  });

  useEffect(() => {
    search();
  }, []);

  async function search() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filters.trade) params.trade = filters.trade;
      if (filters.competency) params.competency = filters.competency;
      if (filters.location) params.location = filters.location;
      if (filters.sort) params.sort = filters.sort;
      const res = await employerApi.searchCandidates(params);
      if (res.success && res.data) setCandidates(res.data);
    } catch {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  }

  async function viewPassport(studentId: string) {
    try {
      const res = await employerApi.getCandidate(studentId);
      if (res.success && res.data) setViewing(res.data);
    } catch {
      toast.error('Failed to load candidate');
    }
  }

  async function handleShortlist(studentId: string) {
    try {
      await employerApi.shortlist(studentId);
      toast.success('Candidate shortlisted');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Shortlist failed');
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Find Talent</h1>
        <p className="mt-1 text-slate-500">Search CAREVA-verified vocational candidates.</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="label">Trade</label>
            <select
              className="input"
              value={filters.trade}
              onChange={(e) => setFilters({ ...filters, trade: e.target.value })}
            >
              <option value="">All trades</option>
              {TRADES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Competency</label>
            <select
              className="input"
              value={filters.competency}
              onChange={(e) => setFilters({ ...filters, competency: e.target.value })}
            >
              <option value="">Any level</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>{levelLabel(l)}</option>
              ))}
            </select>
          </div>
          <Input
            id="location"
            label="Location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            placeholder="City"
          />
          <div>
            <label className="label">Sort by</label>
            <select
              className="input"
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            >
              <option value="score">Highest Skill Score</option>
              <option value="experience">Most Experienced</option>
              <option value="recent">Recently Verified</option>
              <option value="match">Best Match</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={search}>
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-careva-teal border-t-transparent" />
        </div>
      ) : candidates.length === 0 ? (
        <Card className="flex flex-col items-center py-16">
          <Search className="h-10 w-10 text-slate-300" />
          <p className="mt-4 text-slate-500">No candidates found. Try different filters.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {candidates.map((c) => (
            <Card key={c.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{c.fullName}</h3>
                  <p className="text-sm text-slate-500">
                    {c.trade}
                    {c.location && (
                      <span className="ml-1 inline-flex items-center gap-0.5">
                        · <MapPin className="h-3 w-3" /> {c.location}
                      </span>
                    )}
                  </p>
                </div>
                {c.avgCompetency > 0 && (
                  <div className="text-right">
                    <p className="text-lg font-bold text-careva-teal">{c.avgCompetency}%</p>
                    <p className="text-[10px] text-slate-400">Avg score</p>
                  </div>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {c.skills?.slice(0, 4).map((s: any) => (
                  <span
                    key={s.id}
                    className={cn('text-xs', levelBadgeClass(s.verifiedLevel || 'BEGINNER'))}
                  >
                    {s.skill.name}
                  </span>
                ))}
                {(c.skills?.length || 0) > 4 && (
                  <span className="text-xs text-slate-400">+{c.skills.length - 4}</span>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {c.verifiedSkillsCount} verified · {c.experienceYears} yrs exp
              </p>
              <div className="mt-auto flex gap-2 pt-4">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => viewPassport(c.id)}>
                  <Eye className="h-3.5 w-3.5" />
                  Passport
                </Button>
                <Button variant="accent" size="sm" className="flex-1" onClick={() => handleShortlist(c.id)}>
                  <UserPlus className="h-3.5 w-3.5" />
                  Shortlist
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Candidate passport modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10">
          <Card className="w-full max-w-lg animate-slide-up p-6">
            <div className="mb-4 flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-careva-teal" />
                Skill Passport
              </CardTitle>
              <button onClick={() => setViewing(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{viewing.fullName}</h3>
                <p className="text-sm text-slate-500">
                  {[viewing.trade, viewing.location, viewing.institute].filter(Boolean).join(' · ')}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-400">CAREVA ID: {viewing.carevaId}</p>
              </div>
              {viewing.about && (
                <p className="text-sm text-slate-600 dark:text-slate-300">{viewing.about}</p>
              )}
              <div>
                <p className="mb-2 text-sm font-semibold">Verified Skills</p>
                {viewing.skills?.length === 0 ? (
                  <p className="text-sm text-slate-400">No verified skills yet</p>
                ) : (
                  <div className="space-y-2">
                    {viewing.skills.map((s: any) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
                      >
                        <div>
                          <p className="text-sm font-medium">{s.skill.name}</p>
                          <p className="text-xs text-slate-400">{s.skill.trade}</p>
                        </div>
                        <div className="text-right">
                          <span className={levelBadgeClass(s.verifiedLevel || 'BEGINNER')}>
                            {levelLabel(s.verifiedLevel || 'BEGINNER')}
                          </span>
                          {s.competencyScore != null && (
                            <p className="mt-0.5 text-xs font-bold text-careva-teal">
                              {Math.round(s.competencyScore)}%
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="accent"
                  className="flex-1"
                  onClick={() => {
                    handleShortlist(viewing.id);
                    setViewing(null);
                  }}
                >
                  <UserPlus className="h-4 w-4" />
                  Shortlist
                </Button>
                <Button variant="secondary" onClick={() => setViewing(null)}>Close</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
