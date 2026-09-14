import { useEffect, useState } from 'react';
import { Shield, Award, GraduationCap, FolderKanban, Star, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import { studentApi } from '../../services/api';
import type { StudentProfile } from '../../types';
import { Card, CardTitle } from '../../components/ui/Card';
import { levelLabel, levelBadgeClass } from '../../lib/utils';
import { cn } from '../../lib/utils';

export function SkillPassportPage() {
  const [passport, setPassport] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPassport();
  }, []);

  async function loadPassport() {
    try {
      const res = await studentApi.getPassport();
      if (res.success && res.data) setPassport(res.data);
    } catch {
      toast.error('Failed to load Skill Passport');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-careva-teal border-t-transparent" />
      </div>
    );
  }

  if (!passport) {
    return (
      <Card className="flex flex-col items-center py-16">
        <Shield className="h-12 w-12 text-slate-300" />
        <p className="mt-4 text-slate-500">Unable to load Skill Passport.</p>
      </Card>
    );
  }

  const verifiedSkills = passport.skills.filter((s) => s.isVerified);
  const avgScore =
    verifiedSkills.length > 0
      ? Math.round(
          verifiedSkills.reduce((sum, s) => sum + (s.competencyScore || 0), 0) / verifiedSkills.length
        )
      : null;

  return (
    <div className="animate-fade-in mx-auto max-w-4xl space-y-6">
      {/* Header credential card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-careva-navy via-careva-blue to-careva-teal text-white shadow-soft dark:border-slate-700">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">CAREVA Skill Passport</p>
                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{passport.fullName}</h1>
                <p className="mt-1 text-sm text-blue-100">
                  {passport.trade && <span>{passport.trade}</span>}
                  {passport.institute && <span> · {passport.institute}</span>}
                </p>
                <p className="mt-2 font-mono text-xs text-blue-200">
                  CAREVA ID: {passport.carevaId}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white/10 px-5 py-4 backdrop-blur">
              <QrCode className="h-12 w-12 text-white/80" />
              <p className="mt-2 text-center text-[10px] text-blue-100">Scan to verify</p>
              {verifiedSkills[0]?.credential?.credentialId && (
                <p className="mt-1 font-mono text-[10px] text-white/70">
                  {verifiedSkills[0].credential.credentialId}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-white/10 px-3 py-2 backdrop-blur">
              <p className="text-xs text-blue-100">Verified Skills</p>
              <p className="text-xl font-bold">{verifiedSkills.length}</p>
            </div>
            <div className="rounded-lg bg-white/10 px-3 py-2 backdrop-blur">
              <p className="text-xs text-blue-100">Avg. Competency</p>
              <p className="text-xl font-bold">{avgScore != null ? `${avgScore}%` : '—'}</p>
            </div>
            <div className="rounded-lg bg-white/10 px-3 py-2 backdrop-blur">
              <p className="text-xs text-blue-100">Certificates</p>
              <p className="text-xl font-bold">{passport.certificates.length}</p>
            </div>
            <div className="rounded-lg bg-white/10 px-3 py-2 backdrop-blur">
              <p className="text-xs text-blue-100">Projects</p>
              <p className="text-xl font-bold">{passport.projects.length}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 bg-black/10 px-6 py-3 text-center text-xs text-blue-100">
          A certificate tells an employer what a student completed. CAREVA helps demonstrate what the student can actually do.
        </div>
      </div>

      {/* Verified skills */}
      <Card className="p-6">
        <CardTitle className="mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-careva-teal" />
          Verified Skills
        </CardTitle>
        {verifiedSkills.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 py-10 text-center dark:border-slate-700">
            <Shield className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">No verified skills yet.</p>
            <p className="mt-1 text-xs text-slate-400">
              Submit a practical demonstration and complete CAREVA evaluation to earn verified badges.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {verifiedSkills.map((ss) => (
              <div
                key={ss.id}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{ss.skill.name}</h3>
                    <p className="text-xs text-slate-500">{ss.skill.trade}</p>
                  </div>
                  <span className={cn(levelBadgeClass(ss.verifiedLevel || 'BEGINNER'))}>
                    {levelLabel(ss.verifiedLevel || 'BEGINNER')}
                  </span>
                </div>
                {ss.competencyScore != null && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Competency</span>
                      <span className="font-bold text-careva-blue dark:text-careva-teal">
                        {Math.round(ss.competencyScore)}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-careva-blue to-careva-teal"
                        style={{ width: `${ss.competencyScore}%` }}
                      />
                    </div>
                  </div>
                )}
                {ss.credential && (
                  <p className="mt-3 font-mono text-[10px] text-slate-400">
                    {ss.credential.credentialId}
                    {ss.verificationDate && (
                      <span> · Issued {new Date(ss.verificationDate).toLocaleDateString()}</span>
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Education */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="p-6">
          <CardTitle className="mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-careva-teal" />
            Education
          </CardTitle>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Institute</dt>
              <dd className="font-medium text-slate-900 dark:text-white">{passport.institute || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Course</dt>
              <dd className="font-medium text-slate-900 dark:text-white">{passport.course || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Trade</dt>
              <dd className="font-medium text-slate-900 dark:text-white">{passport.trade || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Graduation</dt>
              <dd className="font-medium text-slate-900 dark:text-white">{passport.graduationYear || '—'}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6">
          <CardTitle className="mb-4 flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-careva-teal" />
            Projects & Certificates
          </CardTitle>
          {passport.projects.length === 0 && passport.certificates.length === 0 ? (
            <p className="text-sm text-slate-500">No projects or certificates added yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {passport.projects.slice(0, 3).map((p) => (
                <li key={p.id} className="flex items-center gap-2">
                  <FolderKanban className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">{p.title}</span>
                </li>
              ))}
              {passport.certificates.slice(0, 3).map((c) => (
                <li key={c.id} className="flex items-center gap-2">
                  <Award className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">{c.title}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Employer feedback */}
      {passport.feedbackReceived && passport.feedbackReceived.length > 0 && (
        <Card className="p-6">
          <CardTitle className="mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-careva-teal" />
            Employer Feedback
          </CardTitle>
          <div className="space-y-4">
            {passport.feedbackReceived.map((fb) => {
              const avg =
                (fb.practicalScore +
                  fb.technicalScore +
                  fb.safetyScore +
                  fb.reliabilityScore +
                  fb.communicationScore +
                  fb.workplaceScore) /
                6;
              return (
                <div key={fb.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Performance Rating</span>
                    <span className="text-sm font-bold text-careva-teal">{avg.toFixed(1)} / 5</span>
                  </div>
                  {fb.writtenFeedback && (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{fb.writtenFeedback}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
