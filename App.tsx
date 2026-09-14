import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { VerifyPage } from './pages/public/VerifyPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfilePage } from './pages/student/StudentProfile';
import { StudentSkillsPage } from './pages/student/StudentSkills';
import { StudentSubmissionsPage } from './pages/student/StudentSubmissions';
import { SkillPassportPage } from './pages/student/SkillPassport';
import { CareerInsightsPage } from './pages/student/CareerInsights';
import { StudentJobsPage } from './pages/student/StudentJobs';
import { EmployerDashboard } from './pages/employer/EmployerDashboard';
import { EmployerApplicationsPage } from './pages/employer/EmployerApplications';
import { EmployerCandidatesPage } from './pages/employer/EmployerCandidates';
import { EmployerJobsPage } from './pages/employer/EmployerJobs';
import { EmployerProfilePage } from './pages/employer/EmployerProfile';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { EmployerFeedbackPage } from './pages/employer/EmployerFeedback';
import { NotificationsPage } from './pages/NotificationsPage';
import { Loader2 } from 'lucide-react';

function AppRoutes() {
  const { isLoading, loadUser, isAuthenticated, user } = useAuthStore();
  const initTheme = useThemeStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();
    loadUser();
  }, [initTheme, loadUser]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-careva-teal" />
          <p className="text-sm text-slate-500">Loading CAREVA...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            isAuthenticated && user ? (
              <Navigate
                to={user.role === 'STUDENT' ? '/student' : user.role === 'EMPLOYER' ? '/employer' : '/admin'}
                replace
              />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/verify/:credentialId" element={<VerifyPage />} />
        <Route
          path="/register"
          element={
            isAuthenticated && user ? (
              <Navigate
                to={user.role === 'STUDENT' ? '/student' : user.role === 'EMPLOYER' ? '/employer' : '/admin'}
                replace
              />
            ) : (
              <RegisterPage />
            )
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoute roles={['STUDENT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfilePage />} />
        <Route path="/student/skills" element={<StudentSkillsPage />} />
        <Route path="/student/submissions" element={<StudentSubmissionsPage />} />
        <Route path="/student/passport" element={<SkillPassportPage />} />
        <Route path="/student/jobs" element={<StudentJobsPage />} />
        <Route path="/student/insights" element={<CareerInsightsPage />} />
        <Route path="/student/notifications" element={<NotificationsPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute roles={['EMPLOYER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/employer" element={<EmployerDashboard />} />
        <Route path="/employer/profile" element={<EmployerProfilePage />} />
        <Route path="/employer/jobs" element={<EmployerJobsPage />} />
        <Route path="/employer/candidates" element={<EmployerCandidatesPage />} />
        <Route path="/employer/applications" element={<EmployerApplicationsPage />} />
        <Route path="/employer/notifications" element={<NotificationsPage />} />
        <Route path="/employer/feedback" element={<EmployerFeedbackPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<AdminDashboard />} />
        <Route path="/admin/notifications" element={<NotificationsPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '10px',
          },
        }}
      />
    </BrowserRouter>
  );
}
