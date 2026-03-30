import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import './index.css'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { LandingPage } from '@/features/landing/pages/LandingPage'
import { QueryProvider } from './app/providers/QueryProvider'
import { ToastProvider } from './app/providers/ToastProvider'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastProvider />
      </BrowserRouter>
    </QueryProvider>
  </StrictMode>,
)
