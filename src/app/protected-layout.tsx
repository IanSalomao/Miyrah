import { Outlet } from 'react-router-dom'
import { SideBar } from '@/components/side-bar/side-bar'

// Casca das páginas autenticadas: sidebar fixa + área de conteúdo rolável.
export function ProtectedLayout() {
  return (
    <div className="flex min-h-svh bg-background">
      <SideBar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
