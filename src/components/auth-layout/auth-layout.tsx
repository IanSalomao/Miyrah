import { ShieldCheck } from 'lucide-react'
import { Outlet } from 'react-router-dom'

import miyrahLogo from '@/assets/miyrah_logo_blue.svg'
import { AuthShowcase } from './auth-showcase'

// Moldura das telas não-autenticadas — painel de formulário à esquerda + vitrine à direita
// (oculta abaixo de xl, onde o formulário ocupa a largura toda). templates/auth (Claude Design).
// wiki/components/component_auth_layout.md
export function AuthLayout() {
  return (
    <div className="flex h-svh w-full overflow-hidden bg-linear-to-br from-background via-background to-accent">
      <div className="relative z-10 flex w-full flex-col overflow-y-auto bg-popover px-6 py-10 shadow-[24px_0_45px_-28px_rgba(18,32,58,0.18)] sm:px-10 sm:py-12 xl:w-[38%] xl:min-w-110 xl:px-16 xl:py-14">

        <div className="flex flex-1 flex-col justify-center py-10">
        <img src={miyrahLogo} alt="Miyrah" className="h-12 w-auto my-auto" />
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-md gap-3">
          <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Seus dados estão protegidos com segurança. Ao continuar, você concorda com nossos{' '}
            <a href="#" className="font-medium text-foreground underline-offset-4 hover:underline">
              Termos de Uso
            </a>{' '}
            e nossa{' '}
            <a href="#" className="font-medium text-foreground underline-offset-4 hover:underline">
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </div>

      <div className="hidden flex-1 xl:block">
        <AuthShowcase />
      </div>
    </div>
  )
}
