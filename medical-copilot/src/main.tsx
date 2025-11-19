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
      const theme = state?.theme || 'dark';
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Tema padrão: dark
      document.documentElement.classList.add('dark');
    }
  } catch {
    // Fallback: dark
    document.documentElement.classList.add('dark');
  }
};

applyStoredTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
