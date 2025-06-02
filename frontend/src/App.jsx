import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/shared/AdminLayout';

import LoginAdmin from './pages/LoginAdmin';
import LoginStudent from './pages/LoginStudent';
import AdminStudents from './components/admin/AdminStudents';
import AdminTasks from './components/admin/AdminTasks';
import AdminReports from './components/admin/AdminReports';
import AdminMessages from './components/admin/AdminMessages';
import AdminBlogs from './components/admin/AdminBlogs';
import StudentDashboard from './pages/StudentDashboard';
import Home from './pages/Home';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/login-student" element={<LoginStudent />} />
          <Route path="/student" element={<StudentDashboard />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/students" element={<AdminStudents />} />

            <Route path="students" element={<AdminStudents />} />
            <Route path="tasks" element={<AdminTasks />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="blogs" element={<AdminBlogs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
