import { useEffect, useState, FormEvent } from 'react';
import { FileText, Plus, X, Upload, Clock, CheckCircle2, AlertCircle, Eye, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { studentApi, evaluationApi } from '../../services/api';
import type { SkillSubmission, Skill, SubmissionStatus } from '../../types';
import { Card, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EvaluationResultView, type EvaluationData } from './EvaluationResult';
import { cn } from '../../lib/utils';

const statusConfig: Record<SubmissionStatus, { label: string; className: string; icon: typeof Clock }> = {
  SUBMITTED: { label: 'Submitted', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300', icon: Clock },
  UNDER_EVALUATION: { label: 'Under Evaluation', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300', icon: Clock },
  EVALUATION_COMPLETE: { label: 'Evaluation Complete', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300', icon: Eye },
  VERIFIED: { label: 'Verified', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300', icon: CheckCircle2 },
  NEEDS_IMPROVEMENT: { label: 'Needs Improvement', className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300', icon: AlertCircle },
};

export function StudentSubmissionsPage() {
  const [submissions, setSubmissions] = useState<SkillSubmission[]>([]);
  const [catalog, setCatalog] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [evalResult, setEvalResult] = useState<EvaluationData | null>(null);
  const [form, setForm] = useState({
    skillId: '',
    title: '',
    description: '',
    toolsUsed: '',
    steps: '',
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [subRes, catRes] = await Promise.all([
        studentApi.getSubmissions(),
        studentApi.getSkillsCatalog(),
      ]);
      if (subRes.success && subRes.data) setSubmissions(subRes.data);
      if (catRes.success && catRes.data) setCatalog(catRes.data);
    } catch {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.skillId || !form.title || form.description.length < 10) {
      toast.error('Please fill required fields (description min 10 characters)');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('skillId', form.skillId);
      fd.append('title', form.title);
      fd.append('description', form.description);
      if (form.toolsUsed) fd.append('toolsUsed', form.toolsUsed);
      if (form.steps) fd.append('steps', form.steps);
      if (file) fd.append('media', file);

      const res = await studentApi.createSubmission(fd);
      if (res.success) {
        toast.success('Practical demonstration submitted!');
        setShowForm(false);
        setForm({ skillId: '', title: '', description: '', toolsUsed: '', steps: '' });
        setFile(null);
        loadData();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEvaluate(submissionId: string) {
    setEvaluatingId(submissionId);
    setEvalResult(null);
    try {
      const res = await evaluationApi.run(submissionId);
      if (res.success && res.data) {
        setEvalResult(res.data as EvaluationData);
        toast.success(res.data.verified ? 'Skill verified!' : 'Evaluation complete');
        loadData();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Evaluation failed');
    } finally {
      setEvaluatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-careva-teal border-t-transparent" />
      </div>
    );
  }

  if (evalResult) {
    return (
      <div className="animate-fade-in space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Evaluation Results</h1>
          <Button variant="secondary" onClick={() => setEvalResult(null)}>Back to Submissions</Button>
        </div>
        <EvaluationResultView data={evalResult} onClose={() => setEvalResult(null)} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Practical Demonstrations</h1>
          <p className="mt-1 text-slate-500">
            Submit evidence of practical skill for CAREVA AI-assisted evaluation.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Submit Demo
        </Button>
      </div>

      {submissions.length === 0 ? (
        <Card className="flex flex-col items-center py-16">
          <FileText className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-500">No practical demonstrations yet.</p>
          <p className="mt-1 text-sm text-slate-400">Submit a video, image or document showing your practical skill.</p>
          <Button className="mt-6" onClick={() => setShowForm(true)}>
            Submit your first demo
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const cfg = statusConfig[sub.status];
            const StatusIcon = cfg.icon;
            const latestEval = sub.evaluations?.[0];
            const canEvaluate = sub.status === 'SUBMITTED' || sub.status === 'NEEDS_IMPROVEMENT';
            return (
              <Card key={sub.id} className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{sub.title}</h3>
                      <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', cfg.className)}>
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Skill: <span className="font-medium text-slate-700 dark:text-slate-300">{sub.skill.name}</span>
                      {' · '}
                      {sub.skill.trade}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{sub.description}</p>
                    {sub.toolsUsed && (
                      <p className="mt-1 text-xs text-slate-400">Tools: {sub.toolsUsed}</p>
                    )}
                    {latestEval && (
                      <div className="mt-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          Overall Score: {Math.round(latestEval.overallScore)}% · {latestEval.level.replace('_', '-')}
                        </p>
                        {latestEval.isDemo && (
                          <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">CAREVA AI Demo Mode</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-slate-400">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                    {sub.mediaUrl && (
                      <a
                        href={sub.mediaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-careva-blue hover:underline dark:text-careva-teal"
                      >
                        View evidence
                      </a>
                    )}
                    {canEvaluate && (
                      <Button
                        size="sm"
                        variant="accent"
                        loading={evaluatingId === sub.id}
                        onClick={() => handleEvaluate(sub.id)}
                      >
                        {evaluatingId === sub.id ? (
                          <>Evaluating…</>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5" />
                            Run AI Evaluation
                          </>
                        )}
                      </Button>
                    )}
                    {sub.status === 'VERIFIED' && (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Badge earned
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-12">
          <Card className="w-full max-w-xl animate-slide-up p-6">
            <div className="mb-4 flex items-center justify-between">
              <CardTitle>Submit Practical Demonstration</CardTitle>
              <button onClick={() => setShowForm(false)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <CardDescription className="mb-4">
              Provide evidence of your practical skill. After submission, run CAREVA AI-assisted evaluation (Demo Mode).
            </CardDescription>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Skill *</label>
                <select
                  className="input"
                  value={form.skillId}
                  onChange={(e) => setForm({ ...form, skillId: e.target.value })}
                  required
                >
                  <option value="">Select skill</option>
                  {catalog.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.trade})</option>
                  ))}
                </select>
              </div>
              <Input
                id="title"
                label="Demonstration Title *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. MIG Welding of 6mm mild steel plate"
                required
              />
              <div>
                <label className="label">Description *</label>
                <textarea
                  className="input min-h-[100px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe what you demonstrated, safety steps, process, and outcome. Mention tools and accuracy."
                  required
                  minLength={10}
                />
              </div>
              <Input
                id="toolsUsed"
                label="Tools / Equipment Used"
                value={form.toolsUsed}
                onChange={(e) => setForm({ ...form, toolsUsed: e.target.value })}
                placeholder="e.g. MIG welder, PPE, measuring tools"
              />
              <div>
                <label className="label">Steps Performed</label>
                <textarea
                  className="input min-h-[80px]"
                  value={form.steps}
                  onChange={(e) => setForm({ ...form, steps: e.target.value })}
                  placeholder="1. Safety check and PPE&#10;2. Setup equipment&#10;3. Execute process&#10;4. Inspect quality"
                />
              </div>
              <div>
                <label className="label">Evidence (Video / Image / Document)</label>
                <div className="mt-1 flex items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">
                    <Upload className="h-4 w-4 text-slate-400" />
                    {file ? file.name : 'Choose file (max 10 MB)'}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,video/mp4,video/webm,.pdf,.doc,.docx"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {file && (
                    <button type="button" onClick={() => setFile(null)} className="text-xs text-red-500">
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" loading={submitting}>Submit Demonstration</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
