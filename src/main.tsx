import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { ChartProvider } from './contexts/ChartContext.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ChartProvider>
        <App />
      </ChartProvider>
    </AuthProvider>
  </React.StrictMode>,
)
