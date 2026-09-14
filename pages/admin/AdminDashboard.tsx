import { useEffect, useState } from 'react';
import {
  Users, Building2, Award, FileText, Briefcase, BarChart3, CheckCircle2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import toast from 'react-hot-toast';
import { adminApi } from '../../services/api';
import { Card, CardTitle, CardDescription } from '../../components/ui/Card';

const COLORS = ['#1E40AF', '#0D9488', '#059669', '#D97706', '#7C3AED', '#DC2626', '#0891B2'];

export function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getAnalytics()
      .then((res) => {
        if (res.success && res.data) setData(res.data);
      })
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-careva-teal border-t-transparent" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const statCards = [
    { label: 'Students', value: stats.students ?? 0, icon: Users, color: 'text-careva-blue' },
    { label: 'Employers', value: stats.employers ?? 0, icon: Building2, color: 'text-careva-teal' },
    { label: 'Verified Skills', value: stats.verifiedSkills ?? 0, icon: Award, color: 'text-emerald-600' },
    { label: 'Submissions', value: stats.submissions ?? 0, icon: FileText, color: 'text-amber-600' },
    { label: 'Jobs', value: stats.jobs ?? 0, icon: Briefcase, color: 'text-purple-600' },
    { label: 'Hires', value: stats.hires ?? 0, icon: CheckCircle2, color: 'text-rose-600' },
  ];

  const tradeData = (data?.studentsByTrade || []).map((t: any) => ({
    name: t.trade,
    count: t.count,
  }));

  const competencyData = data?.competencyDist
    ? [
        { name: 'Beginner', value: data.competencyDist.BEGINNER || 0 },
        { name: 'Intermediate', value: data.competencyDist.INTERMEDIATE || 0 },
        { name: 'Job-ready', value: data.competencyDist.JOB_READY || 0 },
      ]
    : [];

  const skillDemand = (data?.mostRequested || []).map((s: any) => ({
    name: s.name.length > 14 ? s.name.slice(0, 14) + '…' : s.name,
    count: s.count,
  }));

  const jobDemand = (data?.jobDemand || []).map((j: any) => ({
    name: j.trade,
    count: j.count,
  }));

  const hiringData = (data?.hiringOutcomes || []).map((h: any) => ({
    name: h.status.replace('_', ' '),
    count: h.count,
  }));

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Platform overview and analytics.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                </div>
                <div className={`rounded-lg bg-slate-100 p-2.5 dark:bg-slate-800 ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <CardTitle>Students by Trade</CardTitle>
          <CardDescription className="mt-1">Distribution of registered students.</CardDescription>
          {tradeData.length === 0 ? (
            <p className="mt-8 text-center text-sm text-slate-400">No data yet</p>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tradeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <CardTitle>Competency Distribution</CardTitle>
          <CardDescription className="mt-1">Verified skill levels across platform.</CardDescription>
          {competencyData.every((d) => d.value === 0) ? (
            <p className="mt-8 text-center text-sm text-slate-400">No verified skills yet</p>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={competencyData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {competencyData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <CardTitle>Most Requested Skills</CardTitle>
          <CardDescription className="mt-1">Skills required in job postings.</CardDescription>
          {skillDemand.length === 0 ? (
            <p className="mt-8 text-center text-sm text-slate-400">No job requirements yet</p>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillDemand} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0D9488" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <CardTitle>Job Demand by Trade</CardTitle>
          <CardDescription className="mt-1">Active job openings.</CardDescription>
          {jobDemand.length === 0 ? (
            <p className="mt-8 text-center text-sm text-slate-400">No active jobs</p>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobDemand}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <CardTitle>Hiring Outcomes</CardTitle>
          <CardDescription className="mt-1">Application pipeline status counts.</CardDescription>
          {hiringData.length === 0 ? (
            <p className="mt-8 text-center text-sm text-slate-400">No applications yet</p>
          ) : (
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hiringData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-careva-teal" />
            Recent Verifications
          </CardTitle>
          <CardDescription className="mt-1">Latest CAREVA skill verifications.</CardDescription>
          {!(data?.verificationActivity?.length > 0) ? (
            <p className="mt-8 text-center text-sm text-slate-400">No verifications yet</p>
          ) : (
            <div className="mt-4 max-h-56 space-y-2 overflow-y-auto">
              {data.verificationActivity.slice(0, 8).map((v: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{v.skillName}</p>
                    <p className="text-xs text-slate-500">
                      {v.studentName} · {v.trade}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-careva-teal">
                      {v.score != null ? `${Math.round(v.score)}%` : '—'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {v.date ? new Date(v.date).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
