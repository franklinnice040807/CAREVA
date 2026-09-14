import { useEffect, useState, FormEvent } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { feedbackApi } from '../../services/api';
import { Card, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const CATEGORIES = [
  { key: 'practicalScore', label: 'Practical Performance' },
  { key: 'technicalScore', label: 'Technical Knowledge' },
  { key: 'safetyScore', label: 'Safety' },
  { key: 'reliabilityScore', label: 'Reliability' },
  { key: 'communicationScore', label: 'Communication' },
  { key: 'workplaceScore', label: 'Workplace Readiness' },
] as const;

export function EmployerFeedbackPage() {
  const [pending, setPending] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({
    practicalScore: 3,
    technicalScore: 3,
    safetyScore: 3,
    reliabilityScore: 3,
    communicationScore: 3,
    workplaceScore: 3,
  });
  const [written, setWritten] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const [p, h] = await Promise.all([feedbackApi.pending(), feedbackApi.list()]);
      if (p.success && p.data) setPending(p.data);
      if (h.success && h.data) setHistory(h.data);
    } catch {
      toast.error('Failed to load feedback data');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    try {
      await feedbackApi.submit({
        applicationId: selected.id,
        ...scores,
        writtenFeedback: written || undefined,
      });
      toast.success('Feedback submitted');
      setSelected(null);
      setWritten('');
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  }

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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employer Feedback</h1>
        <p className="mt-1 text-slate-500">
          Rate hired candidates on practical performance. Feedback appears on their Skill Passport.
        </p>
      </div>

      {/* Pending hires */}
      <Card className="p-6">
        <CardTitle>Pending Feedback</CardTitle>
        <CardDescription className="mt-1">Hires awaiting your performance feedback.</CardDescription>
        {pending.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">No pending feedback. Mark applications as Hired first.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {pending.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{h.student?.fullName}</p>
                  <p className="text-sm text-slate-500">
                    {h.job?.title} · {h.student?.trade}
                  </p>
                </div>
                <Button size="sm" onClick={() => setSelected(h)}>
                  <Star className="h-3.5 w-3.5" />
                  Give Feedback
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* History */}
      {history.length > 0 && (
        <Card className="p-6">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-careva-teal" />
            Submitted Feedback
          </CardTitle>
          <div className="mt-4 space-y-3">
            {history.map((f) => {
              const avg =
                (f.practicalScore +
                  f.technicalScore +
                  f.safetyScore +
                  f.reliabilityScore +
                  f.communicationScore +
                  f.workplaceScore) /
                6;
              return (
                <div
                  key={f.id}
                  className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{f.student?.fullName}</p>
                      <p className="text-xs text-slate-500">{f.application?.job?.title}</p>
                    </div>
                    <span className="text-lg font-bold text-careva-teal">{avg.toFixed(1)}/5</span>
                  </div>
                  {f.writtenFeedback && (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.writtenFeedback}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Feedback form modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10">
          <Card className="w-full max-w-md animate-slide-up p-6">
            <CardTitle>Performance Feedback</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              {selected.student?.fullName} · {selected.job?.title}
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {CATEGORIES.map((cat) => (
                <div key={cat.key}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{cat.label}</span>
                    <span className="font-bold text-careva-teal">{scores[cat.key]}/5</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={scores[cat.key]}
                    onChange={(e) =>
                      setScores({ ...scores, [cat.key]: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-careva-teal"
                  />
                </div>
              ))}
              <div>
                <label className="label">Written Feedback (optional)</label>
                <textarea
                  className="input min-h-[80px]"
                  value={written}
                  onChange={(e) => setWritten(e.target.value)}
                  placeholder="Comments on workplace performance..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" loading={submitting}>
                  Submit Feedback
                </Button>
                <Button type="button" variant="secondary" onClick={() => setSelected(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
