import { createBrowserRouter, Link, type RouteObject } from 'react-router-dom'
import { AuthLayout } from '@/components/auth-layout/auth-layout'
import { PagePlaceholder } from '@/components/page-placeholder'
import { ProtectedLayout } from './protected-layout'
import { ProtectedRoute } from './protected-route'

// Definição das rotas (exportada para os testes montarem um memory router).
// Fases seguintes substituem os PagePlaceholder pelas telas reais de cada feature.
export const routes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <PagePlaceholder title="Entrar" /> },
      { path: '/register', element: <PagePlaceholder title="Criar conta" /> },
      { path: '/forgot-password', element: <PagePlaceholder title="Recuperar senha" /> },
      { path: '/reset-password', element: <PagePlaceholder title="Redefinir senha" /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          { index: true, element: <PagePlaceholder title="Início" /> },
          { path: 'dashboard', element: <PagePlaceholder title="Dashboard" /> },
          { path: 'transactions', element: <PagePlaceholder title="Transações" /> },
          { path: 'members', element: <PagePlaceholder title="Membros" /> },
          { path: 'ministries', element: <PagePlaceholder title="Ministérios" /> },
          { path: 'categories', element: <PagePlaceholder title="Categorias" /> },
          { path: 'reports', element: <PagePlaceholder title="Relatórios" /> },
          { path: 'settings', element: <PagePlaceholder title="Configurações" /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background px-4 text-center">
        <h1 className="font-display text-3xl font-semibold">Página não encontrada</h1>
        <Link to="/" className="text-primary underline-offset-4 hover:underline">
          Voltar para o início
        </Link>
      </div>
    ),
  },
]

export const router = createBrowserRouter(routes)
