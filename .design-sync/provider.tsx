// Provider para os previews do design-sync (não usado pelo app).
// Envolve os componentes em contexto de Router (SideBar/AuthLayout usam
// NavLink/useNavigate/Outlet), TanStack Query (MemberPicker usa useQuery) e
// Auth (SideBar usa useAuth). Como este arquivo é compilado DENTRO do bundle
// (via cfg.extraEntries), o AuthProvider importado compartilha a mesma
// instância de AuthContext que o SideBar consome.
import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/app/auth-provider'
import { queryClient } from '@/app/query-client'

export function DesignSyncProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}
