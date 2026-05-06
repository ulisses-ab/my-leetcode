import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './styles/globals.css'
import App from './App.tsx'
import { applyTheme, readStoredTheme } from './stores/useThemeStore'

// Apply persisted theme before React renders to avoid a palette flash.
applyTheme(readStoredTheme());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
