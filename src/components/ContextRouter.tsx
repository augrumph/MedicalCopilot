import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import ProtectedRoute from '@/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load all pages for better performance
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const MedicalPatientsPage = lazy(() => import('@/pages/MedicalPatientsPage'));
const ConsultationPage = lazy(() => import('@/pages/ConsultationPage').then(mod => ({ default: mod.ConsultationPage })));
const SessionDetailsPage = lazy(() => import('@/pages/SessionDetailsPage').then(mod => ({ default: mod.SessionDetailsPage })));
const HistoryPage = lazy(() => import('@/pages/HistoryPage').then(mod => ({ default: mod.HistoryPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(mod => ({ default: mod.SettingsPage })));
const AppointmentPage = lazy(() => import('@/pages/AppointmentPage').then(mod => ({ default: mod.AppointmentPage })));
const MedicalCopilotPage = lazy(() => import('@/pages/MedicalCopilotPage').then(mod => ({ default: mod.MedicalCopilotPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage'));

const ContextRouter: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { appContext, isAuthenticated } = useAppStore();

    // Redirect to appropriate dashboard if user is on root path and authenticated
    React.useEffect(() => {
        if (location.pathname === '/' && isAuthenticated && appContext) {
            navigate('/worklist');
        }
    }, [location.pathname, isAuthenticated, appContext, navigate]);

    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><LoadingSpinner /></div>}>
            <Routes location={location}>
                <Route path="/" element={isAuthenticated ? <Navigate to="/worklist" replace /> : <Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/worklist"
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
                            <MedicalPatientsPage />
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
                    path="/patients/:id"
                    element={
                        <ProtectedRoute>
                            <MedicalPatientsPage />
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
                <Route
                    path="/copilot"
                    element={
                        <ProtectedRoute>
                            <MedicalCopilotPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/appointments"
                    element={
                        <ProtectedRoute>
                            <AppointmentPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/scheduling"
                    element={<Navigate to="/appointments" replace />}
                />
            </Routes>
        </Suspense>
    );
};

export default ContextRouter;