import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { FullPageSpinner } from './components/ui/Spinner';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import InvestmentsPage from './pages/InvestmentsPage';
import ReferralsPage from './pages/ReferralsPage';

// ─── Protected Route ──────────────────────────────────────────────────────────
// Redirects to login if user is not authenticated
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// ─── Public Route ─────────────────────────────────────────────────────────────
// Redirects to dashboard if user is already logged in
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <FullPageSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

// ─── App Routes ───────────────────────────────────────────────────────────────
const AppRoutes = () => {
  return (
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={
          <PublicRoute><LoginPage /></PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute><RegisterPage /></PublicRoute>
        } />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/investments" element={
          <ProtectedRoute><InvestmentsPage /></ProtectedRoute>
        } />
        <Route path="/referrals" element={
          <ProtectedRoute><ReferralsPage /></ProtectedRoute>
        } />

        {/* Catch all — redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
const App = () => {
  return (
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
  );
};

export default App;