import { useEffect, useState, FormEvent } from 'react';
import { User, Save, MapPin, Phone, GraduationCap, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { studentApi } from '../../services/api';
import type { StudentProfile } from '../../types';
import { Card, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';

const TRADES = ['Electrical', 'Mechanical', 'Welding', 'Automobile', 'Electronics', 'Civil', 'Computer/IT'];

export function StudentProfilePage() {
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    location: '',
    institute: '',
    course: '',
    trade: '',
    graduationYear: '',
    about: '',
    experienceYears: '0',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await studentApi.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        setForm({
          fullName: res.data.fullName || '',
          phone: res.data.phone || '',
          location: res.data.location || '',
          institute: res.data.institute || '',
          course: res.data.course || '',
          trade: res.data.trade || '',
          graduationYear: res.data.graduationYear?.toString() || '',
          about: res.data.about || '',
          experienceYears: res.data.experienceYears?.toString() || '0',
        });
      }
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await studentApi.updateProfile({
        fullName: form.fullName,
        phone: form.phone || undefined,
        location: form.location || undefined,
        institute: form.institute || undefined,
        course: form.course || undefined,
        trade: form.trade || undefined,
        graduationYear: form.graduationYear ? parseInt(form.graduationYear, 10) : undefined,
        about: form.about || undefined,
        experienceYears: parseFloat(form.experienceYears) || 0,
      });
      if (res.success && res.data) {
        setProfile(res.data);
        if (user) {
          setUser({ ...user, fullName: res.data.fullName, profileCompletion: res.data.profileCompletion });
        }
        toast.success('Profile updated successfully');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
    <div className="animate-fade-in mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="mt-1 text-slate-500">Keep your profile complete to improve job matching.</p>
      </div>

      {/* Completion */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Profile Completion</p>
            <p className="text-2xl font-bold text-careva-blue dark:text-careva-teal">
              {profile?.profileCompletion || 0}%
            </p>
          </div>
          <div className="h-3 w-40 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-careva-blue to-careva-teal transition-all"
              style={{ width: `${profile?.profileCompletion || 0}%` }}
            />
          </div>
        </div>
        {profile?.carevaId && (
          <p className="mt-3 text-xs text-slate-400">
            CAREVA ID: <span className="font-mono font-medium text-slate-600 dark:text-slate-300">{profile.carevaId}</span>
          </p>
        )}
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4 p-6">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-careva-teal" />
            Personal Information
          </CardTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="fullName"
              label="Full Name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
            <Input
              id="phone"
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 ..."
            />
            <Input
              id="location"
              label="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="City, State"
            />
            <Input
              id="experienceYears"
              label="Years of Experience"
              type="number"
              min="0"
              step="0.5"
              value={form.experienceYears}
              onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
            />
          </div>
          <div>
            <label className="label">About</label>
            <textarea
              className="input min-h-[100px] resize-y"
              value={form.about}
              onChange={(e) => setForm({ ...form, about: e.target.value })}
              placeholder="Briefly describe your skills, interests and career goals..."
            />
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-careva-teal" />
            Education & Trade
          </CardTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="institute"
              label="Institute"
              value={form.institute}
              onChange={(e) => setForm({ ...form, institute: e.target.value })}
              placeholder="ITI / Polytechnic name"
            />
            <Input
              id="course"
              label="Course"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
            />
            <div>
              <label className="label">Trade</label>
              <select
                className="input"
                value={form.trade}
                onChange={(e) => setForm({ ...form, trade: e.target.value })}
              >
                <option value="">Select trade</option>
                {TRADES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <Input
              id="graduationYear"
              label="Graduation Year"
              type="number"
              min="1990"
              max="2035"
              value={form.graduationYear}
              onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" />
            Save Profile
          </Button>
        </div>
      </form>

      {/* Summary cards */}
      {profile && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="flex items-center gap-3 p-4">
            <MapPin className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Location</p>
              <p className="text-sm font-medium">{profile.location || '—'}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3 p-4">
            <Building2 className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Institute</p>
              <p className="text-sm font-medium">{profile.institute || '—'}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3 p-4">
            <Phone className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm font-medium truncate">{profile.user?.email || '—'}</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
