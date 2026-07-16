import { NavLink, useNavigate } from 'react-router-dom'
import {
  ArrowRightLeft,
  Church,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  Tags,
  Users,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/app/auth-context'

interface NavItem {
  to: string
  label: string
  icon: ComponentType<{ className?: string }>
  end?: boolean
}

// Itens na ordem de wiki/components/component_side_bar.md
const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transações', icon: ArrowRightLeft },
  { to: '/members', label: 'Membros', icon: Users },
  { to: '/ministries', label: 'Ministérios', icon: Church },
  { to: '/categories', label: 'Categorias', icon: Tags },
  { to: '/reports', label: 'Relatórios', icon: FileText },
  { to: '/settings', label: 'Configurações', icon: Settings },
]

export function SideBar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="flex h-svh w-60 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex flex-col gap-0.5 px-6 py-6">
        <span className="font-display text-lg font-semibold tracking-tight text-primary">
          Miyrah
        </span>
        <span className="text-xs text-muted-foreground">Controle financeiro</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm outline-none transition-colors',
                'hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-sidebar-accent font-medium text-sidebar-primary'
                  : 'text-sidebar-foreground',
              )
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LogOut className="size-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
