import './App.css'
import LoginPage from './login-page'
import Dashboard from './Dashboard';
import SigninPage from './signin-page';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    //Wrap the Router with AuthProvider
    <AuthProvider> 
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/signin" element={<SigninPage/>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard /> 
              </ProtectedRoute> 
            }
          />
          <Route path="*" element={<Navigate to="/login" />} /> 
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


