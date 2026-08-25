import { ArrowLeft, Compass, LifeBuoy } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import miyrahLogo from '@/assets/miyrah_logo_blue.svg'
import { useAuth } from '@/app/auth-context'
import { Button } from '@/components/ui/button'

// Tela de rota inexistente. Fica fora do shell autenticado para funcionar
// tanto com sessão ativa quanto sem — o destino do botão primário é que muda.
// Tokens: fundo `Papel`, card `Superfície` + contorno `Linha` + sombra `lg`
// (wiki/design_system.md).
export function NotFoundPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const homeTo = isAuthenticated ? '/' : '/login'
  const homeLabel = isAuthenticated ? 'Ir para o Início' : 'Ir para o login'

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card px-8 py-10 text-center shadow-lg sm:px-12">
        <img src={miyrahLogo} alt="Miyrah" className="mx-auto h-9 w-auto" />

        <div className="mt-8 flex justify-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
            <Compass className="size-7" aria-hidden="true" />
          </span>
        </div>

        <p
          aria-hidden="true"
          className="mt-6 font-display text-6xl leading-none font-bold tracking-tight text-primary tabular-nums"
        >
          404
        </p>

        <h1 className="mt-5 font-display text-3xl leading-tight font-semibold tracking-tight text-foreground">
          Página não encontrada
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          O endereço{' '}
          <code className="rounded-sm bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">
            {location.pathname}
          </code>{' '}
          não existe ou foi movido. Confira o link e tente novamente.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="px-5">
            <Link to={homeTo}>{homeLabel}</Link>
          </Button>
          <Button variant="outline" size="lg" className="px-5" onClick={() => void navigate(-1)}>
            <ArrowLeft aria-hidden="true" />
            Voltar
          </Button>
        </div>
      </div>

      <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <LifeBuoy className="size-3.5 shrink-0" aria-hidden="true" />
        Se você chegou aqui por um link do sistema, avise o suporte.
      </p>
    </div>
  )
}
