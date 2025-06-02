// src/components/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ children, role }) {
  const { auth } = useAuth();

  if (!auth || auth.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
