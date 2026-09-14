import { useEffect, useState } from 'react';
import { Target, TrendingUp, AlertTriangle, Lightbulb, ArrowRight, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { matchingApi } from '../../services/api';
import { Card, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatPercent } from '../../lib/utils';

export function CareerInsightsPage() {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    matchingApi
      .getInsights()
      .then((res) => {
        if (res.success && res.data) setInsights(res.data);
      })
      .catch(() => toast.error('Failed to load insights'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-careva-teal border-t-transparent" />
      </div>
    );
  }

  if (!insights) {
    return (
      <Card className="flex flex-col items-center py-16">
        <Target className="h-12 w-12 text-slate-300" />
        <p className="mt-4 text-slate-500">Unable to generate insights yet.</p>
        <p className="mt-1 text-sm text-slate-400">Verify skills and ensure jobs exist on the platform.</p>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Career Insights</h1>
        <p className="mt-1 text-slate-500">
          Personalized recommendations based on your verified skills and job market fit.
        </p>
      </div>

      {/* Career pathway */}
      <Card className="p-6">
        <CardTitle className="mb-2 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-careva-teal" />
          Career Pathway
        </CardTitle>
        <CardDescription>Suggested progression for your trade.</CardDescription>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {(insights.careerPathway || []).map((role: string, i: number) => (
            <div key={role} className="flex items-center gap-2">
              <div
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  i === 0
                    ? 'bg-careva-blue text-white'
                    : i === (insights.careerPathway?.length || 0) - 1
                      ? 'bg-careva-teal text-white'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {role}
              </div>
              {i < (insights.careerPathway?.length || 0) - 1 && (
                <ArrowRight className="h-4 w-4 text-slate-300" />
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recommended jobs */}
        <Card className="p-6">
          <CardTitle className="mb-2 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-careva-teal" />
            Recommended Jobs
          </CardTitle>
          {!insights.recommendedJobs?.length ? (
            <p className="mt-4 text-sm text-slate-500">No matched jobs yet. Verify more skills or check back later.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {insights.recommendedJobs.map((j: any) => (
                <div
                  key={j.jobId}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{j.title}</p>
                    <p className="text-xs text-slate-500">{j.companyName}</p>
                  </div>
                  <span className="text-sm font-bold text-careva-teal">{formatPercent(j.overallScore)}</span>
                </div>
              ))}
              <Link to="/student/jobs">
                <Button variant="secondary" size="sm" className="mt-2">View all matches</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Skill gaps */}
        <Card className="p-6">
          <CardTitle className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Skill Gaps
          </CardTitle>
          {!insights.skillGaps?.length ? (
            <p className="mt-4 text-sm text-slate-500">No major skill gaps detected against current job matches.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {insights.skillGaps.slice(0, 5).map((g: any, i: number) => (
                <div key={i} className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                    {g.skillName}
                    <span className="ml-2 text-xs font-normal">
                      ({g.gapType === 'MISSING' ? 'Not verified' : `Need ${g.requiredLevel?.replace('_', '-')}`})
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">{g.recommendation}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recommended skills */}
      {insights.recommendedSkills?.length > 0 && (
        <Card className="p-6">
          <CardTitle className="mb-2 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-careva-teal" />
            Recommended Skills to Acquire
          </CardTitle>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {insights.recommendedSkills.map((s: any, i: number) => (
              <div key={i} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="font-semibold text-slate-900 dark:text-white">{s.skillName}</p>
                <p className="mt-1 text-xs text-slate-500">{s.reason}</p>
              </div>
            ))}
          </div>
          <Link to="/student/submissions" className="mt-4 inline-block">
            <Button size="sm">Submit Practical Demo</Button>
          </Link>
        </Card>
      )}

      {/* Improvements */}
      {insights.improvements?.length > 0 && (
        <Card className="p-6">
          <CardTitle className="mb-4">Improvement Recommendations</CardTitle>
          <ul className="space-y-2">
            {insights.improvements.map((imp: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-careva-teal" />
                {imp}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
