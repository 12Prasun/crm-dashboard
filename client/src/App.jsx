import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Companies from './pages/Companies';
import Contacts from './pages/Contacts';
import Deals from './pages/Deals';

function App() {
  const { token, getMe } = useAuthStore();

  useEffect(() => {
    if (token) {
      getMe().catch(() => {
        // Token invalid, stay logged out
      });
    }
  }, []);

  const isAuthenticated = !!token;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/companies"
          element={isAuthenticated ? <Companies /> : <Navigate to="/login" />}
        />
        <Route
          path="/contacts"
          element={isAuthenticated ? <Contacts /> : <Navigate to="/login" />}
        />
        <Route
          path="/deals"
          element={isAuthenticated ? <Deals /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;
