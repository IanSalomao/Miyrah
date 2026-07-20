import { Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { SideBar } from '@/components/side-bar/side-bar'
import {
  SidebarCollapsedProvider,
  useSidebarCollapsed,
} from '@/components/side-bar/hooks/use-sidebar-collapsed'

// Casca das páginas autenticadas: sidebar fixa (não quebra ao rolar a página) + área de conteúdo rolável.
// O recuo do conteúdo acompanha, com a mesma animação, a largura da sidebar.
export function ProtectedLayout() {
  return (
    <SidebarCollapsedProvider>
      <ProtectedLayoutContent />
    </SidebarCollapsedProvider>
  )
}

function ProtectedLayoutContent() {
  const { collapsed } = useSidebarCollapsed()

  return (
    <div className="min-h-svh bg-background">
      <SideBar />
      <main
        className={cn(
          'min-h-svh overflow-y-auto transition-[margin-left] duration-300 ease-in-out',
          collapsed ? 'ml-20' : 'ml-60',
        )}
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
