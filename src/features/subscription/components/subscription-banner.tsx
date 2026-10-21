// Aviso global de assinatura no layout autenticado — somente leitura ou fim do teste.
// Some na própria tela de Assinatura (lá o card de situação já explica). specs/subscription.md.
import { Link, useLocation } from 'react-router-dom'
import { Clock, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSubscription } from '../hooks/use-subscription'
import { getBannerState, relativeDaysLabel } from '../subscription-status'

const SUBSCRIPTION_PATH = '/subscription'

export function SubscriptionBanner() {
  const { pathname } = useLocation()
  const { data: subscription } = useSubscription()

  if (!subscription || pathname === SUBSCRIPTION_PATH) return null
  const banner = getBannerState(subscription)
  if (!banner) return null

  const readOnly = banner.kind === 'readOnly'
  const Icon = readOnly ? Lock : Clock

  return (
    <div
      role={readOnly ? 'alert' : 'status'}
      className={cn(
        'mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border px-4 py-3 text-sm shadow-sm',
        readOnly ? 'border-destructive/30 bg-destructive/5' : 'border-primary/30 bg-accent',
      )}
    >
      <Icon
        className={cn('size-4 shrink-0', readOnly ? 'text-destructive' : 'text-primary')}
        aria-hidden
      />
      <p className="flex-1 text-foreground">
        {readOnly ? (
          <>
            <strong className="font-medium">Sua conta está em somente leitura.</strong> Você pode
            consultar o histórico e gerar relatórios, mas não pode registrar novos lançamentos.
          </>
        ) : (
          <>
            <strong className="font-medium">
              Seu teste grátis termina {relativeDaysLabel(banner.days)}.
            </strong>{' '}
            Escolha um plano para continuar lançando sem interrupção.
          </>
        )}
      </p>
      <Link
        to={SUBSCRIPTION_PATH}
        className="font-medium text-primary underline-offset-4 hover:underline"
      >
        {readOnly ? 'Regularizar assinatura' : 'Escolher plano'}
      </Link>
    </div>
  )
}
