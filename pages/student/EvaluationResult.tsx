import { Shield, CheckCircle2, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { levelLabel, levelBadgeClass } from '../../lib/utils';
import { cn } from '../../lib/utils';

export interface EvaluationData {
  overallScore: number;
  level: string;
  rubricScores: Record<string, number>;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  isDemo: boolean;
  providerName: string;
  verified: boolean;
  credentialId: string | null;
  skillName: string;
  submissionTitle: string;
  rubric: Array<{ key: string; label: string; description: string; weight: number }>;
}

interface Props {
  data: EvaluationData;
  onClose?: () => void;
}

export function EvaluationResultView({ data, onClose }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Demo mode banner */}
      {data.isDemo && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>
            <strong>CAREVA AI-Assisted Competency Evaluation — Demo Mode</strong>
            <br />
            Scores are generated from submission metadata and structured rubrics. No external AI model or computer vision was used.
          </span>
        </div>
      )}

      {/* Overall score */}
      <Card className="overflow-hidden p-0">
        <div className="bg-gradient-to-r from-careva-navy to-careva-blue px-6 py-8 text-center text-white">
          <p className="text-sm font-medium text-blue-100">Overall Competency Score</p>
          <p className="mt-2 text-5xl font-extrabold">{Math.round(data.overallScore)}%</p>
          <div className="mt-3 inline-flex items-center gap-2">
            <span className={cn('rounded-full px-3 py-1 text-sm font-semibold', 
              data.level === 'JOB_READY' ? 'bg-emerald-400/20 text-emerald-100' :
              data.level === 'INTERMEDIATE' ? 'bg-blue-400/20 text-blue-100' :
              'bg-amber-400/20 text-amber-100'
            )}>
              CAREVA Level: {levelLabel(data.level)}
            </span>
          </div>
          <p className="mt-2 text-sm text-blue-200">{data.skillName} · {data.submissionTitle}</p>
        </div>

        {data.verified ? (
          <div className="flex items-center gap-3 border-t border-emerald-200 bg-emerald-50 px-6 py-4 dark:border-emerald-800 dark:bg-emerald-900/20">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            <div>
              <p className="font-semibold text-emerald-800 dark:text-emerald-200">Skill Verified</p>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Credential ID: <span className="font-mono">{data.credentialId}</span>
              </p>
            </div>
            <Link to="/student/passport" className="ml-auto">
              <Button variant="accent" size="sm">
                View Passport
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3 border-t border-amber-200 bg-amber-50 px-6 py-4 dark:border-amber-800 dark:bg-amber-900/20">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200">Needs Improvement</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Score below verification threshold. Review feedback and re-submit.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Rubric scores */}
      <Card className="p-6">
        <CardTitle className="mb-4">Rubric Breakdown</CardTitle>
        <div className="space-y-4">
          {data.rubric.map((cat) => {
            const score = data.rubricScores[cat.key] ?? 0;
            return (
              <div key={cat.key}>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{cat.label}</span>
                    <p className="text-xs text-slate-400">{cat.description}</p>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{score}%</span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-700',
                      score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                    )}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Insights */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">Strengths</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {data.strengths.map((s, i) => (
              <li key={i} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {s}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-amber-700 dark:text-amber-400">Areas for Improvement</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {data.improvements.map((s, i) => (
              <li key={i} className="flex gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                {s}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-careva-blue dark:text-careva-teal">Recommended Next Steps</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {data.recommendations.map((s, i) => (
              <li key={i} className="flex gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-careva-teal" />
                {s}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Verification badge */}
      {data.verified && data.credentialId && (
        <Card className="flex flex-col items-center p-6 text-center sm:flex-row sm:text-left">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-careva-blue to-careva-teal text-white">
            <Shield className="h-8 w-8" />
          </div>
          <div className="mt-4 sm:ml-5 sm:mt-0">
            <p className="font-semibold text-slate-900 dark:text-white">CAREVA Verification Badge</p>
            <p className="mt-1 font-mono text-sm text-slate-500">{data.credentialId}</p>
            <p className="mt-1 text-xs text-slate-400">
              Public verification: /verify/{data.credentialId}
            </p>
          </div>
          <Link to={`/verify/${data.credentialId}`} className="mt-4 sm:ml-auto sm:mt-0">
            <Button variant="secondary" size="sm">Public Verify Page</Button>
          </Link>
        </Card>
      )}

      {onClose && (
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      )}
    </div>
  );
}
