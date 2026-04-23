import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './components/common/Toast';
import PageTransition from './components/common/PageTransition';
import ActivatePage from './pages/public/ActivatePage';
import LoginPage from './pages/public/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardEventsPage from './pages/dashboard/EventsPage';
import RegistrationPage from './pages/dashboard/RegistrationPage';
import MatchmakingPage from './pages/dashboard/MatchmakingPage';
import BracketPage from './pages/dashboard/BracketPage';
import RankingsPage from './pages/dashboard/RankingsPage';
import SchoolDetailsPage from './pages/dashboard/SchoolDetailsPage';
import StaffManagementPage from './pages/dashboard/staff/StaffManagementPage';
import PublicLandingPage from './pages/public/LandingPage';
import PublicEventDetail from './pages/public/PublicEventDetail';
import PublicEventsList from './pages/public/PublicEventsList';
import ContactPage from './pages/public/ContactPage';
import BlogPage from './pages/public/BlogPage';
import ServicesPage from './pages/public/ServicesPage';
import StaffPage from './pages/public/StaffPage';
import EventsPage from './pages/public/EventsPage';
import ParticipantsPage from './pages/public/ParticipantsPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (user?.role !== 'seed_admin') return <Navigate to="/dashboard/events" replace />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <>
      <PageTransition />
      <Routes>
        <Route path="/" element={<PublicLandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events-list" element={<PublicEventsList />} />
        <Route path="/events-view/:eventId" element={<PublicEventDetail />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/participants" element={<ParticipantsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/activate" element={<ActivatePage />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard/events" replace />} />
          <Route path="events" element={<DashboardEventsPage />} />
          <Route path="events/:eventId/registration" element={<RegistrationPage />} />
          <Route path="schools/:schoolId/teams" element={<SchoolDetailsPage />} />
          <Route path="events/:eventId/matchmaking" element={<MatchmakingPage />} />
          <Route path="events/:eventId/bracket" element={<BracketPage />} />
          <Route path="events/:eventId/rankings" element={<RankingsPage />} />
          <Route path="staff" element={
            <AdminRoute>
              <StaffManagementPage />
            </AdminRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
