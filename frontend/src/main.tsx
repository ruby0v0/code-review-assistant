import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import AppProvider from './components/theme/AppProvider.tsx'
import './index.css'
import 'virtual:uno.css'
import './assets/styles/scrollbar.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
