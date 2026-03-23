import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import ProtectedRoute from '@/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load all pages for better performance
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ConsultationPage = lazy(() => import('@/pages/ConsultationPage').then(mod => ({ default: mod.ConsultationPage })));
const SessionDetailsPage = lazy(() => import('@/pages/SessionDetailsPage').then(mod => ({ default: mod.SessionDetailsPage })));
const HistoryPage = lazy(() => import('@/pages/HistoryPage').then(mod => ({ default: mod.HistoryPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(mod => ({ default: mod.SettingsPage })));
const MedicalCopilotPage = lazy(() => import('@/pages/MedicalCopilotPage').then(mod => ({ default: mod.MedicalCopilotPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ShiftFinancePage = lazy(() => import('@/pages/ShiftFinancePage'));
const ProtocolsPage = lazy(() => import('@/features/protocols/ProtocolsPage').then(mod => ({ default: mod.ProtocolsPage })));

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const PaymentSuccessPage = lazy(() => import('@/pages/PaymentSuccessPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));

const ContextRouter: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { appContext, isAuthenticated } = useAppStore();

    // Redirect to appropriate dashboard if user is on root path and authenticated
    // Note: User can still visit branding pages if they want, but root usually takes them to work
    React.useEffect(() => {
        if (location.pathname === '/' && isAuthenticated && appContext) {
            navigate('/worklist');
        }
    }, [location.pathname, isAuthenticated, appContext, navigate]);

    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><LoadingSpinner /></div>}>
            <Routes location={location}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route
                    path="/worklist"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
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
                <Route
                    path="/copilot"
                    element={
                        <ProtectedRoute>
                            <MedicalCopilotPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/plantoes"
                    element={
                        <ProtectedRoute>
                            <ShiftFinancePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/protocols"
                    element={
                        <ProtectedRoute>
                            <ProtocolsPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Suspense>
    );
};

export default ContextRouter;