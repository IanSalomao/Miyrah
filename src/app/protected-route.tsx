import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './auth-context'

// Guard de rota: redireciona para /login quem não está autenticado,
// guardando a origem para voltar após o login.
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
