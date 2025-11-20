import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Aplicar tema do localStorage
const applyStoredTheme = () => {
  try {
    const stored = localStorage.getItem('medical-copilot-storage');
    if (stored) {
      const { state } = JSON.parse(stored);
      const theme = state?.theme || 'light';
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Tema padrão: light
      document.documentElement.classList.remove('dark');
    }
  } catch {
    // Fallback: light
    document.documentElement.classList.remove('dark');
  }
};

applyStoredTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
