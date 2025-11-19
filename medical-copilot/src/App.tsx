import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import LoginPage from './pages/LoginPage';
import ContextRouter from './components/ContextRouter';
import { NotificationDialog } from './components/NotificationDialog';
import ProtectedRoute from './ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    const handleOpenNotifications = () => {
      setIsNotificationOpen(true);
    };

    window.addEventListener('openNotifications', handleOpenNotifications);

    return () => {
      window.removeEventListener('openNotifications', handleOpenNotifications);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="App">
          <ContextRouter />
          <NotificationDialog
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
          <Toaster position="bottom-right" />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
