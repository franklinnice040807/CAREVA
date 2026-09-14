import { useEffect, useState } from 'react';
import { Award, Plus, Trash2, Shield, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { studentApi } from '../../services/api';
import type { Skill, StudentSkill, CompetencyLevel, StudentProfile } from '../../types';
import { Card, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { levelLabel, levelBadgeClass } from '../../lib/utils';
import { cn } from '../../lib/utils';

export function StudentSkillsPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [catalog, setCatalog] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [selfLevel, setSelfLevel] = useState<CompetencyLevel>('BEGINNER');
  const [notes, setNotes] = useState('');
  const [adding, setAdding] = useState(false);
  const [filterTrade, setFilterTrade] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [profileRes, catalogRes] = await Promise.all([
        studentApi.getProfile(),
        studentApi.getSkillsCatalog(),
      ]);
      if (profileRes.success && profileRes.data) setProfile(profileRes.data);
      if (catalogRes.success && catalogRes.data) setCatalog(catalogRes.data);
    } catch {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!selectedSkillId) {
      toast.error('Please select a skill');
      return;
    }
    setAdding(true);
    try {
      const res = await studentApi.addSkill({
        skillId: selectedSkillId,
        selfAssessedLevel: selfLevel,
        experienceNotes: notes || undefined,
      });
      if (res.success) {
        toast.success('Skill added');
        setShowAdd(false);
        setSelectedSkillId('');
        setNotes('');
        loadData();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add skill');
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(id: string) {
    if (!confirm('Remove this skill from your profile?')) return;
    try {
      await studentApi.removeSkill(id);
      toast.success('Skill removed');
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Cannot remove skill');
    }
  }

  const mySkillIds = new Set(profile?.skills.map((s) => s.skillId) || []);
  const availableSkills = catalog.filter((s) => {
    if (mySkillIds.has(s.id)) return false;
    if (filterTrade && s.trade !== filterTrade) return false;
    return true;
  });
  const trades = [...new Set(catalog.map((s) => s.trade))];

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Skills</h1>
          <p className="mt-1 text-slate-500">
            Self-assessed skills are separate from CAREVA-verified badges.
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {/* My skills */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(profile?.skills || []).length === 0 ? (
          <Card className="col-span-full flex flex-col items-center py-12">
            <Award className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">No skills added yet.</p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => setShowAdd(true)}>
              Add your first skill
            </Button>
          </Card>
        ) : (
          profile!.skills.map((ss: StudentSkill) => (
            <Card key={ss.id} className="relative p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{ss.skill.name}</h3>
                  <p className="text-xs text-slate-500">{ss.skill.trade} · {ss.skill.category}</p>
                </div>
                {ss.isVerified ? (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    <Shield className="h-3 w-3" />
                    Verified
                  </span>
                ) : (
                  !ss.isVerified && (
                    <button
                      onClick={() => handleRemove(ss.id)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      title="Remove skill"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )
                )}
              </div>

              <div className="mt-4 space-y-2">
                {ss.selfAssessedLevel && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Self-assessed</span>
                    <span className={levelBadgeClass(ss.selfAssessedLevel)}>
                      {levelLabel(ss.selfAssessedLevel)}
                    </span>
                  </div>
                )}
                {ss.isVerified && ss.verifiedLevel && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">CAREVA Verified</span>
                    <span className={levelBadgeClass(ss.verifiedLevel)}>
                      {levelLabel(ss.verifiedLevel)}
                      {ss.competencyScore != null && ` · ${Math.round(ss.competencyScore)}%`}
                    </span>
                  </div>
                )}
                {ss.experienceNotes && (
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2">{ss.experienceNotes}</p>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add skill modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-lg animate-slide-up p-6">
            <div className="mb-4 flex items-center justify-between">
              <CardTitle>Add Skill</CardTitle>
              <button onClick={() => setShowAdd(false)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <CardDescription className="mb-4">
              Select a skill from the catalog. Verification happens only after practical demonstration and AI evaluation.
            </CardDescription>

            <div className="space-y-4">
              <div>
                <label className="label">Filter by Trade</label>
                <select
                  className="input"
                  value={filterTrade}
                  onChange={(e) => setFilterTrade(e.target.value)}
                >
                  <option value="">All trades</option>
                  {trades.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Skill</label>
                <select
                  className="input"
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                >
                  <option value="">Select a skill</option>
                  {availableSkills.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.trade})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Self-assessed Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['BEGINNER', 'INTERMEDIATE', 'JOB_READY'] as CompetencyLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelfLevel(lvl)}
                      className={cn(
                        'rounded-lg border-2 py-2 text-xs font-semibold transition-all',
                        selfLevel === lvl
                          ? 'border-careva-teal bg-careva-teal/10 text-careva-teal'
                          : 'border-slate-200 text-slate-600 dark:border-slate-700'
                      )}
                    >
                      {levelLabel(lvl)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Experience Notes (optional)</label>
                <textarea
                  className="input min-h-[80px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your experience with this skill..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
                <Button onClick={handleAdd} loading={adding}>Add Skill</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
