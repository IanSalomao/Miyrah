import { Outlet } from 'react-router-dom'

// Moldura das telas não-autenticadas — card único centralizado, sem sidebar.
// wiki/components/component_auth_layout.md
export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-4 py-10">
      <div className="flex flex-col items-center gap-1">
        <span className="font-display text-2xl font-semibold tracking-tight text-primary">
          Church Flow
        </span>
        <span className="text-sm text-muted-foreground">Controle financeiro para igrejas</span>
      </div>
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-none sm:p-8">
        <Outlet />
      </div>
    </div>
  )
}
