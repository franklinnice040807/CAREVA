import { Link } from 'react-router-dom';
import {
  Shield, CheckCircle2, ArrowRight, Users, Briefcase, Award,
  Target, BarChart3, FileCheck, Brain, GraduationCap, Building2,
  Globe2, Handshake, Lightbulb, TrendingUp,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const workflow = [
  { label: 'Student Profile', icon: Users },
  { label: 'Practical Demonstration', icon: FileCheck },
  { label: 'AI-Assisted Evaluation', icon: Brain },
  { label: 'Competency Score', icon: Target },
  { label: 'Verified Skill Passport', icon: Shield },
  { label: 'Employer Matching', icon: Briefcase },
  { label: 'Hiring', icon: Building2 },
  { label: 'Employer Feedback', icon: Award },
];

const features = [
  { title: 'AI-Assisted Skill Verification', desc: 'Structured competency evaluation against industry rubrics.', icon: Brain },
  { title: 'Digital Skill Passport', desc: 'Trusted, shareable credential of verified practical skills.', icon: Shield },
  { title: 'Competency Scoring', desc: 'Clear scores and levels: Beginner → Intermediate → Job-ready.', icon: Target },
  { title: 'Verified Badges', desc: 'Earn CAREVA-verified badges employers can trust.', icon: Award },
  { title: 'Intelligent Job Matching', desc: 'Match candidates to roles by skills, competency and fit.', icon: Briefcase },
  { title: 'Skill Gap Analysis', desc: 'See exactly what is missing and how to close the gap.', icon: BarChart3 },
  { title: 'Career Pathways', desc: 'Recommended progression from trade to specialist roles.', icon: TrendingUp },
  { title: 'Employer Feedback', desc: 'Post-hire performance feedback improves future matching.', icon: CheckCircle2 },
  { title: 'Credential Verification', desc: 'Public verification page for any CAREVA credential ID.', icon: FileCheck },
  { title: 'Institute Analytics', desc: 'Insights into student competency and placement outcomes.', icon: GraduationCap },
  { title: 'Practical Evidence', desc: 'Video, images and documents as proof of real ability.', icon: Lightbulb },
  { title: 'Job Recommendations', desc: 'Personalized openings based on verified skills.', icon: Users },
];

const problems = [
  'Certificates alone may not communicate practical competency',
  'Employers struggle to screen for real hands-on ability',
  'Skill mismatch between training and workplace needs',
  'Limited visibility into what a student can actually do',
  'Students find it hard to demonstrate capability beyond paper',
];

const sdgs = [
  { num: '4', title: 'Quality Education', desc: 'CAREVA strengthens vocational education by validating practical learning outcomes and giving students credible evidence of competence.' },
  { num: '8', title: 'Decent Work & Economic Growth', desc: 'By matching verified skills to employer needs, CAREVA reduces underemployment and supports productive, decent work for vocational talent.' },
  { num: '9', title: 'Industry, Innovation & Infrastructure', desc: 'The platform introduces AI-assisted evaluation and digital credentials as infrastructure for the future of skills and hiring.' },
  { num: '17', title: 'Partnerships for the Goals', desc: 'CAREVA connects institutes, students and employers in a shared ecosystem of trust, feedback and continuous improvement.' },
];

export function LandingPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-careva-blue/5 via-transparent to-transparent" />
        <div className="section-container relative py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-careva-teal/30 bg-careva-teal/10 px-4 py-1.5 text-sm font-medium text-careva-teal">
              <Shield className="h-4 w-4" />
              AI-Verified Skill Passport
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              CAREVA
            </h1>
            <p className="mt-3 text-xl font-semibold text-careva-blue dark:text-careva-teal sm:text-2xl">
              Verify Skills. Connect Talent. Build Careers.
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              CAREVA uses AI-assisted competency evaluation and intelligent matching to help vocational students prove practical skills and connect with the right employers.
            </p>
            <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              Turning practical skills into trusted opportunities.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="secondary" size="lg">
                  See How It Works
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">The Problem</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              A certificate tells an employer what a student completed. It does not always prove what the student can actually do.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((p, i) => (
              <Card key={i} className="flex items-start gap-3 p-5">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                  <span className="text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{p}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution / How it Works */}
      <section id="how-it-works" className="py-16 sm:py-20">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">How CAREVA Works</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              From practical demonstration to verified passport and employer match — a trusted bridge between vocational talent and hiring.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative">
                  <Card className="flex h-full flex-col items-center p-5 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-careva-blue to-careva-teal text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="mb-1 text-xs font-semibold text-careva-teal">Step {i + 1}</span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{step.label}</p>
                  </Card>
                  {i < workflow.length - 1 && (
                    <div className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-slate-300 lg:block">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Platform Features</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Everything needed to verify practical skills and match talent with opportunity.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Card key={i} className="p-5 transition-shadow hover:shadow-soft">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-careva-blue/10 text-careva-blue dark:bg-careva-teal/20 dark:text-careva-teal">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* SDG */}
      <section id="sdg" className="py-16 sm:py-20">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Aligned with Sustainable Development Goals</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              CAREVA contributes to global goals for education, work, innovation and partnership.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {sdgs.map((s) => (
              <Card key={s.num} className="flex gap-4 p-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-careva-blue to-careva-teal text-xl font-bold text-white">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">SDG {s.num}: {s.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{s.desc}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex justify-center gap-6 text-slate-400">
            <Globe2 className="h-6 w-6" />
            <Handshake className="h-6 w-6" />
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-gradient-to-r from-careva-navy to-careva-blue py-16 dark:border-slate-800">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white">Ready to verify skills and build careers?</h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            Join CAREVA as a student or employer and experience AI-assisted skill verification and intelligent matching.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <Button variant="accent" size="lg">
                Create Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
