import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, CheckCircle2, XCircle, Award } from 'lucide-react';
import { publicApi } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { levelLabel, levelBadgeClass } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface VerifyData {
  credentialId: string;
  issuedAt: string;
  status: string;
  studentName: string;
  trade?: string;
  institute?: string;
  carevaId: string;
  skill: { name: string; category: string; trade: string };
  competencyLevel?: string;
  competencyScore?: number;
  verificationDate?: string;
  isVerified: boolean;
}

export function VerifyPage() {
  const { credentialId } = useParams<{ credentialId: string }>();
  const [data, setData] = useState<VerifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!credentialId) {
      setError('No credential ID provided');
      setLoading(false);
      return;
    }
    publicApi
      .verify(credentialId)
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(res.message || 'Credential not found');
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Credential not found or inactive');
      })
      .finally(() => setLoading(false));
  }, [credentialId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-careva-teal border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="section-container flex min-h-[60vh] flex-col items-center justify-center py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Credential Not Found</h1>
        <p className="mt-2 max-w-md text-center text-slate-500">
          {error || 'This CAREVA credential ID is invalid or has been revoked.'}
        </p>
        <p className="mt-1 font-mono text-sm text-slate-400">{credentialId}</p>
        <Link to="/" className="mt-8">
          <Button variant="secondary">Back to CAREVA</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="section-container py-12 sm:py-16">
      <div className="mx-auto max-w-lg animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-careva-blue to-careva-teal">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Credential Verification</h1>
          <p className="mt-1 text-sm text-slate-500">Public verification of a CAREVA Skill Passport credential</p>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="bg-gradient-to-r from-emerald-600 to-careva-teal px-6 py-4 text-center text-white">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Verified Credential</span>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Student</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{data.studentName}</p>
              {(data.trade || data.institute) && (
                <p className="text-sm text-slate-500">
                  {[data.trade, data.institute].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Skill</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{data.skill.name}</p>
              <p className="text-sm text-slate-500">
                {data.skill.trade} · {data.skill.category}
              </p>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <div>
                <p className="text-xs text-slate-500">Competency Level</p>
                {data.competencyLevel && (
                  <span className={cn('mt-1 inline-block', levelBadgeClass(data.competencyLevel))}>
                    {levelLabel(data.competencyLevel)}
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Score</p>
                <p className="text-2xl font-bold text-careva-teal">
                  {data.competencyScore != null ? `${Math.round(data.competencyScore)}%` : '—'}
                </p>
              </div>
            </div>

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Credential ID</dt>
                <dd className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200">
                  {data.credentialId}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">CAREVA ID</dt>
                <dd className="font-mono text-xs text-slate-600 dark:text-slate-400">{data.carevaId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Issued</dt>
                <dd className="text-slate-700 dark:text-slate-300">
                  {new Date(data.issuedAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Status</dt>
                <dd className="font-medium text-emerald-600">{data.status}</dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/50">
            <Award className="mx-auto mb-1 h-4 w-4 text-careva-teal" />
            Verified by CAREVA · AI-Assisted Competency Evaluation
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-slate-400">
          Only public, non-sensitive information is shown. Private student data is never exposed.
        </p>

        <div className="mt-6 text-center">
          <Link to="/">
            <Button variant="ghost" size="sm">← Back to CAREVA</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
