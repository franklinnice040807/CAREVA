import { useEffect, useState, FormEvent } from 'react';
import { Building2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { employerApi } from '../../services/api';
import { Card, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';

export function EmployerProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    industry: '',
    location: '',
    website: '',
    description: '',
    companySize: '',
    contactInfo: '',
  });

  useEffect(() => {
    employerApi
      .getProfile()
      .then((res) => {
        if (res.success && res.data) {
          setForm({
            companyName: res.data.companyName || '',
            industry: res.data.industry || '',
            location: res.data.location || '',
            website: res.data.website || '',
            description: res.data.description || '',
            companySize: res.data.companySize || '',
            contactInfo: res.data.contactInfo || '',
          });
        }
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await employerApi.updateProfile(form);
      if (res.success && res.data) {
        if (user) setUser({ ...user, companyName: res.data.companyName });
        toast.success('Company profile updated');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Update failed');
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
    <div className="animate-fade-in mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Company Profile</h1>
        <p className="mt-1 text-slate-500">Help candidates understand your organization.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="space-y-4 p-6">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-careva-teal" />
            Company Details
          </CardTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="companyName"
              label="Company Name"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              required
            />
            <Input
              id="industry"
              label="Industry"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              placeholder="e.g. Manufacturing"
            />
            <Input
              id="location"
              label="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <Input
              id="companySize"
              label="Company Size"
              value={form.companySize}
              onChange={(e) => setForm({ ...form, companySize: e.target.value })}
              placeholder="e.g. 51-200"
            />
            <Input
              id="website"
              label="Website"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://"
            />
            <Input
              id="contactInfo"
              label="Contact Info"
              value={form.contactInfo}
              onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input min-h-[120px]"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="About your company, culture, and the talent you hire..."
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={saving}>
              <Save className="h-4 w-4" />
              Save Profile
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
