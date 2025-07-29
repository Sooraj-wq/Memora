
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  // Also check for the JWT token for an extra layer of validation
  const token = localStorage.getItem('token');

  if (isAuthenticated && token) {
    // If the user has a password in memory AND a token, allow access
    return children;
  }
  
  // Otherwise, redirect to the login page
  return <Navigate to="/login" />;
}

export default ProtectedRoute;