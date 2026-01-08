import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CourseListPage from './pages/CourseListPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonPage from './pages/LessonPage';

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CreateCoursePage from './pages/instructor/CreateCoursePage';
import EditCoursePage from './pages/instructor/EditCoursePage';
import StudentsPage from './pages/instructor/StudentsPage';
import PaymentsPage from './pages/instructor/PaymentsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Student Pages
import ProgressPage from './pages/student/ProgressPage';

// Layouts
import DashboardLayout from './components/DashboardLayout';

/**
 * @desc Protected Route Component
 */
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />

        {/* Dashboard (Dynamic Redirect based on role) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardRedirect />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Student Private Routes */}
        <Route path="/courses/:courseId/learn" element={
          <ProtectedRoute role="student">
            <LessonPage />
          </ProtectedRoute>
        } />
        <Route path="/student/progress" element={
          <ProtectedRoute role="student">
            <DashboardLayout><ProgressPage /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Instructor Routes */}
        <Route path="/instructor" element={
          <ProtectedRoute role="instructor">
            <DashboardLayout><InstructorDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/instructor/courses" element={
          <ProtectedRoute role="instructor">
            <DashboardLayout><CourseListPage /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/instructor/courses/create" element={
          <ProtectedRoute role="instructor">
            <DashboardLayout><CreateCoursePage /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/instructor/courses/:courseId" element={
          <ProtectedRoute role="instructor">
            <DashboardLayout><EditCoursePage /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/instructor/students" element={
          <ProtectedRoute role="instructor">
            <DashboardLayout><StudentsPage /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/instructor/payments" element={
          <ProtectedRoute role="instructor">
            <DashboardLayout><PaymentsPage /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <DashboardLayout><AdminDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}

/**
 * @desc Helper component to redirect to correct dashboard
 */
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'instructor') return <InstructorDashboard />;
  if (user?.role === 'student') return <Navigate to="/student/progress" />;
  return <Navigate to="/" />;
};

export default App;
