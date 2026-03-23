import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import ContextRouter from './components/ContextRouter';
import { NotificationDialog } from './components/NotificationDialog';
import { GlobalCommandPalette } from './components/GlobalCommandPalette';
import { TermsOfUseDialog } from './components/legal/TermsOfUseDialog';
import ErrorBoundary from './components/ErrorBoundary';
import { useAppStore } from './stores/appStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
    mutations: {
      onError: (error: unknown) => {
        const msg = error instanceof Error ? error.message : 'Erro inesperado';
        toast.error(msg);
      },
    },
  },
});

// API configuration
const API = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';

function App() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const setUser = useAppStore((s) => s.setUser);

  // On every app start, verify session with backend.
  // - If isAuthenticated=true but cookie is invalid → logout (deleted user, expired session).
  // - If isAuthenticated=false but a valid cookie exists (tab was closed) → auto-restore.
  // - Network failure → keep current state (don't force logout on flaky connection).
  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: 'include' })
      .then(async (res) => {
        if (res.status === 401 || res.status === 404) {
          useAppStore.setState({ isAuthenticated: false, user: null });
          localStorage.removeItem('medical-copilot-storage');
        } else if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            useAppStore.setState({ isAuthenticated: true });
          }
        }
      })
      .catch(() => {
        // Network error — keep current state, don't force logout
      })
      .finally(() => {
        setSessionChecked(true);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleOpenNotifications = () => setIsNotificationOpen(true);
    window.addEventListener('openNotifications', handleOpenNotifications);
    return () => window.removeEventListener('openNotifications', handleOpenNotifications);
  }, []);

 if (!sessionChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-8 h-8 rounded-full border-2 border-[#512B81] border-t-transparent animate-spin" />
      </div>
    );
  }

 return (
 <QueryClientProvider client={queryClient}>
 <BrowserRouter>
 <ErrorBoundary>
 <div className="App">
 <ContextRouter />
 <GlobalCommandPalette />
 <NotificationDialog
 isOpen={isNotificationOpen}
 onClose={() => setIsNotificationOpen(false)}
 />
 <TermsOfUseDialog />
 <Toaster position="bottom-right" richColors closeButton expand={true} />
 </div>
 </ErrorBoundary>
 </BrowserRouter>
 </QueryClientProvider>
 );
}

export default App;
