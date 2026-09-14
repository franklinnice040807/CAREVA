import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, User, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { cn } from '../../lib/utils';

export function RegisterPage() {
  const [role, setRole] = useState<'STUDENT' | 'EMPLOYER'>('STUDENT');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        email,
        password,
        role,
        fullName: role === 'STUDENT' ? fullName : undefined,
        companyName: role === 'EMPLOYER' ? companyName : undefined,
      });
      toast.success('Account created successfully!');
      navigate(role === 'STUDENT' ? '/student' : '/employer', { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md animate-slide-up p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-careva-blue to-careva-teal">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Join CAREVA and start verifying skills</p>
        </div>

        {/* Role selector */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
              role === 'STUDENT'
                ? 'border-careva-blue bg-careva-blue/5 dark:border-careva-teal dark:bg-careva-teal/10'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
            )}
          >
            <User className={cn('h-6 w-6', role === 'STUDENT' ? 'text-careva-blue dark:text-careva-teal' : 'text-slate-400')} />
            <span className={cn('text-sm font-semibold', role === 'STUDENT' ? 'text-careva-blue dark:text-careva-teal' : 'text-slate-600')}>
              Student
            </span>
          </button>
          <button
            type="button"
            onClick={() => setRole('EMPLOYER')}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
              role === 'EMPLOYER'
                ? 'border-careva-blue bg-careva-blue/5 dark:border-careva-teal dark:bg-careva-teal/10'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
            )}
          >
            <Building2 className={cn('h-6 w-6', role === 'EMPLOYER' ? 'text-careva-blue dark:text-careva-teal' : 'text-slate-400')} />
            <span className={cn('text-sm font-semibold', role === 'EMPLOYER' ? 'text-careva-blue dark:text-careva-teal' : 'text-slate-600')}>
              Employer
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'STUDENT' ? (
            <Input
              id="fullName"
              label="Full Name"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          ) : (
            <Input
              id="companyName"
              label="Company Name"
              placeholder="Your company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          )}
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <div className="relative">
            <Input
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-careva-blue hover:underline dark:text-careva-teal">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
