// Card "Situação da assinatura" — aba Plano. specs/subscription.md.
import { Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Subscription } from '@/types'
import { describeSubscription, type StatusTone } from '../subscription-status'

// Monocromático: Azul para "ativa", neutro para teste/cancelada com acesso, e a
// cor de Saídas só quando a conta está bloqueada para escrita.
const TONE_CLASSES: Record<StatusTone, string> = {
  active: 'border-transparent bg-accent text-accent-foreground',
  neutral: 'border-border bg-transparent text-foreground',
  alert: 'border-transparent bg-destructive/10 text-destructive',
}

interface StatusCardProps {
  subscription: Subscription
  onCancel: () => void
}

export function StatusCard({ subscription, onCancel }: StatusCardProps) {
  const summary = describeSubscription(subscription)

  return (
    <section
      aria-labelledby="subscription-status-title"
      className="rounded-lg border border-border bg-card shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 p-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="subscription-status-title" className="text-lg font-semibold">
              Situação da assinatura
            </h2>
            <Badge variant="outline" className={cn(TONE_CLASSES[summary.tone])}>
              {summary.badge}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{summary.description}</p>
        </div>

        {subscription.status === 'active' && (
          <Button
            type="button"
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={onCancel}
          >
            Cancelar assinatura
          </Button>
        )}
      </div>

      {subscription.readOnly && (
        <div className="flex items-start gap-3 border-t border-border px-6 py-4 text-sm">
          <Lock className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          <p className="text-muted-foreground">
            <strong className="font-medium text-foreground">Conta em somente leitura.</strong> Você
            continua consultando o histórico e gerando relatórios, mas não registra nem edita
            lançamentos até escolher um plano.
          </p>
        </div>
      )}
    </section>
  )
}
