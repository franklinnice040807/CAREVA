import { useEffect, useState, FormEvent } from 'react';
import { Briefcase, Plus, X, MapPin, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { employerApi } from '../../services/api';
import type { CompetencyLevel } from '../../types';
import { Card, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { levelLabel, levelBadgeClass } from '../../lib/utils';
import { cn } from '../../lib/utils';

const TRADES = ['Electrical', 'Mechanical', 'Welding', 'Automobile', 'Electronics', 'Civil', 'Computer/IT'];
const LEVELS: CompetencyLevel[] = ['BEGINNER', 'INTERMEDIATE', 'JOB_READY'];

export function EmployerJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    trade: '',
    location: '',
    salaryRange: '',
    employmentType: 'FULL_TIME',
    requiredCompetency: 'INTERMEDIATE' as CompetencyLevel,
    experienceRequired: '0',
    skillIds: [] as string[],
  });

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const [jobsRes, skillsRes] = await Promise.all([
        employerApi.getJobs(),
        employerApi.getSkillsCatalog(),
      ]);
      if (jobsRes.success && jobsRes.data) setJobs(jobsRes.data);
      if (skillsRes.success && skillsRes.data) setCatalog(skillsRes.data);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }

  function toggleSkill(id: string) {
    setForm((f) => ({
      ...f,
      skillIds: f.skillIds.includes(id) ? f.skillIds.filter((s) => s !== id) : [...f.skillIds, id],
    }));
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (form.skillIds.length === 0) {
      toast.error('Select at least one required skill');
      return;
    }
    setSaving(true);
    try {
      const res = await employerApi.createJob({
        title: form.title,
        description: form.description,
        trade: form.trade,
        location: form.location || undefined,
        salaryRange: form.salaryRange || undefined,
        employmentType: form.employmentType,
        requiredCompetency: form.requiredCompetency,
        experienceRequired: parseFloat(form.experienceRequired) || 0,
        requirements: form.skillIds.map((skillId) => ({
          skillId,
          requiredLevel: form.requiredCompetency,
        })),
      });
      if (res.success) {
        toast.success('Job posted successfully');
        setShowForm(false);
        setForm({
          title: '',
          description: '',
          trade: '',
          location: '',
          salaryRange: '',
          employmentType: 'FULL_TIME',
          requiredCompetency: 'INTERMEDIATE',
          experienceRequired: '0',
          skillIds: [],
        });
        loadJobs();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create job');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(job: any) {
    try {
      await employerApi.updateJob(job.id, { isActive: !job.isActive });
      toast.success(job.isActive ? 'Job deactivated' : 'Job activated');
      loadJobs();
    } catch {
      toast.error('Update failed');
    }
  }

  const filteredSkills = form.trade
    ? catalog.filter((s) => s.trade === form.trade)
    : catalog;

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Jobs</h1>
          <p className="mt-1 text-slate-500">Post roles and define required competencies.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Post Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card className="flex flex-col items-center py-16">
          <Briefcase className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-500">No jobs posted yet.</p>
          <Button className="mt-6" onClick={() => setShowForm(true)}>Create your first job</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{job.title}</h3>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-semibold',
                        job.isActive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500'
                      )}
                    >
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className={levelBadgeClass(job.requiredCompetency)}>
                      {levelLabel(job.requiredCompetency)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {job.trade}
                    {job.location && (
                      <span className="inline-flex items-center gap-1">
                        {' · '}
                        <MapPin className="inline h-3 w-3" />
                        {job.location}
                      </span>
                    )}
                    {job.salaryRange && ` · ${job.salaryRange}`}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {job.requirements?.map((r: any) => (
                      <span
                        key={r.id}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {r.skill.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center text-xs text-slate-500">
                    <Users className="mx-auto h-4 w-4" />
                    <p className="mt-0.5">{job._count?.applications ?? 0} apps</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => toggleActive(job)}>
                    {job.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10">
          <Card className="w-full max-w-xl animate-slide-up p-6">
            <div className="mb-4 flex items-center justify-between">
              <CardTitle>Post a Job</CardTitle>
              <button onClick={() => setShowForm(false)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                id="title"
                label="Job Title *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <div>
                <label className="label">Description *</label>
                <textarea
                  className="input min-h-[100px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  minLength={20}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Trade *</label>
                  <select
                    className="input"
                    value={form.trade}
                    onChange={(e) => setForm({ ...form, trade: e.target.value, skillIds: [] })}
                    required
                  >
                    <option value="">Select trade</option>
                    {TRADES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Required Competency</label>
                  <select
                    className="input"
                    value={form.requiredCompetency}
                    onChange={(e) =>
                      setForm({ ...form, requiredCompetency: e.target.value as CompetencyLevel })
                    }
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>{levelLabel(l)}</option>
                    ))}
                  </select>
                </div>
                <Input
                  id="location"
                  label="Location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
                <Input
                  id="salaryRange"
                  label="Salary Range"
                  value={form.salaryRange}
                  onChange={(e) => setForm({ ...form, salaryRange: e.target.value })}
                  placeholder="e.g. ₹15,000–25,000"
                />
                <div>
                  <label className="label">Employment Type</label>
                  <select
                    className="input"
                    value={form.employmentType}
                    onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
                  >
                    <option value="FULL_TIME">Full-time</option>
                    <option value="PART_TIME">Part-time</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="APPRENTICESHIP">Apprenticeship</option>
                  </select>
                </div>
                <Input
                  id="experienceRequired"
                  label="Experience (years)"
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.experienceRequired}
                  onChange={(e) => setForm({ ...form, experienceRequired: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Required Skills * (select at least one)</label>
                <div className="mt-2 flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                  {filteredSkills.length === 0 ? (
                    <p className="text-xs text-slate-400">Select a trade to see skills</p>
                  ) : (
                    filteredSkills.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSkill(s.id)}
                        className={cn(
                          'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                          form.skillIds.includes(s.id)
                            ? 'bg-careva-teal text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                        )}
                      >
                        {s.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" loading={saving}>Post Job</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
