// Estado de recolhida/expandida da side-bar, compartilhado entre a SideBar e o
// ProtectedLayout (que precisa acompanhar a largura para recuar o conteúdo) e
// persistido entre sessões.
import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'

const STORAGE_KEY = 'chf.sidebar-collapsed'

interface SidebarCollapsedContextValue {
  collapsed: boolean
  setCollapsed: Dispatch<SetStateAction<boolean>>
}

const SidebarCollapsedContext = createContext<SidebarCollapsedContextValue | null>(null)

function readStoredValue(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

export function SidebarCollapsedProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(readStoredValue)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed))
  }, [collapsed])

  return (
    <SidebarCollapsedContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarCollapsedContext.Provider>
  )
}

export function useSidebarCollapsed(): SidebarCollapsedContextValue {
  const ctx = useContext(SidebarCollapsedContext)
  if (!ctx) {
    throw new Error('useSidebarCollapsed deve ser usado dentro de <SidebarCollapsedProvider>.')
  }
  return ctx
}
