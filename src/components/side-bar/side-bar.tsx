import { NavLink, useNavigate } from 'react-router-dom'
import {
  ArrowRightLeft,
  ChevronLeft,
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
import { MemberAvatar } from '@/components/avatar/avatar'
import miyrahLogo from '@/assets/miyrah_logo_blue.svg'
import miyrahIcon from '@/assets/miyrah_icon_blue.svg'
import { useAccount } from './hooks/use-account'
import { useSidebarCollapsed } from './hooks/use-sidebar-collapsed'

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

export const SIDEBAR_WIDTH_EXPANDED = 'w-60'
export const SIDEBAR_WIDTH_COLLAPSED = 'w-20'

export function SideBar() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { data: account } = useAccount()
  const { collapsed, setCollapsed } = useSidebarCollapsed()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex h-svh flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-in-out',
        collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
      )}
    >
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        className="absolute -right-3 top-8 z-10 flex size-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar shadow-sm transition-colors hover:bg-sidebar-accent"
      >
        <ChevronLeft
          className={cn(
            'size-3.5 text-muted-foreground transition-transform duration-300',
            collapsed && 'rotate-180',
          )}
        />
      </button>

      <div className="relative flex h-20 shrink-0 items-center justify-center overflow-hidden px-4">
        <img
          src={miyrahLogo}
          alt="Miyrah"
          className={cn(
            'absolute h-7 w-auto transition-all duration-300',
            collapsed ? 'scale-95 opacity-0' : 'scale-100 opacity-100',
          )}
        />
        <img
          src={miyrahIcon}
          alt="Miyrah"
          className={cn(
            'absolute size-8 transition-all duration-300',
            collapsed ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
          )}
        />
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm outline-none transition-colors',
                'hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring',
                collapsed && 'justify-center',
                isActive
                  ? 'bg-sidebar-accent font-medium text-sidebar-primary'
                  : 'text-sidebar-foreground',
              )
            }
          >
            <item.icon className="size-4 shrink-0" />
            <span
              className={cn(
                'overflow-hidden whitespace-nowrap transition-all duration-300',
                collapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100',
              )}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border px-3 py-4">
        <div
          className={cn(
            'flex items-center gap-3 overflow-hidden rounded-md px-1 py-1 transition-all duration-300',
            collapsed ? 'justify-center' : 'justify-start',
          )}
        >
          <MemberAvatar name={account?.name ?? ''} className="shrink-0" />
          <div
            className={cn(
              'flex min-w-0 flex-col overflow-hidden whitespace-nowrap transition-all duration-300',
              collapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100',
            )}
          >
            <span className="truncate text-sm font-medium text-sidebar-foreground">
              {account?.name ?? '—'}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {account?.email ?? ''}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? 'Sair' : undefined}
          className={cn(
            'mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground outline-none transition-colors',
            'hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring',
            collapsed && 'justify-center',
          )}
        >
          <LogOut className="size-4 shrink-0" />
          <span
            className={cn(
              'overflow-hidden whitespace-nowrap transition-all duration-300',
              collapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100',
            )}
          >
            Sair
          </span>
        </button>
      </div>
    </aside>
  )
}
