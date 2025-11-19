import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import DashboardPage from '@/pages/DashboardPage';
import PatientsPage from '@/pages/PatientsPage';
import { ConsultationPage } from '@/pages/ConsultationPage';
import { SessionDetailsPage } from '@/pages/SessionDetailsPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { SettingsPage } from '@/pages/SettingsPage';
import LoginPage from '@/pages/LoginPage';
import ProtectedRoute from '@/ProtectedRoute';

const ContextRouter: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appContext, isAuthenticated } = useAppStore();

  // Redirect to appropriate dashboard if user is on root path and authenticated
  React.useEffect(() => {
    if (location.pathname === '/' && isAuthenticated && appContext) {
      navigate('/dashboard');
    }
  }, [location.pathname, isAuthenticated, appContext, navigate]);

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <PatientsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/consultation"
        element={
          <ProtectedRoute>
            <ConsultationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/consultation/:id"
        element={
          <ProtectedRoute>
            <SessionDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default ContextRouter;