import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import * as Sentry from "@sentry/react";

Sentry.init({
  // Kung Vite ang gamit mo (karamihan ngayon):
  dsn: import.meta.env.VITE_SENTRY_DSN,
  
  // Kung Create React App naman ang gamit mo, gamitin mo to:
  // dsn: process.env.REACT_APP_SENTRY_DSN,

  dataCollection: {
    // userInfo: false,
    // httpBodies: []
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)