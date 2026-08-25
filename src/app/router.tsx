import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { AuthLayout } from '@/components/auth-layout/auth-layout'
import { ForgotPasswordPage } from '@/features/auth/forgot-password-page'
import { LoginPage } from '@/features/auth/login-page'
import { RegisterPage } from '@/features/auth/register-page'
import { ResetPasswordPage } from '@/features/auth/reset-password-page'
import { CategoriesPage } from '@/features/categories/pages/categories-page'
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page'
import { HomePage } from '@/features/home/pages/home-page'
import { MembersPage } from '@/features/members/members-page'
import { MinistriesPage } from '@/features/ministries/pages/ministries-page'
import { NotFoundPage } from '@/features/not-found/not-found-page'
import { ReportsPage } from '@/features/reports/pages/reports-page'
import { SettingsPage } from '@/features/settings/settings-page'
import { TransactionsPage } from '@/features/transactions/transactions-page'
import { ProtectedLayout } from './protected-layout'
import { ProtectedRoute } from './protected-route'

// Definição das rotas (exportada para os testes montarem um memory router).
export const routes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'transactions', element: <TransactionsPage /> },
          { path: 'members', element: <MembersPage /> },
          { path: 'ministries', element: <MinistriesPage /> },
          { path: 'categories', element: <CategoriesPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  // Catch-all: qualquer URL desconhecida cai na 404 (inclusive em deep link
  // direto, graças ao fallback de history configurado em vercel.json).
  { path: '*', element: <NotFoundPage /> },
]

export const router = createBrowserRouter(routes)
